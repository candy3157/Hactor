"use client";

import { type ReactNode, useEffect } from "react";

type ConfirmDangerModalProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  warningText: string;
  warningTitle?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDangerModal({
  open,
  title,
  description,
  warningText,
  warningTitle = "주의사항",
  cancelLabel = "취소",
  confirmLabel = "삭제",
  loadingLabel = "삭제 중...",
  isLoading = false,
  onClose,
  onConfirm,
}: ConfirmDangerModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, isLoading, onClose]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-5 backdrop-blur-[4px]"
        role="presentation"
        onClick={() => {
          if (!isLoading) {
            onClose();
          }
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="danger-modal-title"
          className="w-full max-w-[440px] rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mx-auto mb-6 flex h-14 w-14 animate-[danger-shake_0.5s_ease] items-center justify-center rounded-full border-2 border-[rgba(255,77,77,0.3)] bg-[linear-gradient(135deg,rgba(255,77,77,0.15)_0%,rgba(204,0,0,0.15)_100%)]">
            <svg
              className="h-7 w-7 text-[#ff4d4d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <div className="text-center">
            <h2
              id="danger-modal-title"
              className="mb-3 text-[22px] font-semibold tracking-[-0.3px] text-white"
            >
              {title}
            </h2>
            <p className="text-sm leading-relaxed text-[#888]">{description}</p>
          </div>

          <div className="my-5 rounded-[10px] border border-[rgba(255,77,77,0.2)] bg-[rgba(255,77,77,0.08)] p-4">
            <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[#ff6b6b]">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {warningTitle}
            </div>
            <p className="text-[13px] leading-relaxed text-[#999]">
              {warningText}
            </p>
          </div>

          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] px-6 py-3.5 text-[15px] font-medium text-white transition hover:border-[#444] hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-[linear-gradient(135deg,#ff4d4d_0%,#cc0000_100%)] px-6 py-3.5 text-[15px] font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,77,77,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? loadingLabel : confirmLabel}
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes danger-shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </>
  );
}
