"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LoadingNavButtonProps = {
  href: string;
  label: string;
  loadingLabel?: string;
  variant?: "pill" | "text";
};

const baseStyle =
  "inline-flex items-center justify-center gap-2 transition-colors duration-200 disabled:cursor-not-allowed";

const variantStyle = {
  pill:
    "min-w-[88px] rounded-full border border-white/20 bg-[rgba(255,255,255,0.02)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/60 hover:border-white/30 hover:text-white/85 disabled:opacity-70",
  text:
    "min-w-[126px] text-[10px] uppercase tracking-[0.28em] text-white/45 hover:text-white/80 disabled:opacity-70",
} as const;

export default function LoadingNavButton({
  href,
  label,
  loadingLabel = "로딩 중...",
  variant = "pill",
}: LoadingNavButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      type="button"
      aria-busy={isLoading}
      disabled={isLoading}
      onClick={() => {
        if (isLoading) {
          return;
        }
        setIsLoading(true);
        router.push(href);
      }}
      className={`${baseStyle} ${variantStyle[variant]}`}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
        />
      )}
      <span>{isLoading ? loadingLabel : label}</span>
    </button>
  );
}
