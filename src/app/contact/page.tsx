import { ArrowDown, ArrowUpRight, CloudUpload, Mail, MessageSquare } from "lucide-react";
import { PageFrame, PageHero } from "@/components/perspective/page-frame";
import { ProofHead } from "@/components/perspective/band-parts";
import { FreeMatchLink } from "@/components/perspective/cta-links";
import { WalkthroughCalendar } from "@/components/perspective/walkthrough-band";
import { pageMetadata } from "@/lib/metadata";
import { CAL_WALKTHROUGH_URL, CONTACT_EMAIL } from "@/lib/links";
import { FREE_MATCH_OFFER } from "@/lib/plans";
import { ContactForm } from "./contact-form";
import "./contact.css";

export const metadata = pageMetadata({
  title: "Talk to Advantage: Tennis Analytics for Players, Coaches and College Programs",
  description:
    "Book a 20-minute walkthrough for your college program, upload a free match, or send Advantage a message. A person reads every message.",
  path: "/contact",
});

/* /contact. The mesh masthead with the person behind it, then the two ways to
   reach that person as one matched pair of framed cards: the walkthrough
   calendar for college coaches, and the message form. Between them, the other
   ways in for everyone else. */
export default function Page() {
  return (
    <PageFrame
      hero={
        <PageHero
          eyebrow="Contact"
          title="Talk to us."
          sub="College programs: tell us your teams and season and we send a quote. Anyone else: a person reads every message."
          actions={
            <>
              <a className="hbtn hbtn-white" href="#book">
                Book a walkthrough
              </a>
              <a className="hbtn hbtn-glass" href="#write">
                Send a message
              </a>
            </>
          }
          foot={
            <span className="ct-byline">
              <img src="/assets/marketing/founder-avatar.jpg" alt="" width={40} height={40} />
              <span>
                <span className="who">Cj Gimena, founder</span>
                <br />
                Former Bakersfield College player · Former UCLA team manager
              </span>
            </span>
          }
        />
      }
    >
      <section className="band heads-centered" id="book">
        <div className="wrap">
          <ProofHead
            eyebrow="College coaches"
            title="Book a walkthrough."
            tail="20 minutes on Zoom."
            aside="We open the dashboard on a match like yours and talk through your season, your roster and the plan that fits. Bring a match video if you have one."
          />
          {/* Cal.com's own booker, themed to the site's palette, on the page
              with no frame of ours around it. */}
          <div className="ct-cal">
            <WalkthroughCalendar placement="contact" />
          </div>
          <p className="ct-under">
            Rather pick from a full page?{" "}
            <a href={CAL_WALKTHROUGH_URL} target="_blank" rel="noopener noreferrer">
              Open the booking page
            </a>
          </p>
        </div>
      </section>

      <section className="band alt heads-centered" id="ways">
        <div className="wrap">
          <ProofHead eyebrow="Other ways in" title="Not a college coach?" tail="Start here." />
          {/* Each column is one whole link; the action line alone carries the
              link's look, and its arrow points where it goes. */}
          <div className="sub-panel ct-ways reveal">
            <FreeMatchLink className="ct-way" placement="contact-ways" icon={false}>
              <CloudUpload size={22} strokeWidth={1.5} aria-hidden="true" />
              <h3>{FREE_MATCH_OFFER ? "Upload a free match" : "Upload a match"}</h3>
              <p>
                Players: no call needed.{FREE_MATCH_OFFER ? " Your first match is free," : ""} and you get an email when
                the breakdown is ready.
              </p>
              <span className="go">
                {FREE_MATCH_OFFER ? "Upload a free match" : "Sign up"}
                <ArrowUpRight className="out" size={15} strokeWidth={1.8} aria-hidden="true" />
              </span>
            </FreeMatchLink>
            <a className="ct-way" href="#write">
              <MessageSquare size={22} strokeWidth={1.5} aria-hidden="true" />
              <h3>Send a message</h3>
              <p>A quote to share with your athletic department, or any question. A person reads every message.</p>
              <span className="go">
                Write to us
                <ArrowDown className="down" size={15} strokeWidth={1.8} aria-hidden="true" />
              </span>
            </a>
            <a className="ct-way" href={`mailto:${CONTACT_EMAIL}`}>
              <Mail size={22} strokeWidth={1.5} aria-hidden="true" />
              <h3>Email the team</h3>
              <p className="mail">{CONTACT_EMAIL}</p>
              <span className="go">
                Open email
                <ArrowUpRight className="out" size={15} strokeWidth={1.8} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="band heads-centered" id="write">
        <div className="wrap">
          <ProofHead
            eyebrow="Write to us"
            title="Rather write?"
            tail="A person reads every message."
            aside="Ask for a quote to share with your athletic department, or ask anything else."
          />
          <ContactForm />
        </div>
      </section>
    </PageFrame>
  );
}
