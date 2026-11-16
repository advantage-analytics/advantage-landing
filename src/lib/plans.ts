// The paid plans, from January 1, 2027.
//
// Every price, hour count and match count on the site comes from this file:
// /pricing, the home page FAQ, /tennis-analytics, llms.txt, the structured
// data, the "Talk to us" form and the terms. Nothing is typed into a page, so
// a price change is one edit here (plus /pricing's link preview card if its
// artwork ever quotes a figure).
//
// Hours of video are what a plan is charged in. Match counts are an estimate
// beside them, at about HOURS_PER_MATCH hours of video for one singles match,
// and are stored (not computed) so the page shows the rounded figures agreed
// with the plans.

import { links } from "./links";

export const HOURS_PER_MATCH = 1.8;

// Add-ons and terms that apply across plans.
export const EXTRA_HOUR_PRICE = 35;
export const RUSH_PRICE = 25;
export const PRIORITY_ADDON_PERCENT = 15;
export const SECOND_TEAM_DISCOUNT_PERCENT = 20;
export const MAX_INSTALMENTS = 5;
export const PRICE_LOCK_MONTHS = 12;
export const SPRING_SEASON = "January to May";
export const COLLEGE_PAYMENT_METHODS = "card, ACH or purchase order";

// The individual free offer: one match, AI stats only. One switch, so the
// offer can be withdrawn without hunting through the pages.
export const FREE_MATCH_OFFER = true;
export const FREE_MATCH_LINE = "Your first match is free.";

// The human-checked tier, worded as the dashboard words it.
export const VERIFIED = "Verified by Advantage";

export function usd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/* ---------- Players and coaches: billed monthly or yearly ---------- */

export type CoachPlan = {
  id: "free" | "coach" | "coach-pro";
  name: string;
  line: string;
  monthly: number;
  yearly: number;
  // Per month; the free plan's single match is one time.
  hours: number | null;
  matches: number;
  verified: boolean;
};

export const COACH_PLANS: readonly CoachPlan[] = [
  {
    id: "free",
    name: "Free",
    line: FREE_MATCH_LINE,
    monthly: 0,
    yearly: 0,
    hours: null,
    matches: 1,
    verified: false,
  },
  {
    id: "coach",
    name: "Coach",
    line: "A few matches every month.",
    monthly: 150,
    yearly: 1650,
    hours: 5,
    matches: 3,
    verified: true,
  },
  {
    id: "coach-pro",
    name: "Coach Pro",
    line: "For a full match schedule.",
    monthly: 300,
    yearly: 3300,
    hours: 10,
    matches: 5,
    verified: true,
  },
];

// The plans on offer (the free plan only while the offer runs), and the
// cheapest paid one, which "from $X a month" lines quote.
export const OFFERED_COACH_PLANS = COACH_PLANS.filter((p) => FREE_MATCH_OFFER || p.id !== "free");
export const ENTRY_COACH_PLAN = COACH_PLANS.find((p) => p.id === "coach")!;

// Yearly costs this many monthly payments: the rest of the year is free.
export const YEARLY_MONTHS_FREE = 12 - Math.round(ENTRY_COACH_PLAN.yearly / ENTRY_COACH_PLAN.monthly);

/** Sign-up, carrying the plan for the dashboard to read. Paid plans start
    monthly; the dashboard offers yearly at checkout. */
export function signUpHref(plan: CoachPlan["id"]): string {
  const q = new URLSearchParams({ plan });
  if (plan !== "free") q.set("period", "monthly");
  return `${links.signUp}?${q}`;
}

/* ---------- College programs: priced by the season ---------- */

export type Season = "spring" | "full-year";
export const SEASON_LABEL: Record<Season, string> = { spring: "Spring", "full-year": "Full year" };

export type Allowance = { price: number; hours: number; matches: number };

export type CollegePlan = {
  id: "starter" | "program" | "elite";
  name: string;
  line: string;
  spring: Allowance;
  fullYear: Allowance;
  rushIncluded: number;
  // Hours a month that go at Priority, when the plan includes any.
  priorityHours: number | null;
  // Priority can be bought on top (+PRIORITY_ADDON_PERCENT) when not included.
  priorityAddon: boolean;
};

export const COLLEGE_PLANS: readonly CollegePlan[] = [
  {
    id: "starter",
    name: "Starter",
    line: "Your biggest duals.",
    spring: { price: 3000, hours: 80, matches: 45 },
    fullYear: { price: 4800, hours: 130, matches: 70 },
    rushIncluded: 0,
    priorityHours: null,
    priorityAddon: false,
  },
  {
    id: "program",
    name: "Program",
    line: "Your whole spring season.",
    spring: { price: 7500, hours: 200, matches: 110 },
    fullYear: { price: 10500, hours: 280, matches: 155 },
    rushIncluded: 3,
    priorityHours: null,
    priorityAddon: true,
  },
  {
    id: "elite",
    name: "Elite",
    line: "Season, tournaments and practice.",
    spring: { price: 11000, hours: 300, matches: 165 },
    fullYear: { price: 15000, hours: 400, matches: 220 },
    rushIncluded: 6,
    priorityHours: 30,
    priorityAddon: false,
  },
];

export function allowance(plan: CollegePlan, season: Season): Allowance {
  return season === "spring" ? plan.spring : plan.fullYear;
}

/** The "Talk to us" form, with the plan preselected. */
export function salesHref(plan?: CollegePlan["id"]): string {
  return plan ? `/contact?${new URLSearchParams({ plan })}` : "/contact";
}
