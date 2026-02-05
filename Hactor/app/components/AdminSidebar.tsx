"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const sidebarItems = [
  { label: "콘솔 홈", href: "/admin/console" },
  { label: "User List", href: "/admin/console/users" },
  { label: "Activities", href: "/admin/console/activities" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#0b0e0c] px-6 py-8 lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-[0.18em]">
          H
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">
            HACTOR
          </p>
          <p className="text-sm font-semibold text-white">Admin Console</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1 text-[12px] uppercase tracking-[0.25em] text-white/60">
        {sidebarItems.map((item) => {
          const isActive =
            item.href !== "#" &&
            (pathname === item.href ||
              (item.href !== "/admin/console" &&
                pathname.startsWith(`${item.href}/`)));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between rounded-full px-4 py-2 transition-colors hover:text-white ${
                isActive ? "bg-white/10 text-white" : ""
              } ${item.href === "#" ? "cursor-not-allowed" : ""}`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 text-[11px] text-white/40">
        <p>관리자 권한으로 접속 중</p>
        <div className="mt-3 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
          >
            Logout
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/60 hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </div>
    </aside>
  );
}
