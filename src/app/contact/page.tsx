import { ArrowUpRight } from "lucide-react";
import { PageFrame } from "@/components/perspective/page-frame";
import { ContactForm } from "./contact-form";
import "./contact.css";

export const metadata = {
  title: "Contact — Advantage",
  description: "Get in touch with the Advantage team.",
};

const EMAIL = "team@advantage-analytics.com";

// Concrete facts, read as a mono spec ledger — the site's native voice carried
// onto the dark card. Each one sets a real expectation, not an abstract label.
const LEDGER = [
  { label: "Based in", value: "Los Angeles, CA" },
  { label: "Response", value: "Within 2 business days" },
  { label: "Access", value: "By invitation" },
];

export default function Page() {
  return (
    <PageFrame>
      <section className="band contact-band">
        <div className="wrap">
          {/* The navy contact card: glow + grain over a deep gradient. Left
              column carries the narrative, the email as the primary direct line,
              and a mono spec ledger; the glass underline form sits on the right. */}
          <div className="contact-card reveal">
            <div className="contact-glow" aria-hidden="true" />
            <div className="contact-grain" aria-hidden="true" />
            <div className="contact-inner">
              <div className="contact-copy">
                <img
                  className="contact-logo"
                  src="/assets/logos/logo-white.svg"
                  alt="Advantage"
                />
                <span className="eyebrow">Contact</span>
                <h1>Let&rsquo;s talk.</h1>
                <p className="lede">
                  Performance intelligence for competitive tennis. Reach the team
                  directly. A person reads every message, and replies.
                </p>

                <a className="contact-email" href={`mailto:${EMAIL}`}>
                  <span className="ce-label">Email the team</span>
                  <span className="ce-value">
                    {EMAIL}
                    <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </a>

                <dl className="contact-ledger">
                  {LEDGER.map((f) => (
                    <div className="cl-row" key={f.label}>
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="contact-signoff">
                  Built by former collegiate players. Designed for competitive
                  advantage.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
