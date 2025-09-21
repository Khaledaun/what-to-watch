"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const PLATFORMS = ["netflix","prime","disney-plus","hulu","max","apple-tv-plus"] as const;
const MOODS = ["feel-good","intense","funny","romantic","inspiring","family","spooky"] as const;

interface MobileFiltersProps {
  platforms: string[];
  mood: string;
  time: string;
  audience: string;
  type: string;
  onPlatformsChange: (platforms: string[]) => void;
  onMoodChange: (mood: string) => void;
  onTimeChange: (time: string) => void;
  onAudienceChange: (audience: string) => void;
  onTypeChange: (type: string) => void;
  onSubmit: () => void;
}

export default function MobileFilters({
  platforms,
  mood,
  time,
  audience,
  type,
  onPlatformsChange,
  onMoodChange,
  onTimeChange,
  onAudienceChange,
  onTypeChange,
  onSubmit,
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePlatform = (platform: string) => {
    onPlatformsChange(
      platforms.includes(platform)
        ? platforms.filter(p => p !== platform)
        : [...platforms, platform]
    );
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-[var(--gold)] text-black rounded-full shadow-lg hover:bg-[var(--gold-soft)] transition-colors"
        aria-label="Open filters"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
        </svg>
      </button>

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-[var(--surface)] rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-[var(--surface-border)] flex items-center justify-center"
                  aria-label="Close filters"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Platforms */}
                <fieldset>
                  <legend className="text-sm font-medium text-text mb-3">Streaming Platforms</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {PLATFORMS.map((platform) => (
                      <button
                        key={platform}
                        onClick={() => togglePlatform(platform)}
                        className={clsx(
                          "rounded-xl px-3 py-2 text-sm border transition-colors",
                          platforms.includes(platform)
                            ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                            : "border-[var(--surface-border)] text-text-muted"
                        )}
                        aria-pressed={platforms.includes(platform)}
                      >
                        {platform.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Mood */}
                <fieldset>
                  <legend className="text-sm font-medium text-text mb-3">Mood</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {MOODS.map((m) => (
                      <button
                        key={m}
                        onClick={() => onMoodChange(m)}
                        className={clsx(
                          "rounded-xl px-3 py-2 text-sm border transition-colors",
                          mood === m
                            ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                            : "border-[var(--surface-border)] text-text-muted"
                        )}
                        aria-pressed={mood === m}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Time */}
                <fieldset>
                  <legend className="text-sm font-medium text-text mb-3">Time Available</legend>
                  <div className="flex gap-2">
                    {["<45","~90","2h+"].map((t) => (
                      <button
                        key={t}
                        onClick={() => onTimeChange(t)}
                        className={clsx(
                          "flex-1 rounded-xl px-3 py-2 text-sm border transition-colors",
                          time === t
                            ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                            : "border-[var(--surface-border)] text-text-muted"
                        )}
                        aria-pressed={time === t}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Audience */}
                <fieldset>
                  <legend className="text-sm font-medium text-text mb-3">Audience</legend>
                  <select
                    value={audience}
                    onChange={(e) => onAudienceChange(e.target.value)}
                    className="w-full rounded-xl bg-[var(--surface-soft)] border border-[var(--surface-border)] px-3 py-2 text-sm text-text"
                  >
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="family-5-8">Family (5-8)</option>
                    <option value="family-9-12">Family (9-12)</option>
                    <option value="teens">Teens</option>
                  </select>
                </fieldset>

                {/* Type */}
                <fieldset>
                  <legend className="text-sm font-medium text-text mb-3">Content Type</legend>
                  <div className="flex gap-2">
                    {["either","movie","series"].map((t) => (
                      <button
                        key={t}
                        onClick={() => onTypeChange(t)}
                        className={clsx(
                          "flex-1 rounded-xl px-3 py-2 text-sm border transition-colors",
                          type === t
                            ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                            : "border-[var(--surface-border)] text-text-muted"
                        )}
                        aria-pressed={type === t}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => {
                    onPlatformsChange(["netflix","prime","disney-plus"]);
                    onMoodChange("feel-good");
                    onTimeChange("~90");
                    onAudienceChange("couple");
                    onTypeChange("either");
                  }}
                  className="flex-1 rounded-xl border border-[var(--surface-border)] px-4 py-3 text-text hover:bg-[var(--surface-soft)] transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    onSubmit();
                    setIsOpen(false);
                  }}
                  className="flex-1 rounded-xl bg-[var(--gold)] px-4 py-3 text-black font-medium hover:bg-[var(--gold-soft)] transition-colors"
                >
                  Show Picks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
