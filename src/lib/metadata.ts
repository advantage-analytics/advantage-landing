import type { Metadata } from "next";
import siteCard from "../app/opengraph-image.jpg";

// A route's title and description, repeated for link previews. Next replaces
// `openGraph` and `twitter` whole rather than merging them, and neither reads
// the route's own title, so a route that sets only `title` and `description`
// is shared with the home page's text above its image.
//
// Replacing `openGraph` also drops the image the root layout's file convention
// supplied, so the site card is restated here. An image set here beats a
// route's own opengraph-image.jpg, so a route with its own card passes `ownCard`.
export function pageMetadata({
  title,
  description,
  path,
  ownCard = false,
  ...rest
}: { title: string; description: string; path: string; ownCard?: boolean } & Metadata): Metadata {
  return {
    title,
    description,
    // Resolved against metadataBase (the site origin), so every route names
    // one URL as its own whichever host or query string it was reached by.
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Advantage",
      locale: "en_US",
      type: "website",
      ...(ownCard
        ? {}
        : {
            images: [
              {
                url: siteCard.src,
                width: siteCard.width,
                height: siteCard.height,
                alt: "Advantage. Film your match. See how to win the next one.",
              },
            ],
          }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...rest,
  };
}
