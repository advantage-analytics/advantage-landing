import type { ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { EXPORT_GUIDE_HREF, TURNAROUND } from "@/lib/match-intake";
import { CourtDiagram } from "./court-diagram";
import { MatchForm } from "./match-form";
import "./send-a-match.css";

export const metadata = {
  title: "Send us a match — Advantage",
  description:
    "Send one match video and we'll send back a full shot-by-shot breakdown — serve placement, return patterns, first-four-shots. Free, no call, no commitment.",
};

const CONTACT = "team@advantage-analytics.com";

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
    <div className="perspective-page sm-page">
      {/* Wordmark only. A coach who got here from one cold email has one job to
          do; a nav is just somewhere else to go. */}
      <header className="sm-header">
        <div className="sm-wrap">
          <Link className="sm-brand" href="/" aria-label="Advantage — home">
            <img src="/assets/logos/logo.svg" alt="Advantage" />
          </Link>
        </div>
      </header>

      <main className="sm-main">
        <div className="sm-wrap">
          {/* The hero spans the full measure as a masthead; below it the page
              splits. One column on a phone, two from 1080px up: the rail holds
              what a coach reads, the form column holds what they type. Keeping
              the hero out of the rail is what lets the rail pin — a sticky
              element taller than the viewport strands its own lower half, and
              the diagram is the part that has to stay visible. */}
          <section className="sm-hero">
            <h1>Send us a match.</h1>
            <p className="sm-lede">
              We&rsquo;ll send back a full shot-by-shot breakdown &mdash; serve
              placement, return patterns, first-four-shots, and every stat
              linked to the clip it came from. Free, no call, no commitment.
            </p>
            <p className="sm-delivery">
              You&rsquo;ll get a confirmation email today, and your breakdown
              within {TURNAROUND}.
            </p>
          </section>

          <div className="sm-layout">
            <div className="sm-rail">
              <section className="sm-section" aria-labelledby="sm-camera">
                <div className="sm-spine">
                  <span className="eyebrow" id="sm-camera">
                    Before you send
                  </span>
                </div>

                <p className="sm-note">
                  Our tracking reads the court from behind the baseline. Footage
                  shot from the side of the court won&rsquo;t produce a full
                  breakdown yet.
                </p>

                <ul className="sm-checks">
                  {CHECKLIST.map((item, i) => (
                    <li className="sm-check" key={i}>
                      <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="sm-diagram">
                  <CourtDiagram />
                </div>

                <p className="sm-compress">
                  Large file? Most exports compress to under 3GB with no loss
                  that matters to us &mdash;{" "}
                  <a href={EXPORT_GUIDE_HREF}>here&rsquo;s how</a>.
                </p>
              </section>
            </div>

            <section
              className="sm-section sm-formcol"
              aria-labelledby="sm-match"
            >
              <div className="sm-spine">
                <span className="eyebrow" id="sm-match">
                  Your match
                </span>
              </div>
              <MatchForm />
            </section>
          </div>
        </div>
      </main>

      <footer className="sm-footer">
        <div className="sm-wrap">
          <div className="sm-foot-row">
            <img src="/assets/logos/logo.svg" alt="Advantage" />
            <div className="sm-foot-meta">
              <span>advantage-analytics.com</span>
              <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
