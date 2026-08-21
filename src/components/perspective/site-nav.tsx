"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
   section links and the company pages, plus Sign in / Join the pilot —
   so a phone or small tablet keeps every destination the desktop bar
   offers.
   =========================================================== */

// `page: true` is a real route (Pilot, About) that gets a current-page marker;
// the rest are section anchors, resolved against LOCAL_ANCHORS below.
const NAV_LINKS = [
  { href: "#dashboard", label: "Dashboard" },
  { href: "#features", label: "Features" },
  { href: "/pilot", label: "Pilot", page: true },
  { href: "/about", label: "About", page: true },
];

// Section anchors that resolve in place on a route OTHER than the home page.
// The home page needs no entry — it renders every section the nav links to, by
// definition. This is a table of exceptions: /pilot carries its own copy of the
// access form, so its CTA must scroll rather than bounce the visitor home.
const LOCAL_ANCHORS: Record<string, readonly string[]> = {
  "/pilot": ["#access"],
};

/* `subpage` says only one thing: there is no dark hero behind the bar, so it
   wears its solid (frosted, dark-logo) skin from the first paint instead of
   fading in on scroll. About, Contact and the legal pages pass it; /pilot does
   not, because it has a mesh hero of its own.

   Where the links point is a separate question, and it is answered by the route
   rather than by a prop: off the home page every section anchor is prefixed
   with "/" so a tap navigates home and then scrolls, instead of hunting for a
   #section that doesn't exist here, and the brand mark goes home rather than to
   the top of the current page. Deriving both from `pathname` is what lets
   /pilot have a transparent bar AND correctly-rebased anchors — the two used to
   be welded together under `subpage`. */
export function SiteNav({ subpage = false }: { subpage?: boolean } = {}) {
  const [solid, setSolid] = useState(subpage);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const homeHref = isHome ? "#top" : "/";
  // An anchor the current route actually renders scrolls in place; anything
  // else navigates home first. /pilot renders its own access card, so its CTA
  // must not bounce the visitor to the home page's copy of the same form.
  const anchor = (hash: string) =>
    isHome || LOCAL_ANCHORS[pathname]?.includes(hash) ? hash : `/${hash}`;

  // A page link resolves to its own route; a section anchor is rebased per
  // route. `aria-current` marks the link for the page you're on.
  const resolve = (l: (typeof NAV_LINKS)[number]) => ({
    href: l.page ? l.href : anchor(l.href),
    current: l.page && pathname === l.href ? ("page" as const) : undefined,
  });

  useEffect(() => {
    const update = () => {
      // A subpage stays solid regardless of scroll position; the home bar only
      // turns solid once it has left the very top of the hero.
      setSolid(subpage || window.scrollY > 8);
      // Any scroll dismisses the sheet — including the smooth-scroll a link tap
      // triggers — so it never lingers over the content as you move down.
      setOpen(false);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [subpage]);

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
      className={`site-nav${showSolid ? " is-solid" : ""}${open ? " is-open" : ""}${subpage ? " is-subpage" : ""}`}
      aria-label="Primary"
    >
      <a className="site-nav-brand" href={homeHref} aria-label="Advantage — Home">
        <img className="site-logo site-logo-white" src="/assets/logos/logo-white.svg" alt="Advantage" />
        <img className="site-logo site-logo-dark" src="/assets/logos/logo.svg" alt="" aria-hidden="true" />
      </a>
      <div className="site-nav-center">
        {NAV_LINKS.map((l) => {
          const { href, current } = resolve(l);
          // A route gets <Link> so it navigates client-side; a hash anchor
          // gets a plain <a> so the browser handles the in-page scroll.
          return l.page ? (
            <Link key={l.href} href={href} aria-current={current}>
              {l.label}
            </Link>
          ) : (
            <a key={l.href} href={href} aria-current={current}>
              {l.label}
            </a>
          );
        })}
      </div>
      <div className="site-nav-actions">
        <a
          className="site-signin"
          href={links.signIn}
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign in
        </a>
        <a className="site-cta" href={anchor("#access")}>
          Join the pilot
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
          {NAV_LINKS.map((l) => {
            const { href, current } = resolve(l);
            return l.page ? (
              <Link
                key={l.href}
                href={href}
                aria-current={current}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={href}
                aria-current={current}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            );
          })}
          <div className="site-nav-sheet-div" aria-hidden="true" />
          <div className="site-nav-sheet-actions">
            <a
              className="site-signin"
              href={links.signIn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign in
            </a>
            <a className="site-cta" href={anchor("#access")} onClick={() => setOpen(false)}>
              Join the pilot
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
