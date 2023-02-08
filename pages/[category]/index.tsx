import {format, parseISO} from "date-fns";
import {GetStaticPaths, GetStaticProps} from "next";
import Link from "next/link";
import path from "path";
import Layout from "../../components/Layout";
import {CategoryMeta, getCategoryMeta, getCategoryPosts} from "../../lib/api";
import {PostType} from "../../types/post";
import {postFilePaths} from "../../utils/mdxUtils";

interface ICategoriesIndexProps {
  posts: PostType[];
  categoryMeta: CategoryMeta;
}

export const CategoriesIndex = (props: ICategoriesIndexProps): JSX.Element => {
    const { posts, categoryMeta } = props;

    return (
        <Layout wavy>
          <h1 className="capitalize">{categoryMeta.title}</h1>

          {posts.map((post) => (
            <article key={post.slug} className="mt-12">
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                {format(parseISO(post.date), 'MMMM dd, yyyy')}
              </p>
              <h1 className="mb-2 text-xl">
                  <Link as={`/${post.slug}`} href={`/[category]/[slug]`}>
                  <a className="text-gray-900 dark:text-white dark:hover:text-blue-400">
                    {post.title}
                  </a>
                </Link>
              </h1>
              <p className="mb-3">{post.description}</p>
              <p>
                <Link as={`/${post.slug}`} href={`/[category]/[slug]`}>
                  <a>Read More</a>
                </Link>
              </p>
            </article>
          ))}

        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async ({ params: { category } }) => {
  const posts = getCategoryPosts(category.toString(), ['date', 'description', 'slug', 'title']);
  const categoryMeta = getCategoryMeta(category.toString());

  return {
    props: { posts, categoryMeta },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const rawPaths = new Set(
      postFilePaths
          .map((path) => path.replace(/\.mdx?$/, ''))
          .map((file) => path.dirname(file))
  );

  const paths = Array.from(rawPaths)
    .map(path => ({ params: { category: path } }));

  return {
    paths,
    fallback: false,
  };
};

export default CategoriesIndex;
