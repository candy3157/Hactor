import SectionHeading from "./SectionHeading";

export default function HomeAboutSection() {
  return (
    <section id="about" className="mt-8 space-y-4 scroll-mt-24 text-left">
      <SectionHeading
        label="About"
        title="About"
        description="HACTOR 소개 콘텐츠를 준비 중입니다."
      />

      <div className="rounded-2xl border border-dashed border-white/15 bg-[rgba(18,18,24,0.45)] p-6 text-xs text-white/45">
        소개 문구와 활동 방향, 운영 방침 등을 곧 업데이트할 예정입니다.
      </div>
    </section>
  );
}
