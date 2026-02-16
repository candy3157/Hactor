type SectionDividerProps = {
  className?: string;
};

export default function SectionDivider({ className = "mt-8" }: SectionDividerProps) {
  return (
    <div
      className={`${className} h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent`}
    />
  );
}
