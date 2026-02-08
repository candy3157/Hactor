import type { MemberTag as MemberTagType } from "@/app/data/members";

const toneStyles: Record<MemberTagType["tone"], string> = {
  ruby: "border-rose-400/30 bg-rose-500/15 text-rose-100",
  ember: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  frost: "border-sky-400/30 bg-sky-400/10 text-sky-100",
  moss: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  slate: "border-white/10 bg-white/5 text-white/70",
};

type MemberTagProps = {
  tag: MemberTagType;
};

export default function MemberTag({ tag }: MemberTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] ${toneStyles[tag.tone]}`}
    >
      {tag.label}
    </span>
  );
}
