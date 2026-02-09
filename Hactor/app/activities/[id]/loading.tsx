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
  <div className={`animate-pulse rounded-md bg-white/10 ${className}`} />
);

export default function ActivityDetailLoading() {
  return (
    <div
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a2a1a] via-[#132313] to-[#0f1f0f] text-white`}
    >
      <ConstellationBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start justify-center px-4 py-20 sm:py-28">
        <main className="w-full rounded-[28px] border border-white/10 px-6 py-8 [background:linear-gradient(180deg,rgba(17,17,22,0.98)_0%,rgba(9,9,12,0.98)_100%)] [box-shadow:0_28px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[14px] sm:px-10 sm:py-12">
          <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-4 w-56" />
              </div>
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(22,27,39,0.7)]">
              <div className="flex items-center justify-between border-b border-white/10 bg-[rgba(39,44,58,0.95)] px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28ca42]" />
                </div>
                <p className="text-[12px] text-white/65">Document Viewer</p>
                <Skeleton className="h-3 w-20" />
              </div>

              <div className="flex items-center gap-2 border-b border-white/10 bg-[rgba(20,25,36,0.9)] px-3 py-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 flex-1 rounded-md" />
              </div>

              <div className="space-y-6 p-6">
                <section className="rounded-xl border border-white/10 bg-[rgba(10,14,20,0.75)] p-6">
                  <h2 className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                    Metadata
                  </h2>
                  <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <Skeleton className="h-3 w-14" />
                        <Skeleton className="h-7 w-32" />
                      </div>
                    ))}
                  </div>
                </section>

                <article className="rounded-xl border border-white/10 bg-[rgba(10,14,20,0.75)] p-6">
                  <h2 className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                    Detail
                  </h2>
                  <div className="mt-4 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[94%]" />
                    <Skeleton className="h-4 w-[88%]" />
                    <Skeleton className="h-4 w-[76%]" />
                  </div>
                </article>

                <section className="rounded-xl border border-white/10 bg-[rgba(10,14,20,0.75)] p-6">
                  <h2 className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                    Gallery
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton key={index} className="aspect-square w-full rounded-md" />
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
