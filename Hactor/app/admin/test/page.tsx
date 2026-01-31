import Link from "next/link";
import ConstellationBackground from "../../components/ConstellationBackground";

export default function AdminTestPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#111a15] via-[#0f1511] to-[#0b100d] text-white">
      <ConstellationBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-16">
        <main className="w-full max-w-[560px] rounded-[28px] border border-white/10 bg-[rgba(14,14,18,0.92)] px-10 py-12 text-center shadow-[0_28px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[16px]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/55">
            Admin Test Screen
          </p>
          <h1 className="mt-3 font-[var(--font-display)] text-2xl uppercase tracking-[0.18em] text-white">
            Login Success
          </h1>
          <p className="mt-4 text-sm text-white/60">
            You are signed in. This is a temporary test page.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/70 hover:border-white/40 hover:text-white"
            >
              Back to admin
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/70 hover:border-white/40 hover:text-white"
            >
              Home
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
