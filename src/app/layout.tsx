import "./globals.css";
import "./perspective.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const title = "Advantage — Performance Intelligence for Competitive Tennis";
const description =
  "Centralize your Swingvision and ELC match data into pro-grade scouting reports, multi-match trends, and opponent intelligence. Built for the competitive player.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title,
  description,
  // Favicon and social images come from the app-dir file conventions:
  //   src/app/icon.png            -> <link rel="icon">
  //   src/app/opengraph-image.jpg -> og:image (and the twitter card image)
  openGraph: {
    title,
    description,
    siteName: "Advantage",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
