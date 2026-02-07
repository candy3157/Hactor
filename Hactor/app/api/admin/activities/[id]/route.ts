import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type ActivityPayload = {
  title?: string;
  dateLabel?: string;
  year?: number;
  category?: string;
};

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

  if (!payload || Object.keys(payload).length === 0) {
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

  if (payload.title !== undefined && payload.title.trim().length === 0) {
    return NextResponse.json(
      { ok: false, message: "Title cannot be empty" },
      { status: 400 },
    );
  }

  if (
    payload.dateLabel !== undefined &&
    payload.dateLabel.trim().length === 0
  ) {
    return NextResponse.json(
      { ok: false, message: "Date label cannot be empty" },
      { status: 400 },
    );
  }

  if (payload.category !== undefined && payload.category.trim().length === 0) {
    return NextResponse.json(
      { ok: false, message: "Category cannot be empty" },
      { status: 400 },
    );
  }

  if (
    payload.year !== undefined &&
    (!Number.isInteger(payload.year) ||
      payload.year < 1900 ||
      payload.year > 2100)
  ) {
    return NextResponse.json(
      { ok: false, message: "Invalid year range" },
      { status: 400 },
    );
  }

  const updated = await prisma.activity.update({
    where: { id },
    data: {
      title: payload.title?.trim(),
      dateLabel: payload.dateLabel?.trim(),
      year: payload.year,
      category: payload.category?.trim(),
    },
  });

  return NextResponse.json({ ok: true, activity: updated });
}
