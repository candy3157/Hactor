import prisma from "@/lib/prisma";
import AdminSidebar from "@/app/components/AdminSidebar";

const formatDate = (value: Date | null) => {
  if (!value) return "미정";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
};

export default async function AdminUsersPage() {
  const [members, fields] = await Promise.all([
    prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        fields: {
          include: {
            field: true,
          },
        },
      },
    }),
    prisma.activityField.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const selectedMember = members[0] ?? null;
  const selectedFieldIds = new Set(
    selectedMember?.fields.map((entry) => entry.fieldId) ?? [],
  );

  return (
    <div className="min-h-screen bg-[#0f1210] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-6 py-10 lg:px-10">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">
                User List
              </p>
              <h1 className="mt-2 font-[var(--font-display)] text-2xl uppercase tracking-[0.18em] text-white">
                멤버 관리
              </h1>
              <p className="mt-2 text-sm text-white/60">
                멤버 목록 확인 및 개별 데이터 편집을 준비합니다.
              </p>
            </div>
          </header>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <section className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Members
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
                      className="rounded-2xl border border-white/10 bg-[rgba(18,18,22,0.7)] px-5 py-4"
                    >
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
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
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

            <section className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Edit Member
                </p>
                <span className="text-[11px] text-white/40">준비 중</span>
              </div>

              {selectedMember ? (
                <form className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                      Display Name
                    </span>
                    <input
                      type="text"
                      defaultValue={selectedMember.displayName}
                      className="mt-2 h-11 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/80"
                      disabled
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                      Username
                    </span>
                    <input
                      type="text"
                      defaultValue={selectedMember.username ?? ""}
                      className="mt-2 h-11 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/80"
                      disabled
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                      활동 분야
                    </span>
                    <div className="mt-3 grid gap-2">
                      {fields.map((field) => (
                        <label
                          key={field.id}
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/70"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            defaultChecked={selectedFieldIds.has(field.id)}
                            disabled
                          />
                          <span>{field.label}</span>
                        </label>
                      ))}
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                      가입일
                    </span>
                    <input
                      type="text"
                      defaultValue={formatDate(selectedMember.discordJoinedAt)}
                      className="mt-2 h-11 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/80"
                      disabled
                    />
                  </label>

                  <button
                    type="button"
                    className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs uppercase tracking-[0.28em] text-white/50"
                    disabled
                  >
                    저장 (준비 중)
                  </button>
                </form>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-sm text-white/50">
                  편집할 멤버가 없습니다.
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
