"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDown, GraduationCap, UserRound } from "lucide-react";
import { ProofHead } from "@/components/perspective/band-parts";
import { BookCallButton } from "@/components/perspective/walkthrough-band";
import { trackEvent } from "@/lib/analytics";
import {
  COLLEGE_PLANS,
  EXTRA_HOUR_PRICE,
  OFFERED_COACH_PLANS,
  PRIORITY_ADDON_PERCENT,
  RUSH_PRICE,
  SECOND_TEAM_DISCOUNT_PERCENT,
  SPRING_SEASON,
  VERIFIED,
  YEARLY_MONTHS_FREE,
  signUpHref,
  usd,
} from "@/lib/plans";

/* The plans on /pricing and the one switch the rest of the page follows:
   College programs or Players and coaches. The bands after the plans are
   rendered on the server (page.tsx) and passed in; this island only picks
   which of them show and sets `data-audience`, which pricing.css reads to
   keep the bands' grey and white alternating.

   The plans are one comparison table per audience: the plans across the top,
   what changes between them down the side, both ways to pay as the first two
   rows (spring and full year for colleges, monthly and yearly for players and
   coaches), and the button at the foot of each column. Every figure is read
   from lib/plans; this file only decides the rows. The middle plan is the
   featured column. On a phone the same table is shown as a price list
   (PlanList): every plan's headline price at once, one plan open with its
   rows and button.

   College columns book the 20-minute walkthrough on Cal.com, carrying the
   plan with the booking; player and coach columns sign up in the dashboard. */

type Audience = "college" | "individual";
type Cell = ReactNode | null; // null: "Not included", in the muted ink
type Row = { label: string; cells: readonly Cell[]; big?: boolean };
type Section = { title?: string; rows: readonly Row[] };
// `price` is the headline figure, said once more in the phone list's closed row.
type Plan = { id: string; name: string; line: string; price: { fig: string; per: string }; cta: ReactNode };
type Table = { plans: readonly Plan[]; sections: readonly Section[]; featured: number; ctaNote: string };

const big = (fig: string, per?: string) => (
  <span>
    <span className="pr-fig">{fig}</span>
    {per ? <span className="pr-per">{per}</span> : null}
  </span>
);
const muted = (text: string, key?: string) => (
  <span className="pr-no" key={key}>
    {text}
  </span>
);

function ctaClass(i: number, featured: number) {
  return `btn btn-lg ${i === featured ? "btn-primary" : "btn-outline"}`;
}

