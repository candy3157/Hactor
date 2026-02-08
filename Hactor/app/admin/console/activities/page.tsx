"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";
import ConfirmDangerModal from "@/app/components/admin/modals/ConfirmDangerModal";

type Activity = {
  id: string;
  title: string;
  dateLabel: string;
  year: number;
  category: string;
};

const emptyDraft: Activity = {
  id: "",
  title: "",
  dateLabel: "",
  year: new Date().getFullYear(),
  category: "",
};

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Activity>(emptyDraft);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const selected = useMemo(
    () => activities.find((item) => item.id === selectedId) ?? null,
    [activities, selectedId],
  );

  const isFormValid = useMemo(
    () =>
      draft.title.trim().length > 0 &&
      draft.dateLabel.trim().length > 0 &&
      Number.isInteger(draft.year) &&
      draft.year >= 1900 &&
      draft.year <= 2100 &&
      draft.category.trim().length > 0,
    [draft],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/activities");
        if (!res.ok) {
          throw new Error("활동 목록을 불러오지 못했습니다.");
        }
        const data = (await res.json()) as { activities: Activity[] };
        const next = data.activities ?? [];
        setActivities(next);
        if (next.length > 0) {
          setSelectedId(next[0].id);
        }
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "불러오기에 실패했습니다.",
        );
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (selected) {
      setDraft(selected);
    }
  }, [selected]);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/activities/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          dateLabel: draft.dateLabel,
          year: draft.year,
          category: draft.category,
        }),
      });
      if (!res.ok) {
        throw new Error("활동 저장에 실패했습니다.");
      }
      const data = (await res.json()) as { activity: Activity };
      setActivities((prev) =>
        prev.map((item) =>
          item.id === data.activity.id ? data.activity : item,
        ),
      );
      setMessage("저장 완료");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "저장 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          dateLabel: draft.dateLabel,
          year: draft.year,
          category: draft.category,
        }),
      });
      if (!res.ok) {
        throw new Error("활동 생성에 실패했습니다.");
      }
      const data = (await res.json()) as { activity: Activity };
      setActivities((prev) => [data.activity, ...prev]);
      setSelectedId(data.activity.id);
      setMessage("생성 완료");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "생성 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/activities/${selectedId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorPayload = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(errorPayload?.message ?? "활동 삭제에 실패했습니다.");
      }

      const nextActivities = activities.filter((item) => item.id !== selectedId);
      setActivities(nextActivities);

      if (nextActivities.length > 0) {
        setSelectedId(nextActivities[0].id);
        setDraft(nextActivities[0]);
      } else {
        setSelectedId(null);
        setDraft({
          ...emptyDraft,
          year: new Date().getFullYear(),
        });
      }

      setIsDeleteModalOpen(false);
      setMessage("삭제 완료");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "삭제 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    setDraft({
      ...emptyDraft,
      year: new Date().getFullYear(),
    });
    setMessage(null);
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

  return (
    <div className="min-h-screen bg-[#0f1210] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-6 py-10 lg:px-10">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">
                활동
              </p>
              <h1 className="mt-2 font-[var(--font-display)] text-2xl uppercase tracking-[0.18em] text-white">
                활동 관리
              </h1>
              <p className="mt-2 text-sm text-white/60">
                activities 페이지에서 사용할 활동을 생성/수정합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNew}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/60 hover:border-white/35 hover:text-white"
            >
              + 새 활동
            </button>
          </header>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <section className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  활동
                </p>
                <span className="text-sm text-white/70">{activities.length}개</span>
              </div>

              <div className="mt-6 space-y-3">
                {activities.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => setSelectedId(activity.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                      activity.id === selectedId
                        ? "border-white/30 bg-white/10"
                        : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {activity.title}
                        </p>
                        <p className="mt-1 text-[11px] text-white/50">
                          {activity.dateLabel} / {activity.year}
                        </p>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                        {activity.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  편집
                </p>
                <span className="text-[11px] text-white/40">
                  {selectedId ? "수정" : "추가"}
                </span>
              </div>

              <form className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                    제목
                  </span>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-full border border-white/10 bg-[#0f1210] px-4 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                    날짜 라벨
                  </span>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/40">
                    ex) MAR 01
                  </p>
                  <input
                    type="text"
                    value={draft.dateLabel}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        dateLabel: event.target.value,
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-full border border-white/10 bg-[#0f1210] px-4 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                    연도
                  </span>
                  <input
                    type="number"
                    min={1900}
                    max={2100}
                    value={draft.year}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        year: Number.parseInt(event.target.value, 10) || 0,
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-full border border-white/10 bg-[#0f1210] px-4 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                    카테고리
                  </span>
                  <input
                    type="text"
                    value={draft.category}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-full border border-white/10 bg-[#0f1210] px-4 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                  />
                </label>

                {message && (
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] text-white/60">
                    {message}
                  </p>
                )}
                {!isFormValid && (
                  <p className="rounded-2xl border border-amber-300/20 bg-amber-200/10 px-4 py-2 text-[11px] text-amber-100/80">
                    모든 항목을 입력하고 연도는 1900~2100 사이여야 합니다.
                  </p>
                )}

                <button
                  type="button"
                  onClick={selectedId ? handleSave : handleCreate}
                  disabled={isLoading || !isFormValid}
                  className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs uppercase tracking-[0.28em] text-white/60 transition hover:border-white/30 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {selectedId ? "저장" : "추가"}
                </button>

                {selectedId && (
                  <button
                    type="button"
                    onClick={openDeleteModal}
                    disabled={isLoading}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-rose-300/30 bg-rose-400/10 text-xs uppercase tracking-[0.28em] text-rose-100/80 transition hover:border-rose-200/50 hover:bg-rose-400/20 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    활동 삭제
                  </button>
                )}
              </form>
            </section>
          </div>
        </main>
      </div>
      <ConfirmDangerModal
        open={isDeleteModalOpen && !!selectedId}
        isLoading={isLoading}
        title="활동을 삭제하시겠습니까?"
        description={
          selectedId ? (
            <>
              <strong className="font-semibold text-[#ff4d4d]">
                {activities.find((item) => item.id === selectedId)?.title ??
                  "선택한 활동"}
              </strong>{" "}
              항목이 영구적으로 삭제됩니다.
            </>
          ) : null
        }
        warningText="삭제된 데이터는 복구할 수 없습니다. 신중하게 선택해 주세요."
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
