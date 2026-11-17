import type { ReactNode } from "react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/links";
import { EXPORT_GUIDE_HREF, RECORDING_GUIDE_HREF } from "@/lib/match-video";
import { FaqItem } from "./faq-item";
import { PLAN_FAQ } from "@/lib/plan-faq";
import { faqPageLd } from "@/lib/structured-data";
import { JsonLd } from "@/components/json-ld";

/* The questions that stand between a visitor and an upload, ordered by what
   the visitor decides first (what does it cost?), then what happens to their film.
   The shared answers come from lib/plan-faq, so /pricing says the same.
   Collapsed so the whole band fits one screen, phones included; native
   <details> keeps it keyboard-operable and find-in-page searchable, and
   working before hydration; FaqItem only adds the open/close motion. Every row starts closed: the plus marks
   carry the affordance, and one open answer would push a 720px laptop
   past one screen. */

/* `text` is the answer as plain text, for the FAQPage structured data: only
   needed where `a` holds markup, and it must say what the visible answer says. */
const QA: readonly { q: string; a: ReactNode; text?: string }[] = [
  PLAN_FAQ.cost,
  PLAN_FAQ.verified,
  {
    q: PLAN_FAQ.video.q,
    a: (
      <>
        {PLAN_FAQ.video.a} The <Link href={RECORDING_GUIDE_HREF}>recording guide</Link> shows how to set up, and the{" "}
        <Link href={EXPORT_GUIDE_HREF}>export guide</Link> how to get it off the camera.
      </>
    ),
    text: `${PLAN_FAQ.video.a} The recording guide shows how to set up, and the export guide how to get it off the camera.`,
  },
  PLAN_FAQ.ai,
  PLAN_FAQ.ready,
  PLAN_FAQ.film,
];

const FAQ_LD = faqPageLd(QA.map((x) => ({ q: x.q, text: x.text ?? (typeof x.a === "string" ? x.a : "") })));

export function Faq() {
  return (
    <section className="band alt" id="faq">
      <JsonLd data={FAQ_LD} />
      <div className="wrap faq">
        <div className="faq-intro sec-head reveal">
          <span className="eyebrow">FAQ</span>
          <h2>
            Before <span className="h-tail">you upload.</span>
          </h2>
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
