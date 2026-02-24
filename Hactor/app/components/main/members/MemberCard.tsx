import type { MemberProfile } from "@/app/data/members";

type MemberCardProps = {
  member: MemberProfile;
};

export default function MemberCard({ member }: MemberCardProps) {
  const primaryRoleBadge = member.activityFieldBadges[0] ?? null;
  const extraRoleCount = Math.max(0, member.activityFieldBadges.length - 1);
  const roleToneClassByColor = {
    red: "border-[#f87171]/45 bg-[#ef4444]/18 text-[#fecaca] [box-shadow:0_0_8px_rgba(239,68,68,0.22),inset_0_0_6px_rgba(248,113,113,0.12)]",
    blue: "border-[#60a5fa]/45 bg-[#3b82f6]/18 text-[#bfdbfe] [box-shadow:0_0_8px_rgba(59,130,246,0.22),inset_0_0_6px_rgba(96,165,250,0.12)]",
    green:
      "border-[#4ade80]/45 bg-[#22c55e]/18 text-[#bbf7d0] [box-shadow:0_0_8px_rgba(34,197,94,0.22),inset_0_0_6px_rgba(74,222,128,0.12)]",
    purple:
      "border-[#c084fc]/45 bg-[#a855f7]/18 text-[#e9d5ff] [box-shadow:0_0_8px_rgba(168,85,247,0.22),inset_0_0_6px_rgba(192,132,252,0.12)]",
    orange:
      "border-[#fb923c]/45 bg-[#f97316]/18 text-[#fed7aa] [box-shadow:0_0_8px_rgba(249,115,22,0.22),inset_0_0_6px_rgba(251,146,60,0.12)]",
    gray: "border-[#9ca3af]/45 bg-[#6b7280]/18 text-[#e5e7eb] [box-shadow:0_0_8px_rgba(107,114,128,0.22),inset_0_0_6px_rgba(156,163,175,0.12)]",
  } as const;
  const roleDotClassByColor = {
    red: "bg-[#fca5a5]",
    blue: "bg-[#93c5fd]",
    green: "bg-[#86efac]",
    purple: "bg-[#d8b4fe]",
    orange: "bg-[#fdba74]",
    gray: "bg-[#d1d5db]",
  } as const;
  const roleToneClass = primaryRoleBadge
    ? roleToneClassByColor[primaryRoleBadge.color]
    : "";
  const roleDotClass = primaryRoleBadge
    ? roleDotClassByColor[primaryRoleBadge.color]
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
                className={`group inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.03em] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-110 ${roleToneClass}`}
              >
                <span
                  className={`h-1 w-1 rounded-full transition-transform duration-200 group-hover:scale-125 ${roleDotClass}`}
                />
                <span className="line-clamp-2 max-w-[130px] whitespace-normal text-left leading-[1.15]">
                  {primaryRoleBadge.label}
                </span>
              </span>
              {extraRoleCount > 0 ? (
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/75 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-white/25 hover:bg-white/15 hover:text-white">
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
