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
  const [logs, botStatus] = await Promise.all([
    prisma.adminLoginLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { admin: true },
    }),
    prisma.botStatus.findFirst({ orderBy: { updatedAt: "desc" } }),
  ]);

  const lastSyncLabel = botStatus?.lastUserlistSyncAt
    ? formatDateTime(botStatus.lastUserlistSyncAt)
    : "없음";
  const lastSyncCount =
    typeof botStatus?.lastUserlistCount === "number"
      ? `${botStatus.lastUserlistCount}명`
      : "미정";

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
              <h1 className="mt-2 font-[var(--font-display)] text-2xl uppercase tracking-[0.18em] text-white">
                로그인 이력
              </h1>
              <p className="mt-2 text-sm text-white/60">
                최근 관리자 로그인 기록을 확인합니다.
              </p>
            </div>
          </header>

          <div className="mt-6 flex gap-6 overflow-x-auto pb-2">
            <section className="min-w-[320px] flex-1 rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Bot Sent Log
                </p>
                <div className="text-right">
                  <span className="block text-sm text-white/70">
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

            <section className="min-w-[420px] flex-1 rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Admin Recent Logins
                </p>
                <span className="text-sm text-white/70">{logs.length}건</span>
              </div>

              {logs.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-sm text-white/50">
                  기록이 없습니다.
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[rgba(18,18,22,0.7)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {log.admin.username}
                        </p>
                        <p className="mt-1 text-[11px] text-white/45">
                          {formatDateTime(log.createdAt)}
                        </p>
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                        IP {log.ip}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
