import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const SESSION_COOKIE = "admin_session";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const sessionId = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.split("=")[1];

  if (!sessionId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const session = await prisma.adminSession.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.expiresAt <= new Date()) {
    if (session) {
      await prisma.adminSession.delete({ where: { id: sessionId } });
    }
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
