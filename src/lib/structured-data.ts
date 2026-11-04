import { CONTACT_EMAIL } from "./links";
import { absoluteUrl } from "./site";

// schema.org objects for the JSON-LD on each page. Every fact here is one the
// visible pages already state; structured data that says more than the page
// does is the kind search engines ignore or penalise.

const ORG_ID = absoluteUrl("/#organization");

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Advantage",
    legalName: "Advantage Analytics",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/apple-icon.png"),
    email: CONTACT_EMAIL,
    description:
      "Tennis analytics from match video. Players and coaches upload a video of a match and see where points were won and lost, and what to work on.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Advantage",
    url: absoluteUrl("/"),
    publisher: { "@id": ORG_ID },
  };
}

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Advantage",
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    url: absoluteUrl("/"),
    description:
      "Upload a video of your tennis match from your phone or any camera. Advantage turns it into match analysis: where you won points, where you lost them, and what to work on next.",
    // Free through the beta; the price is the visible pages' "free" and
    // nothing more.
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORG_ID },
  };
}

export function faqPageLd(items: readonly { q: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.text },
    })),
  };
}

export function articleLd({ path, headline, description, dateModified }: {
  path: string;
  headline: string;
  description: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    dateModified,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}
