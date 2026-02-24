export const MEMBER_BADGE_COLORS = [
  "red",
  "blue",
  "green",
  "purple",
  "orange",
  "gray",
] as const;

export type MemberBadgeColor = (typeof MEMBER_BADGE_COLORS)[number];

export const DEFAULT_MEMBER_BADGE_COLOR: MemberBadgeColor = "blue";

export const MEMBER_BADGE_COLOR_SHORT_LABEL: Record<MemberBadgeColor, string> = {
  red: "R",
  blue: "B",
  green: "G",
  purple: "P",
  orange: "O",
  gray: "GY",
};

export const MEMBER_BADGE_COLOR_LABEL_KO: Record<MemberBadgeColor, string> = {
  red: "빨강",
  blue: "파랑",
  green: "초록",
  purple: "보라",
  orange: "주황",
  gray: "회색",
};

export const normalizeMemberBadgeColor = (
  value: string | null | undefined,
): MemberBadgeColor => {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized &&
    MEMBER_BADGE_COLORS.includes(normalized as MemberBadgeColor)
  ) {
    return normalized as MemberBadgeColor;
  }
  return DEFAULT_MEMBER_BADGE_COLOR;
};
