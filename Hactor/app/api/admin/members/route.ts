import { NextResponse } from "next/server";
import prisma from "@/lib/prisma-admin";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  normalizeMemberBadgeColor,
  type MemberBadgeColor,
} from "@/lib/member-badge-color";

export const runtime = "nodejs";

const toUniqueActivityFieldBadges = (
  fields: Array<{ fieldId: string; fieldColor: string }>,
) => {
  const unique = new Set<string>();
  const badges: Array<{ label: string; color: MemberBadgeColor }> = [];

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
      color: normalizeMemberBadgeColor(entry.fieldColor),
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

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (!auth.ok) {
    return auth.response;
  }

  const members = await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
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

  const payload = {
    members: members.map((member) => {
      const activityFieldBadges = toUniqueActivityFieldBadges(member.fields);
      return {
        id: member.id,
        discordId: member.discordId ? member.discordId.toString() : null,
        displayName: member.displayName,
        username: member.username,
        avatarUrl: member.avatarUrl,
        activityFields: toActivityFieldsText(activityFieldBadges),
        activityFieldBadges,
        discordJoinedAt: member.discordJoinedAt,
        isActive: member.isActive,
      };
    }),
  };

  return NextResponse.json(payload);
}
