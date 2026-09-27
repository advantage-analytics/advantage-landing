import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { CourtDiagram } from "@/components/court-diagram";
import { FOOTAGE_CHECKLIST } from "@/components/footage-checklist";
import { PageFrame } from "@/components/perspective/page-frame";
import { FindTeamLink, JoinBetaLink } from "@/components/perspective/cta-links";
import { PilotTermsBand } from "@/components/perspective/pilot-terms";
import { RequestAccess } from "@/components/perspective/request-access";
import {
  PILOT_END_DATE,
  PILOT_HOURS,
  PILOT_HOURS_ADJECTIVE,
  PILOT_HOURS_SCOPE,
  PILOT_PAID_PLANS_BEGIN,
} from "@/lib/pilot";
import "./pilot.css";

export const metadata = {
  title: "The Free Fall Season Pilot — Advantage",
  description: `The fall season, free, on your own footage. Advantage turns the match video your collegiate program already shoots into shot-by-shot analytics — free through ${PILOT_END_DATE}.`,
};

/* /pilot — the whole commercial offer on one page, in the site's own theme
   rather than the campaign shell used by /send-a-match. It is linked from the
   nav, the hero, the fall-pilot band, the footer, and the contact form, so it
   has to read as part of the site a coach was already browsing.

   Order is the order the questions arrive in: what does it cost, will my
   footage even work, what happens when I sign up, and then the way in. */

const STEPS: readonly { t: string; p: ReactNode }[] = [
  {
    t: "Create an account.",
    p: "Use your school email. It’s how we recognize you as a coach.",
  },
  {
    t: "Find your team.",
    p: "Search your school and choose the men’s or women’s team you coach.",
  },
  {
    t: "We check your email against the staff list.",
    p: (
      <>
        <strong>If it’s on the list,</strong> the pilot turns on right away, with{" "}
        {PILOT_HOURS} a month for the team.
        <br />
        <strong>If it isn’t,</strong> a person confirms you coach there and emails
        you when it’s on.
      </>
    ),
  },
  {
    t: "Send match video.",
    p: "The analysis comes back in your dashboard — statistics, court maps, and insight your whole roster can read.",
  },
];

const QA = [
  {
    q: "What does it cost?",
    a: `Nothing through ${PILOT_END_DATE}. Paid plans begin in ${PILOT_PAID_PLANS_BEGIN}.`,
  },
  { q: "How much video?", a: `${PILOT_HOURS} ${PILOT_HOURS_SCOPE}.` },
  { q: "Do we need to buy equipment?", a: "No." },
  { q: "Is there a contract?", a: "No." },
  {
    q: "What footage works?",
    a: "Behind the baseline, elevated if possible — the checklist above is the whole answer.",
  },
  { q: "Doubles?", a: "Singles only for now." },
  {
    q: "Men’s and women’s teams?",
    a: `Set up separately, each with its own ${PILOT_HOURS_ADJECTIVE} budget.`,
  },
  {
    q: "What if my email isn’t recognized?",
    a: "You can still sign up and find your team. A person confirms you coach there and emails you when the pilot is on.",
  },
  {
    q: "My school isn’t listed.",
    a: "Tell us with the form at the bottom of this page and we’ll add it.",
  },
  {
    q: "Can individual players join?",
    a: "Yes. The free beta is 2 hours a month, self-serve. No program required.",
  },
];

const PilotMasthead = () => (
  <header className="pv-hero brand-mesh">
    <div className="mesh-grain" aria-hidden="true" />
    <div className="pv-veil" aria-hidden="true" />
    <div className="wrap">
      <span className="h-eyebrow">Fall Pilot · Open now</span>
      <h1 className="h-title">The fall season, free, on your own footage.</h1>
      <p className="h-sub">
        Advantage turns the match video your program already shoots into
        shot-by-shot analytics. For college programs, free through{" "}
        {PILOT_END_DATE}.
      </p>
      <div className="h-actions">
        <FindTeamLink className="hbtn hbtn-white" placement="pilot-hero" />
        <a className="hbtn hbtn-glass" href="#footage">
          Will your footage work?
        </a>
      </div>
      <p className="meta">
        Playing on your own?{" "}
        <JoinBetaLink placement="pilot-hero" icon={false} /> instead.
      </p>
    </div>
  </header>
);

export default function Page() {
  return (
    <PageFrame hero={<PilotMasthead />}>
      <PilotTermsBand
        id="terms"
        eyebrow="The terms"
        title="Four terms, no fine print."
        body="The dates below are the entire commercial offer — nothing else is asked of you this season."
      />

      {/* The qualifier, asked before the ask. A coach who finds out here that
          side-on footage won't work has been saved an hour and a bad first
          impression of the product. */}
      <section className="band alt" id="footage">
        <div className="wrap">
          <div className="hiw-split reveal">
            <div className="hiw-intro">
              <span className="eyebrow">Before you upload</span>
              <h2>Will your footage work?</h2>
              <p>
                Advantage reads the court from behind the baseline. Footage shot
                from the side of the court won’t produce a full breakdown.
              </p>
              <div className="pv-diagram">
                <CourtDiagram />
              </div>
            </div>
            <div>
              <ul className="pv-checks">
                {FOOTAGE_CHECKLIST.map((item, i) => (
                  <li className="pv-checkrow" key={i}>
                    <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="pv-caution">
                <strong>Singles only for now.</strong> Doubles isn’t supported
                yet — a doubles upload won’t produce a breakdown.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="next">
        <div className="wrap">
          <div className="hiw-split reveal">
            <div className="hiw-intro">
              <span className="eyebrow">What happens next</span>
              <h2>From sign-up to the first breakdown.</h2>
              <p>
                No application and no call. Nearly every college program is
                already in the dashboard, waiting for its coaches.
              </p>
            </div>
            <ol className="hiw-list">
              {STEPS.map((s, i) => (
                <li className="hiw-item" key={s.t}>
                  <span className="hiw-num" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div className="hiw-item-body">
                    <h4>{s.t}</h4>
                    <p>{s.p}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="band alt" id="questions">
        <div className="wrap">
          <div className="sec-head reveal">
            <span className="eyebrow">Questions</span>
            <h2>Straight answers.</h2>
          </div>
          <dl className="pv-qa reveal">
            {QA.map((x) => (
              <div className="pv-qa-row" key={x.q}>
                <dt className="q">{x.q}</dt>
                <dd className="a">{x.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <RequestAccess />
    </PageFrame>
  );
}
