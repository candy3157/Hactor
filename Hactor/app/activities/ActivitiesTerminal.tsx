"use client";

import { useMemo, useState } from "react";

type ActivityRow = {
  title: string;
  dateLabel: string;
  category: string;
};

type ActivitiesTerminalProps = {
  activities: ActivityRow[];
};

const categoryTone: Record<string, string> = {
  "스터디": "text-emerald-200",
  "프로젝트": "text-violet-200",
  "강의": "text-amber-200",
  "행사": "text-rose-200",
};

const filterActivities = (activities: ActivityRow[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return activities;
  }

  return activities.filter((activity) => {
    const haystack = [activity.title, activity.dateLabel, activity.category]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
};

export default function ActivitiesTerminal({
  activities,
}: ActivitiesTerminalProps) {
  const [query, setQuery] = useState("");
  const filteredActivities = useMemo(
    () => filterActivities(activities, query),
    [activities, query],
  );

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 p-6 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="absolute inset-0 bg-[url('/kali-background.png')] bg-cover bg-center opacity-35" />
      <div className="absolute inset-0 bg-[rgba(12,16,24,0.75)]" />

      <div className="relative z-10 flex min-h-[520px] flex-col">
        <div className="border-b border-[rgba(74,158,255,0.2)] pb-2">
          <div className="flex flex-wrap items-center font-mono text-[11px] tracking-[0.02em]">
            <span className="font-semibold text-[#ff3e3e]">kali@kali</span>
            <span className="text-white">:</span>
            <span className="font-semibold text-[#4a9eff]">~</span>
            <span className="text-white">$</span>
            <span className="ml-2 flex items-center gap-2">
              <span className="text-white">grep -i</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type to filter"
                aria-label="Filter activities"
                className="min-w-[180px] flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
              />
            </span>
          </div>
        </div>

        <div className="mt-3 font-mono text-[11px] text-white/70">
          <div className="mb-1">
            <span className="font-semibold text-[#ff3e3e]">kali@kali</span>
            <span className="text-white">:</span>
            <span className="font-semibold text-[#4a9eff]">~</span>
            <span className="text-[#4a9eff]">$ </span>
            <span className="text-white/50"># List all HACTOR activities</span>
          </div>
          <div>
            <span className="font-semibold text-[#ff3e3e]">kali@kali</span>
            <span className="text-white">:</span>
            <span className="font-semibold text-[#4a9eff]">~</span>
            <span className="text-[#4a9eff]">$ </span>
            <span className="text-white">hactor activities --list</span>
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-1 overflow-y-auto pr-1 font-mono text-[13px]">
          {filteredActivities.map((activity, index) => (
            <div
              key={`${activity.title}-${index}`}
              className="grid w-full grid-cols-[auto_44px_minmax(200px,1.6fr)_minmax(120px,0.9fr)_minmax(120px,0.9fr)] items-center gap-x-3 border-l-2 border-transparent px-2 py-1 transition-colors duration-200 hover:border-[#4a9eff] hover:bg-[rgba(74,158,255,0.08)]"
            >
              <span className="text-[#4a9eff]">$</span>
              <span className="text-white/40">
                [{String(index + 1).padStart(2, "0")}]
              </span>
              <span className="min-w-0 truncate font-semibold text-white">
                {activity.title}
              </span>
              <span className="min-w-0 truncate text-[rgba(56,189,248,0.8)]">
                {activity.dateLabel}
              </span>
              <span
                className={`min-w-0 truncate ${
                  categoryTone[activity.category] ??
                  "text-[rgba(251,191,36,0.9)]"
                }`}
              >
                {activity.category}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="font-mono text-[10px] text-white/40">
            <span className="text-[#4a9eff]">OK</span>{" "}
            {filteredActivities.length} activities found
          </p>
        </div>
      </div>
    </div>
  );
}
