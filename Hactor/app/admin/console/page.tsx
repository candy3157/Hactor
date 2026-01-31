import Link from "next/link";
import prisma from "@/lib/prisma";

const formatDate = (value: Date | null) => {
  if (!value) return "미정";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
};

export default async function AdminUsersPage() {
  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      fields: {
        include: {
          field: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1713] via-[#0c1511] to-[#0a120e] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-16">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/55">
              HACTOR Admin
            </p>
            <h1 className="mt-2 font-[var(--font-display)] text-2xl uppercase tracking-[0.18em] text-white">
              Members
            </h1>
            <p className="mt-2 text-sm text-white/60">
              디스코드 멤버 목록을 확인하는 페이지입니다.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/60 hover:border-white/35 hover:text-white"
          >
            Back to home
          </Link>
        </header>

        <section className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
              Total
            </p>
            <span className="text-sm text-white/70">{members.length}명</span>
          </div>

          {members.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-sm text-white/50">
              아직 등록된 멤버가 없습니다.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[rgba(18,18,22,0.7)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold text-white">
                        {member.displayName}
                      </p>
                      {member.username && (
                        <span className="text-[11px] text-white/50">
                          @{member.username}
                        </span>
                      )}
                      {!member.isActive && (
                        <span className="rounded-full border border-rose-400/40 bg-rose-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-rose-100">
                          inactive
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-white/45">
                      가입일 {formatDate(member.discordJoinedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
                    {member.fields.length === 0 ? (
                      <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/50">
                        미정
                      </span>
                    ) : (
                      member.fields.map((entry) => (
                        <span
                          key={`${member.id}-${entry.fieldId}`}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70"
                        >
                          {entry.field.label}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
