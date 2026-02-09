import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sfPro = localFont({
  src: [
    { path: "./fonts/SF-Pro.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SF-Pro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-sf",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#111111",
};

export const metadata: Metadata = {
  title: "HACTOR",
  description:
    "Dept. Information Security, at Deajeon University Club HACTOR Web site",

  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${sfPro.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
