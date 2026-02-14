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
  "group inline-flex items-center justify-center gap-2 transition-colors duration-200 disabled:cursor-not-allowed";

const variantStyle = {
  pill:
    "min-w-[132px] rounded-full border border-white/20 bg-[rgba(255,255,255,0.02)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 hover:border-white/35 hover:text-white disabled:opacity-70",
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
      <span className="inline-flex items-center">
        <span>{isLoading ? loadingLabel : label}</span>
        <span
          aria-hidden="true"
          className={`ml-0 w-0 overflow-hidden whitespace-nowrap transition-all duration-200 ${
            isLoading
              ? "opacity-0"
              : "opacity-0 group-hover:ml-1.5 group-hover:w-3 group-hover:opacity-100"
          }`}
        >
          →
        </span>
      </span>
    </button>
  );
}
