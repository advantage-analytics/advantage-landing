// The commercial terms of the Free Fall Season Pilot.
//
// Every surface that quotes a date, an allowance, or the onboarding window
// reads them from here: the home page's beta lanes and FAQ, /pilot's terms
// strip, its questions, and that route's metadata. A coach reads at least two
// of those before deciding, and /pilot promises "four terms, no fine print" —
// so two versions of the offer is exactly the failure the copy says can't
// happen.
// Extending the pilot should be one edit in this file — plus the two link
// preview cards (src/app/opengraph-image.jpg and src/app/pilot/opengraph-image.jpg
// with their .alt.txt), which have the end date baked into the artwork.

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
  "The free beta gives you 2 hours of film a month. No program or card needed.";

// /pilot's terms strip: the label, the figure, and the line under it. Every
// term carries its line so the four columns sit level.
export const PILOT_TERMS: readonly { l: string; v: string; s: string }[] = [
  { l: "Cost", v: "Free", s: `through ${PILOT_END_DATE}` },
  { l: "Film", v: PILOT_HOURS, s: PILOT_HOURS_SCOPE },
  { l: "Commitment", v: "None", s: "No hardware, no contract" },
  { l: "Paid plans", v: PILOT_PAID_PLANS_BEGIN, s: "Nothing is charged before then" },
];
