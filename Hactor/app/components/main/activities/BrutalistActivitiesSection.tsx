import Link from "next/link";
import type { CSSProperties } from "react";

type ActivityGuideItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
};

const activityGuideItems: ActivityGuideItem[] = [
  {
    id: "orientation",
    number: "01",
    title: "새내기\n오리엔테이션",
    description:
      "동아리에 처음 들어오는 새내기들을 위한 환영 행사와 보안의 세계로의 첫 걸음",
    color: "#4ade80",
  },
  {
    id: "mt-trip",
    number: "02",
    title: "MT\n여행",
    description: "친목과 팀워크를 다지는 1박 2일 여행, 함께 성장하는 시간",
    color: "#38bdf8",
  },
  {
    id: "ctf",
    number: "03",
    title: "CTF\n대회",
    description:
      "실전 해킹 대회 및 보안 경연 참가로 실력을 검증하고 경쟁력을 키워요",
    color: "#facc15",
  },
  {
    id: "study",
    number: "04",
    title: "정기\n스터디",
    description: "웹 해킹, 리버싱, 포렌식 등 관심 주제별 그룹 스터디와 실습",
    color: "#34d399",
  },
  {
    id: "seminar",
    number: "05",
    title: "세미나\n발표",
    description: "회원들이 배운 내용을 공유하고 지식을 나누는 정기 발표 시간",
    color: "#a78bfa",
  },
  {
    id: "hackathon",
    number: "06",
    title: "해커톤\n프로젝트",
    description: "실제 보안 솔루션과 도구를 개발하는 협업 프로젝트",
    color: "#fb923c",
  },
];

export default function BrutalistActivitiesSection() {
  return (
    <section
      id="activities"
      className="mt-8 space-y-5 scroll-mt-24 text-center"
    >
      <div>
        <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
          Activities
        </span>
        <h2 className="mt-3 font-[var(--font-display)] text-xl tracking-[0.12em] text-white">
          Activities
        </h2>
        <p className="mt-1 text-xs text-white/50">
          동아리의 대표 활동을 한눈에 확인해보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {activityGuideItems.map((item, index) => {
          const accentStyle = {
            "--accent": item.color,
            animationDelay: `${(index + 1) * 0.08}s`,
          } as CSSProperties;

          return (
            <article
              key={item.id}
              style={accentStyle}
              className="group opacity-0 [animation:slideInLeft_0.6s_cubic-bezier(0.4,0,0.2,1)_forwards]"
            >
              <div className="h-full rounded-2xl border border-white/10 bg-[rgba(18,18,24,0.75)] p-5 text-left transition-colors duration-300 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-white/20 hover:bg-[rgba(30,30,40,0.82)]">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 text-xs font-bold text-black transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.number}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-[var(--font-display)] text-lg leading-tight tracking-[0.08em] text-white transition-colors duration-300 group-hover:text-[var(--accent)]">
                      {item.title.replace("\n", " ")}
                    </h3>
                    <div className="mt-2 h-1.5 w-14 rounded-full bg-[var(--accent)]" />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/70">
                  {item.description}
                </p>

                <button
                  type="button"
                  className="mt-4 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-white/80 transition-all duration-200 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/15 group-hover:text-white hover:translate-x-0.5"
                >
                  자세히 보기 →
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex justify-center pt-1">
        <Link
          href="/activities"
          className="group inline-flex items-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.02)] px-5 py-2 text-[11px] font-semibold tracking-[0.08em] text-white/75 transition-colors duration-200 hover:border-white/35 hover:text-white"
        >
          <span className="inline-flex items-center">
            <span>{"모든 활동 보러가기"}</span>
            <span
              aria-hidden="true"
              className="ml-0 w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:ml-1.5 group-hover:w-3 group-hover:opacity-100"
            >
              →
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
