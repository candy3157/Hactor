import Image from "next/image";
import { Manrope, Orbitron } from "next/font/google";
import ConstellationBackground from "./components/ConstellationBackground";
import TypingText from "./components/TypingText";

const display = Orbitron({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
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

const contests = [
  {
    name: "ASIS CTF Finals 2025",
    time: "Dec 28, 2025",
    mode: "On-site",
    tags: ["Finals", "Top 20%"],
  },
  {
    name: "OCTF 2025",
    time: "Oct 07, 2025",
    mode: "Online",
    tags: ["Open", "Rank 31"],
  },
  {
    name: "SECCON CTF 13 Quals",
    time: "Sep 21, 2025",
    mode: "Online",
    tags: ["Quals", "Top 10%"],
  },
  {
    name: "n1ctf 2025",
    time: "Aug 02, 2025",
    mode: "Online",
    tags: ["Open", "Rank 18"],
  },
  {
    name: "BackdoorCTF 2025",
    time: "Jul 12, 2025",
    mode: "Online",
    tags: ["Open", "Rank 25"],
  },
];

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

          <section className="mt-8 space-y-4 text-center">
            <div>
              <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
                CTF
              </span>
              <h2 className="mt-3 font-[var(--font-display)] text-xl tracking-[0.12em] text-white">
                CTF Contests
              </h2>
              <p className="mt-1 text-xs text-white/50">
                CTFs we have participated in.
              </p>
            </div>

            <div className="space-y-3 text-left">
              {contests.map((contest) => (
                <div
                  key={contest.name}
                  className="rounded-2xl border border-white/10 bg-[rgba(18,18,24,0.75)] p-4 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {contest.name}
                      </p>
                      <p className="mt-1 text-[11px] text-white/50">
                        {contest.time} - {contest.mode}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                      {contest.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.02)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
