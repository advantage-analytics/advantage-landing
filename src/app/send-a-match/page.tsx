import { CampaignFrame } from "@/components/campaign/campaign-frame";
import { CONTACT_EMAIL } from "@/lib/links";
import {
  EXPORT_GUIDE_HREF,
  VIDEO_FORMATS,
  VIDEO_MAX_SIZE,
  VIDEO_MIN_FPS,
  VIDEO_MIN_RESOLUTION,
} from "@/lib/match-video";
import { PILOT_TERMS } from "@/lib/pilot";
import "./send-a-match.css";

export const metadata = {
  title: "Match uploads have moved — Advantage",
  description:
    "We no longer take matches through this page. Programs upload match video to their own Advantage dashboard instead, free through the fall pilot.",
  // Kept only for the cold emails already sent; nobody should find it by search.
  robots: { index: false },
};

/* /send-a-match used to be the cold-email intake: a form plus a file upload,
   answered by hand. Uploads now happen in the dashboard, but those emails are
   still in inboxes and still get clicked, so the route stays as a notice rather
   than a redirect — landing on the home page with no word about the link would
   read as a broken link.

   The page does one thing: say the offer has moved and hand the coach the way
   in. The actions sit in the masthead, before any detail, because on a phone the
   detail would otherwise push them below the fold. The terms and steps below
   are the pilot's own, read from lib/pilot, so this page can't promise
   something /pilot doesn't. */

// Cost, film and commitment: the three a coach who was promised a free
// breakdown checks first. Paid plans are /pilot's business.
const TERMS = PILOT_TERMS.slice(0, 3);

const STEPS: readonly { t: string; p: string }[] = [
  {
    t: "Create an account.",
    p: "Use your school email. It’s how we recognize you as a coach.",
  },
  {
    t: "Find your team.",
    p: "Search for your school and choose the men’s or women’s team you coach.",
  },
  {
    t: "Upload a match.",
    p: `${VIDEO_MIN_RESOLUTION}, ${VIDEO_MIN_FPS}, ${VIDEO_FORMATS}, under ${VIDEO_MAX_SIZE}. The breakdown lands in your dashboard.`,
  },
];

export default function Page() {
  return (
    <CampaignFrame className="sm-page">
      <section className="campaign-head sm-head">
        <span className="sm-badge">This offer has closed</span>
        <h1>Match uploads now happen in Advantage.</h1>
        <p className="campaign-lede">
          We&rsquo;re no longer taking matches through this page. Instead, your
          program uploads video to its own dashboard and gets the same
          shot-by-shot breakdown there, free for the fall season.
        </p>
        <div className="sm-actions">
          <a className="campaign-btn campaign-btn-primary" href="/pilot">
            Join the free pilot
          </a>
          <a
            className="campaign-btn campaign-btn-secondary"
            href={EXPORT_GUIDE_HREF}
          >
            Filming guide
          </a>
        </div>
      </section>

      <dl className="sm-terms">
        {TERMS.map((term) => (
          <div className="sm-term" key={term.l}>
            <dt>{term.l}</dt>
            <dd className="sm-term-value">{term.v}</dd>
            <dd className="sm-term-sub">{term.s}</dd>
          </div>
        ))}
      </dl>

      <section className="sm-steps" aria-labelledby="sm-steps-title">
        <h2 className="eyebrow" id="sm-steps-title">
          How it works now
        </h2>
        <ol>
          {STEPS.map((step, i) => (
            <li key={step.t}>
              <span className="sm-step-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <strong>{step.t}</strong>
                <span>{step.p}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* For the coaches who did send a film before the intake closed. It
          promises no delivery date: we reply to each one by hand. */}
      <p className="campaign-note sm-already">
        Already sent us a match through this page? Email{" "}
        <a className="campaign-link" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        and we&rsquo;ll tell you where it stands.
      </p>
    </CampaignFrame>
  );
}
