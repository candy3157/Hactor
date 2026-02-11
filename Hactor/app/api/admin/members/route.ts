import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const DEFAULT_ACTIVITY_FIELDS = [
  { code: "web", label: "Web", sortOrder: 10 },
  { code: "pwnable", label: "Pwnable", sortOrder: 20 },
  { code: "reverse", label: "Reverse", sortOrder: 30 },
  { code: "forensic", label: "Forensic", sortOrder: 40 },
  { code: "dev", label: "Dev", sortOrder: 50 },
] as const;

const ensureDefaultActivityFields = async () => {
  await prisma.$transaction(async (tx) => {
    const [legacyPawnable, canonicalPwnable] = await Promise.all([
      tx.activityField.findUnique({ where: { code: "pawnable" } }),
      tx.activityField.findUnique({ where: { code: "pwnable" } }),
    ]);

    if (legacyPawnable && canonicalPwnable) {
      const legacyLinks = await tx.memberActivityField.findMany({
        where: { fieldId: legacyPawnable.id },
        select: { memberId: true },
      });

      if (legacyLinks.length > 0) {
        await tx.memberActivityField.createMany({
          data: legacyLinks.map((link) => ({
            memberId: link.memberId,
            fieldId: canonicalPwnable.id,
          })),
          skipDuplicates: true,
        });
      }

      await tx.memberActivityField.deleteMany({
        where: { fieldId: legacyPawnable.id },
      });
      await tx.activityField.delete({
        where: { id: legacyPawnable.id },
      });
    } else if (legacyPawnable && !canonicalPwnable) {
      await tx.activityField.update({
        where: { id: legacyPawnable.id },
        data: {
          code: "pwnable",
          label: "Pwnable",
          sortOrder: 20,
          isActive: true,
        },
      });
    }

    for (const field of DEFAULT_ACTIVITY_FIELDS) {
      await tx.activityField.upsert({
        where: { code: field.code },
        update: {
          label: field.label,
          sortOrder: field.sortOrder,
          isActive: true,
        },
        create: {
          code: field.code,
          label: field.label,
          sortOrder: field.sortOrder,
          isActive: true,
        },
      });
    }
  });
};

export async function GET() {
  await ensureDefaultActivityFields();

  const [members, fields] = await Promise.all([
    prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        fields: {
          orderBy: { assignedAt: "asc" },
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
      fields: member.fields
        .filter((entry) => entry.field.isActive)
        .map((entry) => ({
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
