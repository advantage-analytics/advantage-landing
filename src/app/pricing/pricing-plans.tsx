"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { FaqItem } from "@/components/perspective/faq-item";
import { CONTACT_EMAIL } from "@/lib/links";
import { trackEvent } from "@/lib/analytics";
import { PRICING_QA } from "@/lib/plan-faq";
import {
  COLLEGE_PLANS,
  OFFERED_COACH_PLANS,
  EXTRA_HOUR_PRICE,
  PRIORITY_ADDON_PERCENT,
  RUSH_PRICE,
  SECOND_TEAM_DISCOUNT_PERCENT,
  SPRING_SEASON,
  VERIFIED,
  YEARLY_MONTHS_FREE,
  salesHref,
  signUpHref,
  usd,
} from "@/lib/plans";

/* The plans, as one comparison table per audience: the plans across the
   top, what changes between them down the side, both ways to pay as the
   first two rows (spring and full year for colleges, monthly and yearly for
   players and coaches) so there is no toggle to miss, and the button at the
   foot of each column. Every figure is read from lib/plans; this file only
   decides the rows. The middle plan's column is tinted as the one most
   people pick. On a narrow screen the table scrolls sideways under a pinned
   first column. */

type Cell = ReactNode | null; // null: "Not included", in the muted ink
type Row = { label: string; cells: readonly Cell[]; big?: boolean };
type Section = { title?: string; rows: readonly Row[] };
type Plan = { id: string; name: string; line: string; cta: string; href: string; external: boolean };
type Table = { plans: readonly Plan[]; sections: readonly Section[]; featured: number };

const save = <span className="pr-save">{YEARLY_MONTHS_FREE} month free</span>;
const big = (fig: string, per?: string) => (
  <span>
    <span className="pr-fig">{fig}</span>
    {per ? <span className="pr-per">{per}</span> : null}
  </span>
);

function collegeTable(): Table {
  const P = COLLEGE_PLANS;
  return {
    featured: P.findIndex((p) => p.id === "program"),
    plans: P.map((p) => ({ id: p.id, name: p.name, line: p.line, cta: "Talk to us", href: salesHref(p.id), external: false })),
    sections: [
      {
        rows: [
          { label: "Spring season", big: true, cells: P.map((p) => big(usd(p.spring.price))) },
          { label: "Full year", cells: P.map((p) => usd(p.fullYear.price)) },
        ],
      },
      {
        title: "What you get",
        rows: [
          { label: "Hours of video, spring", cells: P.map((p) => `${p.spring.hours} · about ${p.spring.matches} matches`) },
          { label: "Hours of video, full year", cells: P.map((p) => `${p.fullYear.hours} · about ${p.fullYear.matches} matches`) },
          { label: VERIFIED, cells: P.map(() => "Every match") },
          { label: "Roster", cells: P.map(() => "Your full roster") },
        ],
      },
      {
        title: "Speed",
        rows: [
          {
            label: "Rush matches",
            cells: P.map((p) =>
              p.rushIncluded ? `${p.rushIncluded} each season, then ${usd(RUSH_PRICE)}` : `${usd(RUSH_PRICE)} each`,
            ),
          },
          {
            label: "Priority",
            cells: P.map((p) =>
              p.priorityHours
                ? `Up to ${p.priorityHours} hours a month`
                : p.priorityAddon
                  ? `Add-on, +${PRIORITY_ADDON_PERCENT}%`
                  : null,
            ),
          },
        ],
      },
    ],
  };
}

