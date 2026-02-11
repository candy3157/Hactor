export const memberTagTones = ["ruby", "ember", "frost", "moss", "slate"] as const;

export type MemberTag = {
  label: string;
  tone: (typeof memberTagTones)[number];
};

export type MemberProfile = {
  id: string;
  name: string;
  handle: string;
  tags: MemberTag[];
};

const activityFieldLabelByCode: Record<string, string> = {
  web: "\u{1F310}Web",
  pwnable: "\u{1F4A3}Pwnable",
  pawnable: "\u{1F4A3}Pwnable",
  reverse: "\u{1F50D}Reverse",
  forensic: "\u{1F4C1}Forensic",
  dev: "\u{1F9D1}\u200D\u{1F4BB}Dev",
};

const activityFieldLabelByLabel: Record<string, string> = {
  web: "\u{1F310}Web",
  pwnable: "\u{1F4A3}Pwnable",
  pawnable: "\u{1F4A3}Pwnable",
  reverse: "\u{1F50D}Reverse",
  forensic: "\u{1F4C1}Forensic",
  dev: "\u{1F9D1}\u200D\u{1F4BB}Dev",
};

export const memberTagToneFromField = (
  code: string,
  label: string,
): MemberTag["tone"] => {
  const source = `${code}:${label}`.trim().toLowerCase();
  if (!source) {
    return "slate";
  }

  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }

  return memberTagTones[hash % memberTagTones.length];
};

export const memberTagLabelFromField = (code: string, label: string): string => {
  const normalizedCode = code.trim().toLowerCase();
  if (normalizedCode && activityFieldLabelByCode[normalizedCode]) {
    return activityFieldLabelByCode[normalizedCode];
  }

  const normalizedLabel = label.trim().toLowerCase();
  if (normalizedLabel && activityFieldLabelByLabel[normalizedLabel]) {
    return activityFieldLabelByLabel[normalizedLabel];
  }

  return label;
};
