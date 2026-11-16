import { ArrowUpRight } from "lucide-react";
import { PageFrame } from "@/components/perspective/page-frame";
import { ContactForms } from "./contact-form";
import { pageMetadata } from "@/lib/metadata";
import "./contact.css";
import { LiveDots } from "@/components/perspective/live-dots";
import { BookCallLink } from "@/components/perspective/walkthrough-band";

export const metadata = pageMetadata({
  title: "Talk to Advantage: Tennis Analytics for Players, Coaches and College Programs",
  description:
    "Ask for a quote for your college program, book a walkthrough, or send the Advantage team a message.",
  path: "/contact",
});

const EMAIL = "team@advantage-analytics.com";

export default function Page() {
  return (
    <PageFrame>
      <section className="band contact-band">
        <div className="wrap">
          {/* The navy contact card: glow + grain over a deep gradient. Left
              column holds the headline and the email as the primary direct
              line; the glass underline form sits on the right. */}
          <div className="contact-card reveal">
            <div className="contact-glow" aria-hidden="true" />
            <LiveDots className="contact-grain" energy={1} />
            <div className="contact-inner">
              <div className="contact-copy">
                <h1>Talk to us.</h1>
                <p className="lede">
                  College programs: tell us your teams and season and we send
                  a quote. Anyone else: a person reads every message.
                </p>

                <a className="contact-email" href={`mailto:${EMAIL}`}>
                  <span className="ce-label">Email the team</span>
                  <span className="ce-value">
                    {EMAIL}
                    <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </a>

                <BookCallLink />

                <p className="contact-signoff">
                  Built by former collegiate players in Los Angeles.
                </p>
              </div>

              <ContactForms />
            </div>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
