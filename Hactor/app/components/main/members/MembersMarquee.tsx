import type { MemberProfile } from "@/app/data/members";
import MemberCard from "./MemberCard";

const marqueeCopies = [0, 1];

type MembersMarqueeProps = {
  members: MemberProfile[];
};

export default function MembersMarquee({ members }: MembersMarqueeProps) {
  const topRowMembers = members.filter((_, index) => index % 2 === 0);
  const bottomRowMembers = members.filter((_, index) => index % 2 === 1);
  const firstTrackMembers = topRowMembers.length ? topRowMembers : members;
  const secondTrackMembers = bottomRowMembers.length
    ? bottomRowMembers
    : firstTrackMembers;

  return (
    <div className="relative space-y-4 py-2">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max flex-nowrap gap-4 will-change-transform animate-[ruby-marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          {marqueeCopies.map((copyIndex) => (
            <div
              key={`marquee-top-copy-${copyIndex}`}
              className="flex shrink-0 gap-4"
              aria-hidden={copyIndex === 1}
            >
              {firstTrackMembers.map((member, memberIndex) => (
                <MemberCard
                  key={`top-${member.id}-${memberIndex}-${copyIndex}`}
                  member={member}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max flex-nowrap gap-4 will-change-transform animate-[ruby-marquee_34s_linear_infinite_reverse] hover:[animation-play-state:paused]">
          {marqueeCopies.map((copyIndex) => (
            <div
              key={`marquee-bottom-copy-${copyIndex}`}
              className="flex shrink-0 gap-4"
              aria-hidden={copyIndex === 1}
            >
              {secondTrackMembers.map((member, memberIndex) => (
                <MemberCard
                  key={`bottom-${member.id}-${memberIndex}-${copyIndex}`}
                  member={member}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
