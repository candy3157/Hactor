export type MemberBadgeColor =
  | "red"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "gray";

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
