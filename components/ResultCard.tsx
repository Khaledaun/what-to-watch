"use client";
// import { motion } from "framer-motion";
// import { cardHover } from "@/lib/motion";
import Image from "next/image";
import { ProviderIcons } from "./ProviderIcons";

type Rec = {
  id?: string;
  title: string;
  year?: number;
  posterUrl?: string;
  whyOneLiner?: string;
  runtimeMinutes?: number;
  ratings?: { imdb?: number; rtTomatometer?: number };
  availability?: { providers: string[]; urls?: Record<string, string> };
  trailerUrl?: string;
};

export default function ResultCard({ item }: { item: Rec }) {
  const playUrl =
    item.availability?.urls?.primary ??
    item.availability?.urls?.netflix ??
    item.availability?.urls?.prime ??
    "#";

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-lg">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={item.posterUrl ?? "/placeholder.svg"}
          alt={`${item.title} poster`}
          fill
          sizes="(min-width: 1024px) 360px, 100vw"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-black/70 px-2 py-1 text-xs text-white font-mono">
            {item.ratings?.imdb ? `${item.ratings.imdb} IMDb` : "— IMDb"}
          </span>
          <span className="rounded-full bg-black/70 px-2 py-1 text-xs text-white font-mono">
            {item.runtimeMinutes ? `${item.runtimeMinutes}m` : "—"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
          {item.title}{" "}
          {item.year && <span className="text-white/60">({item.year})</span>}
        </h3>
        <p className="mt-1 text-sm text-white/80">{item.whyOneLiner ?? "A great pick for tonight."}</p>

                <div className="mt-3 flex items-center gap-2">
                  <ProviderIcons items={item.availability?.providers ?? []} />
                  <div className="ml-auto flex gap-2">
                    <button
                      className="rounded-xl bg-[#E0B15C] hover:bg-[#F2C879] px-4 py-2 text-[#0A1220] text-sm font-medium transition-colors"
                      data-affiliate="primary"
                      data-movie-id={item.id}
                      data-movie-title={item.title}
                      data-cta-type="card-primary"
                    >
                      Play now
                    </button>
                    {item.trailerUrl && (
                      <a
                        href={item.trailerUrl}
                        className="rounded-xl bg-white/10 px-3 py-2 text-white/90 text-sm hover:bg-white/15 transition-colors"
                      >
                        Trailer
                      </a>
                    )}
                  </div>
                </div>
      </div>
    </article>
  );
}