function coachTable(): Table {
  const P = OFFERED_COACH_PLANS;
  const free = (p: (typeof P)[number]) => p.id === "free";
  return {
    featured: P.findIndex((p) => p.id === "coach"),
    plans: P.map((p) => ({
      id: p.id,
      name: p.name,
      line: p.line,
      cta: free(p) ? "Upload a free match" : `Choose ${p.name}`,
      href: signUpHref(p.id),
      external: true,
    })),
    sections: [
      {
        rows: [
          { label: "Billed monthly", big: true, cells: P.map((p) => (free(p) ? big("$0") : big(usd(p.monthly), "a month"))) },
          {
            label: "Billed yearly",
            cells: P.map((p) =>
              free(p) ? (
                <span className="pr-no" key={p.id}>
                  One match, one time
                </span>
              ) : (
                <span key={p.id}>
                  {usd(p.yearly)} a year{save}
                </span>
              ),
            ),
          },
        ],
      },
      {
        title: "What you get",
        rows: [
          { label: "Hours of video", cells: P.map((p) => (free(p) ? "1 match" : `${p.hours} a month`)) },
          { label: "About how many matches", cells: P.map((p) => (free(p) ? "1" : `${p.matches} a month`)) },
          { label: "Advantage Intelligence stats and film", cells: P.map(() => "Included") },
          { label: "Fix any point yourself", cells: P.map(() => "Included") },
          { label: VERIFIED, cells: P.map((p) => (p.verified ? "Every match" : null)) },
          { label: "Ask, and your AI apps", cells: P.map((p) => (free(p) ? null : "Included")) },
        ],
      },
      {
        title: "Speed",
        rows: [{ label: "Rush matches", cells: P.map((p) => (free(p) ? null : `${usd(RUSH_PRICE)} each`)) }],
      },
    ],
  };
}

// Built once: they read only module constants.
const COLLEGE_TABLE = collegeTable();
const COACH_TABLE = coachTable();

function PlanTable({ table, label, tab }: { table: Table; label: string; tab: string }) {
  const cols = table.plans.length;
  const tint = (i: number) => (i === table.featured ? "is-featured" : undefined);
  return (
    <div className="pr-table-wrap reveal" role="region" aria-label={label} tabIndex={0}>
      <table className="pr-table">
        <thead>
          <tr>
            <td className="pr-corner" />
            {table.plans.map((p, i) => (
              <th scope="col" className={tint(i)} key={p.id}>
                <span className="pr-name">{p.name}</span>
                <span className="pr-line">{p.line}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.sections.map((sec, si) => (
            <Fragment key={si}>
              {sec.title ? (
                <tr className="pr-sec">
                  <th scope="rowgroup" colSpan={cols + 1}>
                    {sec.title}
                  </th>
                </tr>
              ) : null}
              {sec.rows.map((r) => (
                <tr key={r.label} className={r.big ? "is-price" : undefined}>
                  <th scope="row">{r.label}</th>
                  {r.cells.map((c, i) => (
                    <td className={tint(i)} key={i}>
                      {c === null ? <span className="pr-no">Not included</span> : c}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
          <tr className="pr-ctas">
            <td />
            {table.plans.map((p, i) => (
              <td className={tint(i)} key={p.id}>
                <a
                  className={`btn btn-lg ${i === table.featured ? "btn-primary" : "btn-outline"}`}
                  href={p.href}
                  {...(p.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onClick={() => trackEvent("plan_cta_clicked", { plan: p.id, period: tab })}
                >
                  {p.cta}
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function PricingPlans() {
  const [tab, setTab] = useState<"college" | "individual">("college");
  const college = tab === "college";

  useEffect(() => {
    trackEvent("pricing_viewed", { tab, period: "table" });
  }, [tab]);

  return (
    <section className="band alt" id="plans">
      <div className="wrap">
        <div className="proof-head pr-head reveal">
          <div className="sec-head">
            <span className="eyebrow">The plans</span>
            <h2>{college ? "Priced by the season." : "Priced by the month."}</h2>
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

        <p className="pr-intro reveal">
          {college
            ? `Spring runs ${SPRING_SEASON}. Every plan covers your full roster and is charged in hours of video.`
            : "For players and private coaches. Charged in hours of video each month. Choose monthly or yearly when you sign up."}
        </p>

        {college ? (
          <PlanTable table={COLLEGE_TABLE} label="College plans compared" tab="college" key="college" />
        ) : (
          <PlanTable table={COACH_TABLE} label="Player and coach plans compared" tab="individual" key="individual" />
        )}

        <p className="pr-terms">
          <span>Extra hours are {usd(EXTRA_HOUR_PRICE)} each, any time.</span>
          <span>Match counts are an estimate; hours are what you are charged in.</span>
          {college ? <span>A second team at the same school is {SECOND_TEAM_DISCOUNT_PERCENT}% off.</span> : null}
        </p>
      </div>
    </section>
  );
}

export function PricingFaq() {
  return (
    <section className="band alt" id="questions">
      <div className="wrap faq">
        <div className="faq-intro sec-head reveal">
          <span className="eyebrow">Questions</span>
          <h2>Straight answers.</h2>
        </div>
        <div className="faq-list reveal">
          {PRICING_QA.map((x) => (
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
