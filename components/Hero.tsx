"use client";
import { useState } from "react";
import clsx from "clsx";
import { useFocusRing, LiveRegion } from "./Accessibility";

const PLATFORMS = ["netflix","prime","disney-plus","hulu","max","apple-tv-plus"] as const;
const MOODS = ["feel-good","intense","funny","romantic","inspiring","family","spooky"] as const;
const TIME_BUDGETS = ["<45","~90","2h+"] as const;
const AUDIENCES = ["solo","couple","family 5–8","family 9–12","teens"] as const;
const CONTENT_TYPES = ["either","movie","series"] as const;

export type HeroProps = {
  onShowPicks?: (filters: any) => void;
};

export default function Hero({ onShowPicks }: HeroProps) {
  const [platforms, setPlatforms] = useState<string[]>(["netflix","prime","disney-plus"]);
  const [mood, setMood] = useState<string>("feel-good");
  const [time, setTime] = useState<string>("~90");
  const [audience, setAudience] = useState<string>("couple");
  const [type, setType] = useState<string>("either");
  const [announcement, setAnnouncement] = useState('');

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const submit = () => {
    setAnnouncement("Loading recommendations...");
    onShowPicks?.({ platforms, moods: [mood], timeBudget: time, audience, type });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <LiveRegion message={announcement} />
      
      {/* Hero Decision Strip */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
        <div className="space-y-6">
          {/* Platforms - Multi-chip */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3 text-center">Your Streaming Services</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={clsx(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 border",
                    platforms.includes(p)
                      ? "border-[#E0B15C] bg-[#E0B15C]/10 text-[#E0B15C] shadow-sm"
                      : "border-white/20 text-gray-300 hover:text-white hover:border-white/40 hover:bg-white/5"
                  )}
                  aria-pressed={platforms.includes(p)}
                  aria-label={`${p.replace(/-/g, " ")} streaming platform`}
                >
                  {p.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Mood - Pills */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3 text-center">Mood</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    mood === m
                      ? "bg-[#E0B15C] text-[#0A1220] shadow-lg"
                      : "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20"
                  )}
                  aria-pressed={mood === m}
                  aria-label={`${m} mood`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Time - Radio */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3 text-center">Time Available</h3>
            <div className="flex justify-center gap-2">
              {TIME_BUDGETS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={clsx(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 border",
                    time === t
                      ? "border-[#E0B15C] bg-[#E0B15C]/10 text-[#E0B15C]"
                      : "border-white/20 text-gray-300 hover:text-white hover:border-white/40"
                  )}
                  aria-pressed={time === t}
                  aria-label={`${t} time budget`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Audience - Select */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3 text-center">Audience</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={clsx(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    audience === a
                      ? "bg-[#1E3A8A] text-white shadow-sm"
                      : "bg-white/10 text-gray-300 hover:text-white hover:bg-white/20"
                  )}
                  aria-pressed={audience === a}
                  aria-label={`${a} audience`}
                >
                  {a.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Type - Segmented */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3 text-center">Content Type</h3>
            <div className="flex justify-center">
              <div className="bg-white/10 rounded-lg p-1 flex">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct}
                    onClick={() => setType(ct)}
                    className={clsx(
                      "rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                      type === ct
                        ? "bg-[#E0B15C] text-[#0A1220] shadow-sm"
                        : "text-gray-300 hover:text-white"
                    )}
                    aria-pressed={type === ct}
                    aria-label={`${ct} content type`}
                  >
                    {ct.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={submit}
          disabled={platforms.length === 0}
          className="inline-flex items-center justify-center px-8 py-4 bg-[#E0B15C] hover:bg-[#F2C879] text-[#0A1220] font-semibold text-lg rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Show Me Picks
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <button
          onClick={() => onShowPicks?.({ surpriseMe: true })}
          className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/10 transition-all duration-200"
        >
          Surprise Me
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}