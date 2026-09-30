import type { ReactNode } from "react";
import { CONTACT_EMAIL, SITE_DOMAIN } from "@/lib/links";
import "./campaign.css";

/* The shell for pages a coach reaches from outside the site: /export-guide,
   linked from the dashboard uploader, and the /send-a-match notice that older
   cold emails still point at.

   Deliberately NOT a client component, unlike the site's PageFrame — both
   routes are static and export `metadata`, and there is no scroll-reveal
   observer to run because campaign pages don't animate on scroll.

   `className` carries the route hook (`sm-page`, `eg-page`) that the route's
   stylesheet keys its custom properties off. Dropping or misspelling it fails
   silently and visually only. */

export function CampaignFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`perspective-page campaign-page${className ? ` ${className}` : ""}`}
    >
      <header className="campaign-header">
        <div className="campaign-wrap">
          <img
            className="campaign-brand"
            src="/assets/logos/logo.svg"
            alt="Advantage"
            width={320}
            height={57}
          />
        </div>
      </header>

      <main className="campaign-main">
        <div className="campaign-wrap">{children}</div>
      </main>

      {/* Every link here opens a new tab on purpose. The legal pages render the
          full site frame, so a same-tab hop would drop a coach out of the page
          they came for onto a fully navigable site. */}
      <footer className="campaign-footer">
        <div className="campaign-wrap">
          <div className="campaign-foot-row">
            <img
              src="/assets/logos/logo.svg"
              alt="Advantage"
              width={320}
              height={57}
            />
            <div className="campaign-foot-meta">
              <a
                href={`https://${SITE_DOMAIN}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE_DOMAIN}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
            <div className="campaign-foot-legal">
              <a
                href="/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href="/legal/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Mirrors PageHead's shape so the two shells stay legible side by side.
   `children` renders after the lede. */
export function CampaignHead({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="campaign-head">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h1>{title}</h1>
      {lede ? <p className="campaign-lede">{lede}</p> : null}
      {children}
    </section>
  );
}
