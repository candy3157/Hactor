import Image from "next/image";
import localFont from "next/font/local";
import ConstellationBackground from "./components/ConstellationBackground";
import LoadingNavButton from "./components/main/LoadingNavButton";
import MembersMarquee from "./components/main/members/MembersMarquee";
import TypingText from "./components/TypingText";
import { activityCatalog } from "./data/activities";
import { getMarqueeMembers } from "@/lib/member-marquee";

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

const DISCORD_INVITE_URL = "https://discord.gg/hactor";

const joinUsCards = [
  {
    icon: "💬",
    title: "지원 방법",
    description: "디스코드 링크 클릭",
    description2: "→ 간단한 자기소개",
  },
  {
    icon: "⏰",
    title: "모집 시기",
    description: "상시 모집",
    description2: "(학기 중 진행)",
  },
  {
    icon: "📋",
    title: "자격 요건",
    description: "정보보안 관심자",
    description2: "누구나 환영",
  },
];

const joinUsFaq = [
  {
    question: "코딩을 못해도 괜찮나요?",
    answer:
      "네. 처음부터 함께 배워나갈 수 있습니다. 기초부터 차근차근 스터디를 진행하고 있어요.",
  },
  {
    question: "활동 시간은 어떻게 되나요?",
    answer:
      "주 1회 정기 스터디와 자율 온라인 활동이 있습니다. 학기 일정에 맞춰 부담 없이 참여할 수 있습니다.",
  },
  {
    question: "회비가 있나요?",
    answer:
      "기본 회비는 없습니다. 다만 외부 활동(해커톤, CTF 대회 등) 참가 시 개인 비용이 발생할 수 있습니다.",
  },
];

export const runtime = "nodejs";
export const revalidate = 120;

export default async function Home() {
  let members: Awaited<ReturnType<typeof getMarqueeMembers>> = [];
  try {
    members = await getMarqueeMembers();
  } catch (error) {
    console.error("Failed to load marquee members from DB:", error);
  }

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
                <span className="block">Daejeon University</span>
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

          <section id="about" className="mt-8 space-y-4 scroll-mt-24 text-left">
            <div>
              <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
                About
              </span>
              <h2 className="mt-3 font-[var(--font-display)] text-xl tracking-[0.12em] text-white">
                About
              </h2>
            </div>
            <div className="rounded-2xl border border-dashed border-white/15 bg-[rgba(18,18,24,0.45)] p-6 text-xs text-white/35">
              {/* About section content will be added later */}
            </div>
          </section>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <section
            id="members"
            className="mt-8 space-y-5 scroll-mt-24 text-center"
          >
            <div>
              <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
                Crews
              </span>
              <h2 className="mt-3 font-[var(--font-display)] text-xl tracking-[0.12em] text-white">
                Members
              </h2>
              <p className="mt-1 text-xs text-white/50">
                Current active members in the team.
              </p>
            </div>

            <MembersMarquee members={members} />

            <div className="flex justify-center">
              <LoadingNavButton href="/members" label="더보기" variant="pill" />
            </div>
          </section>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <section
            id="activities"
            className="mt-8 space-y-4 scroll-mt-24 text-left"
          >
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
              <LoadingNavButton
                href="/activities"
                label="모든 활동 보기 →"
                variant="text"
              />
            </div>

            <div className="relative pl-12">
              <div className="absolute left-[22px] top-2 h-full w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
              <div className="space-y-4">
                {activityCatalog.current.map((activity) => (
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
                            key={`${activity.title}-${line}`}
                            className="block text-center leading-4"
                          >
                            {line}
                          </span>
                        ))}
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

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <section
            id="join-us"
            className="mt-8 space-y-5 scroll-mt-24 text-left"
          >
            <div className="text-center">
              <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
                Join Us
              </span>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 p-6 [box-shadow:0_22px_48px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:p-9">
              <div className="text-center">
                <h2 className="bg-gradient-to-r from-emerald-200 via-indigo-200 to-violet-200 bg-clip-text font-[var(--font-display)] text-3xl tracking-[0.08em] text-transparent sm:text-4xl">
                  함께 성장할 동료를 찾습니다
                </h2>
                <p className="mt-4 text-lg text-white/78">
                  초보자도 환영합니다
                </p>
                <p className="mt-1 text-sm text-white/55">
                  열정과 호기심만 있다면 충분합니다
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {joinUsCards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-2xl border border-white/10 bg-[rgba(15,20,23,0.72)] p-5 text-center [box-shadow:inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <p className="text-3xl">{card.icon}</p>
                    <h3 className="mt-3 text-base font-semibold text-white/90">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/65">
                      {card.description}
                    </p>
                    <p className="text-sm text-white/65">{card.description2}</p>
                  </article>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a
                  href={DISCORD_INVITE_URL}
                  className="inline-flex items-center gap-3 rounded-full border border-indigo-300/30 bg-gradient-to-r from-indigo-500/88 to-violet-500/88 px-7 py-3 text-sm font-semibold tracking-[0.08em] text-white shadow-[0_12px_30px_rgba(79,70,229,0.3)] transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-[0_15px_38px_rgba(79,70,229,0.4)]"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.12-.09.246-.187.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.126.105.252.202.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
                  </svg>
                  디스코드 참여하기
                </a>
                <p className="mt-4 text-xs text-white/45">
                  또는 이메일 문의:{" "}
                  <a
                    href="mailto:hactor@example.com"
                    className="text-indigo-300 transition-colors hover:text-indigo-200"
                  >
                    hactor@example.com
                  </a>
                </p>
              </div>

              <div className="mt-9 border-t border-white/10 pt-7">
                <h3 className="text-center text-lg font-semibold text-white/88">
                  자주 묻는 질문
                </h3>
                <div className="mt-4 space-y-3">
                  {joinUsFaq.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-xl border border-white/10 bg-[rgba(14,18,22,0.74)] p-4"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-white/90">
                        <span>{faq.question}</span>
                        <span className="text-white/50 transition-transform duration-200 group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-6 text-white/63">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-12 rounded-3xl border border-white/5 px-8 py-10">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="text-center md:text-left">
                  <h3 className="text-sm font-medium tracking-wide text-white/70">
                    HACTOR <span className="text-white/30">·</span>{" "}
                    <span className="text-white/50">DAEJEON UNIVERSITY</span>
                  </h3>
                </div>

                <div className="flex gap-3">
                  <a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Discord"
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-green-500/50 hover:bg-white/10"
                  >
                    <svg
                      className="h-4 w-4 text-white/60 transition-colors group-hover:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    <span className="sr-only">Discord</span>
                  </a>

                  <a
                    href="mailto:hactor@example.com"
                    aria-label="Email"
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-green-500/50 hover:bg-white/10"
                  >
                    <svg
                      className="h-4 w-4 text-white/60 transition-colors group-hover:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="sr-only">Email</span>
                  </a>

                  <a
                    href="https://github.com/hactor"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-green-500/50 hover:bg-white/10"
                  >
                    <svg
                      className="h-4 w-4 text-white/60 transition-colors group-hover:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="sr-only">GitHub</span>
                  </a>

                  <a
                    href="https://open.kakao.com/o/hactor"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="KakaoTalk OpenChat"
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-green-500/50 hover:bg-white/10"
                  >
                    <svg
                      className="h-4 w-4 text-white/60 transition-colors group-hover:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                    </svg>
                    <span className="sr-only">KakaoTalk OpenChat</span>
                  </a>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-xs text-white/40">© 2026 HACTOR</p>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
