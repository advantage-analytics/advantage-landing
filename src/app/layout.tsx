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

const LOCAL_ORIGIN = "http://localhost:3000";

// Resolving this at module scope means a bad value doesn't degrade the metadata,
// it throws before the layout renders and 500s every route on the site. `??`
// alone wasn't enough: it guards null/undefined, so an empty string or a
// scheme-less host (`advantage-analytics.com`) still reached new URL() and blew
// up. Prepend a scheme when one is missing, and fall back rather than throw.
function resolveMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return new URL(LOCAL_ORIGIN);
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    console.warn(
      `[layout] NEXT_PUBLIC_SITE_URL is not a usable URL; falling back to ${LOCAL_ORIGIN}.`,
    );
    return new URL(LOCAL_ORIGIN);
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title,
  description,
  // Favicon, home-screen icon and social images come from the app-dir file
  // conventions:
  //   src/app/icon.png            -> <link rel="icon">
  //   src/app/apple-icon.png      -> <link rel="apple-touch-icon">
  //   src/app/opengraph-image.jpg -> og:image (and the twitter card image)
  // Without the apple-icon, "Add to Home Screen" on iOS falls back to a
  // screenshot of the page instead of the logo: Safari ignores rel="icon"
  // there. The file is a 180x180 opaque square (iOS masks it into its own
  // squircle and renders transparency as black, so it can't be the rounded,
  // alpha-cornered favicon).
  //
  // `appleWebApp.title` is the label under that home-screen icon; without it
  // iOS uses the full <title>, which truncates to "Advantage — Perfo...".
  // `capable` is opt-out because Next defaults it to true for any appleWebApp
  // object, and Safari 17.4+ reads `mobile-web-app-capable` to launch the
  // bookmark chrome-less. This is a marketing site that hands off to the
  // dashboard app and mailto: links, so it should open as a normal Safari tab.
  appleWebApp: {
    capable: false,
    title: "Advantage",
  },
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
