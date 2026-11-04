import type { Metadata } from "next";
import { PageFrame, PageHead } from "@/components/perspective/page-frame";
import { FaqItem } from "@/components/perspective/faq-item";
import { PILOT_END_DATE, PILOT_PAID_PLANS_BEGIN } from "@/lib/pilot";
import { PricingBoard } from "./pricing-board";
import "./pricing.css";

// A design preview of the January 2027 plans. Not linked from the site and
// kept out of search, so the free beta stays the only offer anyone can find.
export const metadata: Metadata = {
  title: "Pricing preview — Advantage",
  robots: { index: false, follow: false },
};

const QA: readonly { q: string; a: string }[] = [
  {
    q: "What counts as an hour?",
    a: "The length of the video you send, after you trim it. A typical match is about 1 hour 20 minutes.",
  },
  {
    q: "Do unused hours roll over?",
    a: "Plan hours reset on the 1st of each month. Credit packs last 12 months, so they’re the way to save film for tournament season.",
  },
  {
    q: "Are SwingVision imports included?",
    a: "Yes, on every plan, Free included, with no limit.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Any time. Changes start on your next billing date, and you keep your matches and reports.",
  },
  {
    q: "I was in the fall pilot. What do I pay?",
    a: "Pilot programs and players get 15% off their first paid season.",
  },
];

export default function Page() {
  return (
    <PageFrame>
      <div className="pr-preview" role="note">
        Design preview. Advantage is free through {PILOT_END_DATE}; these plans begin in{" "}
        {PILOT_PAID_PLANS_BEGIN}.
      </div>
      <PageHead
        eyebrow="Pricing"
        title="Pay for the matches you film."
        lede="SwingVision imports are free on every plan. Video analysis is priced by the hour, and a typical match is about 1 hour 20 minutes."
      />
      <PricingBoard />
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
        </div>
      </section>
    </PageFrame>
  );
}
