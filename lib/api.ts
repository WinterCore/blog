import fs from 'fs';
import matter from 'gray-matter';
import path, { join } from 'path';
import { POSTS_PATH } from '../utils/mdxUtils';

export function getPostSlugs(): string[] {
  const dirs = fs.readdirSync(POSTS_PATH, { withFileTypes: true })
        .filter(fd => fd.isDirectory());

  const slugs = dirs.flatMap(dir => {
      const posts = fs.readdirSync(join(POSTS_PATH, dir.name))
      
      return posts.map(name => join(dir.name, name))
        .filter(name => ! name.endsWith(".json"));
  });
  return slugs;
}

type PostItems = {
  [key: string]: string;
};

export function getPostBySlug(slug: string, fields: string[] = []): PostItems {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(POSTS_PATH, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items: PostItems = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []): PostItems[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getCategoryPosts(category: string, fields: string[] = []): PostItems[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .filter(slug => slug.toLowerCase().startsWith(category.toLowerCase()))
    .map(slug => getPostBySlug(slug, fields))
    .sort((post1, post2) => (new Date(post2.date).getTime() - new Date(post1.date).getTime()));

  return posts;
}

export interface CategoryMeta {
    readonly title: string;
    readonly description: string;
}

export function getCategoryMeta(category: string): CategoryMeta {
  const metaPath = path.join(POSTS_PATH, category, "meta.json");
  const data = fs.readFileSync(metaPath, "utf8");

  return JSON.parse(data);
}
