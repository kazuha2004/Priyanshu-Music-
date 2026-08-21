import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soulstation — An Atmospheric Music Room",
  description:
    "An immersive internet radio experience. Sit down, pour a cup, and let the music fill the room.",
  keywords: ["indie music", "lo-fi", "internet radio", "atmospheric", "music player"],
  authors: [{ name: "Soulstation" }],
  openGraph: {
    title: "Soulstation — An Atmospheric Music Room",
    description:
      "An immersive internet radio experience. Sit down, pour a cup, and let the music fill the room.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soulstation",
    description: "An atmospheric digital music room.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a1612",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
