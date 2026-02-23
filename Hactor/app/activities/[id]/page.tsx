import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma-public";
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
const FILE_ICON_PATH = "/activity/application-document.svg?v=2";

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
  const pathLabel = `/home/hactor/Activities/${activity.year}/${fileName}`;

  return (
    <div
      className={`${display.variable} ${body.variable} relative min-h-screen overflow-hidden bg-gradient-to-br from-[#1a2a1a] via-[#132313] to-[#0f1f0f] text-white`}
    >
      <ConstellationBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-start justify-center px-4 py-20 sm:py-28">
        <main className="w-full max-w-[820px] rounded-[28px] border border-white/10 px-10 py-14 [background:linear-gradient(180deg,rgba(17,17,22,0.98)_0%,rgba(9,9,12,0.98)_100%)] [box-shadow:0_28px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[14px] sm:max-w-[1024px] sm:px-16">
          <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
                  Activity Detail
                </span>
                <h1 className="mt-3 text-3xl uppercase tracking-[0.14em] text-white sm:text-4xl">
                  ACTIVITIES
                </h1>
              </div>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-[rgba(255,255,255,0.02)] px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors duration-200 hover:border-[#e95420]/65 hover:bg-[rgba(233,84,32,0.15)] hover:text-[#ffd6c6]"
              >
                Home
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/25 bg-[#ececec]">
              <div className="flex items-center justify-between border-b border-black/25 bg-[#2f2b31] px-4 py-2 text-white/90">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28ca42]" />
                </div>
                <p className="text-[12px]">Activity File Viewer</p>
                <span className="text-[10px] uppercase tracking-[0.18em] text-white/55">
                  {activity.year}
                </span>
              </div>

              <div className="flex items-center gap-2 border-b border-[#d0d0d0] bg-[#f3f3f3] px-3 py-2">
                <Link
                  href={backHref}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#c4c4c4] bg-[#ececec] text-sm text-[#3a3a3a] transition hover:bg-[#e3e3e3]"
                  aria-label="Back to activities list"
                >
                  &lt;
                </Link>
                <div className="min-w-0 flex-1 rounded-md border border-[#cfcfcf] bg-white px-3 py-1.5 text-[12px] text-[#3f3f3f]">
                  {pathLabel}
                </div>
              </div>

              <div className="space-y-5 bg-[#f5f5f5] p-5">
                <section className="rounded-xl border border-[#dadada] bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
                  <div className="flex items-start gap-4">
                    <Image
                      src={FILE_ICON_PATH}
                      alt="activity file icon"
                      width={52}
                      height={64}
                      className="shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-[#232323]">
                        {fileName}
                      </p>
                      <p className="mt-1 text-xs text-[#777]">
                        {activity.dateLabel} / {activity.year} /{" "}
                        {activity.category}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#777]">
                        Title
                      </p>
                      <p className="mt-1 text-sm text-[#252525]">
                        {activity.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#777]">
                        Category
                      </p>
                      <p className="mt-1 text-sm text-[#252525]">
                        {activity.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#777]">
                        Date
                      </p>
                      <p className="mt-1 text-sm text-[#252525]">
                        {activity.dateLabel}
                      </p>
                    </div>
                  </div>
                </section>

                <article className="rounded-xl border border-[#dadada] bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
                  <h2 className="text-[11px] uppercase tracking-[0.24em] text-[#7a2a86]">
                    Detail
                  </h2>
                  {content ? (
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#2b2b2b]">
                      {content}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm italic text-[#7d7d7d]">
                      No detail content uploaded yet.
                    </p>
                  )}
                </article>

                <section className="rounded-xl border border-[#dadada] bg-white p-5 shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
                  <h2 className="text-[11px] uppercase tracking-[0.24em] text-[#7a2a86]">
                    Gallery
                  </h2>
                  {imageUrls.length > 0 ? (
                    <>
                      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                        {imageUrls.map((url, index) => (
                          <figure key={`${url}-${index}`} className="space-y-2">
                            <Image
                              src={url}
                              alt={`${activity.title} image ${index + 1}`}
                              width={1200}
                              height={1200}
                              className="aspect-square w-full rounded-md border border-[#dedede] object-cover"
                            />
                          </figure>
                        ))}
                      </div>
                      <p className="mt-4 text-center text-xs text-[#777]">
                        {imageUrls.length} image
                        {imageUrls.length > 1 ? "s" : ""}
                      </p>
                    </>
                  ) : (
                    <p className="mt-4 text-sm italic text-[#7d7d7d]">
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
