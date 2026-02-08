import type { MemberProfile } from "@/app/data/members";
import MemberCard from "./MemberCard";

const marqueeCopies = [0, 1];

type MembersMarqueeProps = {
  members: MemberProfile[];
};

export default function MembersMarquee({ members }: MembersMarqueeProps) {
  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max flex-nowrap gap-4 will-change-transform animate-[ruby-marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
        {marqueeCopies.map((copyIndex) => (
          <div
            key={`marquee-copy-${copyIndex}`}
            className="flex shrink-0 gap-4"
            aria-hidden={copyIndex === 1}
          >
            {members.map((member) => (
              <MemberCard
                key={`${member.handle}-${copyIndex}`}
                member={member}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
