"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { links } from "@/lib/links";

/* ===========================================================
   Site nav — a single fixed header that lives for the whole page.

   Two states, cross-faded:
   • At the top it's transparent with the white logo, floating over
     the dark mesh hero (the original overlay look).
   • Once the hero has scrolled past, it goes "solid": a frosted-glass
     bar with a hairline, a soft shadow, and the dark logo + ink text
     so it stays legible over the light content below.

   The flip is driven by the hero's own height, so the bar is only ever
   transparent while it sits over the dark mesh — never white-on-white.
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
    const hero = document.querySelector<HTMLElement>(".heroC-stage");
    let raf = 0;

    const update = () => {
      raf = 0;
      // Solidify just before the hero fully clears the bar (its solid
      // height ≈ 64px), so the swap lands exactly as light content meets it.
      const trigger = hero ? hero.offsetHeight - 64 : 64;
      setSolid(window.scrollY > trigger);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
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
