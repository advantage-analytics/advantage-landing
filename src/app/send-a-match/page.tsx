import type { ReactNode } from "react";
import { Check } from "lucide-react";
import {
  CampaignFrame,
  CampaignHead,
} from "@/components/campaign/campaign-frame";
import {
  EXPORT_GUIDE_HREF,
  MAX_UPLOAD_HOURS,
  MAX_UPLOAD_LABEL,
  TURNAROUND,
} from "@/lib/match-intake";
import { CourtDiagram } from "./court-diagram";
import { MatchForm } from "./match-form";
import "./send-a-match.css";

export const metadata = {
  title: "Send us a match — Advantage",
  description:
    "Send one match video and we'll send back a full shot-by-shot breakdown — serve placement, return patterns, first-four-shots. Free, no call, no commitment.",
};

/* The qualifier, stated before a coach spends an hour on an upload we'd have to
   refuse. Getting this wrong is the worst thing the product could do to a first
   impression, so it precedes the form: stacked above it on a phone, beside it in
   the sticky rail on a desktop. */
const CHECKLIST: ReactNode[] = [
  <>
    Filmed from <strong>behind the baseline</strong>, roughly centered on the
    court
  </>,
  <>
    Elevated if possible &mdash; a fence post, a balcony, the top row of
    bleachers
  </>,
  <>Far service line visible</>,
  <>Near court outside of baseline visible</>,
  <>
    <strong>1080p or better, 30fps</strong>
  </>,
  <>MP4 / H.264 &mdash; most phone and PlaySight exports already are</>,
];

export default function Page() {
  return (
    <CampaignFrame className="sm-page">
      {/* The masthead spans the full measure; below it the page splits. One
          column on a phone, two from 1080px up: the rail holds what a coach
          reads, the form column holds what they type. Keeping the masthead out
          of the rail is what lets the rail pin — a sticky element taller than
          the viewport strands its own lower half, and the diagram is the part
          that has to stay visible. */}
      <CampaignHead
        title="Send us a match."
        lede={
          <>
            We&rsquo;ll send back a full shot-by-shot breakdown &mdash; serve
            placement, return patterns, first-four-shots, and every stat linked
            to the clip it came from. Free, no call, no commitment.
          </>
        }
      >
        <p className="sm-delivery">
          You&rsquo;ll get a confirmation email today, and your breakdown within{" "}
          {TURNAROUND}.
        </p>
      </CampaignHead>

      <div className="sm-layout">
        <div className="sm-rail">
          <section className="sm-section" aria-labelledby="sm-camera">
            {/* The eyebrow is this section's heading, so it is one: without
                this the form region offered no outline below <h1>. .eyebrow
                carries every visual property, so nothing moves. */}
            <div className="sm-spine">
              <h2 className="eyebrow" id="sm-camera">
                Before you send
              </h2>
            </div>

            <p className="sm-note">
              Our tracking reads the court from behind the baseline. Footage
              shot from the side of the court won&rsquo;t produce a full
              breakdown yet.
            </p>

            <ul className="sm-checks campaign-list">
              {CHECKLIST.map((item, i) => (
                <li className="campaign-item" key={i}>
                  <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="sm-diagram">
              <CourtDiagram />
            </div>

            {/* Opens in a new tab on purpose: the form keeps no state, so a
                same-tab hop to the guide wipes everything a coach has
                already typed and drops them back on an empty form. */}
            <p className="sm-compress">
              Uploads take files up to {MAX_UPLOAD_LABEL}, about{" "}
              {MAX_UPLOAD_HOURS} of video. Bigger than that? Paste a link
              instead &mdash; there&rsquo;s no size limit on links.{" "}
              <a
                className="campaign-link"
                href={EXPORT_GUIDE_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                More on large files
              </a>
              .
            </p>
          </section>
        </div>

        <section
          className="sm-section sm-formcol"
          aria-labelledby="sm-match"
        >
          <div className="sm-spine">
            <h2 className="eyebrow" id="sm-match">
              Your match
            </h2>
          </div>
          <MatchForm />
        </section>
      </div>
    </CampaignFrame>
  );
}
