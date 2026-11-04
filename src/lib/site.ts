// The site's public origin, read once from NEXT_PUBLIC_SITE_URL. The root
// layout's metadataBase, the sitemap, robots.txt, llms.txt and the JSON-LD
// all resolve absolute URLs against it, so they always name the same host.
//
// Resolving this at module scope means a bad value doesn't degrade the metadata,
// it throws before the layout renders and 500s every route on the site. `??`
// alone wasn't enough: it guards null/undefined, so an empty string or a
// scheme-less host (`advantage-analytics.com`) still reached new URL() and blew
// up. Prepend a scheme when one is missing, and fall back rather than throw.
const LOCAL_ORIGIN = "http://localhost:3000";

function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return new URL(LOCAL_ORIGIN);
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    console.warn(`[site] NEXT_PUBLIC_SITE_URL is not a usable URL; falling back to ${LOCAL_ORIGIN}.`);
    return new URL(LOCAL_ORIGIN);
  }
}

export const SITE_URL = resolveSiteUrl();

/** An absolute URL on this site for a path like "/pilot". */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

// The pages search engines should index, in the order the sitemap lists them.
// /send-a-match is left out on purpose: it is noindex, kept only for links in
// emails already sent.
export const INDEXED_PATHS = [
  "/",
  "/tennis-analytics",
  "/pilot",
  "/recording-guide",
  "/export-guide",
  "/mcp",
  "/about",
  "/contact",
  "/legal/privacy-policy",
  "/legal/terms-and-conditions",
  "/legal/guardian-terms",
] as const;
