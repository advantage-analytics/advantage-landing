import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Every crawler is welcome, AI ones included (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended and the rest match "*"): being read and cited
// by AI answer engines is part of how players find Advantage. Only the form
// endpoints and the one-click unsubscribe link are kept out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/unsubscribe"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
