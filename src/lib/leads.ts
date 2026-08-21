// Every form that posts to /api/leads.
//
// Shared across the wire on purpose. `Source` is free text in Airtable, so the
// route validates against this list and falls back to "Landing CTA" for
// anything else — which means a typo'd or renamed source on the client fails
// silently, mislabelling the column triage sorts on. Typing both ends against
// the same union turns that into a compile error instead.
export const LEAD_SOURCES = ["Landing CTA", "Pilot page"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
