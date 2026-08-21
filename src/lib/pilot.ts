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
export const PILOT_ONBOARDING_WINDOW =
  "Onboarding runs through September for the fall season.";

// Rendered as a data ledger rather than a pricing card — `s` is the qualifying
// note that sits beside a figure.
export const PILOT_TERMS: readonly { l: string; v: string; s?: string }[] = [
  { l: "Free through", v: PILOT_END_DATE },
  { l: "Processed video", v: PILOT_HOURS, s: PILOT_HOURS_SCOPE },
  { l: "Hardware · contract · cost", v: "None" },
  { l: "Paid plans begin", v: PILOT_PAID_PLANS_BEGIN },
];
