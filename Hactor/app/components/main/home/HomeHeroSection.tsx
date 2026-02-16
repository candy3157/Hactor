import Image from "next/image";
import TypingText from "@/app/components/TypingText";

export default function HomeHeroSection() {
  return (
    <>
      <header className="flex items-start justify-between gap-6">
        <div className="max-w-[300px] font-[var(--font-body)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/55">
            <span className="block">Dept. of Information Security,</span>
            <span className="block">Daejeon University</span>
          </p>
          <h1 className="mt-2 font-[var(--font-display)] text-3xl uppercase tracking-[0.18em] text-white">
            HACTOR
          </h1>
          <p className="mt-3 text-sm leading-5 text-white/60">
            대전대학교 정보보안학과 학술 동아리 HACTOR 입니다.
          </p>
        </div>

        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/90">
          <Image
            src="/hactor-logo-new.png"
            alt="HACTOR logo"
            width={92}
            height={92}
            className="h-24 w-24 rounded-full object-contain"
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
    </>
  );
}
