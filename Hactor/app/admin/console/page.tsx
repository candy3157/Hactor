// User Sync 로그

import prisma from "@/lib/prisma";
import AdminSidebar from "@/app/components/AdminSidebar";

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(value);

export default async function AdminConsolePage() {
  const [latest, totalCount] = await Promise.all([
    prisma.member.aggregate({
      _max: { updatedAt: true },
    }),
    prisma.member.count(),
  ]);

  const lastSyncLabel = latest._max.updatedAt
    ? formatDateTime(latest._max.updatedAt)
    : "없음";
  const lastSyncCount = `${totalCount}명`;

  return (
    <div className="min-h-screen bg-[#0f1210] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-6 py-10 lg:px-10">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">
                Console Home
              </p>
            </div>
          </header>

          <div className="mt-6">
            <section className="w-full max-w-[560px] rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Bot Sent Log
                </p>
                <div className="text-left sm:text-right">
                  <span className="block text-sm leading-6 text-white/70">
                    {lastSyncLabel}
                  </span>
                  <span className="block text-[11px] text-white/45">
                    {lastSyncCount}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-white/45">
                마지막 UserList 전송 시각 및 전송 인원입니다.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
