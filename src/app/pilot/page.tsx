import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { CourtDiagram } from "@/components/court-diagram";
import { FOOTAGE_CHECKLIST } from "@/components/footage-checklist";
import { PageFrame } from "@/components/perspective/page-frame";
import { ProofHead } from "@/components/perspective/band-parts";
import { FindTeamLink, JoinBetaLink } from "@/components/perspective/cta-links";
import { FaqItem } from "@/components/perspective/faq-item";
import { LiveDots } from "@/components/perspective/live-dots";
import { PilotTermsBand } from "@/components/perspective/pilot-terms";
import { RequestAccess } from "@/components/perspective/request-access";
import { CONTACT_EMAIL } from "@/lib/links";
import {
  BETA_END_SHORT,
  PILOT_END_DATE,
  PILOT_HOURS,
  PILOT_HOURS_ADJECTIVE,
  PILOT_PAID_PLANS_BEGIN,
} from "@/lib/pilot";
import "./pilot.css";

export const metadata = {
  title: "The Free Fall Season Pilot — Advantage",
  description: `The fall season, free, on your own footage. Advantage turns the match video your collegiate program already shoots into shot-by-shot analytics — free through ${PILOT_END_DATE}.`,
};

/* /pilot — the whole commercial offer on one page, built from the home page's
   parts: the same mesh hero with its live dot grid, the same band head
   (headline left, aside flush right), How it works' white panel, the FAQ's
   collapsed rows, and the navy card to close. It is linked from the nav, the
   footer and the contact form, so it has to read as the site a coach was
   already browsing.

   Order is the order the questions arrive in: what does it cost, will my
   footage even work, what happens when I sign up, what else, and then the
   way in. */

const STEPS: readonly { t: string; p: ReactNode; spec: string }[] = [
  {
    t: "Create an account.",
    p: "Use your school email. It’s how we recognize you as a coach.",
    spec: "school email",
  },
  {
    t: "Find your team.",
    p: "Search for your school and choose the men’s or women’s team you coach.",
    spec: "men’s · women’s",
  },
  {
    t: "We check your email.",
    p: "If it’s on the staff list, the pilot turns on right away. If not, a person confirms you coach there and emails you.",
    spec: `${PILOT_HOURS} a month`,
  },
  {
    t: "Send match video.",
    p: "The breakdown lands in your dashboard: numbers, court maps and film the whole roster can read.",
    spec: "within 24 h",
  },
];

// Only what the bands above leave open. Cost, hours, hardware and footage are
// answered in place, so they aren't asked again here.
const QA: readonly { q: string; a: ReactNode }[] = [
  {
    q: `What happens after ${BETA_END_SHORT}?`,
    a: `Paid plans begin in ${PILOT_PAID_PLANS_BEGIN}. Until then, everything is free.`,
  },
  {
    q: "Are men’s and women’s teams separate?",
    a: `Yes. Each is set up on its own, with its own ${PILOT_HOURS_ADJECTIVE} budget.`,
  },
  {
    q: "What if my email isn’t recognized?",
    a: "Sign up and find your team anyway. A person confirms you coach there and emails you when the pilot is on.",
  },
  {
    q: "What if my school isn’t listed?",
    a: "Tell us with the form at the foot of this page and we’ll add it.",
  },
  { q: "Does doubles work?", a: "Not yet. Singles only for now." },
  { q: "How long does a breakdown take?", a: "Within 24 hours. You get an email when it’s ready." },
  {
    q: "Who can see our film?",
    a: "Your team. Everyone in your team workspace can see it.",
  },
  {
    q: "Can players join on their own?",
    a: "Yes. The free beta gives players 2 hours of film a month. No program needed.",
  },
];

/* The home hero's mesh and live grid, in a flowing panel only as tall as its
   type: there is no dashboard to hold in perspective here. Like the home hero,
   it melts into the white band below instead of ending on a hard edge. */
const PilotMasthead = () => (
  <header className="pv-hero brand-mesh" id="top">
    <LiveDots />
    <div className="pv-veil" aria-hidden="true" />
    <div className="wrap">
      <span className="h-eyebrow">Fall pilot · College programs</span>
      <h1 className="h-title">The fall season, free, on your own footage.</h1>
      <p className="h-sub">Match analytics for your whole roster, through {BETA_END_SHORT}.</p>
      <div className="h-actions">
        <FindTeamLink className="hbtn hbtn-white" placement="pilot-hero" />
        <a className="hbtn hbtn-glass" href="#footage">
          Check your footage
        </a>
      </div>
      <p className="meta">
        Playing on your own? <JoinBetaLink placement="pilot-hero" icon={false} /> instead.
      </p>
    </div>
  </header>
);

export default function Page() {
  return (
    <PageFrame hero={<PilotMasthead />}>
      <PilotTermsBand
        id="terms"
        alt
        eyebrow="The terms"
        title="Four terms, no fine print."
        aside="This is the whole offer. Nothing else is asked of your program this season."
      />

      {/* The qualifier, asked before the ask. A coach who finds out here that
          side-on footage won't work has been saved an hour and a bad first
          impression of the product. */}
      <section className="band alt" id="footage">
        <div className="wrap">
          <ProofHead
            eyebrow="Before you upload"
            title="Will your footage work?"
            aside="Advantage reads the court from behind the baseline. Film shot from the side won’t give a full breakdown."
          />
          <div className="pv-footage reveal">
            <figure className="pv-angle">
              <CourtDiagram />
            </figure>
            <div className="pv-footage-list">
              <ul className="pv-checks">
                {FOOTAGE_CHECKLIST.map((item, i) => (
                  <li className="pv-checkrow" key={i}>
                    <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="pv-caution">
                <strong>Singles only for now.</strong> A doubles upload won’t produce a
                breakdown yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band" id="next">
        <div className="wrap">
          <ProofHead
            eyebrow="What happens next"
            title="From sign-up to the first breakdown."
            aside="No application and no call. Nearly every college program is already in the dashboard."
          />
          <ol className="how-panel is-four reveal" aria-label="Four steps">
            {STEPS.map((s, i) => (
              <li className="how-step" key={s.t}>
                <span className="n">0{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
                <span className="spec">{s.spec}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band alt" id="questions">
        <div className="wrap faq">
          <div className="faq-intro sec-head reveal">
            <span className="eyebrow">Questions</span>
            <h2>Straight answers.</h2>
          </div>
          <div className="faq-list reveal">
            {QA.map((x) => (
              <FaqItem key={x.q} q={x.q}>
                {x.a}
              </FaqItem>
            ))}
          </div>
          <p className="faq-more reveal">
            Not covered here? <a href={`mailto:${CONTACT_EMAIL}`}>Email us</a>.
          </p>
        </div>
      </section>

      <RequestAccess />
    </PageFrame>
  );
}
