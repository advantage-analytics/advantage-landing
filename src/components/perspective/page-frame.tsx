"use client";

import type { ReactNode } from "react";
import { SiteNav } from "./site-nav";
import { Footer } from "./footer";
import { useReveal } from "./reveal";
import "./subpage.css";

/* PageFrame — the standalone-route shell. It reproduces the home page's outer
   structure (.perspective-page → SiteNav → main → Footer) and runs the same
   reveal-on-scroll observer over the page's `.reveal` elements. About, Contact,
   and the legal pages all render their content as children.

   Pass `hero` for a route that carries its own dark masthead (/pilot): the
   nav then keeps its transparent-over-hero skin, and <main> drops the top
   padding that exists only to clear a solid bar. Without it — the default —
   the bar is solid from first paint and <main> is inset below it. */
export function PageFrame({
  children,
  hero,
}: {
  children: ReactNode;
  hero?: ReactNode;
}) {
  useReveal();
  return (
    <div className="perspective-page">
      <SiteNav subpage={!hero} />
      {hero}
      <main className={hero ? undefined : "subpage-main"}>{children}</main>
      <Footer />
    </div>
  );
}

/* PageHead — the shared masthead. `eyebrow` and `lede` are optional; `meta`
   carries the mono version/updated line the legal pages use. Wrapped in a
   `.reveal` so it fades in with the same motion as everything below it. */
export function PageHead({
  eyebrow,
  title,
  lede,
  meta,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <section>
      <div className="wrap">
        <div className="page-head reveal">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h1>{title}</h1>
          {lede ? <p className="lede">{lede}</p> : null}
          {meta ? <p className="page-meta">{meta}</p> : null}
        </div>
      </div>
    </section>
  );
}
