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
    name: "tngh(김수호)",
    handle: "tngh",
    tags: [],
  },
  {
    name: "BANGTO(정진환)",
    handle: "BANGTO",
    tags: [],
  },
  {
    name: "chunhyang._.2(김준형)",
    handle: "chunhyang._.2",
    tags: [],
  },
  {
    name: "FINALEON(이희찬)",
    handle: "FINALEON",
    tags: [],
  },
  {
    name: "BLINK(박현수)",
    handle: "BLINK",
    tags: [],
  },
  {
    name: "S4lmon(전상혁)",
    handle: "S4lmon",
    tags: [],
  },
  {
    name: "hs._.4_9(장현성)",
    handle: "hs._.4_9",
    tags: [],
  },
  {
    name: "Gobi(조양희)",
    handle: "Gobi",
    tags: [],
  },
  {
    name: "HunSec(정성훈)",
    handle: "HunSec",
    tags: [{ label: "왕", tone: "ember" }],
  },
  {
    name: "N0N4ME7(심재원)",
    handle: "N0N4ME7",
    tags: [],
  },
  {
    name: "Boheme(송준혁)",
    handle: "b0h3m3",
    tags: [],
  },
  {
    name: "tjrgus(조석현)",
    handle: "tjrgus",
    tags: [],
  },
  {
    name: "JaeJae(명재영)",
    handle: "JaeJae",
    tags: [],
  },
  {
    name: "candy3157(곽재혁)",
    handle: "candy3157",
    tags: [{ label: "Dev", tone: "frost" }],
  },
];
