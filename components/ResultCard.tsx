"use client";
import { motion } from "framer-motion";
import { cardHover } from "@/lib/motion";
import Image from "next/image";
import { ProviderIcons } from "./ProviderIcons";

type Rec = {
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
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHover}
      className="group relative overflow-hidden rounded-2xl bg-[var(--surface-soft)] border border-[var(--surface-border)] shadow-card"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={item.posterUrl ?? "/placeholder.svg"}
          alt={`${item.title} poster`}
          fill
          sizes="(min-width: 1024px) 360px, 100vw"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-black/70 px-2 py-1 text-xs text-white">
            {item.ratings?.imdb ? `${item.ratings.imdb} IMDb` : "— IMDb"}
          </span>
          <span className="rounded-full bg-black/70 px-2 py-1 text-xs text-white">
            {item.runtimeMinutes ? `${item.runtimeMinutes}m` : "—"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">
          {item.title}{" "}
          {item.year && <span className="text-white/60">({item.year})</span>}
        </h3>
        <p className="mt-1 text-sm text-white/80">{item.whyOneLiner ?? "A great pick for tonight."}</p>

        <div className="mt-3 flex items-center gap-2">
          <ProviderIcons items={item.availability?.providers ?? []} />
          <div className="ml-auto flex gap-2">
            <a
              href={playUrl}
              className="rounded-xl bg-[var(--gold)] px-4 py-2 text-black text-sm font-medium hover:bg-[var(--gold-soft)] transition"
            >
              Play now
            </a>
            {item.trailerUrl && (
              <a
                href={item.trailerUrl}
                className="rounded-xl bg-white/10 px-3 py-2 text-white/90 text-sm hover:bg-white/15"
              >
                Trailer
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
