// Every form that posts to /api/leads.
//
// Shared across the wire on purpose. `Source` is free text in Airtable, so the
// route validates against this list and falls back to "Sales" for anything
// else, which means a typo'd or renamed source on the client fails silently,
// mislabelling the column triage sorts on. Typing both ends against the same
// union turns that into a compile error instead.
//
// "Sales" is the only live browser source: the college form on /contact.
// "Landing CTA", "Pilot page" and "Missing school" belonged to the 2026 pilot.
// They stay on the list so the old Airtable rows keep a recognised label and a
// cached copy of an old form still lands as a labelled row.
// "Walkthrough" is written by the Cal.com webhook (/api/cal-booking), never by
// a browser form.
export const LEAD_SOURCES = ["Sales", "Landing CTA", "Pilot page", "Missing school", "Walkthrough"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

// The college form's choices, shared so the route accepts exactly what the
// form offers.
export const TEAM_CHOICES = ["Men's", "Women's", "Both"] as const;
export type TeamChoice = (typeof TEAM_CHOICES)[number];
