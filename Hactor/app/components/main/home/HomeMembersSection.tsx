import type { MemberProfile } from "@/app/data/members";
import LoadingNavButton from "@/app/components/main/LoadingNavButton";
import MembersMarquee from "@/app/components/main/members/MembersMarquee";
import SectionHeading from "./SectionHeading";

type HomeMembersSectionProps = {
  members: MemberProfile[];
};

export default function HomeMembersSection({
  members,
}: HomeMembersSectionProps) {
  return (
    <section id="members" className="mt-8 space-y-5 scroll-mt-24 text-center">
      <SectionHeading
        align="center"
        label="Crews"
        title="Members"
        description="현재 팀에서 활동 중인 멤버들을 확인해보세요."
      />

      <MembersMarquee members={members} />

      <div className="flex justify-center">
        <LoadingNavButton href="/members" label="더보기" variant="pill" />
      </div>
    </section>
  );
}
