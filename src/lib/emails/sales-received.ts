// Sent to a coach right after their message on /contact is filed as a Sales
// lead (a head or assistant coach writing through the form).
//
// It repeats what they asked for, so a wrong team or season is caught before
// the quote is written, and says what happens next: a person replies with a
// quote. No reply time is promised beyond the contact form's own.

import {
  type EmailContent,
  PRICING_URL,
  button,
  emailShell,
  escapeHtml,
  fallbackLink,
  firstName,
  heading,
  helpBlock,
  note,
  panel,
  paras,
  textFooter,
} from "./layout";

export type SalesReceivedInput = {
  name: string;
  school: string;
  teams: string;
  season: string;
  plan: string;
  rosterSize: string;
};

function rows(input: SalesReceivedInput): { l: string; v: string }[] {
  return [
    { l: "School", v: input.school },
    { l: "Teams", v: input.teams },
    { l: "Season", v: input.season },
    { l: "Plan", v: input.plan || "Not sure yet" },
    { l: "Roster size", v: input.rosterSize },
  ].filter((r) => r.v.trim());
}

export function salesReceivedEmail(input: SalesReceivedInput): EmailContent {
  const first = firstName(input.name);
  const list = rows(input);

  const body = [
    heading("REQUEST RECEIVED", "We've got your request"),
    paras([
      `Thanks, ${escapeHtml(first)}. A person reads this and replies with a quote for your program.`,
      "If anything below is wrong, reply to this email and we will fix it before we quote.",
    ]),
    panel(list.map((r) => ({ l: r.l, v: escapeHtml(r.v) }))),
    button("See the plans", PRICING_URL),
    fallbackLink(PRICING_URL),
    note("You're receiving this because you asked about a plan at advantage-analytics.com."),
    helpBlock(),
  ].join("\n");

  return {
    subject: "We've got your request",
    html: emailShell({
      title: "We've got your request | Advantage",
      preheader: "A person reads it and replies with a quote for your program.",
      body,
    }),
    text: `WE'VE GOT YOUR REQUEST

Thanks, ${first}. A person reads this and replies with a quote for your program.

If anything below is wrong, reply to this email and we will fix it before we quote.

${list.map((r) => `${r.l}: ${r.v}`).join("\n")}

${PRICING_URL}

You're receiving this because you asked about a plan at advantage-analytics.com.

${textFooter()}`,
  };
}
