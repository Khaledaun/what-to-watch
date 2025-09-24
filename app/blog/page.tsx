import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Metadata } from "next";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Blog - What to Watch Tonight | Movie & TV Articles",
  description: "Read our latest articles about movies, TV shows, streaming platforms, and entertainment recommendations.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog - What to Watch Tonight | Movie & TV Articles",
    description: "Read our latest articles about movies, TV shows, streaming platforms, and entertainment recommendations.",
    url: "/blog",
  },
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="py-10">
      <Navigation />
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold font-display mb-4">Latest Articles</h1>
        <p className="text-text-muted mb-8">
          Discover our curated insights on movies, TV shows, and streaming platforms.
        </p>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article 
                key={post.slug} 
                className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)] p-6 hover:bg-white/5 transition-colors"
              >
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-xl font-semibold text-[var(--gold)] group-hover:text-[var(--gold-soft)] transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-text-muted mb-3">{post.description}</p>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    {post.tags && (
                      <div className="flex gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-[var(--surface-border)] rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            href="/what-to-watch/tonight" 
            className="inline-flex items-center px-6 py-3 bg-[var(--gold)] text-black font-medium rounded-2xl hover:bg-[var(--gold-soft)] transition-colors"
          >
            Find What to Watch Tonight
          </Link>
        </div>
      </div>
    </main>
  );
}
