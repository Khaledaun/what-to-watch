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
      <LiveRegion>{announcement}</LiveRegion>
      
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
        <div className="space-y-8">
          {/* Platforms */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Choose Your Streaming Services</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={clsx(
                    "rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200",
                    platforms.includes(p)
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  )}
                  aria-pressed={platforms.includes(p)}
                  aria-label={`${p.replace(/-/g, " ")} streaming platform`}
                >
                  {p.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">What's Your Mood?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={clsx(
                    "rounded-lg px-4 py-2 text-sm font-medium border transition-all duration-200",
                    mood === m
                      ? "border-blue-500 text-blue-700 bg-blue-50 shadow-sm"
                      : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  )}
                  aria-pressed={mood === m}
                  aria-label={`${m} mood`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Time Budget */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">How Much Time Do You Have?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {TIME_BUDGETS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={clsx(
                    "rounded-lg px-4 py-2 text-sm font-medium border transition-all duration-200",
                    time === t
                      ? "border-blue-500 text-blue-700 bg-blue-50 shadow-sm"
                      : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  )}
                  aria-pressed={time === t}
                  aria-label={`${t} time budget`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Who Are You Watching With?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {AUDIENCES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={clsx(
                    "rounded-lg px-4 py-2 text-sm font-medium border transition-all duration-200",
                    audience === a
                      ? "border-blue-500 text-blue-700 bg-blue-50 shadow-sm"
                      : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  )}
                  aria-pressed={audience === a}
                  aria-label={`${a} audience`}
                >
                  {a.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">Movie or Series?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct}
                  onClick={() => setType(ct)}
                  className={clsx(
                    "rounded-lg px-4 py-2 text-sm font-medium border transition-all duration-200",
                    type === ct
                      ? "border-blue-500 text-blue-700 bg-blue-50 shadow-sm"
                      : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={submit}
          disabled={platforms.length === 0}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Show Me Picks
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <button
          onClick={() => onShowPicks?.({ surpriseMe: true })}
          className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-lg font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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


