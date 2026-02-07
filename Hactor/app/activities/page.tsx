import localFont from "next/font/local";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ConstellationBackground from "../components/ConstellationBackground";
import ActivitiesTerminal from "./ActivitiesTerminal";

const display = localFont({
  src: [
    { path: "../fonts/SF-Pro.ttf", weight: "400", style: "normal" },
    { path: "../fonts/SF-Pro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "../fonts/SF-Pro.ttf", weight: "400", style: "normal" },
    { path: "../fonts/SF-Pro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const revalidate = 60;

export default async function ActivitiesPage() {
  const activities = await prisma.activity.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  const activityRows = activities.map((activity) => ({
    title: activity.title,
    dateLabel: activity.dateLabel,
    category: activity.category,
  }));

  return (
    <div
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a2a1a] via-[#132313] to-[#0f1f0f] text-white`}
    >
      <ConstellationBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-start justify-center px-4 py-20 sm:py-28">
        <main className="w-full max-w-[820px] rounded-[28px] border border-white/10 px-10 py-14 [background:linear-gradient(180deg,rgba(17,17,22,0.98)_0%,rgba(9,9,12,0.98)_100%)] [box-shadow:0_28px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[14px] sm:max-w-[1024px] sm:px-16">
          <section className="space-y-6">
            <div>
              <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
                Activities
              </span>
              <h1 className="mt-3 font-[var(--font-sf)] text-4xl uppercase tracking-[0.2em] text-white sm:text-5xl">
                Activities
              </h1>
              <p className="mt-2 text-xs text-white/50">
                Club activity log, updated from the admin console.
              </p>
            </div>

            <ActivitiesTerminal activities={activityRows} />

            <div className="flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.02)] px-6 py-2 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:border-[#4a9eff]/60 hover:bg-[rgba(74,158,255,0.08)] hover:text-[#4a9eff]"
              >
                &larr; Back to Home
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
