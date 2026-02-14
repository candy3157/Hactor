import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSameOrigin } from "@/lib/admin-auth";

export const runtime = "nodejs";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60;

type LoginPayload = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  const originError = requireSameOrigin(request);
  if (originError) {
    return originError;
  }

  let payload: LoginPayload | null = null;

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    payload = null;
  }

  const username = payload?.username?.trim();
  const password = payload?.password;

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, message: "Missing credentials" },
      { status: 400 },
    );
  }

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin || !admin.isActive) {
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const matches = await bcrypt.compare(password, admin.passwordHash);
  if (!matches) {
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  const session = await prisma.adminSession.create({
    data: {
      adminId: admin.id,
      expiresAt,
    },
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: session.id,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  response.headers.set("Cache-Control", "no-store");

  return response;
}
