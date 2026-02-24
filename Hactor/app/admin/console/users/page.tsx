"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";
import ConfirmDangerModal from "@/app/components/admin/modals/ConfirmDangerModal";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

type Member = {
  id: string;
  discordId: string | null;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  discordJoinedAt: string | null;
  isActive: boolean;
  activityFields: string | null;
  activityFieldBadges: ActivityFieldBadge[];
};

type BadgeColor =
  | "red"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "gray";

type ActivityFieldBadge = {
  label: string;
  color: BadgeColor;
};

type MemberDraft = {
  id: string;
  displayName: string;
  username: string;
  isActive: boolean;
  activityFieldBadges: ActivityFieldBadge[];
};

const emptyDraft: MemberDraft = {
  id: "",
  displayName: "",
  username: "",
  isActive: true,
  activityFieldBadges: [],
};

const formatDate = (value: string | null) => {
  if (!value) return "미정";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
};

const normalizeActivityField = (value: string) =>
  value.trim().replace(/\s+/g, " ");

const badgeColors: BadgeColor[] = [
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "gray",
];

const toBadgeColor = (value: string | undefined): BadgeColor => {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized &&
    badgeColors.includes(normalized as BadgeColor)
  ) {
    return normalized as BadgeColor;
  }
  return "blue";
};

const badgeToneClassByColor: Record<BadgeColor, string> = {
  red: "border-[#f87171]/40 bg-[#ef4444]/18 text-[#fecaca]",
  blue: "border-[#60a5fa]/40 bg-[#3b82f6]/18 text-[#bfdbfe]",
  green: "border-[#4ade80]/40 bg-[#22c55e]/18 text-[#bbf7d0]",
  purple: "border-[#c084fc]/40 bg-[#a855f7]/18 text-[#e9d5ff]",
  orange: "border-[#fb923c]/40 bg-[#f97316]/18 text-[#fed7aa]",
  gray: "border-[#9ca3af]/40 bg-[#6b7280]/18 text-[#e5e7eb]",
};

const parseActivityFieldBadges = (
  badges: ActivityFieldBadge[] | null | undefined,
  fallbackText: string | null,
) => {
  if (Array.isArray(badges) && badges.length > 0) {
    const unique = new Set<string>();
    const parsed: ActivityFieldBadge[] = [];
    badges.forEach((badge) => {
      const label = normalizeActivityField(badge.label ?? "");
      if (!label) {
        return;
      }
      const key = label.toLowerCase();
      if (unique.has(key)) {
        return;
      }
      unique.add(key);
      parsed.push({
        label,
        color: toBadgeColor(badge.color),
      });
    });
    if (parsed.length > 0) {
      return parsed;
    }
  }

  if (!fallbackText) {
    return [];
  }

  return Array.from(
    new Set(
      fallbackText
        .split(/[,\n]+/)
        .map(normalizeActivityField)
        .filter((entry) => entry.length > 0),
    ),
  ).map((label) => ({
    label,
    color: "blue" as const,
  }));
};

const mergeActivityField = (
  fields: ActivityFieldBadge[],
  rawValue: string,
  color: BadgeColor,
) => {
  const next = normalizeActivityField(rawValue);
  if (!next) {
    return fields;
  }

  const existingIndex = fields.findIndex(
    (field) => field.label.toLowerCase() === next.toLowerCase(),
  );
  if (existingIndex !== -1) {
    return fields.map((field, index) =>
      index === existingIndex ? { ...field, color } : field,
    );
  }

  return [...fields, { label: next, color }];
};

