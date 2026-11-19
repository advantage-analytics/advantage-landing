import type { ReactNode } from "react";
import { Film, MessageSquare, Pencil, Scissors, Smartphone } from "lucide-react";
import { PageFrame, PageHero } from "@/components/perspective/page-frame";
import { ProofHead } from "@/components/perspective/band-parts";
import { FinalBand } from "@/components/perspective/final-band";
import { Faq } from "@/components/perspective/faq";
import { FreeMatchLink } from "@/components/perspective/cta-links";
import { BookCallButton } from "@/components/perspective/walkthrough-band";
import { VerifiedCheck } from "@/components/perspective/verified";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { faqPageLd } from "@/lib/structured-data";
import { PRICING_QA } from "@/lib/plan-faq";
import {
  COLLEGE_PAYMENT_METHODS,
  COLLEGE_PLANS,
  ENTRY_COACH_PLAN,
  FREE_MATCH_LINE,
  FREE_MATCH_OFFER,
  MAX_INSTALMENTS,
  PRICE_LOCK_MONTHS,
  SECOND_TEAM_DISCOUNT_PERCENT,
  VERIFIED,
  usd,
} from "@/lib/plans";
import { PricingBody } from "./pricing-plans";
import "./pricing.css";

const title = "Pricing: Advantage tennis analytics plans";
const description = `Plans for college programs from ${usd(COLLEGE_PLANS[0].spring.price)} a spring season, and for players and coaches from ${usd(ENTRY_COACH_PLAN.monthly)} a month. Paid plans include ${VERIFIED}.`;

export const metadata = pageMetadata({ title, description, path: "/pricing" });

const FAQ_LD = faqPageLd(PRICING_QA.map((x) => ({ q: x.q, text: x.a })));

/* /pricing. The mesh masthead, then the plans for the chosen audience (college
   programs or players and coaches), how colleges pay, what every paid plan
   returns, the questions and the navy close. Every figure comes from
   lib/plans. The bands are rendered here; PricingBody (pricing-plans.tsx)
   holds the switch and the table and picks which bands show. */

// How a college pays, in the order it happens.
const PAY: readonly { t: string; p: string }[] = [
  {
    t: "Call or quote",
    p: "Book a 20-minute call, or write to us with your teams and season. We send a quote for the plan that fits.",
  },
  { t: "Invoice", p: `We invoice the school. Pay by ${COLLEGE_PAYMENT_METHODS}.` },
  { t: "Instalments", p: `Pay at once or in up to ${MAX_INSTALMENTS} instalments.` },
  {
    t: "Second team",
    p: `A second team at the same school is ${SECOND_TEAM_DISCOUNT_PERCENT}% off. Prices are locked for ${PRICE_LOCK_MONTHS} months.`,
  },
];

const INCLUDED: readonly { icon: ReactNode; t: string; p: string }[] = [
  {
    icon: <VerifiedCheck size={22} />,
    t: VERIFIED,
    p: "On paid plans a reviewer checks every point: who won it and how it ended.",
  },
  { icon: <Film size={20} strokeWidth={1.5} />, t: "Stats linked to film", p: "Every stat opens the clip it came from." },
  {
    icon: <Scissors size={20} strokeWidth={1.5} />,
    t: "Condensed film",
    p: "Changeovers and the time between points are cut out, so you watch only the tennis.",
  },
  {
    icon: <Pencil size={20} strokeWidth={1.5} />,
    t: "Fix any point yourself",
    p: "Correct a point in a click. The original is always kept.",
  },
  {
    icon: <MessageSquare size={20} strokeWidth={1.5} />,
    t: "Ask, in your AI app",
    p: "Question your matches in plain English, in Advantage or in the AI app you already use.",
  },
  {
    icon: <Smartphone size={20} strokeWidth={1.5} />,
    t: "The film you already have",
    p: "A phone, a GoPro or court cameras like PlaySight. No hardware to buy.",
  },
];

const payBand = (
  <section className="band alt heads-centered" id="paying">
    <div className="wrap">
      <ProofHead eyebrow="For colleges" title="How colleges pay." tail="The way your athletic department already buys." />
      <ol className="sub-panel pr-pay reveal">
        {PAY.map((x, i) => (
          <li key={x.t}>
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            <h3>{x.t}</h3>
            <p>{x.p}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

// Grey then white for colleges; pricing.css swaps the two for players and
// coaches, where the college band above them is hidden.
const afterBands = (
  <>
    <section className="band heads-centered" id="included">
      <div className="wrap">
        <ProofHead
          eyebrow="Every paid plan"
          title="What comes back"
          tail="from every match."
          aside="Plans differ in hours, not in what you see."
        />
        <div className="sub-panel pr-included reveal">
          {INCLUDED.map((x) => (
            <div key={x.t}>
              <span className="pr-inc-icon" aria-hidden="true">
                {x.icon}
              </span>
              <h3>{x.t}</h3>
              <p>{x.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Faq
      qa={PRICING_QA}
      id="questions"
      className="band alt heads-centered"
      eyebrow="Questions"
      title="Straight answers."
      ld={false}
    />
  </>
);

const closeCollege = (
  <FinalBand
    eyebrow="Your season"
    title="Talk through your season."
    actions={
      <>
        <BookCallButton className="hbtn hbtn-white" placement="pricing-final" />
        <FreeMatchLink className="hbtn hbtn-glass" placement="pricing-final" />
      </>
    }
    note="A 20-minute call on Zoom."
  />
);

const closeIndividual = (
  <FinalBand
    title="Start with the match you already filmed."
    placement="pricing-final"
    note={FREE_MATCH_OFFER ? FREE_MATCH_LINE : null}
  />
);

export default function Page() {
  return (
    <PageFrame
      hero={
        <PageHero
          eyebrow="Pricing"
          title={
            <>
              Pay for the hours <br className="pv-br" />
              of tennis you film.
            </>
          }
          sub="Every paid plan gets the same breakdown, with a reviewer checking every point. Plans differ only in how many hours of video you upload. No hardware to buy."
          actions={
            <>
              <a className="hbtn hbtn-white" href="#plans">
                See the plans
              </a>
              <a className="hbtn hbtn-glass" href="#questions">
                Common questions
              </a>
            </>
          }
          foot={FREE_MATCH_OFFER ? FREE_MATCH_LINE : undefined}
        />
      }
    >
      <JsonLd data={FAQ_LD} />
      <PricingBody pay={payBand} after={afterBands} closeCollege={closeCollege} closeIndividual={closeIndividual} />
    </PageFrame>
  );
}
