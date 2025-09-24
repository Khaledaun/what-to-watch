"use client";
import Link from 'next/link';

interface Backlink {
  url: string;
  title: string;
  description: string;
  type: 'internal' | 'external';
  category: string;
}

interface BacklinksProps {
  backlinks: Backlink[];
  title?: string;
}

export default function Backlinks({ backlinks, title = "Related Content" }: BacklinksProps) {
  if (!backlinks || backlinks.length === 0) {
    return null;
  }

  return (
    <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {backlinks.map((backlink, index) => (
          <Link
            key={index}
            href={backlink.url}
            className="group block"
            rel={backlink.type === 'external' ? 'nofollow noopener noreferrer' : undefined}
          >
            <div className="bg-slate-800/50 rounded-lg p-6 hover:bg-slate-700/50 transition-all duration-200 transform hover:scale-105">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                  {backlink.title}
                </h3>
                <div className="flex-shrink-0 ml-3">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors line-clamp-3">
                {backlink.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {backlink.category}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  {backlink.type === 'internal' ? 'Internal Link' : 'External Link'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

