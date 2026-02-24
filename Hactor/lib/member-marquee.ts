import type { MemberProfile } from "@/app/data/members";
import type { MemberBadgeColor } from "@/app/data/members";
import prisma from "@/lib/prisma-public";

const normalizeFieldIds = (fieldIds: string[]) =>
  Array.from(
    new Set(
      fieldIds
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0),
    ),
  );

const toBadgeColor = (value: string): MemberBadgeColor => {
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "red" ||
    normalized === "green" ||
    normalized === "purple" ||
    normalized === "orange" ||
    normalized === "gray"
  ) {
    return normalized;
  }
  return "blue";
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
      fields: {
        orderBy: { assignedAt: "asc" },
        select: {
          fieldId: true,
          fieldColor: true,
        },
      },
    },
  });

  return rows.map((member) => {
    const normalizedFieldIds = normalizeFieldIds(
      member.fields.map((entry) => entry.fieldId),
    );
    const activityFieldBadges = normalizedFieldIds.map((fieldId) => {
      const source = member.fields.find(
        (entry) => entry.fieldId.trim().toLowerCase() === fieldId.toLowerCase(),
      );
      return {
        label: fieldId,
        color: toBadgeColor(source?.fieldColor ?? "blue"),
      };
    });

    return {
      id: member.id,
      name: member.displayName,
      handle: member.username ?? "",
      activityFields:
        normalizedFieldIds.length > 0 ? normalizedFieldIds.join(", ") : null,
      activityFieldBadges,
    };
  });
};
