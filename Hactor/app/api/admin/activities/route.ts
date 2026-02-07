import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type ActivityPayload = {
  title?: string;
  dateLabel?: string;
  year?: number;
  category?: string;
};

export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ ok: true, activities });
}

export async function POST(request: Request) {
  let payload: ActivityPayload | null = null;

  try {
    payload = (await request.json()) as ActivityPayload;
  } catch {
    payload = null;
  }

  if (
    !payload?.title?.trim() ||
    !payload?.dateLabel?.trim() ||
    !payload?.category?.trim() ||
    !Number.isInteger(payload?.year)
  ) {
    return NextResponse.json(
      { ok: false, message: "Missing required fields" },
      { status: 400 },
    );
  }

  if (payload.year! < 1900 || payload.year! > 2100) {
    return NextResponse.json(
      { ok: false, message: "Invalid year range" },
      { status: 400 },
    );
  }

  const year = payload.year;

  const created = await prisma.activity.create({
    data: {
      title: payload.title.trim(),
      dateLabel: payload.dateLabel.trim(),
      year,
      category: payload.category.trim(),
    },
  });

  return NextResponse.json({ ok: true, activity: created }, { status: 201 });
}
