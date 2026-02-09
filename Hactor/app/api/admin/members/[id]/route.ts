import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type Payload = {
  displayName?: string;
  username?: string | null;
  isActive?: boolean;
  fieldIds?: number[];
  discordJoinedAt?: string | null;
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
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

  const fieldIds = Array.isArray(payload.fieldIds)
    ? Array.from(new Set(payload.fieldIds.filter((value) => Number.isInteger(value))))
    : null;

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

    if (fieldIds) {
      await tx.memberActivityField.deleteMany({
        where: { memberId: id },
      });

      if (fieldIds.length > 0) {
        await tx.memberActivityField.createMany({
          data: fieldIds.map((fieldId) => ({
            memberId: id,
            fieldId,
          })),
          skipDuplicates: true,
        });
      }
    }

    const refreshed = await tx.member.findUniqueOrThrow({
      where: { id },
      include: {
        fields: {
          include: { field: true },
        },
      },
    });
    return refreshed;
  });

  const response = {
    id: updated.id,
    discordId: updated.discordId ? updated.discordId.toString() : null,
    displayName: updated.displayName,
    username: updated.username,
    avatarUrl: updated.avatarUrl,
    discordJoinedAt: updated.discordJoinedAt,
    isActive: updated.isActive,
    fields: updated.fields.map((entry) => ({
      fieldId: entry.fieldId,
      label: entry.field.label,
    })),
  };

  return NextResponse.json({ ok: true, member: response });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ ok: false, message: "Missing id" }, { status: 400 });
  }

  await prisma.member.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
