import Image from "next/image";
import localFont from "next/font/local";
import ConstellationBackground from "./components/ConstellationBackground";
import TypingText from "./components/TypingText";
import { activityCatalog } from "./data/activities";

const display = localFont({
  src: [
    { path: "./fonts/SF-Pro.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SF-Pro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "./fonts/SF-Pro.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SF-Pro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

const members = [
  {
    name: "Michel",
    handle: "michel",
    tags: [
      { label: "Web", tone: "frost" },
      { label: "Forensics", tone: "moss" },
    ],
  },
  {
    name: "Ox1de",
    handle: "ox1de",
    tags: [
      { label: "Crypto", tone: "ember" },
      { label: "Pwn", tone: "ruby" },
    ],
  },
  {
    name: "lime",
    handle: "lime",
    tags: [
      { label: "Rev", tone: "slate" },
      { label: "Infra", tone: "frost" },
    ],
  },
  {
    name: "wo0k",
    handle: "wo0k",
    tags: [
      { label: "Pwn", tone: "ruby" },
      { label: "Crypto", tone: "ember" },
    ],
  },
  {
    name: "ovic",
    handle: "ovic",
    tags: [
      { label: "Web", tone: "frost" },
      { label: "Dev", tone: "slate" },
    ],
  },
  {
    name: "ar0",
    handle: "ar0",
    tags: [
      { label: "Reversing", tone: "moss" },
      { label: "Forensics", tone: "frost" },
    ],
  },
];

const activityTone: Record<string, string> = {
  스터디: "border-emerald-400/30 text-emerald-200 bg-emerald-400/10",
  프로젝트: "border-violet-400/30 text-violet-200 bg-violet-400/10",
  강의: "border-amber-400/30 text-amber-200 bg-amber-400/10",
  행사: "border-rose-400/30 text-rose-200 bg-rose-400/10",
};
const activityDot: Record<string, string> = {
  스터디: "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.75)]",
  프로젝트: "bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.75)]",
  강의: "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.75)]",
  행사: "bg-rose-300 shadow-[0_0_10px_rgba(251,113,133,0.75)]",
};

const formatTimelineDate = (date: string) => {
  if (date.includes("매주")) {
    return ["NOW"];
  }
  const parts = date.split(" ");
  if (parts.length >= 2) {
    return [parts[0].toUpperCase(), parts[1]];
  }
  return [date.toUpperCase()];
};

const toneStyles: Record<string, string> = {
  ruby: "border-rose-400/30 bg-rose-500/15 text-rose-100",
  ember: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  frost: "border-sky-400/30 bg-sky-400/10 text-sky-100",
  moss: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  slate: "border-white/10 bg-white/5 text-white/70",
};

const marqueeCopies = [0, 1];

function Tag({
  label,
  tone = "slate",
}: {
  label: string;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}

export default function Home() {
  return (
    <div
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a2a1a] via-[#132313] to-[#0f1f0f] text-white`}
    >
      <ConstellationBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-start justify-center px-4 py-20 sm:py-28">
        <main className="w-full max-w-[820px] rounded-[28px] border border-white/10 px-10 py-14 [background:linear-gradient(180deg,rgba(17,17,22,0.98)_0%,rgba(9,9,12,0.98)_100%)] [box-shadow:0_28px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[14px] sm:max-w-[1024px] sm:px-16">
          <header className="flex items-start justify-between gap-6">
            <div className="max-w-[300px] font-[var(--font-body)]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/55">
                <span className="block">Dept. of Information Security,</span>
                <span className="block">Deajeon University</span>
              </p>
              <h1 className="mt-2 font-[var(--font-display)] text-3xl uppercase tracking-[0.18em] text-white">
                HACTOR
              </h1>
              <p className="mt-3 text-s leading-5 text-white/60">
                대전대학교 정보보안학과 학술 동아리 HACTOR 입니다.
              </p>
            </div>
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-[#f3fbf6] via-[#d7efe0] to-[#bcd9c8] shadow-[0_0_30px_rgba(120,210,160,0.45)]">
              <Image
                src="/HACTOR_B.png"
                alt="HACTOR logo"
                width={92}
                height={92}
                className="h-24 w-24 rounded-full object-contain brightness-110 contrast-110 saturate-110 drop-shadow-[0_0_10px_rgba(30,70,40,0.35)]"
                priority
              />
            </div>
          </header>

          <div className="mt-7 flex justify-center">
            <TypingText
              text="WELCOME TO HACTOR"
              className="font-mono text-[18px] font-semibold uppercase tracking-[0.12em] text-[#30ff4a] sm:text-[20px]"
            />
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <section className="mt-8 space-y-5 text-center">
            <div>
              <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
                Crews
              </span>
              <h2 className="mt-3 font-[var(--font-display)] text-xl tracking-[0.12em] text-white">
                Members
              </h2>
              <p className="mt-1 text-xs text-white/50">
                Current active players in the team.
              </p>
            </div>

            <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
              <div className="flex w-max flex-nowrap gap-4 will-change-transform animate-[ruby-marquee_18s_linear_infinite] group-hover:[animation-play-state:paused]">
                {marqueeCopies.map((copyIndex) => (
                  <div
                    key={`marquee-copy-${copyIndex}`}
                    className="flex shrink-0 gap-4"
                    aria-hidden={copyIndex === 1}
                  >
                    {members.map((member) => (
                      <div
                        key={`${member.name}-${copyIndex}`}
                        className="w-[220px] flex-none rounded-2xl border border-white/10 bg-[rgba(18,18,24,0.75)] p-4 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                            {member.name.slice(0, 2)}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-white">
                              {member.name}
                            </p>
                            <p className="text-[11px] text-white/50">
                              @{member.handle}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {member.tags.map((tag) => (
                            <Tag
                              key={`${member.name}-${tag.label}-${copyIndex}`}
                              label={tag.label}
                              tone={tag.tone}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button className="inline-flex items-center justify-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.02)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:border-white/30 hover:text-white/85">
                See more
              </button>
            </div>
          </section>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <section className="mt-8 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
                  Activities
                </span>
                <h2 className="mt-3 font-[var(--font-display)] text-xl tracking-[0.12em] text-white">
                  Activities
                </h2>
                <p className="mt-1 text-xs text-white/50">
                  우리가 진행한 주요 활동을 확인하세요.
                </p>
              </div>
              <button className="text-[10px] uppercase tracking-[0.28em] text-white/45 transition-colors hover:text-white/80">
                모든 활동 보기 →
              </button>
            </div>

            <div className="relative pl-12">
              <div className="absolute left-[22px] top-2 h-full w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
              <div className="space-y-4">
                {activityCatalog.current.map((activity) => (
                  <div key={activity.title} className="relative flex w-full gap-4">
                    <div className="flex w-[45px] flex-col items-center">
                      <span
                        className={`mt-2 h-2.5 w-2.5 rounded-full ${
                          activityDot[activity.category] ??
                          "bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                        }`}
                      />
                      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                        {formatTimelineDate(activity.date).map(
                          (line) => (
                            <span
                              key={`${activity.title}-${line}`}
                              className="block text-center leading-4"
                            >
                              {line}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="flex-1 rounded-2xl border border-white/10 bg-[rgba(18,18,24,0.75)] p-5 text-white/80 transition-colors duration-300 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/20 hover:bg-[rgba(26,26,36,0.9)] hover:text-white">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-white">
                            {activity.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                          <span
                            className={`rounded-full border px-3 py-1 ${activityTone[activity.category] ?? "border-white/10 text-white/60 bg-white/5"}`}
                          >
                            {activity.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {activityCatalog.archives.map((archive) => (
              <details
                key={archive.title}
                className="rounded-2xl border border-white/10 bg-[rgba(18,18,24,0.6)] p-4 transition-colors duration-300 hover:border-white/20 hover:bg-[rgba(26,26,36,0.7)]"
              >
                <summary className="flex cursor-pointer items-center justify-between text-sm text-white/60">
                  <span>{archive.title}</span>
                  <span className="text-[11px] uppercase tracking-[0.2em]">
                    {archive.items.length}개
                  </span>
                </summary>
                <div className="relative mt-4 pl-12">
                  <div className="absolute left-[22px] top-2 h-full w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
                  <div className="space-y-4">
                    {archive.items.map((activity) => (
                      <div
                        key={activity.title}
                        className="relative flex w-full gap-4"
                      >
                        <div className="flex w-[45px] flex-col items-center">
                          <span
                            className={`mt-2 h-2.5 w-2.5 rounded-full ${
                              activityDot[activity.category] ??
                              "bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                            }`}
                          />
                          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/35">
                            {formatTimelineDate(activity.date).map((line) => (
                              <span
                                key={`${archive.title}-${activity.title}-${line}`}
                                className="block text-center leading-4"
                              >
                                {line}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 rounded-2xl border border-white/10 bg-[rgba(18,18,24,0.75)] p-4 text-white/80 transition-colors duration-300 hover:border-white/20 hover:bg-[rgba(26,26,36,0.9)] hover:text-white">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {activity.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                              <span
                                className={`rounded-full border px-3 py-1 ${activityTone[activity.category] ?? "border-white/10 text-white/60 bg-white/5"}`}
                              >
                                {activity.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
