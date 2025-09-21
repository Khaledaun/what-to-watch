import { getPost, getPostSlugs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateArticleLD, generateBreadcrumbLD } from "@/lib/structured-data";
import Navigation from "@/components/Navigation";

interface BlogPostProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  try {
    const { data } = getPost(params.slug);
    
    return {
      title: `${data.title} | What to Watch Tonight`,
      description: data.description,
      alternates: {
        canonical: `/blog/${params.slug}`,
      },
      openGraph: {
        title: data.title,
        description: data.description,
        url: `/blog/${params.slug}`,
        type: 'article',
        publishedTime: data.date,
        tags: data.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: data.title,
        description: data.description,
      },
    };
  } catch {
    return {
      title: 'Post Not Found | What to Watch Tonight',
    };
  }
}

export default function BlogPost({ params }: BlogPostProps) {
  try {
    const { content, data } = getPost(params.slug);

    // Generate structured data
    const articleLD = generateArticleLD(data as any, content);
    const breadcrumbLD = generateBreadcrumbLD([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: data.title, url: `/blog/${params.slug}` }
    ]);

    return (
      <article className="py-10">
        <Navigation />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
        />

        <div className="container max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-[var(--gold)] hover:text-[var(--gold-soft)]">
              Home
            </Link>
            <span className="mx-2 text-text-muted">/</span>
            <Link href="/blog" className="text-[var(--gold)] hover:text-[var(--gold-soft)]">
              Blog
            </Link>
            <span className="mx-2 text-text-muted">/</span>
            <span className="text-text-muted">{data.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold font-display mb-4">{data.title}</h1>
            <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
              <time dateTime={data.date}>
                {new Date(data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              {data.tags && (
                <div className="flex gap-2">
                  {data.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-[var(--surface-border)] rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-lg text-text-muted">{data.description}</p>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <MDXRemote source={content} />
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-[var(--surface-border)]">
            <div className="text-center">
              <p className="text-sm text-text-muted mb-4">
                Data provided by TMDB API. Last updated: {new Date(data.date).toLocaleDateString()}
              </p>
              <Link 
                href="/what-to-watch/tonight" 
                className="inline-flex items-center px-6 py-3 bg-[var(--gold)] text-black font-medium rounded-2xl hover:bg-[var(--gold-soft)] transition-colors"
              >
                Find What to Watch Tonight
              </Link>
            </div>
          </footer>
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
