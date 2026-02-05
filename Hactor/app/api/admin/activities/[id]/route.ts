import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type ActivityPayload = {
  title?: string;
  dateLabel?: string;
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

  const updated = await prisma.activity.update({
    where: { id },
    data: {
      title: payload.title,
      dateLabel: payload.dateLabel,
      category: payload.category,
    },
  });

  return NextResponse.json({ ok: true, activity: updated });
}
