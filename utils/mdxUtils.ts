import fs, {readdirSync} from 'fs';
import path from 'path';

// POSTS_PATH is useful when you want to get the path to a specific file
export const POSTS_PATH = path.join(process.cwd(), 'posts');

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const postFilePaths = fs
  .readdirSync(POSTS_PATH, { withFileTypes: true })
  .filter(fd => fd.isDirectory())
  .flatMap(fd => {
      const posts = readdirSync(path.join(POSTS_PATH, fd.name))
      return posts.map(post => path.join(fd.name, post));
  })
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path));
