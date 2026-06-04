"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { links } from "@/lib/links";

/* ===========================================================
   Site nav — a sticky header for the whole page.

   It floats transparent over the dark mesh hero at the very top
   (white logo + links), then solidifies into a frosted bar the
   moment you scroll. That solid background is the point: the hero
   headline scrolls UP behind it and is covered cleanly, instead of
   colliding with the nav text the way a transparent bar would.

   Driven by scrollY alone (transparent only within the first few
   pixels), so there's no dependency on the hero's height settling —
   the race that used to flash the bar solid on first paint.
   =========================================================== */

const NAV_LINKS = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#access", label: "Pricing" },
];

export function SiteNav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <nav className={`site-nav${solid ? " is-solid" : ""}`} aria-label="Primary">
      <a className="site-nav-brand" href="#top" aria-label="Advantage — Home">
        <img className="site-logo site-logo-white" src="/assets/logos/logo-white.svg" alt="Advantage" />
        <img className="site-logo site-logo-dark" src="/assets/logos/logo.svg" alt="" aria-hidden="true" />
      </a>
      <div className="site-nav-center">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="site-nav-actions">
        <a className="site-signin" href={links.signIn}>
          Sign in
        </a>
        <a className="site-cta" href="#access">
          Get started
          <ArrowUpRight size={15} />
        </a>
      </div>
    </nav>
  );
}
