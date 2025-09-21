import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BlogMeta = {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags?: string[];
};

const BLOG_PATH = path.join(process.cwd(), "content/blog");

export function getAllPosts(): BlogMeta[] {
  if (!fs.existsSync(BLOG_PATH)) {
    return [];
  }
  
  return fs.readdirSync(BLOG_PATH)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const source = fs.readFileSync(path.join(BLOG_PATH, file), "utf-8");
      const { data } = matter(source);
      return data as BlogMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string) {
  const filePath = path.join(BLOG_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
  
  const source = fs.readFileSync(filePath, "utf-8");
  return matter(source);
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_PATH)) {
    return [];
  }
  
  return fs.readdirSync(BLOG_PATH)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}
