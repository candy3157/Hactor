import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const [members, fields] = await Promise.all([
    prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        fields: {
          include: {
            field: true,
          },
        },
      },
    }),
    prisma.activityField.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const payload = {
    members: members.map((member) => ({
      id: member.id,
      discordId: member.discordId ? member.discordId.toString() : null,
      displayName: member.displayName,
      username: member.username,
      avatarUrl: member.avatarUrl,
      discordJoinedAt: member.discordJoinedAt,
      isActive: member.isActive,
      fields: member.fields.map((entry) => ({
        fieldId: entry.fieldId,
        label: entry.field.label,
      })),
    })),
    fields: fields.map((field) => ({
      id: field.id,
      label: field.label,
      code: field.code,
    })),
  };

  return NextResponse.json(payload);
}
