"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
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

   Below 820px the center links and inline actions give way to a
   single menu button that drops a frosted sheet with the full nav —
   section links plus Sign in / Get started — so a phone or small
   tablet keeps every destination the desktop bar offers.
   =========================================================== */

const NAV_LINKS = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#access", label: "Pricing" },
];

export function SiteNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setSolid(window.scrollY > 8);
      // Any scroll dismisses the sheet — including the smooth-scroll a link tap
      // triggers — so it never lingers over the content as you move down.
      setOpen(false);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // While open: Esc closes; crossing back above the breakpoint discards the
  // open state so the sheet can't stay "open" once the inline nav returns.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 820) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // The bar wears its solid (frosted) skin whenever it's scrolled OR the sheet
  // is open, so the dropped sheet reads against an opaque header, never the
  // transparent-over-hero state.
  const showSolid = solid || open;

  return (
    <nav
      className={`site-nav${showSolid ? " is-solid" : ""}${open ? " is-open" : ""}`}
      aria-label="Primary"
    >
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

      {/* Compact-only menu trigger (shown ≤820px via CSS). */}
      <button
        type="button"
        className="site-nav-toggle"
        aria-expanded={open}
        aria-controls="site-nav-sheet"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Drop-down sheet. Kept mounted for the grid-rows reveal; `inert` pulls
          it out of the tab order and a11y tree while collapsed so the clipped
          links aren't reachable. */}
      <div className="site-nav-sheet" id="site-nav-sheet" inert={!open}>
        <div className="site-nav-sheet-inner">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="site-nav-sheet-div" aria-hidden="true" />
          <div className="site-nav-sheet-actions">
            <a className="site-signin" href={links.signIn}>
              Sign in
            </a>
            <a className="site-cta" href="#access" onClick={() => setOpen(false)}>
              Get started
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
