import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type ActivityPayload = {
  title?: string;
  dateLabel?: string;
  category?: string;
};

export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: [{ createdAt: "desc" }],
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
    !payload?.title ||
    !payload?.dateLabel ||
    !payload?.category ||
    !payload?.category
  ) {
    return NextResponse.json(
      { ok: false, message: "Missing required fields" },
      { status: 400 },
    );
  }

  const created = await prisma.activity.create({
    data: {
      title: payload.title,
      dateLabel: payload.dateLabel,
      category: payload.category,
    },
  });

  return NextResponse.json({ ok: true, activity: created }, { status: 201 });
}
