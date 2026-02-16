import type { ReactNode } from "react";
import ConstellationBackground from "@/app/components/ConstellationBackground";

type HomeShellProps = {
  fontClassName: string;
  children: ReactNode;
};

export default function HomeShell({ fontClassName, children }: HomeShellProps) {
  return (
    <div
      className={`${fontClassName} relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a2a1a] via-[#132313] to-[#0f1f0f] text-white`}
    >
      <ConstellationBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-start justify-center px-4 py-20 sm:py-28">
        <main className="w-full max-w-[820px] rounded-[28px] border border-white/10 px-10 py-14 [background:linear-gradient(180deg,rgba(17,17,22,0.98)_0%,rgba(9,9,12,0.98)_100%)] [box-shadow:0_28px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[14px] sm:max-w-[1024px] sm:px-16">
          {children}
        </main>
      </div>
    </div>
  );
}
