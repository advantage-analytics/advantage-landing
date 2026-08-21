import Link from "next/link";
import { links } from "@/lib/links";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <img src="/assets/logos/logo.svg" alt="Advantage" />
            <p>Performance intelligence for competitive tennis. Built by former collegiate players.</p>
          </div>
          <nav className="foot-cols">
            <div className="foot-col">
              <h5>Product</h5>
              <Link href="/#dashboard">Dashboard</Link>
              <Link href="/#how">How it works</Link>
              <Link href="/#features">Features</Link>
              <Link href="/pilot">The fall pilot</Link>
              <Link href="/#access">Join the pilot</Link>
              <a href={links.signUp} target="_blank" rel="noopener noreferrer">
                Create a free account
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
          </span>
        </div>
      </div>
    </footer>
  );
}
