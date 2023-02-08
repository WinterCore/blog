import { format, parseISO } from 'date-fns';
import fs from 'fs';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import path from 'path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import Layout, { WEBSITE_HOST_URL } from '../../components/Layout';
import {CategoryMeta, getCategoryMeta} from '../../lib/api';
import { MetaProps } from '../../types/layout';
import { PostType } from '../../types/post';
import { postFilePaths, POSTS_PATH } from '../../utils/mdxUtils';

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  Head,
  Image,
  Link,
};

type PostPageProps = {
  source: MDXRemoteSerializeResult;
  frontMatter: PostType;
  category: string;
  slug: string;
  categoryMeta: CategoryMeta;
};

const PostPage = ({ source, frontMatter, category, slug, categoryMeta }: PostPageProps): JSX.Element => {
  const customMeta: MetaProps = {
    title: `${frontMatter.title} - Hasan Kharouf`,
    description: frontMatter.description,
    image: `${WEBSITE_HOST_URL}${frontMatter.image}`,
    date: frontMatter.date,
    type: "article",
  };

  return (
      <>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <style jsx global>{`
              .hero a {
                color: #6b7280;
              }
              .hero a:hover {
                color: #334155;
              }
              .dark .hero a {
                color: #9ca3af;
              }
              .dark .hero a:hover {
                color: white;
              }
          `}</style>
          <Layout customMeta={customMeta} hero={
                  <div className="hero max-w-5xl mx-auto px-8 flex flex-col justify-end h-full py-8">
                    <div className="whitespace-nowrap mb-3 flex gap-2 items-center font-bold">
                        <Link href="/">
                            Home
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        <Link href={`/${category}`}>
                            {categoryMeta.title}
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        <Link href={`/${category}/${slug}`}>
                            {frontMatter.title}
                        </Link>
                    </div>
                    <h1 className="mb-2 text-gray-900 dark:text-white">
                      {frontMatter.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(parseISO(frontMatter.date), 'MMMM dd, yyyy')}
                    </p>
                  </div>
              }>
          <article>
            <div className="prose dark:prose-dark">
              <MDXRemote {...source} components={components} />
            </div>
          </article>
        </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params: { slug, category } }) => {
  const postFilePath = path.join(POSTS_PATH, category.toString(), `${slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);
  const categoryMeta = getCategoryMeta(category.toString());

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrism,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['anchor'],
            },
          },
        ],
      ],
      format: 'mdx',
    },
    scope: data,
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
      category: category.toString(),
      slug: slug.toString(),
      categoryMeta,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((file) => ({ params: { slug: path.basename(file), category: path.dirname(file) } }));

  return {
    paths,
    fallback: false,
  };
};

export default PostPage;
