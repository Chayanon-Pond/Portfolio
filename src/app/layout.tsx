import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://chayanon-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Chayanon Pond — Full-Stack Developer",
  description:
    "Full-Stack Developer building mission-critical, long-lived systems — Go, Vue, Next.js. Enterprise WMS/OMS, IoT, and web platforms.",
  keywords: [
    "Full-Stack Developer",
    "Go",
    "Golang",
    "Vue",
    "Next.js",
    "TypeScript",
    "WMS",
    "OMS",
    "Chayanon Pond",
  ],
  authors: [{ name: "Chayanon Pond" }],
  openGraph: {
    title: "Chayanon Pond — Full-Stack Developer",
    description:
      "Building mission-critical, long-lived systems — Go, Vue, Next.js.",
    url: SITE_URL,
    siteName: "Chayanon Pond",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chayanon Pond — Full-Stack Developer",
    description:
      "Building mission-critical, long-lived systems — Go, Vue, Next.js.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} antialiased`}
    >
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
