type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const wrapperClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={wrapperClass}>
      <span className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-white/70">
        {label}
      </span>
      <h2 className="mt-3 font-[var(--font-display)] text-xl tracking-[0.12em] text-white">
        {title}
      </h2>
      {description ? <p className="mt-1 text-xs text-white/50">{description}</p> : null}
    </div>
  );
}
