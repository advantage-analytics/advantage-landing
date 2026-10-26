import Link from "next/link";
import type { ReactNode } from "react";
import { CONTACT_EMAIL, SITE_DOMAIN, links } from "@/lib/links";
import "./docs.css";

/* The shell for the site's reference pages (/mcp, /export-guide): a wordmark
   header with one way into the product, a 1200px content wrap, and a footer
   that matches the site footer's legal row. Pages are mid-task documents, so
   there is no site nav; the wordmark is the way home.

   `className` is the route hook (`mcp-page`, `eg-page`) the route's own
   stylesheet keys off. The frame writes only `.docs` and `.docs-*`; a route
   writes its own prefix and reads the site tokens from perspective.css.
   Prose inside the wrap is the route's to cap (about 640px reads well). */

export function DocsFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`docs${className ? ` ${className}` : ""}`}>
      <header className="docs-header">
        <div className="docs-wrap docs-header-row">
          <Link href="/" aria-label="Advantage home">
            <img
              className="docs-brand"
              src="/assets/logos/logo.svg"
              alt=""
              width={320}
              height={57}
            />
          </Link>
          <a className="docs-header-link" href={links.signIn}>
            Open Advantage
          </a>
        </div>
      </header>

      <main className="docs-wrap docs-main">{children}</main>

      <footer className="docs-footer">
        <div className="docs-wrap">
          <div className="docs-footer-top">
            <img
              src="/assets/logos/logo.svg"
              alt="Advantage"
              width={320}
              height={57}
            />
            <div className="docs-footer-links">
              <a href={`https://${SITE_DOMAIN}`}>{SITE_DOMAIN}</a>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
          </div>
          {/* The site footer's legal row (components/perspective/footer.tsx),
              word for word. */}
          <div className="docs-footer-bottom">
            <span>© 2026 Advantage Analytics. All rights reserved.</span>
            <div className="docs-footer-links">
              <Link href="/legal/privacy-policy">Privacy Policy</Link>
              <Link href="/legal/terms-and-conditions">
                Terms &amp; Conditions
              </Link>
              <Link href="/legal/guardian-terms">Guardian Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
