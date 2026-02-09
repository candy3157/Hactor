import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type ActivityPayload = {
  title?: unknown;
  date?: unknown;
  category?: unknown;
  content?: unknown;
  imageUrls?: unknown;
};

type ActivityWithImages = {
  id: string;
  title: string;
  date: Date;
  dateLabel: string;
  year: number;
  category: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: Array<{
    id: number;
    imageUrl: string;
    sortOrder: number;
  }>;
};

const MAX_IMAGE_COUNT = 24;

const imagesInclude = {
  images: {
    orderBy: [{ sortOrder: "asc" as const }, { id: "asc" as const }],
  },
};

const isHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeOptionalText = (value: unknown) => {
  if (value === undefined) {
    return { ok: true as const, value: undefined as string | null | undefined };
  }

  if (value === null) {
    return { ok: true as const, value: null as string | null };
  }

  if (typeof value !== "string") {
    return { ok: false as const };
  }

  const trimmed = value.trim();
  return {
    ok: true as const,
    value: trimmed.length > 0 ? trimmed : null,
  };
};

const normalizeImageUrls = (value: unknown) => {
  if (value === undefined) {
    return { ok: true as const, value: undefined as string[] | undefined };
  }

  if (!Array.isArray(value)) {
    return { ok: false as const };
  }

  const next: string[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    if (typeof entry !== "string") {
      return { ok: false as const };
    }

    const trimmed = entry.trim();
    if (!trimmed) {
      continue;
    }

    if (!isHttpUrl(trimmed)) {
      return { ok: false as const };
    }

    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      next.push(trimmed);
    }
  }

  if (next.length > MAX_IMAGE_COUNT) {
    return { ok: false as const };
  }

  return { ok: true as const, value: next };
};

const parseDateInput = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }

  return parsed;
};

const toDateInputValue = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  })
    .format(date)
    .toUpperCase();

const serializeActivity = (activity: ActivityWithImages) => ({
  id: activity.id,
  title: activity.title,
  date: toDateInputValue(activity.date),
  dateLabel: activity.dateLabel,
  year: activity.year,
  category: activity.category,
  content: activity.content ?? "",
  imageUrls: activity.images.map((image) => image.imageUrl),
  createdAt: activity.createdAt,
  updatedAt: activity.updatedAt,
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  let payload: ActivityPayload | null = null;

  try {
    payload = (await request.json()) as ActivityPayload;
  } catch {
    payload = null;
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { ok: false, message: "No fields to update" },
      { status: 400 },
    );
  }

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "Missing activity id" },
      { status: 400 },
    );
  }

  const data: Prisma.ActivityUpdateInput = {};
  let hasChanges = false;

  if (Object.prototype.hasOwnProperty.call(payload, "title")) {
    if (typeof payload.title !== "string" || payload.title.trim().length === 0) {
      return NextResponse.json(
        { ok: false, message: "Title cannot be empty" },
        { status: 400 },
      );
    }

    data.title = payload.title.trim();
    hasChanges = true;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "date")) {
    const parsedDate = parseDateInput(payload.date);

    if (!parsedDate) {
      return NextResponse.json(
        { ok: false, message: "Date must be in YYYY-MM-DD format" },
        { status: 400 },
      );
    }

    const year = parsedDate.getUTCFullYear();

    if (year < 1900 || year > 2100) {
      return NextResponse.json(
        { ok: false, message: "Invalid year range" },
        { status: 400 },
      );
    }

    data.date = parsedDate;
    data.year = year;
    data.dateLabel = formatDateLabel(parsedDate);
    hasChanges = true;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "category")) {
    if (
      typeof payload.category !== "string" ||
      payload.category.trim().length === 0
    ) {
      return NextResponse.json(
        { ok: false, message: "Category cannot be empty" },
        { status: 400 },
      );
    }

    data.category = payload.category.trim();
    hasChanges = true;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "content")) {
    const normalizedContent = normalizeOptionalText(payload.content);
    if (!normalizedContent.ok) {
      return NextResponse.json(
        { ok: false, message: "Invalid content format" },
        { status: 400 },
      );
    }

    data.content = normalizedContent.value ?? null;
    hasChanges = true;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "imageUrls")) {
    const normalizedImageUrls = normalizeImageUrls(payload.imageUrls);
    if (!normalizedImageUrls.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Image URLs must be an array of valid http(s) URLs",
        },
        { status: 400 },
      );
    }

    const imageUrls = normalizedImageUrls.value ?? [];

    data.images = {
      deleteMany: {},
      create: imageUrls.map((imageUrl, index) => ({
        imageUrl,
        sortOrder: index,
      })),
    };

    hasChanges = true;
  }

  if (!hasChanges) {
    return NextResponse.json(
      { ok: false, message: "No fields to update" },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.activity.update({
      where: { id },
      data,
      include: imagesInclude,
    });

    return NextResponse.json({ ok: true, activity: serializeActivity(updated) });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, message: "Activity not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { ok: false, message: "Failed to update activity" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "Missing activity id" },
      { status: 400 },
    );
  }

  try {
    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, message: "Activity not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { ok: false, message: "Failed to delete activity" },
      { status: 500 },
    );
  }
}
