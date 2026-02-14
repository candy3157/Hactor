"use client";

export default function ConstellationBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="terminal-base" />
        <div className="terminal-noise" />
        <div className="terminal-scanlines" />
        <div className="terminal-vignette" />
      </div>

      <style jsx>{`
        .terminal-base {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            #1a2a1a 0%,
            #132313 50%,
            #0f1f0f 100%
          );
        }

        .terminal-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.45;
          animation: noise-shift 0.2s infinite;
        }

        @keyframes noise-shift {
          0% {
            transform: translate(0, 0);
          }
          10% {
            transform: translate(-1px, -1px);
          }
          20% {
            transform: translate(1px, 1px);
          }
          30% {
            transform: translate(-1px, 1px);
          }
          40% {
            transform: translate(1px, -1px);
          }
          50% {
            transform: translate(0, 0);
          }
          60% {
            transform: translate(1px, 1px);
          }
          70% {
            transform: translate(-1px, -1px);
          }
          80% {
            transform: translate(1px, -1px);
          }
          90% {
            transform: translate(-1px, 1px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        .terminal-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(110, 231, 183, 0.03) 0px,
            rgba(110, 231, 183, 0.03) 1px,
            transparent 1px,
            transparent 2px
          );
          animation: scanline-scroll 12s linear infinite;
        }

        @keyframes scanline-scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(2px);
          }
        }

        .terminal-scanlines::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            rgba(110, 231, 183, 0.018) 0px,
            rgba(110, 231, 183, 0.018) 1px,
            transparent 1px,
            transparent 3px
          );
        }

        .terminal-scanlines::after {
          content: "";
          position: absolute;
          top: -50%;
          left: 0;
          right: 0;
          height: 20%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(110, 231, 183, 0.055) 50%,
            transparent 100%
          );
          animation: scan-move 8s linear infinite;
        }

        @keyframes scan-move {
          0% {
            top: -20%;
          }
          100% {
            top: 100%;
          }
        }

        .terminal-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.28) 80%,
            rgba(0, 0, 0, 0.55) 100%
          );
        }

        .terminal-vignette::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 320px;
          height: 320px;
          background: radial-gradient(
            circle at top left,
            rgba(110, 231, 183, 0.08) 0%,
            transparent 72%
          );
        }

        .terminal-vignette::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 320px;
          height: 320px;
          background: radial-gradient(
            circle at bottom right,
            rgba(74, 222, 128, 0.06) 0%,
            transparent 72%
          );
        }

        @media (max-width: 768px) {
          .terminal-noise {
            animation: none;
          }

          .terminal-scanlines::after {
            animation-duration: 10s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .terminal-noise,
          .terminal-scanlines,
          .terminal-scanlines::after {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
