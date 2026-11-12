"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { FaqItem } from "@/components/perspective/faq-item";
import { links, CONTACT_EMAIL } from "@/lib/links";

type Plan = {
  name: string;
  line: string;
  price: string;
  billed: string;
  amount: string;
  approx: string;
  features: readonly string[];
  cta: string;
  href: string;
  featured?: boolean;
};

const COLLEGE: readonly Plan[] = [
  {
    name: "Starter",
    line: "Your biggest duals.",
    price: "$600",
    billed: "$3,000 billed for the spring season",
    amount: "80 hours",
    approx: "≈ 11 duals",
    features: ["Every singles match human-checked", "Team workspace and roster", "Rush matches at $25 each"],
    cta: "Choose Starter",
    href: "/contact",
  },
  {
    name: "Program",
    line: "Your whole spring season.",
    price: "$1,500",
    billed: "$7,500 billed for the spring season",
    amount: "200 hours",
    approx: "≈ 28 duals",
    features: [
      "Every singles match human-checked",
      "Team workspace and roster",
      "3 rush matches included each season",
      "Priority processing as an add-on",
    ],
    cta: "Choose Program",
    href: "/contact",
    featured: true,
  },
  {
    name: "Elite",
    line: "Season, fall and practice, with priority.",
    price: "$2,200",
    billed: "$11,000 billed for the spring season",
    amount: "300 hours",
    approx: "≈ 43 duals",
    features: [
      "Every singles match human-checked",
      "Team workspace and roster",
      "Priority processing included",
      "6 rush matches included each season",
      "Room for fall tournaments and practice",
    ],
    cta: "Choose Elite",
    href: "/contact",
  },
];

const individual = (yearly: boolean): readonly Plan[] => [
  {
    name: "Free",
    line: "See your first match analyzed.",
    price: "$0",
    billed: "No card needed",
    amount: "1 match",
    approx: "one time",
    features: ["AI analysis you can correct point by point", "SwingVision imports, always free"],
    cta: "Start free",
    href: links.signUp,
  },
  {
    name: "Coach",
    line: "Every match checked, every month.",
    price: yearly ? "$137" : "$149",
    billed: yearly ? "$1,639 billed yearly" : "Billed monthly",
    amount: "5 hours / month",
    approx: "≈ 4 matches",
    features: ["Every singles match human-checked", "Ask, and a connection to your AI tools", "Rush matches at $25 each"],
    cta: "Choose Coach",
    href: links.signUp,
    featured: true,
  },
  {
    name: "Coach Pro",
    line: "For a full match schedule.",
    price: yearly ? "$274" : "$299",
    billed: yearly ? "$3,289 billed yearly" : "Billed monthly",
    amount: "10 hours / month",
    approx: "≈ 8 matches",
    features: ["Every singles match human-checked", "Ask, and a connection to your AI tools", "Rush matches at $25 each"],
    cta: "Choose Coach Pro",
    href: links.signUp,
  },
];

function PlanColumn({ plan, i }: { plan: Plan; i: number }) {
  return (
    <li className="pr-plan">
      <div className="pr-top">
        <span className="n">0{i + 1}</span>
        {plan.featured ? <span className="pr-tag">Most chosen</span> : null}
      </div>
      <h3>{plan.name}</h3>
      <p className="pr-line">{plan.line}</p>
      <p className="pr-price">
        <span className="pr-fig">{plan.price}</span>
        {plan.price !== "$0" ? <span className="pr-per">/ month</span> : null}
      </p>
      <p className="pr-billed">{plan.billed}</p>
      <div className="pr-spec">
        <span>{plan.amount}</span>
        <span>{plan.approx}</span>
      </div>
      <ul className="pr-feats">
        {plan.features.map((f) => (
          <li key={f}>
            <Check size={15} strokeWidth={1.75} aria-hidden="true" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a className={`btn btn-lg ${plan.featured ? "btn-primary" : "btn-outline"} pr-cta`} href={plan.href}>
        {plan.cta}
      </a>
    </li>
  );
}

export function PricingPlans() {
  const [tab, setTab] = useState<"college" | "individual">("college");
  const [yearly, setYearly] = useState(false);
  const college = tab === "college";
  const plans = college ? COLLEGE : individual(yearly);

  return (
    <section className="band alt" id="plans">
      <div className="wrap">
        <div className="proof-head pr-head reveal">
          <div className="sec-head">
            <span className="eyebrow">The plans</span>
            <h2>Priced by the season.</h2>
          </div>
          <div className="pr-tabs" role="tablist" aria-label="Who the plans are for">
            <button role="tab" aria-selected={college} className={college ? "is-on" : ""} onClick={() => setTab("college")}>
              College programs
            </button>
            <button role="tab" aria-selected={!college} className={!college ? "is-on" : ""} onClick={() => setTab("individual")}>
              Players and coaches
            </button>
          </div>
        </div>

        <div className="pr-sub reveal">
          <p>
            {college
              ? "Shown per month, billed for the spring season, January to May. Every plan covers your full roster."
              : "For players and private coaches. Cancel anytime."}
          </p>
          {!college ? (
            <div className="pr-billing" role="group" aria-label="Billing">
              <button aria-pressed={!yearly} className={!yearly ? "is-on" : ""} onClick={() => setYearly(false)}>
                Monthly
              </button>
              <button aria-pressed={yearly} className={yearly ? "is-on" : ""} onClick={() => setYearly(true)}>
                Yearly · 1 month free
              </button>
            </div>
          ) : null}
        </div>

        <ol className="pr-panel" aria-label={college ? "College plans" : "Player and coach plans"}>
          {plans.map((p, i) => (
            <PlanColumn plan={p} i={i} key={p.name} />
          ))}
        </ol>

        {college ? (
          <p className="pr-terms">
            <span>Pay in 5 monthly installments if you prefer.</span>
            <span>Second team at the same school: 20% off.</span>
            <span>Extra hours: $35 each.</span>
            <a href="#questions">Ask about a full year</a>
          </p>
        ) : null}
      </div>
    </section>
  );
}

const QA: readonly { q: string; a: string }[] = [
  {
    q: "What counts as an hour?",
    a: "An hour of match video analyzed. A singles match is usually a little over an hour, and a singles dual about 7.",
  },
  {
    q: "What happens if we run out of hours?",
    a: "Add hours at $35 each, or move up a plan. We let you know at 50%, 80% and 100% of your hours.",
  },
  {
    q: "Can our school pay monthly?",
    a: "Yes. Spring plans can be paid in 5 monthly installments. Full-year plans run July to June and cost less per month. Ask us about one.",
  },
  {
    q: "What does human-checked mean?",
    a: "After Advantage Intelligence reads the video, a reviewer checks every point: the score, the server, the winner and how it ended.",
  },
  { q: "Does doubles work?", a: "Not yet. Singles only for now." },
  {
    q: "Do we need any hardware?",
    a: "No. PlaySight film or any camera that records 1080p at 30fps from behind the baseline works.",
  },
];

export function PricingFaq() {
  return (
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
  );
}
