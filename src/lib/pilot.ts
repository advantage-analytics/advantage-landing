// The commercial terms of the Free Fall Season Pilot.
//
// Every surface that quotes a date, an allowance, or the onboarding window
// reads them from here: the landing page's fall-pilot band, /pilot's ledger,
// /pilot's Q&A, and that route's metadata. A coach reads at least two of those
// before deciding, and the band promises "four terms, no fine print" — so two
// versions of the offer is exactly the failure the copy claims can't happen.
// Extending the pilot should be one edit in this file.

export const PILOT_END_DATE = "December 31, 2026";
export const PILOT_PAID_PLANS_BEGIN = "January 2027";
export const PILOT_HOURS = "75 hours";
export const PILOT_HOURS_SCOPE = "per program, per month";
// The same allowance said attributively, e.g. "its own 75-hour budget".
export const PILOT_HOURS_ADJECTIVE = "75-hour";
// Individuals (no program) during the same free window: the open beta, at the
// dashboard's 2-hour monthly video cap. The launch surfaces (hero eyebrow, beta
// cards, final band, FAQ, the access card) quote the window and this lane in
// their short form.
// Non-breaking space: "Dec" and "31" never split across a line.
export const BETA_END_SHORT = "Dec\u00a031";
export const INDIVIDUAL_BETA_SHORT =
  "Free beta — 2 hrs/month, self-serve, no program required.";

// Rendered as a data ledger rather than a pricing card — `s` is the qualifying
// note that sits beside a figure.
export const PILOT_TERMS: readonly { l: string; v: string; s?: string }[] = [
  { l: "Free through", v: PILOT_END_DATE },
  { l: "Processed video", v: PILOT_HOURS, s: PILOT_HOURS_SCOPE },
  { l: "Hardware · contract · cost", v: "None" },
  { l: "Paid plans begin", v: PILOT_PAID_PLANS_BEGIN },
];
