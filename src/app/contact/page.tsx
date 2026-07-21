import { ArrowUpRight } from "lucide-react";
import { PageFrame } from "@/components/perspective/page-frame";
import { ContactForm } from "./contact-form";
import "./contact.css";

export const metadata = {
  title: "Contact — Advantage",
  description: "Get in touch with the Advantage team.",
};

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
            <div className="contact-grain" aria-hidden="true" />
            <div className="contact-inner">
              <div className="contact-copy">
                <h1>Let&rsquo;s talk.</h1>
                <p className="lede">
                  A person reads every message and replies within two business
                  days.
                </p>

                <a className="contact-email" href={`mailto:${EMAIL}`}>
                  <span className="ce-label">Email the team</span>
                  <span className="ce-value">
                    {EMAIL}
                    <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </a>

                <p className="contact-signoff">
                  Built by former collegiate players in Los Angeles.
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
