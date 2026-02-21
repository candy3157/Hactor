"use client";

import {
  memberTagLabelFromField,
  memberTagToneFromField,
} from "@/app/data/members";
import MemberTag from "@/app/components/main/members/MemberTag";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type MemberActivityFieldRow = {
  fieldId: number;
  code: string;
  label: string;
  assignedAt: string;
};

type MemberRow = {
  id: string;
  name: string;
  handle: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  isActive: boolean;
  memberActivityFields: MemberActivityFieldRow[];
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
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    members[0]?.id ?? null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredMembers = useMemo(
    () => filterMembers(members, query),
    [members, query],
  );
  const selectedMember = useMemo(() => {
    if (!filteredMembers.length) {
      return null;
    }

    return (
      filteredMembers.find((member) => member.id === selectedMemberId) ??
      filteredMembers[0]
    );
  }, [filteredMembers, selectedMemberId]);

  const commandTarget =
    selectedMember?.username ?? selectedMember?.handle ?? "unknown";

  useEffect(() => {
    if (!isDetailOpen) {
      return;
    }

    const closeDetail = () => {
      setIsDetailOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      closeDetail();
    };

    const handleTouchStart = () => {
      closeDetail();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [isDetailOpen]);

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-[#4e2a3c] p-6 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.04),0_24px_50px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,#4f163b_0%,#2f0a25_42%,#21071b_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0.14)_100%)]" />

      <div className="relative z-10 flex min-h-[520px] flex-col">
        <div className="-mx-6 -mt-6 mb-3 overflow-hidden border-b border-black/30">
          <div className="flex h-9 items-center justify-center bg-gradient-to-b from-[#4b4b4b] to-[#3b3b3b] text-sm font-semibold text-white/90">
            hactor@ubuntu: userlist
          </div>
        </div>

        <div className="border-b border-[#e95420]/35 pb-2">
          <div className="flex flex-wrap items-center font-mono text-[11px] tracking-[0.02em]">
            <span className="font-semibold text-[#8ae234]">hactor@ubuntu</span>
            <span className="text-white">:</span>
            <span className="font-semibold text-[#729fcf]">~</span>
            <span className="text-[#FFFFFF]">$</span>
            <span className="ml-2 flex items-center gap-2">
              <span className="text-white">grep -i</span>
              <span className="relative min-w-[180px] flex-1 cursor-text whitespace-pre">
                <span className="text-white">{query}</span>
                <span
                  className="cursor-step ml-[2px] inline-block h-[1.2em] !w-[8px] animate-[blink-step_0.8s_step-end_infinite] bg-[#FFFFFF] align-text-bottom"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Filter members"
                  disabled={isDetailOpen}
                  className="absolute inset-0 h-full w-full opacity-0 caret-transparent"
                />
              </span>
            </span>
          </div>
        </div>

        <div className="mt-3 font-mono text-[11px] text-white/70">
          <div className="mb-1">
            <span className="font-semibold text-[#8ae234]">hactor@ubuntu</span>
            <span className="text-white">:</span>
            <span className="font-semibold text-[#729fcf]">~</span>
            <span className="text-[#FFFFFF]">$ </span>
            <span className="text-white/50"># List all HACTOR members</span>
          </div>
          <div>
            <span className="font-semibold text-[#8ae234]">hactor@ubuntu</span>
            <span className="text-white">:</span>
            <span className="font-semibold text-[#729fcf]">~</span>
            <span className="text-[#FFFFFF]">$ </span>
            <span className="text-white">hactor members --list</span>
          </div>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {isDetailOpen ? (
            <div className="mt-4 min-h-[220px] border-t border-white/10 pt-3 font-mono text-[11px]">
              {selectedMember ? (
                <>
                  <div>
                    <span className="font-semibold text-[#8ae234]">
                      hactor@ubuntu
                    </span>
                    <span className="text-white">:</span>
                    <span className="font-semibold text-[#729fcf]">~</span>
                    <span className="text-[#FFFFFF]">$ </span>
                    <span className="text-white">
                      hactor members --show {commandTarget}
                    </span>
                  </div>

                  <div className="mt-3 rounded-lg border border-[#e95420]/35 bg-[rgba(49,10,36,0.6)] p-3">
                    <div className="grid grid-cols-[140px_1fr] items-start gap-y-3">
                      <span className="text-white/45">Name</span>
                      <span className="text-white">
                        {selectedMember.displayName}
                      </span>

                      <span className="text-white/45">Avatar</span>
                      <span>
                        {selectedMember.avatarUrl ? (
                          <span className="inline-flex items-center gap-3">
                            <span className="relative h-12 w-12 overflow-hidden rounded-md border border-white/15 bg-white/5">
                              <Image
                                src={selectedMember.avatarUrl}
                                alt={`${selectedMember.displayName} avatar`}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </span>
                          </span>
                        ) : (
                          <span className="italic text-white/35">null</span>
                        )}
                      </span>

                      <span className="text-white/45">is_active</span>
                      <span
                        className={
                          selectedMember.isActive
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }
                      >
                        {String(selectedMember.isActive)}
                      </span>

                      <span className="text-white/45">Activity_fields</span>
                      <span className="flex flex-wrap gap-2">
                        {selectedMember.memberActivityFields.length ? (
                          selectedMember.memberActivityFields.map((field) => (
                            <MemberTag
                              key={`${selectedMember.id}-${field.fieldId}`}
                              tag={{
                                label: memberTagLabelFromField(
                                  field.code,
                                  field.label,
                                ),
                                tone: memberTagToneFromField(
                                  field.code,
                                  field.label,
                                ),
                              }}
                            />
                          ))
                        ) : (
                          <span className="italic text-white/35">null</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 text-[10px] uppercase tracking-[0.18em] text-white/65">
                    Press any key to exit . . .
                  </div>
                </>
              ) : (
                <p className="text-white/45">No members match your query.</p>
              )}
            </div>
          ) : (
            <div className="space-y-1 font-mono text-[13px]">
              {filteredMembers.map((member, index) => {
                const tagLabel = member.tags.length
                  ? member.tags.join(", ")
                  : "-";
                const isSelected = member.id === selectedMember?.id;

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => {
                      setSelectedMemberId(member.id);
                      setIsDetailOpen(true);
                    }}
                    className={`grid w-full grid-cols-[auto_44px_minmax(140px,1fr)_minmax(160px,1fr)_minmax(180px,2fr)] items-center gap-x-3 border-l-2 px-2 py-1 text-left transition-colors duration-200 ${
                      isSelected
                        ? "border-[#e95420] bg-[rgba(233,84,32,0.14)]"
                        : "border-transparent hover:border-[#e95420] hover:bg-[rgba(233,84,32,0.08)]"
                    }`}
                  >
                    <span className="text-[#e95420]">&nbsp;</span>
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
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-white/10 pt-3">
          <p className="font-mono text-[10px] text-white/40">
            <span className="text-[#8ae234]">OK</span> {filteredMembers.length}{" "}
            members found
          </p>
        </div>
      </div>
    </div>
  );
}
