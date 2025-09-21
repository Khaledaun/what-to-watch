"use client";
import { motion } from "framer-motion";
import { fadeInUp, staggerChildren, pop } from "@/lib/motion";
import { useState } from "react";
import clsx from "clsx";
import { useFocusRing, LiveRegion } from "./Accessibility";

const PLATFORMS = ["netflix","prime","disney-plus","hulu","max","apple-tv-plus"] as const;
const MOODS = ["feel-good","intense","funny","romantic","inspiring","family","spooky"] as const;

export type HeroProps = {
  onShowPicks?: (filters: any) => void;
};

export default function Hero({ onShowPicks }: HeroProps) {
  const [platforms, setPlatforms] = useState<string[]>(["netflix","prime","disney-plus"]);
  const [mood, setMood] = useState<string>("feel-good");
  const [time, setTime] = useState<string>("~90");
  const [audience, setAudience] = useState<string>("couple");
  const [type, setType] = useState<string>("either");
  const [announcement, setAnnouncement] = useState<string>("");

  useFocusRing();

  const toggle = (v: string) => {
    setPlatforms((prev) => {
      const newPlatforms = prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v];
      setAnnouncement(`${v} ${prev.includes(v) ? 'deselected' : 'selected'}`);
      return newPlatforms;
    });
  };

  const submit = () => {
    setAnnouncement("Loading recommendations...");
    onShowPicks?.({ platforms, moods: [mood], timeBudget: time, audience, type });
  };

  return (
    <motion.section
      className="container pt-10 pb-6"
      initial="hidden"
      animate="show"
      variants={staggerChildren}
    >
      <LiveRegion message={announcement} />
      <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold tracking-tight font-display">
        What to Watch Tonight
      </motion.h1>
      <motion.p variants={fadeInUp} className="mt-2 text-sm text-text-muted">
        3 picks you can start in under 60 seconds.
      </motion.p>

      <motion.div variants={pop} className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
                  {/* Platforms */}
                  <fieldset className="flex flex-wrap gap-2">
                    <legend className="sr-only">Select streaming platforms</legend>
                    {PLATFORMS.map((p) => (
                      <button
                        key={p}
                        onClick={() => toggle(p)}
                        className={clsx(
                          "rounded-2xl border px-3 py-2 text-sm transition-colors",
                          platforms.includes(p)
                            ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                            : "border-[var(--surface-border)] text-text-muted hover:text-text"
                        )}
                        aria-pressed={platforms.includes(p)}
                        aria-label={`${p.replace(/-/g, " ")} streaming platform`}
                      >
                        {p.replace(/-/g, " ")}
                      </button>
                    ))}
                  </fieldset>

                  {/* Mood */}
                  <fieldset className="flex flex-wrap gap-2 ml-2">
                    <legend className="sr-only">Select mood</legend>
                    {MOODS.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={clsx(
                          "rounded-2xl px-3 py-2 text-sm border transition-colors",
                          mood === m
                            ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10"
                            : "border-[var(--surface-border)] text-text-muted hover:text-text"
                        )}
                        aria-pressed={mood === m}
                        aria-label={`${m} mood`}
                      >
                        {m}
                      </button>
                    ))}
                  </fieldset>

          {/* Time */}
          <div className="ml-2 flex gap-2">
            {["<45","~90","2h+"].map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={clsx(
                  "rounded-2xl px-3 py-2 text-sm border",
                  time === t
                    ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--surface-border)] text-text-muted hover:text-text"
                )}
                aria-pressed={time === t}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Audience */}
          <select
            className="ml-2 rounded-2xl bg-transparent border border-[var(--surface-border)] px-3 py-2 text-sm text-text-muted"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="solo">solo</option>
            <option value="couple">couple</option>
            <option value="family-5-8">family 5–8</option>
            <option value="family-9-12">family 9–12</option>
            <option value="teens">teens</option>
          </select>

          {/* Type */}
          <div className="ml-2 flex gap-2">
            {["either","movie","series"].map((tt) => (
              <button
                key={tt}
                onClick={() => setType(tt)}
                className={clsx(
                  "rounded-2xl px-3 py-2 text-sm border",
                  type === tt
                    ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--surface-border)] text-text-muted hover:text-text"
                )}
              >
                {tt}
              </button>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-2 justify-start lg:justify-end">
          <button
            onClick={submit}
            className="rounded-2xl px-5 py-3 bg-[var(--gold)] text-black font-medium shadow-glow hover:bg-[var(--gold-soft)] transition"
          >
            Show me picks
          </button>
          <button
            onClick={() => onShowPicks?.({ surpriseMe: true })}
            className="rounded-2xl px-5 py-3 bg-[var(--surface-soft)] border border-[var(--surface-border)] text-text hover:bg-white/5"
          >
            Surprise me
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
