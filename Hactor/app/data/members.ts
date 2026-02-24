import type { MemberBadgeColor } from "@/lib/member-badge-color";

export type MemberFieldBadge = {
  label: string;
  color: MemberBadgeColor;
};

export type MemberProfile = {
  id: string;
  name: string;
  handle: string;
  activityFields: string | null;
  activityFieldBadges: MemberFieldBadge[];
};
