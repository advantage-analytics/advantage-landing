import type { MetadataRoute } from "next";
import { INDEXED_PATHS, absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXED_PATHS.map((path) => ({ url: absoluteUrl(path) }));
}
