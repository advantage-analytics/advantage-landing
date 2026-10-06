import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the dev server to be loaded from other devices on the LAN (e.g.
  // testing on a phone via http://<your-mac-ip>:3000). Without this, Next 16
  // treats LAN-IP access as a cross-origin dev request and the page never
  // hydrates: the nav menu is dead and the scroll-reveal sections below the
  // hero stay hidden. Update the IP if your machine's LAN address changes
  // (find it with `ipconfig getifaddr en0`). Production builds don't need this.
  allowedDevOrigins: ["192.168.1.208"],
  // The product tour's video and poster are large and change only with a new
  // cut, so they are cached: a day in the browser, a year at the CDN (which a
  // deploy purges). The names carry a version instead of a hash: bump TOUR in
  // product-tour.tsx and rename the files on a re-cut.
  async headers() {
    return [
      {
        source: "/assets/marketing/:file(product-tour-.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
