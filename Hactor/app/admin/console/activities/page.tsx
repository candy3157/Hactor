"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";
import ConfirmDangerModal from "@/app/components/admin/modals/ConfirmDangerModal";

type Activity = {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  year: number;
  category: string;
  content: string;
  imageUrls: string[];
};

type ActivityFromApi = {
  id: string;
  title: string;
  date?: string;
  dateLabel?: string;
  year?: number;
  category: string;
  content?: string;
  imageUrls?: string[];
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (dateValue: string) => {
  if (!dateValue) {
    return "";
  }

  const parsed = new Date(`${dateValue}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  })
    .format(parsed)
    .toUpperCase();
};

const extractYear = (dateValue: string) => {
  const parsed = new Date(`${dateValue}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().getFullYear();
  }

  return parsed.getUTCFullYear();
};

const defaultDate = toDateInputValue(new Date());

const emptyDraft: Activity = {
  id: "",
  title: "",
  date: defaultDate,
  dateLabel: formatDateLabel(defaultDate),
  year: extractYear(defaultDate),
  category: "",
  content: "",
  imageUrls: [],
};

const parseImageUrls = (raw: string) =>
  raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const normalizeActivity = (activity: ActivityFromApi): Activity => {
  const date = activity.date ?? defaultDate;
  const year = activity.year ?? extractYear(date);
  const dateLabel = activity.dateLabel ?? formatDateLabel(date);

  return {
    id: activity.id,
    title: activity.title,
    date,
    dateLabel,
    year,
    category: activity.category,
    content: activity.content ?? "",
    imageUrls: Array.isArray(activity.imageUrls) ? activity.imageUrls : [],
  };
};

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Activity>(emptyDraft);
  const [imageUrlsInput, setImageUrlsInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const selected = useMemo(
    () => activities.find((item) => item.id === selectedId) ?? null,
    [activities, selectedId],
  );

  const previewDateLabel = useMemo(
    () => formatDateLabel(draft.date),
    [draft.date],
  );
  const previewYear = useMemo(() => extractYear(draft.date), [draft.date]);

  const isFormValid = useMemo(
    () =>
      draft.title.trim().length > 0 &&
      /^\d{4}-\d{2}-\d{2}$/.test(draft.date) &&
      draft.category.trim().length > 0,
    [draft],
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/activities");
        if (!res.ok) {
          throw new Error("Failed to load activities.");
        }

        const data = (await res.json()) as { activities?: ActivityFromApi[] };
        const next = (data.activities ?? []).map((activity) =>
          normalizeActivity(activity),
        );
        setActivities(next);

        if (next.length > 0) {
          setSelectedId(next[0].id);
        }
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to load activities.",
        );
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (selected) {
      setDraft(selected);
      setImageUrlsInput(selected.imageUrls.join("\n"));
    }
  }, [selected]);

  const buildPayload = () => ({
    title: draft.title,
    date: draft.date,
    category: draft.category,
    content: draft.content,
    imageUrls: parseImageUrls(imageUrlsInput),
  });

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/activities/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to update activity.");
      }

      const data = (await res.json()) as { activity: ActivityFromApi };
      const nextActivity = normalizeActivity(data.activity);

      setActivities((prev) =>
        prev.map((item) => (item.id === nextActivity.id ? nextActivity : item)),
      );
      setDraft(nextActivity);
      setImageUrlsInput(nextActivity.imageUrls.join("\n"));
      setMessage("Updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update.");
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
        body: JSON.stringify(buildPayload()),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message ?? "Failed to create activity.");
      }

      const data = (await res.json()) as { activity: ActivityFromApi };
      const nextActivity = normalizeActivity(data.activity);

      setActivities((prev) => [nextActivity, ...prev]);
      setSelectedId(nextActivity.id);
      setDraft(nextActivity);
      setImageUrlsInput(nextActivity.imageUrls.join("\n"));
      setMessage("Created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create.");
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
        const errorPayload = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(errorPayload?.message ?? "Failed to delete activity.");
      }

      const nextActivities = activities.filter(
        (item) => item.id !== selectedId,
      );
      setActivities(nextActivities);

      if (nextActivities.length > 0) {
        const next = nextActivities[0];
        setSelectedId(next.id);
        setDraft(next);
        setImageUrlsInput(next.imageUrls.join("\n"));
      } else {
        const nextDate = toDateInputValue(new Date());
        setSelectedId(null);
        setDraft({
          ...emptyDraft,
          date: nextDate,
          dateLabel: formatDateLabel(nextDate),
          year: extractYear(nextDate),
        });
        setImageUrlsInput("");
      }

      setIsDeleteModalOpen(false);
      setMessage("Deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNew = () => {
    const nextDate = toDateInputValue(new Date());

    setSelectedId(null);
    setDraft({
      ...emptyDraft,
      date: nextDate,
      dateLabel: formatDateLabel(nextDate),
      year: extractYear(nextDate),
    });
    setImageUrlsInput("");
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
                Activities
              </p>
              <h1 className="mt-2 font-[var(--font-display)] text-2xl uppercase tracking-[0.18em] text-white">
                Activity Manager
              </h1>
              <p className="mt-2 text-sm text-white/60">
                Manage list and detail content for the Activities page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNew}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/60 hover:border-white/35 hover:text-white"
            >
              + New Activity
            </button>
          </header>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <section className="rounded-[24px] border border-white/10 bg-[rgba(12,12,16,0.9)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">
                  Activities
                </p>
                <span className="text-sm text-white/70">
                  {activities.length}
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
                  Editor
                </p>
                <span className="text-[11px] text-white/40">
                  {selectedId ? "Edit" : "Create"}
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
                    Date
                  </span>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        date: event.target.value,
                      }))
                    }
                    className="mt-2 h-11 w-full rounded-full border border-white/10 bg-[#0f1210] px-4 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                  />
                </label>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[11px] text-white/70">
                  <p className="uppercase tracking-[0.2em] text-white/45">
                    Auto Generated
                  </p>
                  <p className="mt-1">
                    {previewDateLabel || "-"} / {previewYear}
                  </p>
                </div>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                    Category
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

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                    Content
                  </span>
                  <textarea
                    value={draft.content}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        content: event.target.value,
                      }))
                    }
                    rows={6}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0f1210] px-4 py-3 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                    placeholder="Write detail text shown in activity detail page"
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                    Gallery Image URLs
                  </span>
                  <p className="mt-2 text-[10px] leading-5 text-white/40">
                    이미지 URL을 입력해주세요.(Supabase Storage에 이미지를
                    업로드 하면 URL을 얻을 수 있습니다)
                  </p>
                  <textarea
                    value={imageUrlsInput}
                    onChange={(event) => setImageUrlsInput(event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0f1210] px-4 py-3 text-sm text-white/80 focus:border-white/30 focus:outline-none"
                    placeholder={`https://example.com/a.jpg
https://example.com/b.png
https://example.com/c.webp`}
                  />
                </label>

                {message && (
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] text-white/60">
                    {message}
                  </p>
                )}
                {!isFormValid && (
                  <p className="rounded-2xl border border-amber-300/20 bg-amber-200/10 px-4 py-2 text-[11px] text-amber-100/80">
                    Fill in title/date/category first.
                  </p>
                )}

                <button
                  type="button"
                  onClick={selectedId ? handleSave : handleCreate}
                  disabled={isLoading || !isFormValid}
                  className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs uppercase tracking-[0.28em] text-white/60 transition hover:border-white/30 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {selectedId ? "Save" : "Create"}
                </button>

                {selectedId && (
                  <button
                    type="button"
                    onClick={openDeleteModal}
                    disabled={isLoading}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full border border-rose-300/30 bg-rose-400/10 text-xs uppercase tracking-[0.28em] text-rose-100/80 transition hover:border-rose-200/50 hover:bg-rose-400/20 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete
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
        title="Delete this activity?"
        description={
          selectedId ? (
            <>
              <strong className="font-semibold text-[#ff4d4d]">
                {activities.find((item) => item.id === selectedId)?.title ??
                  "Selected activity"}
              </strong>{" "}
              will be permanently removed.
            </>
          ) : null
        }
        warningText="Deleted data cannot be recovered. Please confirm carefully."
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
}
