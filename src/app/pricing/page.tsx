import { PageFrame } from "@/components/perspective/page-frame";
import { LiveDots } from "@/components/perspective/live-dots";
import { FreeMatchLink, TalkToUsLink } from "@/components/perspective/cta-links";
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
import { PricingPlans, PricingFaq } from "./pricing-plans";
import "./pricing.css";

const title = "Pricing: Advantage tennis analytics plans";
const description = `Plans for college programs from ${usd(COLLEGE_PLANS[0].spring.price)} a spring season, and for players and coaches from ${usd(ENTRY_COACH_PLAN.monthly)} a month. Paid plans include ${VERIFIED}.`;

export const metadata = pageMetadata({ title, description, path: "/pricing", ownCard: true });

const FAQ_LD = faqPageLd(PRICING_QA.map((x) => ({ q: x.q, text: x.a })));

/* /pricing. Built from the site's own parts: the mesh masthead with its live
   dot grid, a band head, the How it works panel split into plan columns, the
   FAQ rows, and the navy band to close. Every figure comes from lib/plans. */

const Masthead = () => (
  <header className="pv-hero brand-mesh" id="top">
    <LiveDots energy={1} strength={4} />
    <div className="pv-veil" aria-hidden="true" />
    <div className="wrap">
      <span className="h-eyebrow">Pricing</span>
      <h1 className="h-title">Pay for the hours of tennis you film.</h1>
      <p className="h-sub">
        Advantage Intelligence turns your match video into stats and film. On paid plans a reviewer then checks every
        point. No hardware to buy.
      </p>
      <div className="h-actions">
        <a className="hbtn hbtn-white" href="#plans">
          See the plans
        </a>
        <a className="hbtn hbtn-glass" href="#questions">
          Questions
        </a>
      </div>
    </div>
  </header>
);

const INCLUDED: readonly { t: string; p: string }[] = [
  { t: VERIFIED, p: "On paid plans a reviewer checks every point: who won it and how it ended." },
  { t: "Stats linked to film", p: "Every stat opens the clip it came from." },
  { t: "Condensed film", p: "Changeovers and the time between points are cut out, so you watch only the tennis." },
  { t: "Fix any point yourself", p: "Correct a point in a click. The original is always kept." },
  { t: "Ask, in your AI app", p: "Question your matches in plain English, in Advantage or in the AI app you already use." },
  { t: "The film you already have", p: "A phone, a GoPro or court cameras like PlaySight. No hardware to buy." },
];

// How a college pays, in the order it happens.
const PAY: readonly { t: string; p: string }[] = [
  { t: "Quote", p: "Tell us your teams and season. We send a quote for the plan that fits." },
  { t: "Invoice", p: `We invoice the school. Pay by ${COLLEGE_PAYMENT_METHODS}.` },
  { t: "Instalments", p: `Pay at once or in up to ${MAX_INSTALMENTS} instalments.` },
  {
    t: "Second team",
    p: `A second team at the same school is ${SECOND_TEAM_DISCOUNT_PERCENT}% off. Prices are locked for ${PRICE_LOCK_MONTHS} months.`,
  },
];

export default function Page() {
  return (
    <PageFrame hero={<Masthead />}>
      <JsonLd data={FAQ_LD} />
      <PricingPlans />

      <section className="band" id="paying">
        <div className="wrap">
          <div className="proof-head reveal">
            <div className="sec-head">
              <span className="eyebrow">For colleges</span>
              <h2>How colleges pay.</h2>
            </div>
            <p className="band-aside">The way your athletic department already buys.</p>
          </div>
          <ol className="pr-included pr-pay reveal">
            {PAY.map((x, i) => (
              <li className="pr-inc" key={x.t}>
                <span className="n">0{i + 1}</span>
                <h3>{x.t}</h3>
                <p>{x.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band alt" id="included">
        <div className="wrap">
          <div className="proof-head reveal">
            <div className="sec-head">
              <span className="eyebrow">Every paid plan</span>
              <h2>What comes back from every match.</h2>
            </div>
            <p className="band-aside">The same breakdown on every paid plan. Plans differ in hours, not in what you see.</p>
          </div>
          <div className="pr-included reveal">
            {INCLUDED.map((x) => (
              <div className="pr-inc" key={x.t}>
                <h3>{x.t}</h3>
                <p>{x.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingFaq />

      <section className="band final-band" id="start">
        <div className="ac-glow" aria-hidden="true" />
        <LiveDots className="ac-grain" energy={1} />
        <div className="final-inner reveal">
          <span className="eyebrow">Your season</span>
          <h2>Talk through your season.</h2>
          <div className="final-actions">
            <TalkToUsLink className="hbtn hbtn-white" placement="pricing-final" />
            <FreeMatchLink className="hbtn hbtn-glass" placement="pricing-final" />
          </div>
          {FREE_MATCH_OFFER ? <span className="final-note">{FREE_MATCH_LINE}</span> : null}
        </div>
      </section>
    </PageFrame>
  );
}
