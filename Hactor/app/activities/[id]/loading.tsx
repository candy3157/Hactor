import localFont from "next/font/local";
import ConstellationBackground from "../../components/ConstellationBackground";

const display = localFont({
  src: [
    { path: "../../fonts/SF-Pro.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/SF-Pro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "../../fonts/SF-Pro.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/SF-Pro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-md bg-[#d7d7d7] ${className}`} />
);

export default function ActivityDetailLoading() {
  return (
    <div
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a2a1a] via-[#132313] to-[#0f1f0f] text-white`}
    >
      <ConstellationBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-start justify-center px-4 py-20 sm:py-28">
        <main className="w-full max-w-[820px] rounded-[28px] border border-white/10 px-10 py-14 [background:linear-gradient(180deg,rgba(17,17,22,0.98)_0%,rgba(9,9,12,0.98)_100%)] [box-shadow:0_28px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[14px] sm:max-w-[1024px] sm:px-16">
          <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <Skeleton className="h-7 w-36 rounded-full bg-white/12" />
                <Skeleton className="h-10 w-72 bg-white/12" />
                <Skeleton className="h-4 w-56 bg-white/12" />
              </div>
              <Skeleton className="h-10 w-24 rounded-full bg-white/12" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/25 bg-[#ececec]">
              <div className="flex items-center justify-between border-b border-black/25 bg-[#2f2b31] px-4 py-2 text-white/90">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28ca42]" />
                </div>
                <Skeleton className="h-3 w-36 bg-white/15" />
                <Skeleton className="h-3 w-16 bg-white/15" />
              </div>

              <div className="flex items-center gap-2 border-b border-[#d0d0d0] bg-[#f3f3f3] px-3 py-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 flex-1 rounded-md bg-[#e2e2e2]" />
              </div>

              <div className="space-y-5 bg-[#f5f5f5] p-5">
                <section className="rounded-xl border border-[#dadada] bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-12 rounded-md" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-5 w-64" />
                      <Skeleton className="h-3 w-52" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-28" />
                      </div>
                    ))}
                  </div>
                </section>

                <article className="rounded-xl border border-[#dadada] bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
                  <Skeleton className="h-3 w-20" />
                  <div className="mt-4 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[94%]" />
                    <Skeleton className="h-4 w-[86%]" />
                    <Skeleton className="h-4 w-[72%]" />
                  </div>
                </article>

                <section className="rounded-xl border border-[#dadada] bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
                  <Skeleton className="h-3 w-20" />
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className="aspect-square w-full rounded-md"
                      />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
