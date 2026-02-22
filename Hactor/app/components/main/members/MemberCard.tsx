import type { MemberProfile } from "@/app/data/members";

type MemberCardProps = {
  member: MemberProfile;
};

export default function MemberCard({ member }: MemberCardProps) {
  const primaryRoleBadge = member.activityFieldBadges[0] ?? null;
  const extraRoleCount = Math.max(0, member.activityFieldBadges.length - 1);
  const roleToneClass = primaryRoleBadge
    ? primaryRoleBadge.color === "red"
      ? "border-[#f87171]/45 bg-[#ef4444]/18 text-[#fecaca] [box-shadow:0_0_8px_rgba(239,68,68,0.22),inset_0_0_6px_rgba(248,113,113,0.12)]"
      : primaryRoleBadge.color === "green"
        ? "border-[#4ade80]/45 bg-[#22c55e]/18 text-[#bbf7d0] [box-shadow:0_0_8px_rgba(34,197,94,0.22),inset_0_0_6px_rgba(74,222,128,0.12)]"
        : "border-[#60a5fa]/45 bg-[#3b82f6]/18 text-[#bfdbfe] [box-shadow:0_0_8px_rgba(59,130,246,0.22),inset_0_0_6px_rgba(96,165,250,0.12)]"
    : "";
  const roleDotClass = primaryRoleBadge
    ? primaryRoleBadge.color === "red"
      ? "bg-[#fca5a5]"
      : primaryRoleBadge.color === "green"
        ? "bg-[#86efac]"
        : "bg-[#93c5fd]"
    : "";

  return (
    <div className="h-[132px] w-[220px] flex-none rounded-2xl border border-white/10 bg-[rgba(18,18,24,0.75)] p-4 transition-colors duration-300 hover:border-white/20 hover:bg-[rgba(30,30,40,0.82)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="text-left">
        <p className="text-sm font-semibold text-white">{member.name}</p>
        <p className="text-[11px] text-white/50">@{member.handle}</p>
        <div className="mt-2 h-[40px]">
          {primaryRoleBadge ? (
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.03em] ${roleToneClass}`}
              >
                <span className={`h-1 w-1 rounded-full ${roleDotClass}`} />
                <span className="line-clamp-2 max-w-[130px] whitespace-normal text-left leading-[1.15]">
                  {primaryRoleBadge.label}
                </span>
              </span>
              {extraRoleCount > 0 ? (
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/75">
                  +{extraRoleCount}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
