import type { MemberProfile } from "@/app/data/members";
import { memberTagToneFromField } from "@/app/data/members";
import { memberTagLabelFromField } from "@/app/data/members";
import prisma from "@/lib/prisma";

export const getMarqueeMembers = async (): Promise<MemberProfile[]> => {
  const rows = await prisma.member.findMany({
    where: {
      isActive: true,
      username: { not: null },
    },
    orderBy: { displayName: "asc" },
    select: {
      id: true,
      displayName: true,
      username: true,
      fields: {
        orderBy: { assignedAt: "asc" },
        select: {
          field: {
            select: {
              code: true,
              label: true,
              isActive: true,
            },
          },
        },
      },
    },
  });

  return rows.map((member) => ({
    id: member.id,
    name: member.displayName,
    handle: member.username ?? "",
    tags: member.fields
      .filter((entry) => entry.field.isActive)
      .map((entry) => ({
        label: memberTagLabelFromField(entry.field.code, entry.field.label),
        tone: memberTagToneFromField(entry.field.code, entry.field.label),
      })),
  }));
};
