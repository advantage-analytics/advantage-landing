import type { ReactNode } from "react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/links";
import { EXPORT_GUIDE_HREF } from "@/lib/match-intake";
import { BETA_END_SHORT, PILOT_END_DATE, PILOT_PAID_PLANS_BEGIN } from "@/lib/pilot";

/* The questions that stand between a visitor and an upload. Every answer is
   open: six short answers read faster laid out than hidden behind toggles, the
   same call /pilot makes for its own Q&A. */

const QA: readonly { q: string; a: ReactNode }[] = [
  {
    q: "Do I need a program to join?",
    a: "No. The free beta is for individual players: sign up, upload a match, get 2 hours of film a month.",
  },
  {
    q: "Who is the fall pilot for?",
    a: `College programs. Coaches sign up and find their team, which gets 75 hours of film a month. Paid plans begin ${PILOT_PAID_PLANS_BEGIN}.`,
  },
  {
    q: "What video works?",
    a: (
      <>
        Singles footage shot from behind the baseline, raised up if you can. Side-on film won’t give a full
        breakdown. The <Link href={EXPORT_GUIDE_HREF}>export guide</Link> shows how to get it off the camera.
      </>
    ),
  },
  { q: "How long does a breakdown take?", a: "Within 24 hours. You get an email when it’s ready." },
  { q: "Who can see my film?", a: "Only you. In the pilot, everyone in your team workspace too." },
  {
    q: `What happens after ${BETA_END_SHORT}?`,
    a: `Everything is free through ${PILOT_END_DATE}. Paid plans begin in ${PILOT_PAID_PLANS_BEGIN}.`,
  },
];

export function Faq() {
  return (
    <section className="band alt" id="faq">
      <div className="wrap faq-grid">
        <div className="faq-intro reveal">
          <span className="eyebrow">FAQ</span>
          <h2>Before you upload.</h2>
          <p>
            Anything else: <a href={`mailto:${CONTACT_EMAIL}`}>email us</a>.
          </p>
        </div>
        <dl className="faq-list reveal">
          {QA.map((x) => (
            <div className="faq-row" key={x.q}>
              <dt>{x.q}</dt>
              <dd>{x.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
