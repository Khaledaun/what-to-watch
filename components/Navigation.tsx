import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="container py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-display text-[var(--gold)]">
          What to Watch Tonight
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/what-to-watch/tonight" 
            className="text-text hover:text-[var(--gold)] transition-colors"
          >
            Tonight
          </Link>
          <Link 
            href="/blog" 
            className="text-text hover:text-[var(--gold)] transition-colors"
          >
            Blog
          </Link>
          <Link 
            href="/blog/new" 
            className="text-text hover:text-[var(--gold)] transition-colors text-sm"
          >
            Write
          </Link>
        </div>
      </div>
    </nav>
  );
}
