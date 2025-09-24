"use client";
import { useState } from "react";
import clsx from "clsx";

const PLATFORMS = ["netflix","prime","disney-plus","hulu","max","apple-tv-plus"] as const;
const MOODS = ["feel-good","intense","funny","romantic","inspiring","family","spooky"] as const;
const TIME_BUDGETS = ["<45","~90","2h+"] as const;
const AUDIENCES = ["solo","couple","family 5–8","family 9–12","teens"] as const;
const CONTENT_TYPES = ["either","movie","series"] as const;

export type MobileFiltersProps = {
  onShowPicks?: (filters: any) => void;
}

export default function MobileFilters({ onShowPicks }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>(["netflix","prime","disney-plus"]);
  const [mood, setMood] = useState<string>("feel-good");
  const [time, setTime] = useState<string>("~90");
  const [audience, setAudience] = useState<string>("couple");
  const [type, setType] = useState<string>("either");

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const submit = () => {
    onShowPicks?.({ platforms, moods: [mood], timeBudget: time, audience, type });
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 text-black font-medium shadow-lg lg:hidden"
      >
        <span className="text-sm">Filters</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
      </button>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-[var(--surface)] rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--surface-border)] flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Platforms */}
              <fieldset>
                <legend className="text-lg font-semibold mb-3">Platforms</legend>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <label
                      key={p}
                      className={clsx(
                        "relative flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        platforms.includes(p)
                          ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                          : "border-[var(--surface-border)] bg-[var(--surface-soft)] text-text hover:bg-white/5"
                      )}
                    >
                      <input
                        type="checkbox"
                        value={p}
                        checked={platforms.includes(p)}
                        onChange={() => togglePlatform(p)}
                        className="sr-only"
                      />
                      {p.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Mood */}
              <fieldset>
                <legend className="text-lg font-semibold mb-3">Mood</legend>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <label
                      key={m}
                      className={clsx(
                        "relative flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        mood === m
                          ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                          : "border-[var(--surface-border)] bg-[var(--surface-soft)] text-text hover:bg-white/5"
                      )}
                    >
                      <input
                        type="radio"
                        value={m}
                        checked={mood === m}
                        onChange={() => setMood(m)}
                        name="mobile-mood"
                        className="sr-only"
                      />
                      {m.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Time Budget */}
              <fieldset>
                <legend className="text-lg font-semibold mb-3">Time Available</legend>
                <div className="flex flex-wrap gap-2">
                  {TIME_BUDGETS.map((t) => (
                    <label
                      key={t}
                      className={clsx(
                        "relative flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        time === t
                          ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                          : "border-[var(--surface-border)] bg-[var(--surface-soft)] text-text hover:bg-white/5"
                      )}
                    >
                      <input
                        type="radio"
                        value={t}
                        checked={time === t}
                        onChange={() => setTime(t)}
                        name="mobile-time"
                        className="sr-only"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Audience */}
              <fieldset>
                <legend className="text-lg font-semibold mb-3">Audience</legend>
                <div className="flex flex-wrap gap-2">
                  {AUDIENCES.map((a) => (
                    <label
                      key={a}
                      className={clsx(
                        "relative flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        audience === a
                          ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                          : "border-[var(--surface-border)] bg-[var(--surface-soft)] text-text hover:bg-white/5"
                      )}
                    >
                      <input
                        type="radio"
                        value={a}
                        checked={audience === a}
                        onChange={() => setAudience(a)}
                        name="mobile-audience"
                        className="sr-only"
                      />
                      {a.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Content Type */}
              <fieldset>
                <legend className="text-lg font-semibold mb-3">Content Type</legend>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPES.map((ct) => (
                    <label
                      key={ct}
                      className={clsx(
                        "relative flex cursor-pointer items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        type === ct
                          ? "border-[var(--gold)] bg-[var(--gold)] text-black"
                          : "border-[var(--surface-border)] bg-[var(--surface-soft)] text-text hover:bg-white/5"
                      )}
                    >
                      <input
                        type="radio"
                        value={ct}
                        checked={type === ct}
                        onChange={() => setType(ct)}
                        name="mobile-type"
                        className="sr-only"
                      />
                      {ct.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setPlatforms(["netflix","prime","disney-plus"]);
                  setMood("feel-good");
                  setTime("~90");
                  setAudience("couple");
                  setType("either");
                }}
                className="flex-1 rounded-xl border border-[var(--surface-border)] px-4 py-3 text-text font-medium hover:bg-white/5 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={submit}
                disabled={platforms.length === 0}
                className="flex-1 rounded-xl bg-[var(--gold)] px-4 py-3 text-black font-medium hover:bg-[var(--gold-soft)] transition-colors"
              >
                Show Picks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}