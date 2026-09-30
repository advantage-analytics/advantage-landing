import type { ReactNode } from "react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/links";
import { EXPORT_GUIDE_HREF } from "@/lib/match-video";
import { FaqItem } from "./faq-item";
import { BETA_END_SHORT, PILOT_HOURS, PILOT_PAID_PLANS_BEGIN } from "@/lib/pilot";

/* The questions that stand between a visitor and an upload, ordered by what
   the visitor decides first (can I join?), then what happens to their film.
   Collapsed so the whole band fits one screen, phones included; native
   <details> keeps it keyboard-operable and find-in-page searchable, and
   working before hydration; FaqItem only adds the open/close motion. Every row starts closed: the plus marks
   carry the affordance, and one open answer would push a 720px laptop
   past one screen. */

const QA: readonly { q: string; a: ReactNode }[] = [
  {
    q: "Do I need a program to join?",
    a: "No. The free beta is for individual players: sign up, upload a match, get 2 hours of film a month.",
  },
  {
    q: "Who is the fall pilot for?",
    a: `College programs. A coach signs up and finds the team, and the program gets ${PILOT_HOURS} of film a month.`,
  },
  {
    q: `What happens after ${BETA_END_SHORT}?`,
    a: `Paid plans begin in ${PILOT_PAID_PLANS_BEGIN}. Until then, everything is free.`,
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
  {
    q: "Who can see my film?",
    a: "Only you. If you’re in the pilot, everyone in your team workspace can see it too.",
  },
];

export function Faq() {
  return (
    <section className="band alt" id="faq">
      <div className="wrap faq">
        <div className="faq-intro sec-head reveal">
          <span className="eyebrow">FAQ</span>
          <h2>Before you upload.</h2>
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
  );
}
