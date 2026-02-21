"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ActivityRow = {
  id: string;
  date: string;
  title: string;
  dateLabel: string;
  year: number;
  category: string;
};

type ActivitiesTerminalProps = {
  activities: ActivityRow[];
  nowLabel: string;
};

type ViewMode = "icon" | "list";
type DirectoryState = { kind: "activities" } | { kind: "year"; year: number };

const DEFAULT_YEARS = [2025, 2026];
const ACTIVITY_RETURN_STATE_KEY = "activities:return-state";
const FOLDER_ICON_PATH = "/activity/folder.png";
const FILE_ICON_PATH = "/activity/application-document.svg";

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

const toFileName = (title: string) => {
  const safeTitle = title.trim() || "activity";
  return `${safeTitle}.log`;
};

const compareActivitiesByDateDesc = (a: ActivityRow, b: ActivityRow) => {
  const aTime = Date.parse(a.date);
  const bTime = Date.parse(b.date);

  if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
    return bTime - aTime;
  }

  return a.title.localeCompare(b.title);
};

export default function ActivitiesTerminal({
  activities,
  nowLabel,
}: ActivitiesTerminalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("icon");
  const [currentDir, setCurrentDir] = useState<DirectoryState>({
    kind: "activities",
  });
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );
  const [pendingActivityId, setPendingActivityId] = useState<string | null>(
    null,
  );

  const filteredActivities = useMemo(
    () => filterActivities(activities, query).sort(compareActivitiesByDateDesc),
    [activities, query],
  );

  const years = useMemo(() => {
    const merged = new Set<number>(DEFAULT_YEARS);
    filteredActivities.forEach((activity) => {
      if (Number.isInteger(activity.year) && activity.year > 0) {
        merged.add(activity.year);
      }
    });
    return Array.from(merged).sort((a, b) => b - a);
  }, [filteredActivities]);

  const activitiesByYear = useMemo(() => {
    const grouped = new Map<number, ActivityRow[]>();
    years.forEach((year) => grouped.set(year, []));
    filteredActivities.forEach((activity) => {
      if (!grouped.has(activity.year)) {
        grouped.set(activity.year, []);
      }
      grouped.get(activity.year)?.push(activity);
    });

    grouped.forEach((items, year) => {
      grouped.set(year, [...items].sort(compareActivitiesByDateDesc));
    });

    return grouped;
  }, [filteredActivities, years]);

  const path =
    currentDir.kind === "activities"
      ? "/home/hactor/Activities"
      : `/home/hactor/Activities/${currentDir.year}`;
  const currentDirActivities =
    currentDir.kind === "year"
      ? (activitiesByYear.get(currentDir.year) ?? [])
      : [];
  const currentDirName =
    currentDir.kind === "activities" ? "Activities" : String(currentDir.year);
  const isNavigating = pendingActivityId !== null;

  const openActivityDetail = (activity: ActivityRow) => {
    if (isNavigating) {
      return;
    }

    setSelectedActivityId(activity.id);
    setPendingActivityId(activity.id);

    try {
      window.sessionStorage.setItem(
        ACTIVITY_RETURN_STATE_KEY,
        JSON.stringify({
          year: activity.year,
          selectedActivityId: activity.id,
        }),
      );
    } catch {
      // Best-effort only; navigation should continue even if storage is blocked.
    }

    router.push(`/activities/${activity.id}`);
  };

  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-2xl border border-[#433a45] bg-[#161319] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(233,84,32,0.18),transparent_40%),radial-gradient(circle_at_0%_100%,rgba(119,45,145,0.25),transparent_45%)]" />

      <div className="relative z-10 flex min-h-[560px] items-center justify-center px-3 py-4 sm:px-4 sm:py-5">
        <div className="flex h-[500px] w-full max-w-[1020px] flex-col overflow-hidden rounded-xl border border-black/35 bg-[#ececec] shadow-[0_22px_70px_rgba(0,0,0,0.52)]">
          <div className="flex h-11 items-center justify-between border-b border-black/25 bg-[#2f2b31] px-3 text-white/90">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (currentDir.kind === "activities") {
                    return;
                  }
                  setCurrentDir({ kind: "activities" });
                  setSelectedActivityId(null);
                }}
                disabled={currentDir.kind === "activities" || isNavigating}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/15 bg-white/5 text-sm text-white/75 transition hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Back"
              >
                &lt;
              </button>
              <button
                type="button"
                disabled
                className="inline-flex h-7 w-7 cursor-not-allowed items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-sm text-white/30"
                aria-label="Forward"
              >
                &gt;
              </button>
              <div className="ml-1 flex items-center rounded-md border border-white/15 bg-white/[0.07] px-3 py-1 text-sm">
                Computer
                <span className="ml-2 text-xs text-white/70">v</span>
              </div>
            </div>

            <div className="mx-3 hidden min-w-0 flex-1 sm:block">
              <div className="flex h-8 items-center rounded-md border border-white/15 bg-black/20 px-3 text-[12px] text-white/85">
                <span className="truncate">{path}</span>
                {isNavigating ? (
                  <span className="ml-3 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e95420]/50 bg-[#e95420]/20 px-2 py-0.5 text-[10px] text-[#ffd0c0]">
                    <span className="h-2.5 w-2.5 animate-spin rounded-full border border-[#ffd0c0]/30 border-t-[#ffd0c0]" />
                    Opening...
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                aria-label="Search activities"
                disabled={isNavigating}
                className="h-7 w-24 rounded-md border border-white/15 bg-black/20 px-2.5 text-[12px] text-white/90 outline-none placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-45 sm:w-36"
              />
              <div className="hidden items-center gap-1 rounded-md border border-white/15 bg-black/20 p-1 sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode("icon")}
                  disabled={isNavigating}
                  className={`inline-flex h-5 w-6 items-center justify-center rounded text-[10px] transition ${
                    viewMode === "icon"
                      ? "bg-[#e95420] text-white"
                      : "text-white/70 hover:bg-white/15"
                  }`}
                  aria-label="Icon view"
                >
                  []
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  disabled={isNavigating}
                  className={`inline-flex h-5 w-6 items-center justify-center rounded text-[10px] transition ${
                    viewMode === "list"
                      ? "bg-[#e95420] text-white"
                      : "text-white/70 hover:bg-white/15"
                  }`}
                  aria-label="List view"
                >
                  ==
                </button>
              </div>
              <button
                type="button"
                aria-label="Close window"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#e95420] text-sm text-white"
              >
                x
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            <aside className="hidden w-52 border-r border-[#d3d3d3] bg-[#e7e7e7] p-3 text-[14px] text-[#1f1f1f] md:block">
              <p className="px-3 py-1.5 font-medium text-black">Recent</p>
              <p className="mt-1 rounded-md bg-[#d6d6d6] px-3 py-1.5 font-medium text-black">
                Activities
              </p>
              <div className="mt-2 space-y-1 text-[#2e2e2e]">
                <p className="rounded-md px-3 py-1.5 hover:bg-[#d9d9d9]">
                  Home
                </p>
                <p className="rounded-md px-3 py-1.5 hover:bg-[#d9d9d9]">
                  Documents
                </p>
                <p className="rounded-md px-3 py-1.5 hover:bg-[#d9d9d9]">
                  Downloads
                </p>
                <p className="rounded-md px-3 py-1.5 hover:bg-[#d9d9d9]">
                  Music
                </p>
                <p className="rounded-md px-3 py-1.5 hover:bg-[#d9d9d9]">
                  Pictures
                </p>
                <p className="rounded-md px-3 py-1.5 hover:bg-[#d9d9d9]">
                  Videos
                </p>
              </div>
              <div className="my-2 h-px bg-[#cfcfcf]" />
              <p className="rounded-md px-3 py-1.5 text-[#2e2e2e] hover:bg-[#d9d9d9]">
                Other Locations
              </p>
            </aside>

            <section className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#f5f5f5] p-4 text-[#1f1f1f] sm:p-5">
              {currentDir.kind === "activities" ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onDoubleClick={() => {
                        setCurrentDir({ kind: "year", year });
                        setSelectedActivityId(null);
                      }}
                      disabled={isNavigating}
                      className="group relative flex flex-col items-center gap-1.5 rounded-lg px-2 py-2 transition hover:bg-[#e4e4e4] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      <Image
                        src={FOLDER_ICON_PATH}
                        alt={`${year} folder`}
                        width={72}
                        height={56}
                        className="transition group-hover:scale-[1.03]"
                      />
                      <span className="text-[14px] text-[#1c1c1c]">{year}</span>
                      <span className="absolute right-1.5 top-1 rounded-full bg-[#7a2a86] px-2 py-0.5 text-[10px] font-semibold text-white">
                        {activitiesByYear.get(year)?.length ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              ) : viewMode === "icon" ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {currentDirActivities.map((activity) => {
                    const fileName = toFileName(activity.title);
                    const isSelected = selectedActivityId === activity.id;
                    const isPending = pendingActivityId === activity.id;
                    const isDimmed = isNavigating && !isPending;

                    return (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() => setSelectedActivityId(activity.id)}
                        onDoubleClick={() => openActivityDetail(activity)}
                        disabled={isNavigating}
                        className={`flex flex-col items-center gap-1.5 rounded-lg px-2 py-2 transition ${
                          isDimmed
                            ? "opacity-50"
                            : isSelected
                              ? "bg-[#e8ddf0]"
                              : "hover:bg-[#e4e4e4]"
                        }`}
                      >
                        <Image
                          src={FILE_ICON_PATH}
                          alt="activity file"
                          width={46}
                          height={56}
                        />
                        <span className="line-clamp-2 text-center text-[12px] text-[#1f1f1f]">
                          {fileName}
                        </span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#7a2a86]">
                            <span className="h-2.5 w-2.5 animate-spin rounded-full border border-[#7a2a86]/30 border-t-[#7a2a86]" />
                            Opening...
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#666]">
                            {activity.dateLabel}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1 text-[12px]">
                  <div className="grid grid-cols-[42px_minmax(180px,2fr)_minmax(90px,1fr)_minmax(80px,0.8fr)] gap-3 rounded-md bg-[#e3e3e3] px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-[#666]">
                    <span>Icon</span>
                    <span>Name</span>
                    <span>Modified</span>
                    <span>Type</span>
                  </div>
                  {currentDirActivities.map((activity) => {
                    const fileName = toFileName(activity.title);
                    const isSelected = selectedActivityId === activity.id;
                    const isPending = pendingActivityId === activity.id;
                    const isDimmed = isNavigating && !isPending;

                    return (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() => setSelectedActivityId(activity.id)}
                        onDoubleClick={() => openActivityDetail(activity)}
                        disabled={isNavigating}
                        className={`grid w-full grid-cols-[42px_minmax(180px,2fr)_minmax(90px,1fr)_minmax(80px,0.8fr)] items-center gap-3 rounded-md px-3 py-2 text-left transition ${
                          isDimmed
                            ? "opacity-50"
                            : isSelected
                              ? "bg-[#e8ddf0]"
                              : "hover:bg-[#e9e9e9]"
                        }`}
                      >
                        <Image
                          src={FILE_ICON_PATH}
                          alt="activity file"
                          width={20}
                          height={24}
                        />
                        <span className="truncate text-[#1f1f1f]">
                          {fileName}
                        </span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 truncate text-[#7a2a86]">
                            <span className="h-2.5 w-2.5 shrink-0 animate-spin rounded-full border border-[#7a2a86]/30 border-t-[#7a2a86]" />
                            Opening...
                          </span>
                        ) : (
                          <span className="truncate text-[#666]">
                            {activity.dateLabel}
                          </span>
                        )}
                        <span className="truncate text-[#555]">
                          {activity.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <div className="flex items-center justify-between border-t border-[#d6d6d6] bg-[#ececec] px-3 py-1.5 text-[10px] text-[#666]">
            <span>
              {currentDir.kind === "activities"
                ? `${years.length} items`
                : `${currentDirActivities.length} items`}
            </span>
            {isNavigating ? (
              <span className="inline-flex items-center gap-1.5 text-[#7a2a86]">
                <span className="h-2.5 w-2.5 animate-spin rounded-full border border-[#7a2a86]/30 border-t-[#7a2a86]" />
                Loading detail...
              </span>
            ) : (
              <span>{`${currentDirName} / ${nowLabel}`}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
