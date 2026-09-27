// Every form that posts to /api/leads.
//
// Shared across the wire on purpose. `Source` is free text in Airtable, so the
// route validates against this list and falls back to "Landing CTA" for
// anything else — which means a typo'd or renamed source on the client fails
// silently, mislabelling the column triage sorts on. Typing both ends against
// the same union turns that into a compile error instead.
// "Missing school" is the only live source: a coach whose school isn't listed
// in the dashboard, from the form at the foot of /pilot. "Landing CTA" and
// "Pilot page" were the retired pilot-application form; they stay on the list
// so a cached copy of that form still lands as a labelled row rather than a
// mislabelled one.
export const LEAD_SOURCES = ["Landing CTA", "Pilot page", "Missing school"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
