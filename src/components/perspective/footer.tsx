import Link from "next/link";
import { CONTACT_EMAIL, links } from "@/lib/links";
import { FreeMatchLink } from "./cta-links";
import { EXPORT_GUIDE_HREF, RECORDING_GUIDE_HREF } from "@/lib/match-video";

/* Four short columns, each one kind of link:
   - Product: the home page's sections, in the order the page shows them.
   - Guides: the reference pages.
   - Get started: the two ways in and the prices, so a visitor who scrolled
     past every button meets the choice once more.
   - Company: who we are, a direct email, and sign-in for people who already
     have an account.
   Every destination appears once. The column titles are h2s (styled small)
   so the footer continues the page's heading outline instead of jumping to h5. */
const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logos/logo.svg" alt="Advantage" />
            <p>Performance intelligence for competitive tennis. Built by a former collegiate player.</p>
          </div>
          <nav className="foot-cols" aria-label="Footer">
            <div className="foot-col">
              <h2 className="foot-h">Product</h2>
              <Link href="/#how">How it works</Link>
              <Link href="/#tour">Product tour</Link>
              <Link href="/#team">Team workspace</Link>
              <Link href="/#verified">Verified by Advantage</Link>
              <Link href="/#ai">AI connector</Link>
              <Link href="/#faq">FAQ</Link>
            </div>
            <div className="foot-col">
              <h2 className="foot-h">Guides</h2>
              <Link href="/guides">All guides</Link>
              <Link href="/tennis-analytics">Tennis analytics</Link>
              <Link href={RECORDING_GUIDE_HREF}>Recording guide</Link>
              <Link href={EXPORT_GUIDE_HREF}>Export guide</Link>
              <Link href="/mcp">Use with AI apps</Link>
            </div>
            <div className="foot-col">
              <h2 className="foot-h">Get started</h2>
              <FreeMatchLink placement="footer" icon={false} />
              <Link href="/pricing">Pricing</Link>
              <Link href="/contact">Talk to us</Link>
            </div>
            <div className="foot-col">
              <h2 className="foot-h">Company</h2>
              <Link href="/about">About</Link>
              <a href={`mailto:${CONTACT_EMAIL}`}>Email us</a>
              <a href={links.signIn} target="_blank" rel="noopener noreferrer">
                Sign in
              </a>
            </div>
          </nav>
        </div>
        <div className="foot-bottom">
          <span className="cp">© {YEAR} Advantage Analytics. All rights reserved.</span>
          <span className="foot-legal">
            <Link href="/legal/privacy-policy">Privacy Policy</Link>
            <Link href="/legal/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link href="/legal/guardian-terms">Guardian Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
