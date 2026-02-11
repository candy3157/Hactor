"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";
import ConfirmDangerModal from "@/app/components/admin/modals/ConfirmDangerModal";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

type MemberField = {
  fieldId: number;
  label: string;
};

type Member = {
  id: string;
  discordId: string | null;
  displayName: string;
  username: string | null;
  avatarUrl: string | null;
  discordJoinedAt: string | null;
  isActive: boolean;
  fields: MemberField[];
};

type Field = {
  id: number;
  label: string;
  code: string;
};

type MemberDraft = {
  id: string;
  displayName: string;
  username: string;
  isActive: boolean;
  fieldIds: number[];
};

const emptyDraft: MemberDraft = {
  id: "",
  displayName: "",
  username: "",
  isActive: true,
  fieldIds: [],
};

const formatDate = (value: string | null) => {
  if (!value) return "미정";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
};

export default function AdminUsersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MemberDraft>(emptyDraft);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [joinDate, setJoinDate] = useState<Date | null>(null);
  const [fieldQuery, setFieldQuery] = useState("");

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedId) ?? null,
    [members, selectedId],
  );

  const isFormValid = useMemo(
    () => draft.displayName.trim().length > 0,
    [draft.displayName],
  );
  const filteredFields = useMemo(() => {
    const query = fieldQuery.trim().toLowerCase();
    if (!query) {
      return fields;
    }
    return fields.filter((field) => {
      const source = `${field.label} ${field.code}`.toLowerCase();
      return source.includes(query);
    });
  }, [fields, fieldQuery]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/members");
      const data = (await res.json()) as {
        members: Member[];
        fields: Field[];
      };
      setMembers(data.members ?? []);
      setFields(data.fields ?? []);
      if (data.members?.length) {
        setSelectedId(data.members[0].id);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (!selectedMember) {
      return;
    }
    setDraft({
      id: selectedMember.id,
      displayName: selectedMember.displayName,
      username: selectedMember.username ?? "",
      isActive: selectedMember.isActive,
      fieldIds: selectedMember.fields.map((entry) => entry.fieldId),
    });
    setJoinDate(
      selectedMember.discordJoinedAt
        ? new Date(selectedMember.discordJoinedAt)
        : null,
    );
    setFieldQuery("");
  }, [selectedMember]);

  const toggleField = (fieldId: number) => {
    setDraft((prev) => {
      const exists = prev.fieldIds.includes(fieldId);
      return {
        ...prev,
        fieldIds: exists
          ? prev.fieldIds.filter((id) => id !== fieldId)
          : [...prev.fieldIds, fieldId],
      };
    });
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
    try {
      const res = await fetch(`/api/admin/members/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: draft.displayName,
          username: draft.username,
          isActive: draft.isActive,
          fieldIds: draft.fieldIds,
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
                  {members.length}명
                </span>
              </div>

              {members.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-sm text-white/50">
                  아직 등록된 멤버가 없습니다.
                </div>
              ) : (
                <div className="mt-6 space-y-4 pb-2">
                  {members.map((member) => (
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
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
                        {member.fields.length === 0 ? (
                          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/50">
                            미정
                          </span>
                        ) : (
                          member.fields.map((entry) => (
                            <span
                              key={`${member.id}-${entry.fieldId}`}
                              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/70"
                            >
                              {entry.label}
                            </span>
                          ))
                        )}
                      </div>
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
                      미선택 가능
                    </p>
                    <div className="mt-3 rounded-2xl border border-white/10 bg-[rgba(15,18,22,0.78)] p-3 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03)]">
                      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-3 py-2">
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
                          value={fieldQuery}
                          onChange={(event) => setFieldQuery(event.target.value)}
                          placeholder="활동 분야 검색"
                          className="h-7 w-full bg-transparent text-sm text-white/80 placeholder:text-white/35 focus:outline-none"
                        />
                        {fieldQuery ? (
                          <button
                            type="button"
                            onClick={() => setFieldQuery("")}
                            className="text-xs font-medium text-emerald-300/85 hover:text-emerald-200"
                          >
                            Cancel
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-3 rounded-md border border-white/10 bg-[rgba(255,255,255,0.05)] px-3 py-2 text-xs font-medium text-white/45">
                        Matching fields
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {fields.length === 0 ? (
                          <div className="w-full rounded-xl border border-dashed border-white/15 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-center text-[11px] text-white/50">
                            등록된 활동 분야가 없습니다.
                          </div>
                        ) : filteredFields.length === 0 ? (
                          <div className="w-full rounded-xl border border-dashed border-white/15 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-center text-[11px] text-white/50">
                            검색 결과가 없습니다.
                          </div>
                        ) : (
                          filteredFields.map((field) => {
                            const selected = draft.fieldIds.includes(field.id);
                            return (
                              <button
                                key={field.id}
                                type="button"
                                onClick={() => toggleField(field.id)}
                                aria-pressed={selected}
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                                  selected
                                    ? "border-emerald-300/45 bg-emerald-500/20 text-emerald-100 shadow-[0_6px_18px_rgba(16,185,129,0.22)]"
                                    : "border-white/15 bg-[rgba(255,255,255,0.06)] text-white/80 hover:border-white/30 hover:bg-[rgba(255,255,255,0.1)]"
                                }`}
                              >
                                <span>{field.label}</span>
                                <span className="inline-flex h-4 w-4 items-center justify-center leading-none">
                                  {selected ? (
                                    <svg
                                      className="h-3.5 w-3.5"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M3.5 8.2 6.6 11.3 12.5 5.4"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  ) : (
                                    <span className="text-base leading-none">+</span>
                                  )}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-white/45">
                      선택됨: {draft.fieldIds.length}개
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setDraft((prev) => ({ ...prev, fieldIds: [] }))}
                        className="text-[11px] font-medium text-white/55 underline-offset-2 transition hover:text-white/80 hover:underline"
                      >
                        모두 해제
                      </button>
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

