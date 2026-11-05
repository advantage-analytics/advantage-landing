import "./globals.css";
import "./perspective.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";
import { organizationLd, websiteLd } from "@/lib/structured-data";

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

// Plain-language and search-shaped: a cold visitor (or a search result) should
// know what this is from the title alone. No other product is named here.
const title = "Advantage — Tennis Analytics and Match Analysis From Your Phone or Any Camera";
const description =
  "Upload a video of your match from your phone or any camera. Advantage is the tennis coaching app that turns the video into match analysis: where you won points, where you lost them, and what to work on next. Tennis analytics for players and coaches.";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  // Each route states its own canonical through pageMetadata(); this one is
  // the home page's, which can't export metadata (it is a client component).
  alternates: { canonical: "/" },
  title,
  description,
  // Favicon, home-screen icon and social images come from the app-dir file
  // conventions:
  //   src/app/icon.png            -> <link rel="icon">
  //   src/app/apple-icon.png      -> <link rel="apple-touch-icon">
  //   src/app/opengraph-image.jpg -> og:image (and the twitter card image)
  // That image is the site-wide card; /pilot, /export-guide, /recording-guide,
  // /tennis-analytics, /mcp and /about override it with their own
  // opengraph-image.jpg. An older card (the wordmark on black) is kept in
  // assets/link-previews/, outside src/app and public/ so it is neither picked
  // up as metadata nor served.
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
        {/* Who publishes the site, on every page: what search engines and AI
            answer engines read to tie the pages to one company. */}
        <JsonLd data={[organizationLd(), websiteLd()]} />
        {children}
        {/* Vercel Web Analytics. Until this landed the funnel was unmeasurable:
            lib/analytics.ts hands every event to whatever tag is on the page,
            and no tag was — so a coach reaching a form and a coach
            completing it looked identical from here, which is how a silently
            dropped submission stayed invisible. Cookieless and
            no-op outside production, so it costs nothing in dev. */}
        <Analytics />
      </body>
    </html>
  );
}
