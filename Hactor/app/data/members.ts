export type MemberTag = {
  label: string;
  tone: "ruby" | "ember" | "frost" | "moss" | "slate";
};

export type MemberProfile = {
  name: string;
  handle: string;
  tags: MemberTag[];
};

export const members: MemberProfile[] = [
  {
    name: "Michel",
    handle: "michel",
    tags: [
      { label: "Web", tone: "frost" },
      { label: "Forensics", tone: "moss" },
    ],
  },
  {
    name: "Ox1de",
    handle: "ox1de",
    tags: [
      { label: "Crypto", tone: "ember" },
      { label: "Pwn", tone: "ruby" },
    ],
  },
  {
    name: "lime",
    handle: "lime",
    tags: [],
  },
  {
    name: "wo0k",
    handle: "wo0k",
    tags: [
      { label: "Pwn", tone: "ruby" },
      { label: "Crypto", tone: "ember" },
    ],
  },
  {
    name: "ovic",
    handle: "ovic",
    tags: [
      { label: "Web", tone: "frost" },
      { label: "Dev", tone: "slate" },
    ],
  },
  {
    name: "ar0",
    handle: "ar0",
    tags: [
      { label: "Reversing", tone: "moss" },
      { label: "Forensics", tone: "frost" },
    ],
  },
];
