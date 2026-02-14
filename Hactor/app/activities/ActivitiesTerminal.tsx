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
};

type ViewMode = "icon" | "list";
type DirectoryState = { kind: "activities" } | { kind: "year"; year: number };

const DEFAULT_YEARS = [2025, 2026];
const ACTIVITY_RETURN_STATE_KEY = "activities:return-state";

type RestoredState = {
  currentDir: DirectoryState;
  selectedActivityId: string | null;
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

const restoreStateFromSession = (): RestoredState => {
  const fallback: RestoredState = {
    currentDir: { kind: "activities" },
    selectedActivityId: null,
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  const rawState = window.sessionStorage.getItem(ACTIVITY_RETURN_STATE_KEY);
  if (!rawState) {
    return fallback;
  }

  window.sessionStorage.removeItem(ACTIVITY_RETURN_STATE_KEY);

  try {
    const parsed = JSON.parse(rawState) as {
      year?: unknown;
      selectedActivityId?: unknown;
    };

    const restoredDir: DirectoryState =
      typeof parsed.year === "number" && Number.isInteger(parsed.year)
        ? { kind: "year", year: parsed.year }
        : fallback.currentDir;
    const restoredSelectedId =
      typeof parsed.selectedActivityId === "string"
        ? parsed.selectedActivityId
        : null;

    return {
      currentDir: restoredDir,
      selectedActivityId: restoredSelectedId,
    };
  } catch {
    // Ignore malformed state from session storage.
    return fallback;
  }
};

export default function ActivitiesTerminal({
  activities,
}: ActivitiesTerminalProps) {
  const router = useRouter();
  const [restoredState] = useState(restoreStateFromSession);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("icon");
  const [currentDir, setCurrentDir] = useState<DirectoryState>(
    restoredState.currentDir,
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    restoredState.selectedActivityId,
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

  const nowLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date()),
    [],
  );

  const path =
    currentDir.kind === "activities"
      ? "/kali/Hactor/Activities"
      : `/kali/Hactor/Activities/${currentDir.year}`;
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
    <div className="relative min-h-[560px] overflow-hidden rounded-2xl border border-white/10 bg-[#060a12] shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
      <div className="absolute inset-0 bg-[url('/kali-background.png')] bg-cover bg-center opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(35,95,160,0.35),transparent_42%),radial-gradient(circle_at_84%_78%,rgba(162,53,98,0.28),transparent_45%),linear-gradient(180deg,rgba(8,12,20,0.6),rgba(8,12,20,0.9))]" />

      <div className="absolute inset-x-0 top-0 z-20 flex h-8 items-center justify-between border-b border-white/10 bg-[rgba(12,18,30,0.85)] px-3 text-[11px] text-white/80 backdrop-blur-[10px]">
        <div className="flex items-center gap-4">
          <span>Applications</span>
          <span>Places</span>
          <span>Terminal</span>
        </div>
        <span>{nowLabel}</span>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-6 hidden rounded-md border border-white/10 bg-[rgba(20,26,40,0.75)] px-4 py-2 text-center font-mono text-[#7dd6ff] shadow-[0_12px_30px_rgba(0,0,0,0.4)] lg:block">
        <p className="text-[42px] leading-none tracking-[0.04em]">06:34</p>
        <p className="mt-1 text-[11px] text-white/45">2022-12-10</p>
      </div>

      <div className="relative z-10 flex min-h-[560px] items-center justify-center px-4 pb-5 pt-12">
        <div className="flex h-[500px] w-full max-w-[1020px] flex-col overflow-hidden rounded-[10px] border border-white/10 bg-[rgba(31,36,48,0.96)] shadow-[0_22px_70px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between border-b border-white/10 bg-[rgba(28,32,43,0.95)] px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28ca42]" />
            </div>
            <p className="text-[13px] text-white/65">Activiteis</p>
            <div className="w-12" />
          </div>

          <div className="flex items-center gap-2 border-b border-white/10 bg-[rgba(39,44,58,0.95)] px-3 py-2">
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[rgba(21,27,38,0.8)] text-sm text-white/70 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Back"
            >
              &lt;
            </button>

            <div className="flex h-8 min-w-0 flex-1 items-center rounded-md border border-white/10 bg-[rgba(20,25,36,0.85)] px-3 text-[12px] text-white/75">
              <span className="truncate">{path}</span>
              {isNavigating ? (
                <span className="ml-3 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#6cb5e9]/40 bg-[rgba(74,158,255,0.14)] px-2 py-0.5 text-[10px] text-[#9ed6ff]">
                  <span className="h-2.5 w-2.5 animate-spin rounded-full border border-[#9ed6ff]/35 border-t-[#9ed6ff]" />
                  Opening...
                </span>
              ) : null}
            </div>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              aria-label="Search activities"
              disabled={isNavigating}
              className="h-8 w-40 rounded-md border border-white/10 bg-[rgba(20,25,36,0.85)] px-3 text-[12px] text-white/80 outline-none placeholder:text-white/35 disabled:cursor-not-allowed disabled:opacity-45 sm:w-52"
            />

            <div className="flex items-center gap-1 rounded-md border border-white/10 bg-[rgba(20,25,36,0.85)] p-1">
              <button
                type="button"
                onClick={() => setViewMode("icon")}
                disabled={isNavigating}
                className={`inline-flex h-6 w-6 items-center justify-center rounded text-[11px] transition ${
                  viewMode === "icon"
                    ? "bg-[rgba(90,159,212,0.35)] text-[#9ed6ff]"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
                aria-label="Icon view"
              >
                []
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                disabled={isNavigating}
                className={`inline-flex h-6 w-6 items-center justify-center rounded text-[11px] transition ${
                  viewMode === "list"
                    ? "bg-[rgba(90,159,212,0.35)] text-[#9ed6ff]"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
                aria-label="List view"
              >
                ==
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            <aside className="hidden w-56 border-r border-white/10 bg-[rgba(30,35,47,0.85)] p-3 text-[13px] text-white/65 md:block">
              <div className="rounded-md bg-[rgba(90,159,212,0.2)] px-3 py-2 text-white">
                Activities
              </div>
              <div className="mt-1 space-y-1">
                <div className="rounded-md px-3 py-2 hover:bg-white/8">
                  Home
                </div>
                <div className="rounded-md px-3 py-2 hover:bg-white/8">
                  Documents
                </div>
                <div className="rounded-md px-3 py-2 hover:bg-white/8">
                  Downloads
                </div>
                <div className="rounded-md px-3 py-2 hover:bg-white/8">
                  Music
                </div>
                <div className="rounded-md px-3 py-2 hover:bg-white/8">
                  Pictures
                </div>
                <div className="rounded-md px-3 py-2 hover:bg-white/8">
                  Videos
                </div>
              </div>
              <div className="my-2 h-px bg-white/10" />
              <div className="rounded-md px-3 py-2 hover:bg-white/8">
                Other Locations
              </div>
            </aside>

            <section className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-[rgba(22,27,39,0.58)] p-5">
              {currentDir.kind === "activities" ? (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onDoubleClick={() => {
                        setCurrentDir({ kind: "year", year });
                        setSelectedActivityId(null);
                      }}
                      disabled={isNavigating}
                      className="group relative flex flex-col items-center gap-2 rounded-lg px-2 py-3 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      <Image
                        src="/folder_temp.svg"
                        alt={`${year} folder`}
                        width={74}
                        height={60}
                        className="drop-shadow-[0_8px_16px_rgba(52,131,205,0.35)] transition group-hover:scale-[1.03]"
                      />
                      <span className="text-[13px] text-white/90">{year}</span>
                      <span className="absolute right-2 top-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {activitiesByYear.get(year)?.length ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              ) : viewMode === "icon" ? (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
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
                        className={`flex flex-col items-center gap-2 rounded-lg px-2 py-3 transition ${
                          isDimmed
                            ? "opacity-50"
                            : isSelected
                            ? "bg-[rgba(90,159,212,0.22)]"
                            : "hover:bg-white/10"
                        }`}
                      >
                        <Image
                          src="/application-document.svg"
                          alt="activity file"
                          width={46}
                          height={56}
                        />
                        <span className="line-clamp-2 text-center text-[12px] text-white/90">
                          {fileName}
                        </span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#9ed6ff]">
                            <span className="h-2.5 w-2.5 animate-spin rounded-full border border-[#9ed6ff]/35 border-t-[#9ed6ff]" />
                            Opening...
                          </span>
                        ) : (
                          <span className="text-[10px] text-white/45">
                            {activity.dateLabel}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1 text-[12px]">
                  <div className="grid grid-cols-[42px_minmax(180px,2fr)_minmax(90px,1fr)_minmax(80px,0.8fr)] gap-3 rounded-md bg-[rgba(40,46,60,0.88)] px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-white/45">
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
                            ? "bg-[rgba(90,159,212,0.22)]"
                            : "hover:bg-white/10"
                        }`}
                      >
                        <Image
                          src="/application-document.svg"
                          alt="activity file"
                          width={22}
                          height={26}
                        />
                        <span className="truncate text-white/90">
                          {fileName}
                        </span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 truncate text-[#9ed6ff]">
                            <span className="h-2.5 w-2.5 shrink-0 animate-spin rounded-full border border-[#9ed6ff]/35 border-t-[#9ed6ff]" />
                            Opening...
                          </span>
                        ) : (
                          <span className="truncate text-white/55">
                            {activity.dateLabel}
                          </span>
                        )}
                        <span className="truncate text-white/60">
                          {activity.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 bg-[rgba(28,33,45,0.95)] px-3 py-1.5 text-[10px] text-white/45">
            <span>
              {currentDir.kind === "activities"
                ? `${years.length} items`
                : `${currentDirActivities.length} items`}
            </span>
            {isNavigating ? (
              <span className="inline-flex items-center gap-1.5 text-[#9ed6ff]">
                <span className="h-2.5 w-2.5 animate-spin rounded-full border border-[#9ed6ff]/35 border-t-[#9ed6ff]" />
                Loading detail...
              </span>
            ) : (
              <span>{currentDirName}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