export default function AdminUsersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MemberDraft>(emptyDraft);
  const [activityFieldInput, setActivityFieldInput] = useState("");
  const [activityFieldColorInput, setActivityFieldColorInput] =
    useState<BadgeColor>("blue");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [joinDate, setJoinDate] = useState<Date | null>(null);
  const [memberQuery, setMemberQuery] = useState("");

  const filteredMembers = useMemo(() => {
    const query = memberQuery.trim().toLowerCase();
    if (!query) {
      return members;
    }

    return members.filter((member) => {
      const source =
        `${member.displayName} ${member.username ?? ""}`.toLowerCase();
      return source.includes(query);
    });
  }, [members, memberQuery]);

  const selectedMember = useMemo(
    () => filteredMembers.find((member) => member.id === selectedId) ?? null,
    [filteredMembers, selectedId],
  );

  const isFormValid = useMemo(
    () => draft.displayName.trim().length > 0,
    [draft.displayName],
  );

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/members");
      const data = (await res.json()) as {
        members: Member[];
      };
      setMembers(data.members ?? []);
      if (data.members?.length) {
        setSelectedId(data.members[0].id);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (filteredMembers.length === 0) {
      setSelectedId(null);
      return;
    }

    if (
      !selectedId ||
      !filteredMembers.some((member) => member.id === selectedId)
    ) {
      setSelectedId(filteredMembers[0].id);
    }
  }, [filteredMembers, selectedId]);

  useEffect(() => {
    if (!selectedMember) {
      return;
    }
    setDraft({
      id: selectedMember.id,
      displayName: selectedMember.displayName,
      username: selectedMember.username ?? "",
      isActive: selectedMember.isActive,
      activityFieldBadges: parseActivityFieldBadges(
        selectedMember.activityFieldBadges,
        selectedMember.activityFields,
      ),
    });
    setJoinDate(
      selectedMember.discordJoinedAt
        ? new Date(selectedMember.discordJoinedAt)
        : null,
    );
    setActivityFieldInput("");
  }, [selectedMember]);

  const addActivityField = (rawValue: string, color: BadgeColor) => {
    setDraft((prev) => ({
      ...prev,
      activityFieldBadges: mergeActivityField(
        prev.activityFieldBadges,
        rawValue,
        color,
      ),
    }));
  };

  const removeActivityFieldAt = (targetIndex: number) => {
    setDraft((prev) => ({
      ...prev,
      activityFieldBadges: prev.activityFieldBadges.filter(
        (_, index) => index !== targetIndex,
      ),
    }));
  };

  const updateActivityFieldColor = (targetIndex: number, color: BadgeColor) => {
    setDraft((prev) => ({
      ...prev,
      activityFieldBadges: prev.activityFieldBadges.map((badge, index) =>
        index === targetIndex ? { ...badge, color } : badge,
      ),
    }));
  };

  const commitActivityFieldInput = () => {
    const next = normalizeActivityField(activityFieldInput);
    if (!next) {
      return;
    }
    addActivityField(next, activityFieldColorInput);
    setActivityFieldInput("");
  };

  const handleSave = async () => {
    if (!selectedId) {
      return;
    }
    if (!isFormValid) {
      setMessage("표시 이름을 입력하세요.");
      return;
    }
    setIsLoading(true);
    setMessage(null);
    const nextActivityFieldBadges = mergeActivityField(
      draft.activityFieldBadges,
      activityFieldInput,
      activityFieldColorInput,
    );
    try {
      const res = await fetch(`/api/admin/members/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: draft.displayName,
          username: draft.username,
          isActive: draft.isActive,
          activityFieldBadges: nextActivityFieldBadges,
          discordJoinedAt: joinDate ? joinDate.toISOString() : null,
        }),
      });
      if (!res.ok) {
        throw new Error("저장에 실패했습니다.");
      }
      const data = (await res.json()) as { member: Member };
      setMembers((prev) =>
        prev.map((member) =>
          member.id === data.member.id ? data.member : member,
        ),
      );
      if (nextActivityFieldBadges.length !== draft.activityFieldBadges.length) {
        setDraft((prev) => ({
          ...prev,
          activityFieldBadges: nextActivityFieldBadges,
        }));
      }
      setActivityFieldInput("");
      setMessage("저장 완료");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = () => {
    if (!selectedId || isLoading) {
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isLoading) {
      return;
    }
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/members/${selectedId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("삭제에 실패했습니다.");
      }
      setMembers((prev) => {
        const remaining = prev.filter((member) => member.id !== selectedId);
        setSelectedId(remaining[0]?.id ?? null);
        return remaining;
      });
      setIsDeleteModalOpen(false);
      setMessage("삭제 완료");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "삭제 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1210] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-6 py-10 lg:px-10">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">
                User List
              </p>
              <h1 className="mt-2 font-[var(--font-display)] text-2xl uppercase tracking-[0.18em] text-white">
                멤버 관리
              </h1>
              <p className="mt-2 text-sm text-white/60">
                멤버 목록 확인 및 개별 데이터 편집을 진행합니다.
              </p>
            </div>
          </header>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <section className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)] lg:max-h-[72vh] lg:overflow-y-auto">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Members
                </p>
                <span className="text-sm text-white/70">
                  {memberQuery
                    ? `${filteredMembers.length}/${members.length}`
                    : members.length}
                  명
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-2">
                <svg
                  className="h-4 w-4 shrink-0 text-white/35"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  value={memberQuery}
                  onChange={(event) => setMemberQuery(event.target.value)}
                  placeholder="이름 검색"
                  className="h-7 w-full bg-transparent text-sm text-white/80 placeholder:text-white/35 focus:outline-none"
                />
                {memberQuery ? (
                  <button
                    type="button"
                    onClick={() => setMemberQuery("")}
                    className="text-xs font-medium text-emerald-300/85 hover:text-emerald-200"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>

              {members.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-sm text-white/50">
                  아직 등록된 멤버가 없습니다.
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-sm text-white/50">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="mt-6 space-y-4 pb-2">
                  {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedId(member.id)}
                      className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                        member.id === selectedId
                          ? "border-white/30 bg-white/10"
                          : "border-white/10 bg-[rgba(18,18,22,0.7)] hover:border-white/25 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm font-semibold text-white">
                          {member.displayName}
                        </p>
                        {member.username && (
                          <span className="text-[11px] text-white/50">
                            @{member.username}
                          </span>
                        )}
                        {!member.isActive && (
                          <span className="rounded-full border border-rose-400/40 bg-rose-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-rose-100">
                            inactive
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-white/45">
                        가입일 {formatDate(member.discordJoinedAt)}
                      </p>
                      <p className="mt-2 text-[11px] text-white/60">
                        활동 분야:{" "}
                        <span className="text-white/75">
                          {member.activityFields?.trim() ?? ""}
                        </span>
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Edit Member
                </p>
                <span className="text-[11px] text-white/40">
                  {selectedMember ? "수정" : "대기"}
                </span>
              </div>

              {selectedMember ? (
                <form className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                      Display Name
                    </span>
                    <input
                      type="text"
                      value={draft.displayName}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          displayName: event.target.value,
                        }))
                      }
                      className="mt-2 h-11 w-full rounded-full border border-white/10 bg-[#0f1210] px-4 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                      Username
                    </span>
                    <input
                      type="text"
                      value={draft.username}
                      onChange={(event) =>
                        setDraft((prev) => ({
                          ...prev,
                          username: event.target.value,
                        }))
                      }
                      className="mt-2 h-11 w-full rounded-full border border-white/10 bg-[#0f1210] px-4 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                      활성화
                    </span>
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={draft.isActive}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            isActive: event.target.checked,
                          }))
                        }
                        className="h-4 w-4"
                      />
                      <span className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                        활성 멤버
                      </span>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                      활동 분야
                    </span>
                    <p className="mt-2 text-[11px] text-white/45">
                      태그의 색 지정, 직무 입력 후 Enter로 추가
                    </p>
                    <div className="mt-2 rounded-2xl border border-white/10 bg-[#0f1210] px-3 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {draft.activityFieldBadges.map((badge, index) => (
                          <span
                            key={`${badge.label}-${index}`}
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                              badgeToneClassByColor[badge.color]
                            }`}
                          >
                            <span>{badge.label}</span>
                            <select
                              value={badge.color}
                              onChange={(event) =>
                                updateActivityFieldColor(
                                  index,
                                  toBadgeColor(event.target.value),
                                )
                              }
                              aria-label={`${badge.label} 색상`}
                              className="h-5 rounded-md border border-white/20 bg-black/20 px-1 text-[10px] text-white/85 outline-none"
                            >
                              <option value="red">R</option>
                              <option value="blue">B</option>
                              <option value="green">G</option>
                              <option value="purple">P</option>
                              <option value="orange">O</option>
                              <option value="gray">GY</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => removeActivityFieldAt(index)}
                              aria-label={`${badge.label} 삭제`}
                              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white/85 transition hover:bg-white/20 hover:text-white"
                            >
                              x
                            </button>
                          </span>
                        ))}
                        <select
                          value={activityFieldColorInput}
                          onChange={(event) =>
                            setActivityFieldColorInput(
                              toBadgeColor(event.target.value),
                            )
                          }
                          aria-label="새 직무 색상"
                          className="h-8 rounded-md border border-white/15 bg-black/20 px-2 text-xs text-white/85 outline-none"
                        >
                          <option value="red">빨강</option>
                          <option value="blue">파랑</option>
                          <option value="green">초록</option>
                          <option value="purple">보라</option>
                          <option value="orange">주황</option>
                          <option value="gray">회색</option>
                        </select>
                        <input
                          type="text"
                          value={activityFieldInput}
                          onChange={(event) =>
                            setActivityFieldInput(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              commitActivityFieldInput();
                              return;
                            }

                            if (
                              event.key === "Backspace" &&
                              activityFieldInput.length === 0 &&
                              draft.activityFieldBadges.length > 0
                            ) {
                              event.preventDefault();
                              removeActivityFieldAt(
                                draft.activityFieldBadges.length - 1,
                              );
                            }
                          }}
                          onBlur={commitActivityFieldInput}
                          placeholder={
                            draft.activityFieldBadges.length === 0
                              ? "예: Web, Reverse, Crypto"
                              : "직무 추가"
                          }
                          className="h-8 min-w-[140px] flex-1 bg-transparent px-1 text-sm text-white/80 placeholder:text-white/35 focus:outline-none"
                        />
                      </div>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                      가입일
                    </span>
                    <div className="mt-2">
                      <DatePicker
                        selected={joinDate}
                        onChange={(date: Date | null) => setJoinDate(date)}
                        locale={ko}
                        dateFormat="yyyy년 MM월 dd일"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                        placeholderText="날짜를 선택하세요"
                        className="h-11 w-full rounded-full border border-white/10 bg-[#0f1210] px-4 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                      />
                    </div>
                    {joinDate && (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/40">
                        현재 가입일: {formatDate(joinDate.toISOString())}
                      </p>
                    )}
                  </label>

                  {message && (
                    <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] text-white/60">
                      {message}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isLoading || !isFormValid}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs uppercase tracking-[0.28em] text-white/60 transition hover:border-white/30 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={openDeleteModal}
                      disabled={isLoading}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/10 text-xs uppercase tracking-[0.28em] text-rose-100/80 transition hover:border-rose-300/60 hover:bg-rose-500/20 hover:text-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      삭제
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-sm text-white/50">
                  편집할 멤버가 없습니다.
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
      <ConfirmDangerModal
        open={isDeleteModalOpen && !!selectedMember}
        isLoading={isLoading}
        title="멤버를 삭제하시겠습니까?"
        description={
          selectedMember ? (
            <>
              <strong className="font-semibold text-[#ff4d4d]">
                {selectedMember.username
                  ? `${selectedMember.username}(${selectedMember.displayName})`
                  : selectedMember.displayName}
              </strong>{" "}
              님의 모든 데이터가 영구적으로 삭제됩니다.
            </>
          ) : null
        }
        warningText="삭제된 데이터는 복구할 수 없습니다. 신중하게 선택해 주세요."
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container input {
          width: 100%;
        }
        .react-datepicker {
          background: #0f1210;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
          color: #f5f7f5;
        }
        .react-datepicker__header {
          background: #141a16;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: #f5f7f5;
        }
        .react-datepicker__day {
          color: rgba(255, 255, 255, 0.8);
        }
        .react-datepicker__day:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
        .react-datepicker__day--today {
          font-weight: 700;
          color: #9ae6b4;
        }
        .react-datepicker__triangle {
          display: none;
        }
        .react-datepicker__year-dropdown,
        .react-datepicker__month-dropdown {
          background: #0f1210;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        .react-datepicker__year-option:hover,
        .react-datepicker__month-option:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .react-datepicker__navigation-icon::before {
          border-color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
}
