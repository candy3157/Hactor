import Link from "next/link";
import type {
  HomeActivityHistory,
  HomeActivityItem,
  HomeActivityYearGroup,
} from "@/lib/home-activities";

type BrutalistActivitiesSectionProps = {
  history: HomeActivityHistory;
};

type ActivityTone = {
  badgeClass: string;
  dotClass: string;
};

const defaultTone: ActivityTone = {
  badgeClass: "border-white/20 bg-white/10 text-white/80",
  dotClass: "bg-white/60",
};

const tonePalette: ActivityTone[] = [
  {
    badgeClass: "border-emerald-300/35 bg-emerald-300/15 text-emerald-100",
    dotClass: "bg-emerald-300",
  },
  {
    badgeClass: "border-amber-300/35 bg-amber-300/15 text-amber-100",
    dotClass: "bg-amber-300",
  },
  {
    badgeClass: "border-sky-300/35 bg-sky-300/15 text-sky-100",
    dotClass: "bg-sky-300",
  },
  {
    badgeClass: "border-violet-300/35 bg-violet-300/15 text-violet-100",
    dotClass: "bg-violet-300",
  },
  {
    badgeClass: "border-rose-300/35 bg-rose-300/15 text-rose-100",
    dotClass: "bg-rose-300",
  },
  {
    badgeClass: "border-teal-300/35 bg-teal-300/15 text-teal-100",
    dotClass: "bg-teal-300",
  },
  {
    badgeClass: "border-fuchsia-300/35 bg-fuchsia-300/15 text-fuchsia-100",
    dotClass: "bg-fuchsia-300",
  },
  {
    badgeClass: "border-orange-300/35 bg-orange-300/15 text-orange-100",
    dotClass: "bg-orange-300",
  },
  {
    badgeClass: "border-cyan-300/35 bg-cyan-300/15 text-cyan-100",
    dotClass: "bg-cyan-300",
  },
];

const getTone = (category: string): ActivityTone => {
  const source = category.trim().toLowerCase();
  if (!source) {
    return defaultTone;
  }

  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }

  return tonePalette[hash % tonePalette.length] ?? defaultTone;
};

const getCurrentKstYear = () =>
  Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      year: "numeric",
    }).format(new Date()),
  );

type ActivityTimelineItemProps = {
  activity: HomeActivityItem;
};

function ActivityTimelineItem({ activity }: ActivityTimelineItemProps) {
  const tone = getTone(activity.category);

  return (
    <li className="relative">
      <span
        className={`absolute -left-7 top-5 h-3.5 w-3.5 rounded-full border-2 border-[#121218] ring-4 ring-emerald-200/15 ${tone.dotClass}`}
      />

      <Link
        href={`/activities/${activity.id}`}
        className="group block rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.06]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${tone.badgeClass}`}
          >
            {activity.category}
          </span>
          <span className="text-xs text-white/45">{activity.dateLabel}</span>
        </div>

        <p className="mt-2 text-xl font-semibold text-white transition-colors group-hover:text-emerald-100">
          {activity.title}
        </p>
      </Link>
    </li>
  );
}

type ActivityYearAccordionProps = {
  yearGroup: HomeActivityYearGroup;
  openByDefault: boolean;
};

function ActivityYearAccordion({
  yearGroup,
  openByDefault,
}: ActivityYearAccordionProps) {
  return (
    <details
      open={openByDefault}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-[rgba(18,18,24,0.72)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)] open:border-emerald-300/30"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
        <h3 className="text-lg font-semibold text-white">{yearGroup.year}</h3>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[10px] text-white/60 transition-transform duration-200 group-open:rotate-180">
          v
        </span>
      </summary>

      <div className="px-4 pb-5 sm:px-5">
        <div className="relative pl-8">
          <div className="pointer-events-none absolute left-[11px] top-1 bottom-1 w-px bg-gradient-to-b from-emerald-300/65 via-emerald-200/35 to-transparent" />

          <ol className="space-y-4">
            {yearGroup.items.map((activity) => (
              <ActivityTimelineItem key={activity.id} activity={activity} />
            ))}
          </ol>
        </div>
      </div>
    </details>
  );
}

export default function BrutalistActivitiesSection({
  history,
}: BrutalistActivitiesSectionProps) {
  const currentYear = getCurrentKstYear();

  return (
    <section id="activities" className="mt-8 space-y-5 scroll-mt-24">
      <div className="text-center">
        <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
          Activities
        </span>
        <h2 className="mt-3 font-[var(--font-display)] text-xl tracking-[0.12em] text-white">
          Activities History
        </h2>
        <p className="mt-1 text-xs text-white/50">HACTOR 활동</p>
      </div>

      {history.years.length > 0 ? (
        <div className="space-y-7 text-left">
          {history.years.map((yearGroup) => (
            <ActivityYearAccordion
              key={yearGroup.year}
              yearGroup={yearGroup}
              openByDefault={yearGroup.year === currentYear}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[rgba(18,18,24,0.45)] p-6 text-center text-sm text-white/45">
          아직 등록된 활동 기록이 없습니다. 관리자 페이지에서 활동을 추가해
          주세요.
        </div>
      )}

      <div className="flex justify-center pt-1">
        <Link
          href="/activities"
          className="group inline-flex items-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.02)] px-5 py-2 text-[11px] font-semibold tracking-[0.08em] text-white/75 transition-colors duration-200 hover:border-white/35 hover:text-white"
        >
          모든 활동 보기
        </Link>
      </div>
    </section>
  );
}
