"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConstellationBackground from "../components/ConstellationBackground";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? "Login failed");
      }

      router.push("/admin/console");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#121b14] via-[#0f1713] to-[#0b120d] text-white">
      <ConstellationBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-16">
        <main className="w-full max-w-[520px] rounded-[28px] border border-white/10 bg-[rgba(14,14,18,0.95)] px-8 py-10 text-left shadow-[0_28px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[16px] sm:px-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/55">
                HACTOR Operations
              </p>
              <h1 className="mt-2 font-[var(--font-display)] text-2xl uppercase tracking-[0.18em] text-white">
                Admin Access
              </h1>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-[#f3fbf6] via-[#d7efe0] to-[#bcd9c8]">
              <Image
                src="/HACTOR_B.png"
                alt="HACTOR logo"
                width={48}
                height={48}
                className="h-10 w-10 rounded-full object-contain"
                priority
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-white/60">
            Admins only. Sign in to access the management console.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                ID
              </span>
              <input
                type="text"
                name="username"
                placeholder="ID"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 h-11 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/80 placeholder:text-white/30 focus:border-emerald-300/60 focus:outline-none"
                required
              />
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                Password
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 h-11 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white/80 placeholder:text-white/30 focus:border-emerald-300/60 focus:outline-none"
                required
              />
            </label>

            {error && (
              <p className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/15 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100 transition-colors hover:border-emerald-300/70 hover:bg-emerald-400/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-[11px] text-white/45">
            <span>Only authorized operators.</span>
            <Link
              href="/"
              className="uppercase tracking-[0.25em] text-white/55 hover:text-white"
            >
              Back to home
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
