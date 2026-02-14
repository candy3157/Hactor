import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const SESSION_COOKIE = "admin_session";

type AdminSessionAuthResult =
  | {
      ok: true;
      adminId: string;
      sessionId: string;
    }
  | {
      ok: false;
      response: NextResponse;
    };

const readCookie = (request: Request, key: string) => {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const pair = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${key}=`));

  if (!pair) {
    return null;
  }

  return pair.slice(key.length + 1) || null;
};

const parseOrigin = (value: string) => {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const getAllowedOrigins = (request: Request) => {
  const fromRequest = parseOrigin(request.url);
  const fromEnv = (process.env.ADMIN_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((value) => parseOrigin(value))
    .filter((value): value is string => value !== null);

  const allowed = new Set<string>(fromEnv);
  if (fromRequest) {
    allowed.add(fromRequest);
  }

  return allowed;
};

export const requireSameOrigin = (request: Request): NextResponse | null => {
  const originHeader = request.headers.get("origin");
  if (!originHeader) {
    return NextResponse.json(
      { ok: false, message: "Forbidden origin" },
      { status: 403 },
    );
  }

  const requestOrigin = parseOrigin(originHeader);
  if (!requestOrigin) {
    return NextResponse.json(
      { ok: false, message: "Forbidden origin" },
      { status: 403 },
    );
  }

  const allowedOrigins = getAllowedOrigins(request);
  if (!allowedOrigins.has(requestOrigin)) {
    return NextResponse.json(
      { ok: false, message: "Forbidden origin" },
      { status: 403 },
    );
  }

  return null;
};

export const requireAdminSession = async (
  request: Request,
): Promise<AdminSessionAuthResult> => {
  const sessionId = readCookie(request, SESSION_COOKIE);
  if (!sessionId) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  const session = await prisma.adminSession.findUnique({
    where: { id: sessionId },
    include: {
      admin: {
        select: {
          id: true,
          isActive: true,
        },
      },
    },
  });

  if (
    !session ||
    session.expiresAt <= new Date() ||
    !session.admin ||
    !session.admin.isActive
  ) {
    if (session) {
      await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => null);
    }

    const response = NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    );

    response.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    response.headers.set("Cache-Control", "no-store");

    return {
      ok: false,
      response,
    };
  }

  return {
    ok: true,
    adminId: session.admin.id,
    sessionId: session.id,
  };
};
