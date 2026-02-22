"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type FooterIconLinkProps = {
  href: string;
  label: string;
  external?: boolean;
  children: ReactNode;
};

type FooterIconButtonProps = {
  onClick: () => void;
  label: string;
  children: ReactNode;
};

const iconButtonClass =
  "group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-green-500/50 hover:bg-white/10";

const iconClass =
  "h-4 w-4 text-white/60 transition-colors group-hover:text-green-400";

const CONTACT_EMAIL = "dju.hactor@gmail.com";

function FooterIconLink({
  href,
  label,
  external = false,
  children,
}: FooterIconLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={label}
      className={iconButtonClass}
    >
      {children}
      <span className="sr-only">{label}</span>
    </a>
  );
}

function FooterIconButton({ onClick, label, children }: FooterIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={iconButtonClass}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export default function HomeFooter() {
  const [emailCopyStatus, setEmailCopyStatus] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    if (!navigator.clipboard) {
      setEmailCopyStatus("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setEmailCopyStatus("copied");
    } catch (error) {
      console.error("Failed to copy email address:", error);
      setEmailCopyStatus("error");
    }

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setEmailCopyStatus("idle");
    }, 2000);
  };

  return (
    <footer className="mt-12 rounded-3xl border border-white/5 px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="text-sm font-medium tracking-wide text-white/70">
              HACTOR <span className="text-white/30">|</span>{" "}
              <span className="text-white/50">DAEJEON UNIVERSITY</span>
            </h3>
          </div>

          <div className="flex gap-3">
            <FooterIconButton
              onClick={handleCopyEmail}
              label={
                emailCopyStatus === "copied"
                  ? "Email copied"
                  : "Copy email address"
              }
            >
              {emailCopyStatus === "copied" ? (
                <svg
                  className="h-4 w-4 text-green-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className={iconClass}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              )}
            </FooterIconButton>

            <FooterIconLink
              href="https://github.com/hactor"
              label="GitHub"
              external
            >
              <svg
                className={iconClass}
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </FooterIconLink>

            <FooterIconLink
              href="https://open.kakao.com/o/sFD6Tohi"
              label="KakaoTalk OpenChat"
              external
            >
              <svg
                className={iconClass}
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
              </svg>
            </FooterIconLink>
          </div>

          <span className="sr-only" aria-live="polite">
            {emailCopyStatus === "copied" &&
              "Email address copied to clipboard."}
            {emailCopyStatus === "error" &&
              "Failed to copy email address to clipboard."}
          </span>

          <div className="text-center md:text-right">
            <p className="text-xs text-white/40">(c) 2026 HACTOR</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
