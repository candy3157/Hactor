import type { MemberProfile } from "@/app/data/members";
import MemberTag from "./MemberTag";

type MemberCardProps = {
  member: MemberProfile;
};

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="w-[220px] flex-none rounded-2xl border border-white/10 bg-[rgba(18,18,24,0.75)] p-4 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
          {member.name.slice(0, 2)}
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-white">{member.name}</p>
          <p className="text-[11px] text-white/50">@{member.handle}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {member.tags.map((tag, tagIndex) => (
          <MemberTag
            key={`${member.handle}-${tag.label}-${tagIndex}`}
            tag={tag}
          />
        ))}
      </div>
    </div>
  );
}
