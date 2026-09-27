import Link from "next/link";
import { links } from "@/lib/links";
import { EXPORT_GUIDE_HREF } from "@/lib/match-intake";

/* Three columns: what the product is, the two ways in, and the company. The
   Programs column carries both lanes side by side so a visitor who scrolled
   past every CTA still meets the choice once more at the bottom. */
export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <img src="/assets/logos/logo.svg" alt="Advantage" />
            <p>Performance intelligence for competitive tennis. Built by former collegiate players.</p>
          </div>
          <nav className="foot-cols" aria-label="Footer">
            <div className="foot-col">
              <h5>Product</h5>
              <Link href="/#dashboard">Dashboard</Link>
              <Link href="/#film">Film room</Link>
              <Link href="/#shots">Shot map</Link>
              <Link href="/#how">How it works</Link>
              <Link href={EXPORT_GUIDE_HREF}>Export guide</Link>
            </div>
            <div className="foot-col">
              <h5>Programs</h5>
              <Link href="/pilot">Pilot</Link>
              <a href={links.signUp} target="_blank" rel="noopener noreferrer">
                Find Your Team
              </a>
              <a href={links.signUp} target="_blank" rel="noopener noreferrer">
                Join Free Beta
              </a>
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <a href={links.signIn} target="_blank" rel="noopener noreferrer">
                Sign in
              </a>
            </div>
          </nav>
        </div>
        <div className="foot-bottom">
          <span className="cp">© 2026 Advantage Analytics. All rights reserved.</span>
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
