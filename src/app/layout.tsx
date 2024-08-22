import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Analytics from "~/components/Analytics";
import "./globals.css";
import { cn } from "~/utils/cn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "恐怖氛围制造机 | 创造最沉浸的恐怖体验",
  description: "恐怖氛围制造机是一款全方位打造恐怖氛围的应用。利用先进的音效和灯光控制技术，随时随地带你进入恐怖的世界。适合恐怖故事、鬼屋、万圣节派对等场景。",
  keywords: "恐怖, 氛围制造, 恐怖音乐, 恐怖灯光, 恐怖故事, 鬼屋, 万圣节, 恐怖体验",
  authors: [{ url: "https://github.com/kirklin", name: "Kirk Lin" }],
  openGraph: {
    title: "恐怖氛围制造机 | 创造最沉浸的恐怖体验",
    description: "通过恐怖氛围制造机，创造最沉浸的恐怖体验。适合恐怖故事、鬼屋、万圣节派对等场景。",
    url: "https://cre8tor.tech/", // 替换为实际URL
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={cn(inter.className, "antialiased common-bg")}>
        <div id="app">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
