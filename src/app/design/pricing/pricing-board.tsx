"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  CREDIT_PACKS,
  PLANS,
  type Audience,
  type Billing,
  type Plan,
} from "@/lib/pricing";
import { links } from "@/lib/links";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

/* Two switches over one row of three cards: who it's for, and how they pay.
   Yearly is "a season" for programs, since a team buys for its calendar, not
   for twelve months. */
export function PricingBoard() {
  const [audience, setAudience] = useState<Audience>("players");
  const [billing, setBilling] = useState<Billing>("monthly");
  const yearlyLabel = audience === "teams" ? "Yearly or season" : "Yearly";
  // Players pay 10 months for 12. A 6-month season is priced near 5 months.
  const yearlyBadge = audience === "teams" ? "Save over 15%" : "2 months free";

  return (
    <section className="pr-board">
      <div className="wrap">
        <div className="pr-switches reveal">
          <Segmented
            label="Who is it for"
            value={audience}
            onChange={setAudience}
            options={[
              { v: "players", t: "Players" },
              { v: "teams", t: "Coaches and teams" },
            ]}
          />
          <Segmented
            label="Billing"
            value={billing}
            onChange={setBilling}
            options={[
              { v: "monthly", t: "Monthly" },
              { v: "yearly", t: yearlyLabel, badge: yearlyBadge },
            ]}
          />
        </div>

        <div className="pr-cards">
          {PLANS[audience].map((p) => (
            <PlanCard key={p.id} plan={p} billing={billing} />
          ))}
        </div>

        <div className="pr-credits">
          <div className="pr-credits-head">
            <span className="eyebrow">Credit packs</span>
            <h3>Need more film? Top up any time.</h3>
            <p>Credits work on any plan, Free included, and last 12 months.</p>
          </div>
          <dl className="pr-packs">
            {CREDIT_PACKS.map((c) => (
              <div className="pr-pack" key={c.hours}>
                <dt>{c.hours}</dt>
                <dd className="v">{usd(c.price)}</dd>
                <dd className="s">{c.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const yearly = billing === "yearly" && plan.monthly > 0;
  const price = yearly ? plan.yearly : plan.monthly;
  const unit = plan.monthly === 0 ? "forever" : yearly ? `/ ${plan.yearlyUnit}` : "/ month";
  const perMonth = yearly
    ? plan.yearlyUnit === "season"
      ? `${usd(Math.round(plan.yearly / 6))} a month over a 6-month season`
      : `${usd(Math.round(plan.yearly / 12))} a month, billed yearly`
    : plan.monthly === 0
      ? "No card needed"
      : "Billed monthly, cancel any time";

  return (
    <article className={`pr-card${plan.featured ? " is-featured" : ""}`}>
      {plan.featured ? <span className="pr-flag">Most popular</span> : null}
      <h3>{plan.name}</h3>
      <p className="pr-for">{plan.forWho}</p>
      <p className="pr-price">
        <span className="v">{usd(price)}</span>
        <span className="u">{unit}</span>
      </p>
      <p className="pr-bill">{perMonth}</p>
      <div className="pr-hours">
        <span className="h">{plan.hours}</span>
        <span className="n">{plan.hoursNote}</span>
      </div>
      <ul className="pr-feats">
        {plan.features.map((f) => (
          <li key={f}>
            <Check size={15} strokeWidth={1.75} aria-hidden="true" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        className={`btn btn-lg ${plan.featured ? "btn-primary" : "btn-outline"} pr-cta`}
        href={links.signUp}
      >
        {plan.cta}
      </a>
    </article>
  );
}

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { v: T; t: string; badge?: string }[];
}) {
  return (
    <div className="pr-seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          className={value === o.v ? "is-on" : undefined}
          onClick={() => onChange(o.v)}
        >
          {o.t}
          {o.badge ? <span className="pr-badge">{o.badge}</span> : null}
        </button>
      ))}
    </div>
  );
}
