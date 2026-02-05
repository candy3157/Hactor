"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";

type Activity = {
  id: string;
  title: string;
  dateLabel: string;
  category: string;
};

const emptyDraft: Activity = {
  id: "",
  title: "",
  dateLabel: "",
  category: "스터디",
};

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Activity>(emptyDraft);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selected = useMemo(
    () => activities.find((item) => item.id === selectedId) ?? null,
    [activities, selectedId],
  );
  const isFormValid = useMemo(() => {
    return (
      draft.title.trim().length > 0 &&
      draft.dateLabel.trim().length > 0 &&
      draft.category.trim().length > 0
    );
  }, [draft]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/activities");
      const data = (await res.json()) as { activities: Activity[] };
      setActivities(data.activities ?? []);
      if (data.activities?.length) {
        setSelectedId(data.activities[0].id);
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
          category: draft.category,
        }),
      });
      if (!res.ok) {
        throw new Error("저장에 실패했습니다.");
      }
      const data = (await res.json()) as { activity: Activity };
      setActivities((prev) =>
        prev.map((item) =>
          item.id === data.activity.id ? data.activity : item,
        ),
      );
      setMessage("저장 완료");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "저장 실패");
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
          category: draft.category,
        }),
      });
      if (!res.ok) {
        throw new Error("추가에 실패했습니다.");
      }
      const data = (await res.json()) as { activity: Activity };
      setActivities((prev) => [data.activity, ...prev]);
      setSelectedId(data.activity.id);
      setMessage("추가 완료");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "추가 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    setDraft(emptyDraft);
  };

  return (
    <div className="min-h-screen bg-[#0f1210] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-6 py-10 lg:px-10">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">
                Activities
              </p>
              <h1 className="mt-2 font-[var(--font-display)] text-2xl uppercase tracking-[0.18em] text-white">
                활동 관리
              </h1>
              <p className="mt-2 text-sm text-white/60">
                활동 데이터를 추가 및 수정할 수 있습니다.
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
                  Activities
                </p>
                <span className="text-sm text-white/70">
                  {activities.length}개
                </span>
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
                          {activity.dateLabel}
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
                  Edit
                </p>
                <span className="text-[11px] text-white/40">
                  {selectedId ? "수정" : "추가"}
                </span>
              </div>

              <form className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                    Title
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
                    Date Label
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
                    Category
                  </span>
                  <select
                    value={draft.category}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-full border border-white/10 bg-[#0f1210] px-4 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                  >
                    <option className="bg-[#0f1210] text-white" value="스터디">
                      스터디
                    </option>
                    <option
                      className="bg-[#0f1210] text-white"
                      value="프로젝트"
                    >
                      프로젝트
                    </option>
                    <option className="bg-[#0f1210] text-white" value="강의">
                      강의
                    </option>
                    <option className="bg-[#0f1210] text-white" value="행사">
                      행사
                    </option>
                  </select>
                </label>

                {message && (
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] text-white/60">
                    {message}
                  </p>
                )}
                {!isFormValid && (
                  <p className="rounded-2xl border border-amber-300/20 bg-amber-200/10 px-4 py-2 text-[11px] text-amber-100/80">
                    모든 항목을 입력해야 추가/저장할 수 있습니다.
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
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
