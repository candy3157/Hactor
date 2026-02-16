import localFont from "next/font/local";
import BrutalistActivitiesSection from "./components/main/activities/BrutalistActivitiesSection";
import HomeAboutSection from "./components/main/home/HomeAboutSection";
import HomeFooter from "./components/main/home/HomeFooter";
import HomeHeroSection from "./components/main/home/HomeHeroSection";
import HomeMembersSection from "./components/main/home/HomeMembersSection";
import HomeShell from "./components/main/home/HomeShell";
import SectionDivider from "./components/main/home/SectionDivider";
import {
  getHomeActivityHistory,
  type HomeActivityHistory,
} from "@/lib/home-activities";
import { getMarqueeMembers } from "@/lib/member-marquee";

const display = localFont({
  src: [
    { path: "./fonts/SF-Pro.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SF-Pro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "./fonts/SF-Pro.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SF-Pro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});

const DISCORD_INVITE_URL = "https://discord.gg/hactor";

export const runtime = "nodejs";
export const revalidate = 60;

export default async function Home() {
  let activityHistory: HomeActivityHistory = {
    years: [],
    totalCount: 0,
    yearCount: 0,
  };
  let members: Awaited<ReturnType<typeof getMarqueeMembers>> = [];

  const [membersResult, historyResult] = await Promise.allSettled([
    getMarqueeMembers(),
    getHomeActivityHistory(),
  ]);

  if (membersResult.status === "fulfilled") {
    members = membersResult.value;
  } else {
    console.error("Failed to load marquee members from DB:", membersResult.reason);
  }

  if (historyResult.status === "fulfilled") {
    activityHistory = historyResult.value;
  } else {
    console.error(
      "Failed to load activities history from DB:",
      historyResult.reason,
    );
  }

  return (
    <HomeShell fontClassName={`${display.variable} ${body.variable}`}>
      <HomeHeroSection />
      <SectionDivider />
      <HomeAboutSection />
      <SectionDivider />
      <HomeMembersSection members={members} />
      <SectionDivider />
      <BrutalistActivitiesSection history={activityHistory} />
      <SectionDivider />
      <HomeFooter discordInviteUrl={DISCORD_INVITE_URL} />
    </HomeShell>
  );
}
