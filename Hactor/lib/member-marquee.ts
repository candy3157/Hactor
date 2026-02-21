import type { MemberProfile } from "@/app/data/members";
import { memberTagToneFromField } from "@/app/data/members";
import { memberTagLabelFromField } from "@/app/data/members";
import prisma from "@/lib/prisma";

const parseActivityFields = (value: string | null): string[] => {
  if (!value) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .split(/[,\n]/)
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0),
    ),
  );
};

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
      activityFields: true,
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

  return rows.map((member) => {
    const parsedFields = parseActivityFields(member.activityFields);
    const tags =
      parsedFields.length > 0
        ? parsedFields.map((fieldLabel) => ({
            label: memberTagLabelFromField(fieldLabel, fieldLabel),
            tone: memberTagToneFromField(fieldLabel, fieldLabel),
          }))
        : member.fields
            .filter((entry) => entry.field.isActive)
            .map((entry) => ({
              label: memberTagLabelFromField(entry.field.code, entry.field.label),
              tone: memberTagToneFromField(entry.field.code, entry.field.label),
            }));
    const activityFieldsText = member.activityFields?.trim() || null;

    return {
      id: member.id,
      name: member.displayName,
      handle: member.username ?? "",
      tags,
      activityFields: activityFieldsText,
    };
  });
};
