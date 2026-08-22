import { Check } from "lucide-react";
import { CourtDiagram } from "@/components/court-diagram";
import { FOOTAGE_CHECKLIST } from "@/components/footage-checklist";
import { PageFrame } from "@/components/perspective/page-frame";
import { PilotTermsBand } from "@/components/perspective/pilot-terms";
import { RequestAccess } from "@/components/perspective/request-access";
import {
  PILOT_END_DATE,
  PILOT_HOURS,
  PILOT_HOURS_ADJECTIVE,
  PILOT_HOURS_SCOPE,
  PILOT_ONBOARDING_WINDOW,
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
   footage even work, what happens if I say yes, and then the form. */

const STEPS = [
  {
    t: "Send the form below.",
    p: "Name, school, role — nothing else.",
  },
  {
    t: "We email you when the pilot opens.",
    p: "A real reply from a person, not a sequence — with a start date as soon as we have one.",
  },
  {
    t: "Your staff gets accounts and upload access.",
    p: "With a short walkthrough of the first upload. Already on SwingVision? Those matches import too.",
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
];

const PilotMasthead = () => (
  <header className="pv-hero brand-mesh">
    <div className="mesh-grain" aria-hidden="true" />
    <div className="pv-veil" aria-hidden="true" />
    <div className="wrap">
      <span className="h-eyebrow">Free Fall Season Pilot</span>
      <h1 className="h-title">The fall season, free, on your own footage.</h1>
      <p className="h-sub">
        Advantage turns the match video your program already shoots into
        shot-by-shot analytics. For collegiate programs, now through{" "}
        {PILOT_END_DATE}.
      </p>
      <div className="h-actions">
        <a className="hbtn hbtn-white" href="#access">
          Join the pilot
        </a>
        <a className="hbtn hbtn-glass" href="#footage">
          Will your footage work?
        </a>
      </div>
      <p className="meta">{PILOT_ONBOARDING_WINDOW}</p>
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
        body="Every program that wants in, gets in. The dates below are the entire commercial offer — nothing else is asked of you this season."
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
              <h2>From the form to the first breakdown.</h2>
              <p>
                No call required. A person sets your program up over email — the
                four steps beside this are the whole onboarding.
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

      <RequestAccess source="Pilot page" />
    </PageFrame>
  );
}
