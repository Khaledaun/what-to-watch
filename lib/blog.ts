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

// Check if we're in a Node.js environment
const isNodeEnv = typeof process !== 'undefined' && process.versions && process.versions.node;

export function getAllPosts(): BlogMeta[] {
  // Return empty array if not in Node.js environment (e.g., Edge Runtime)
  if (!isNodeEnv || !fs.existsSync(BLOG_PATH)) {
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
  // Return mock data if not in Node.js environment
  if (!isNodeEnv) {
    return {
      content: `# ${slug}\n\nThis is a placeholder blog post.`,
      data: {
        title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `A blog post about ${slug}`,
        slug,
        date: new Date().toISOString(),
        tags: ['placeholder']
      }
    };
  }

  const filePath = path.join(BLOG_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Post with slug "${slug}" not found`);
  }
  
  const source = fs.readFileSync(filePath, "utf-8");
  return matter(source);
}

export function getPostSlugs(): string[] {
  // Return empty array if not in Node.js environment
  if (!isNodeEnv || !fs.existsSync(BLOG_PATH)) {
    return [];
  }
  
  return fs.readdirSync(BLOG_PATH)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}

