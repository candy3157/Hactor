import { NextResponse } from "next/server";
import prisma from "@/lib/prisma-admin";
import { requireAdminSession, requireSameOrigin } from "@/lib/admin-auth";

export const runtime = "nodejs";

type Payload = {
  displayName?: string;
  username?: string | null;
  isActive?: boolean;
  activityFieldBadges?: Array<{ label?: string; color?: string }> | null;
  activityFields?: string | null;
  discordJoinedAt?: string | null;
};

type BadgeColor = "red" | "blue" | "green";

const toBadgeColor = (value: string | undefined): BadgeColor => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "red" || normalized === "green") {
    return normalized;
  }
  return "blue";
};

const parseActivityFieldLabels = (value: string | null | undefined) => {
  if (typeof value !== "string") {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(/[\n,]+/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0),
    ),
  );
};

const parseActivityFieldBadges = (payload: Payload) => {
  if (Array.isArray(payload.activityFieldBadges)) {
    const deduped = new Map<string, { label: string; color: BadgeColor }>();
    payload.activityFieldBadges.forEach((badge) => {
      const label = badge.label?.trim().replace(/\s+/g, " ") ?? "";
      if (!label) {
        return;
      }
      deduped.set(label.toLowerCase(), {
        label,
        color: toBadgeColor(badge.color),
      });
    });
    return Array.from(deduped.values());
  }

  if (typeof payload.activityFields === "string") {
    return parseActivityFieldLabels(payload.activityFields).map((label) => ({
      label,
      color: "blue" as const,
    }));
  }

  if (payload.activityFieldBadges === null || payload.activityFields === null) {
    return [];
  }

  return null;
};

const toUniqueActivityFieldBadges = (
  fields: Array<{ fieldId: string; fieldColor: string }>,
) => {
  const unique = new Set<string>();
  const badges: Array<{ label: string; color: BadgeColor }> = [];

  fields.forEach((entry) => {
    const label = entry.fieldId.trim();
    if (!label) {
      return;
    }
    const key = label.toLowerCase();
    if (unique.has(key)) {
      return;
    }
    unique.add(key);
    badges.push({
      label,
      color: toBadgeColor(entry.fieldColor),
    });
  });

  return badges;
};

const toActivityFieldsText = (badges: Array<{ label: string }>) => {
  const unique = Array.from(
    new Set(
      badges
        .map((badge) => badge.label.trim())
        .filter((value) => value.length > 0),
    ),
  );

  return unique.length > 0 ? unique.join(", ") : null;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const originError = requireSameOrigin(request);
  if (originError) {
    return originError;
  }

  const auth = await requireAdminSession(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ ok: false, message: "Missing id" }, { status: 400 });
  }

  let payload: Payload | null = null;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    payload = null;
  }

  if (!payload || Object.keys(payload).length === 0) {
    return NextResponse.json({ ok: false, message: "No fields to update" }, { status: 400 });
  }

  if (typeof payload.displayName === "string" && payload.displayName.trim().length === 0) {
    return NextResponse.json({ ok: false, message: "Display name required" }, { status: 400 });
  }

  const parsedFieldBadges = parseActivityFieldBadges(payload);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.member.update({
      where: { id },
      data: {
        displayName: payload.displayName?.trim(),
        username: payload.username?.trim() || null,
        isActive: typeof payload.isActive === "boolean" ? payload.isActive : undefined,
        discordJoinedAt: payload.discordJoinedAt
          ? new Date(payload.discordJoinedAt)
          : payload.discordJoinedAt === null
            ? null
            : undefined,
      },
    });

    if (parsedFieldBadges !== null) {
      await tx.memberActivityField.deleteMany({
        where: { memberId: id },
      });

      const valuesToSave = parsedFieldBadges;
      if (valuesToSave.length > 0) {
        await tx.memberActivityField.createMany({
          data: valuesToSave.map((badge) => ({
            memberId: id,
            fieldId: badge.label,
            fieldColor: badge.color,
          })),
          skipDuplicates: true,
        });
      }
    }

    return tx.member.findUniqueOrThrow({
      where: { id },
      include: {
        fields: {
          orderBy: { assignedAt: "asc" },
          select: {
            fieldId: true,
            fieldColor: true,
          },
        },
      },
    });
  });

  const activityFieldBadges = toUniqueActivityFieldBadges(updated.fields);

  const response = {
    id: updated.id,
    discordId: updated.discordId ? updated.discordId.toString() : null,
    displayName: updated.displayName,
    username: updated.username,
    avatarUrl: updated.avatarUrl,
    activityFields: toActivityFieldsText(activityFieldBadges),
    activityFieldBadges,
    discordJoinedAt: updated.discordJoinedAt,
    isActive: updated.isActive,
  };

  return NextResponse.json({ ok: true, member: response });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const originError = requireSameOrigin(request);
  if (originError) {
    return originError;
  }

  const auth = await requireAdminSession(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ ok: false, message: "Missing id" }, { status: 400 });
  }

  await prisma.member.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