function collegeTable(): Table {
  const P = COLLEGE_PLANS;
  const featured = P.findIndex((p) => p.id === "program");
  return {
    featured,
    ctaNote: "A 20-minute call on Zoom",
    plans: P.map((p, i) => ({
      id: p.id,
      name: p.name,
      line: p.line,
      price: { fig: usd(p.spring.price), per: "spring" },
      cta: (
        <BookCallButton
          className={ctaClass(i, featured)}
          placement="pricing-plan"
          plan={p.id}
          onOpen={() => trackEvent("plan_cta_clicked", { plan: p.id, period: "college" })}
        />
      ),
    })),
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
          {
            label: "Match video, spring",
            cells: P.map((p) => `${p.spring.hours} hours · about ${p.spring.matches} matches`),
          },
          {
            label: "Match video, full year",
            cells: P.map((p) => `${p.fullYear.hours} hours · about ${p.fullYear.matches} matches`),
          },
          { label: VERIFIED, cells: P.map(() => "Every match") },
          { label: "Roster", cells: P.map(() => "Your full roster") },
        ],
      },
      {
        title: "Speed",
        rows: [
          {
            label: "Rush",
            cells: P.map((p) =>
              p.rushIncluded
                ? `${p.rushIncluded} included each season, then ${usd(RUSH_PRICE)}`
                : `${usd(RUSH_PRICE)} a match`,
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
  const featured = P.findIndex((p) => p.id === "coach");
  const free = (p: (typeof P)[number]) => p.id === "free";
  return {
    featured,
    ctaNote: "Monthly or yearly at sign-up",
    plans: P.map((p, i) => ({
      id: p.id,
      name: p.name,
      line: p.line,
      price: free(p) ? { fig: "$0", per: "free" } : { fig: usd(p.monthly), per: "a month" },
      cta: (
        <a
          className={ctaClass(i, featured)}
          href={signUpHref(p.id)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("plan_cta_clicked", { plan: p.id, period: "individual" })}
        >
          {free(p) ? "Upload a free match" : `Choose ${p.name}`}
        </a>
      ),
    })),
    sections: [
      {
        rows: [
          {
            label: "Billed monthly",
            big: true,
            cells: P.map((p) => (free(p) ? big("$0") : big(usd(p.monthly), "a month"))),
          },
          {
            label: "Billed yearly",
            cells: P.map((p) =>
              free(p) ? (
                muted("Nothing to pay", p.id)
              ) : (
                <span key={p.id}>
                  {usd(p.yearly)} a year
                  <span className="pr-save">
                    {YEARLY_MONTHS_FREE} month{YEARLY_MONTHS_FREE === 1 ? "" : "s"} free
                  </span>
                </span>
              ),
            ),
          },
        ],
      },
      {
        title: "What you get",
        rows: [
          {
            label: "Match video each month",
            cells: P.map((p) => (free(p) ? "1 match, one time" : `${p.hours} hours · about ${p.matches} matches`)),
          },
          { label: "Stats and film", cells: P.map(() => "Included") },
          { label: "Fix any point yourself", cells: P.map(() => "Included") },
          { label: VERIFIED, cells: P.map((p) => (p.verified ? "Every match" : null)) },
          { label: "Ask, in Advantage or your AI app", cells: P.map((p) => (free(p) ? null : "Included")) },
        ],
      },
      {
        title: "Speed",
        rows: [{ label: "Rush", cells: P.map((p) => (free(p) ? null : `${usd(RUSH_PRICE)} a match`)) }],
      },
    ],
  };
}

// Built once: they read only module constants.
const TABLES: Record<Audience, Table> = { college: collegeTable(), individual: coachTable() };

function PlanTable({ table, tabId }: { table: Table; tabId: string }) {
  const cols = table.plans.length;
  const tint = (i: number) => (i === table.featured ? "is-featured" : undefined);
  return (
    <div className="pr-plans" id="pr-plans-panel" role="tabpanel" aria-labelledby={tabId}>
      <PlanList table={table} />
      <div className="mock-frame pr-table-wrap" tabIndex={0}>
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
                        {c === null ? muted("Not included") : c}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
            <tr className="pr-ctas">
              <td className="pr-cta-note">{table.ctaNote}</td>
              {table.plans.map((p, i) => (
                <td className={tint(i)} key={p.id}>
                  {p.cta}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* "200 hours · about 110 matches" reads as the hours, with the estimate
   quieter under them, in the phone list. */
function lead(cell: Cell): ReactNode {
  if (cell === null) return muted("Not included");
  if (typeof cell !== "string" || !cell.includes(" · ")) return cell;
  const [first, ...rest] = cell.split(" · ");
  return (
    <>
      {first}
      <span className="pr-sub">{rest.join(" · ")}</span>
    </>
  );
}

/* The phone's version of the table (pricing.css shows it below 641px and the
   table above): a list of the plans with each one's headline price, so all
   of them read at once, and one plan open at a time with its rows, its
   button and the button's note. It opens on the featured plan. The headline
   price row is the closed row's price, so it is not repeated inside. */
function PlanList({ table }: { table: Table }) {
  const [open, setOpen] = useState<number | null>(table.featured);
  return (
    <div className="mock-frame pr-list">
      {table.plans.map((p, i) => {
        const isOpen = open === i;
        const id = `pr-list-${p.id}`;
        return (
          <div className={isOpen ? "pr-item is-open" : "pr-item"} key={p.id}>
            <button
              type="button"
              className="pr-item-head"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="pr-item-name">
                <span className="pr-name">{p.name}</span>
                <span className="pr-line">{p.line}</span>
              </span>
              <span className="pr-item-price">
                <span className="pr-item-fig">{p.price.fig}</span>
                <span className="pr-per">{p.price.per}</span>
              </span>
              <ChevronDown className="pr-item-chev" size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <div className="pr-item-body" id={id} hidden={!isOpen}>
              {table.sections.map((sec, si) => (
                <Fragment key={si}>
                  {sec.title ? <p className="pr-item-sec">{sec.title}</p> : null}
                  <dl className="pr-item-rows">
                    {sec.rows
                      .filter((r) => !r.big)
                      .map((r) => (
                        <div key={r.label}>
                          <dt>{r.label}</dt>
                          <dd>{lead(r.cells[i])}</dd>
                        </div>
                      ))}
                  </dl>
                </Fragment>
              ))}
              <div className="pr-item-cta">
                {p.cta}
                <span className="pr-cta-note">{table.ctaNote}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const AUDIENCES: readonly { id: Audience; label: string; Icon: typeof GraduationCap }[] = [
  { id: "college", label: "College programs", Icon: GraduationCap },
  { id: "individual", label: "Players and coaches", Icon: UserRound },
];

export function PricingBody({
  pay,
  after,
  closeCollege,
  closeIndividual,
}: {
  // The college-only band, under the plans.
  pay: ReactNode;
  // What every paid plan returns and the questions, for both audiences.
  after: ReactNode;
  closeCollege: ReactNode;
  closeIndividual: ReactNode;
}) {
  const [tab, setTab] = useState<Audience>("college");
  const college = tab === "college";
  const index = AUDIENCES.findIndex((a) => a.id === tab);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move along the tabs and select as they go, Home and End jump
  // to the ends: the keyboard pattern for a tab list, as on the home page.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = AUDIENCES.length;
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const next = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : step ? (index + step + n) % n : -1;
    if (next < 0) return;
    e.preventDefault();
    setTab(AUDIENCES[next].id);
    tabs.current[next]?.focus();
  };

  useEffect(() => {
    trackEvent("pricing_viewed", { tab, period: "table" });
  }, [tab]);

  return (
    <div className="pr-body" data-audience={tab}>
      <section className="band heads-centered" id="plans">
        <div className="wrap">
          <ProofHead
            eyebrow="The plans"
            title={college ? "Priced by the season." : "Priced by the month."}
            tail="Charged in hours of video."
            aside={
              college
                ? `Spring runs ${SPRING_SEASON}. Every plan covers your full roster.`
                : "For players and private coaches. Choose monthly or yearly when you sign up."
            }
          />

          <div
            className="ps-tabs pr-switch"
            role="tablist"
            aria-label="Who the plans are for"
            style={{ "--ps-i": index, "--ps-n": AUDIENCES.length } as CSSProperties}
            onKeyDown={onKey}
          >
            <span className="ps-thumb" aria-hidden="true" />
            {AUDIENCES.map(({ id, label, Icon }, i) => (
              <button
                key={id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`pr-tab-${id}`}
                aria-selected={tab === id}
                aria-controls="pr-plans-panel"
                tabIndex={tab === id ? 0 : -1}
                className={tab === id ? "is-on" : undefined}
                onClick={() => setTab(id)}
              >
                <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <PlanTable
            key={tab}
            table={TABLES[tab]}
            tabId={`pr-tab-${tab}`}
          />

          <p className="pr-terms">
            <span>Extra hours are {usd(EXTRA_HOUR_PRICE)} each, any time.</span>
            <span>Match counts are an estimate; hours are what you are charged in.</span>
            {college ? (
              <>
                <span>A second team at the same school is {SECOND_TEAM_DISCOUNT_PERCENT}% off.</span>
                <span>
                  Rather write? <a href="/contact#write">Send us a message</a> and we reply with a quote.
                </span>
              </>
            ) : (
              <span>Monthly hours don’t carry over.</span>
            )}
          </p>
        </div>
      </section>

      {college ? pay : null}
      {after}
      {college ? closeCollege : closeIndividual}
    </div>
  );
}
