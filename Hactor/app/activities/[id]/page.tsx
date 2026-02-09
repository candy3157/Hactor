import localFont from "next/font/local";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
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

type ActivityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 60;

const toFileName = (title: string) => {
  const safeTitle = title.trim() || "activity";
  return `${safeTitle}.log`;
};

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;
  const backHref = "/activities";

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      },
    },
  });

  if (!activity) {
    notFound();
  }

  const fileName = toFileName(activity.title);
  const imageUrls = activity.images.map((image) => image.imageUrl);
  const content = activity.content?.trim() ?? "";
  const pathLabel = `/kali/Hactor/Activities/${activity.year}/${fileName}`;

  return (
    <div
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a2a1a] via-[#132313] to-[#0f1f0f] text-white`}
    >
      <ConstellationBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start justify-center px-4 py-20 sm:py-28">
        <main className="w-full rounded-[28px] border border-white/10 px-6 py-8 [background:linear-gradient(180deg,rgba(17,17,22,0.98)_0%,rgba(9,9,12,0.98)_100%)] [box-shadow:0_28px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[14px] sm:px-10 sm:py-12">
          <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
                  Activity Detail
                </span>
                <h1 className="mt-3 text-3xl uppercase tracking-[0.14em] text-white sm:text-4xl">
                  {activity.title}
                </h1>
                <p className="mt-2 text-xs text-white/50">
                  {activity.dateLabel} / {activity.year} / {activity.category}
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.02)] px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:border-[#4a9eff]/60 hover:bg-[rgba(74,158,255,0.08)] hover:text-[#4a9eff]"
              >
                Home
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[rgba(22,27,39,0.7)]">
              <div className="flex items-center justify-between border-b border-white/10 bg-[rgba(39,44,58,0.95)] px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28ca42]" />
                </div>
                <p className="text-[12px] text-white/65">Document Viewer</p>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                  {fileName}
                </span>
              </div>

              <div className="flex items-center gap-2 border-b border-white/10 bg-[rgba(20,25,36,0.9)] px-3 py-2">
                <Link
                  href={backHref}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[rgba(21,27,38,0.8)] text-sm text-white/70 transition hover:border-white/20 hover:text-white"
                  aria-label="Back to activities list"
                >
                  &lt;
                </Link>
                <div className="min-w-0 flex-1 rounded-md border border-white/10 bg-[rgba(20,25,36,0.85)] px-3 py-1.5 text-[12px] text-white/70">
                  {pathLabel}
                </div>
              </div>

              <div className="space-y-6 p-6">
                <section className="rounded-xl border border-white/10 bg-[rgba(10,14,20,0.75)] p-6">
                  <h2 className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                    Metadata
                  </h2>
                  <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                        Title
                      </p>
                      <p className="text-lg text-white/90">{activity.title}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                        Category
                      </p>
                      <p className="text-lg text-white/90">{activity.category}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                        Date
                      </p>
                      <p className="text-lg text-white/90">{activity.dateLabel}</p>
                    </div>
                  </div>
                </section>

                <article className="rounded-xl border border-white/10 bg-[rgba(10,14,20,0.75)] p-6">
                  <h2 className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                    Detail
                  </h2>
                  {content ? (
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/85">
                      {content}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm italic text-white/40">
                      No detail content uploaded yet.
                    </p>
                  )}
                </article>

                <section className="rounded-xl border border-white/10 bg-[rgba(10,14,20,0.75)] p-6">
                  <h2 className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                    Gallery
                  </h2>
                  {imageUrls.length > 0 ? (
                    <>
                      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {imageUrls.map((url, index) => (
                          <figure key={`${url}-${index}`} className="space-y-2">
                            <img
                              src={url}
                              alt={`${activity.title} image ${index + 1}`}
                              className="aspect-square w-full rounded-md border border-white/10 object-cover"
                            />
                          </figure>
                        ))}
                      </div>
                      <p className="mt-4 text-center text-xs text-white/45">
                        {imageUrls.length} image{imageUrls.length > 1 ? "s" : ""}
                      </p>
                    </>
                  ) : (
                    <p className="mt-4 text-sm italic text-white/40">
                      No gallery images uploaded.
                    </p>
                  )}
                </section>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
