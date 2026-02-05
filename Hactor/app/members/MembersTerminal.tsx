"use client";

import { useMemo, useState } from "react";

type MemberRow = {
  name: string;
  handle: string;
  tags: string[];
};

type MembersTerminalProps = {
  members: MemberRow[];
};

const filterMembers = (members: MemberRow[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return members;
  }

  return members.filter((member) => {
    const haystack = [member.name, member.handle, member.tags.join(" ")]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
};

export default function MembersTerminal({ members }: MembersTerminalProps) {
  const [query, setQuery] = useState("");
  const filteredMembers = useMemo(
    () => filterMembers(members, query),
    [members, query],
  );

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 p-6 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)]">
      <div className="absolute inset-0 bg-[url('/kali-background.png')] bg-cover bg-center opacity-35" />
      <div className="absolute inset-0 bg-[rgba(12,16,24,0.75)]" />

      <div className="relative z-10 flex min-h-[520px] flex-col">
        <div className="border-b border-[rgba(74,158,255,0.2)] pb-2">
        <div className="flex flex-wrap items-center font-mono text-[11px] tracking-[0.02em]">
          <span className="font-semibold text-[#ff3e3e]">kali@kali</span>
          <span className="text-white">:</span>
          <span className="font-semibold text-[#4a9eff]">~</span>
          <span className="text-white">$</span>
          <span className="ml-2 flex items-center gap-2">
            <span className="text-white">grep -i</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="검색 할 문자열 입력"
              aria-label="Filter members"
              className="min-w-[180px] flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
            />
          </span>
        </div>
      </div>

        <div className="mt-3 font-mono text-[11px] text-white/70">
        <div className="mb-1">
          <span className="font-semibold text-[#ff3e3e]">kali@kali</span>
          <span className="text-white">:</span>
          <span className="font-semibold text-[#4a9eff]">~</span>
          <span className="text-[#4a9eff]">$ </span>
          <span className="text-white/50"># List all HACTOR members</span>
        </div>
        <div>
          <span className="font-semibold text-[#ff3e3e]">kali@kali</span>
          <span className="text-white">:</span>
          <span className="font-semibold text-[#4a9eff]">~</span>
          <span className="text-[#4a9eff]">$ </span>
          <span className="text-white">hactor members --list</span>
        </div>
      </div>

        <div className="mt-4 flex-1 space-y-1 overflow-y-auto pr-1 font-mono text-[13px]">
        {filteredMembers.map((member, index) => {
          const tagLabel = member.tags.length ? member.tags.join(", ") : "-";

          return (
            <div
              key={`${member.handle}-${index}`}
              className="grid w-full grid-cols-[auto_44px_minmax(140px,1fr)_minmax(160px,1fr)_minmax(180px,2fr)] items-center gap-x-3 border-l-2 border-transparent px-2 py-1 transition-colors duration-200 hover:border-[#4a9eff] hover:bg-[rgba(74,158,255,0.08)]"
            >
              <span className="text-[#4a9eff]">$</span>
              <span className="text-white/40">
                [{String(index + 1).padStart(2, "0")}]
              </span>
              <span className="min-w-0 truncate font-semibold text-white">
                {member.name}
              </span>
              <span className="min-w-0 truncate text-[rgba(56,189,248,0.8)]">
                @{member.handle}
              </span>
              <span
                className={
                  tagLabel === "-"
                    ? "min-w-0 truncate italic text-white/30"
                    : "min-w-0 truncate text-[rgba(251,191,36,0.9)]"
                }
              >
                {tagLabel}
              </span>
            </div>
          );
        })}
      </div>

        <div className="mt-4 border-t border-white/10 pt-3">
        <p className="font-mono text-[10px] text-white/40">
          <span className="text-[#4a9eff]">OK</span> {filteredMembers.length}{" "}
          members found
        </p>
        </div>
      </div>
    </div>
  );
}
