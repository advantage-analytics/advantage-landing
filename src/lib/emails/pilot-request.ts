// Sent to a coach the moment they submit the "Join the pilot" form, on the
// landing page or on /pilot.
//
// Two things this email deliberately does not do.
//
// It gives no date. The dashboard at app.advantage-analytics.com isn't open
// yet, so "we'll reply within one business day" — which is what the form's
// success state used to promise — is a commitment to a thing that doesn't
// exist. The promise here is the one we can keep: we'll tell them when the
// pilot is ready to take programs on.
//
// And it does not offer /send-a-match. That offer belongs to the cold outreach
// campaign and is reserved for it: a coach who arrives through the campaign has
// been asked for one specific thing, and repeating the ask to everyone who
// joins the pilot queue spends it on an audience that didn't come for it. So
// this email carries no call to action at all. Someone joining a waitlist has
// nothing to do next, and a button that admits that is better than one that
// invents an errand.

import {
  type EmailContent,
  emailShell,
  escapeHtml,
  heading,
  helpBlock,
  note,
  panel,
  paras,
  strong,
} from "./layout";
import {
  PILOT_END_DATE,
  PILOT_HOURS,
  PILOT_HOURS_SCOPE,
} from "../pilot";

export type PilotRequestInput = {
  name: string;
  email: string;
  university: string;
  role: string;
  division: string;
};

// Coaches sign off with a first name; the form asks for a full one.
function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

export function pilotRequestEmail(input: PilotRequestInput): EmailContent {
  const first = escapeHtml(firstName(input.name));
  // Falls back rather than printing an empty clause. University is required by
  // the form today, but this email shouldn't break if that ever softens.
  const program = input.university.trim();
  const programPhrase = program ? escapeHtml(program) : "your program";

  const body = [
    heading("PILOT REQUEST RECEIVED", "You're on the list for the Free Fall Pilot"),
    paras([
      `${first}, thanks for putting ${strong(programPhrase)} forward for the Advantage Free Fall Pilot.`,
      `We're still building the program out. Rather than give you a start date we'd have to move, we'll email you the moment the pilot is ready to take programs on — that's the next thing you'll hear from us, and there's nothing you need to do until then.`,
      `The offer itself hasn't moved: free through ${strong(PILOT_END_DATE)}, ${PILOT_HOURS} of processed video ${PILOT_HOURS_SCOPE}, with no hardware, no contract and no cost.`,
    ]),

    panel(
      [
        { l: "Program", v: escapeHtml(program) },
        { l: "Your role", v: escapeHtml(input.role) },
        { l: "Division", v: escapeHtml(input.division) },
        { l: "Email", v: escapeHtml(input.email) },
      ].filter((r) => r.v),
    ),

    note(
      "You're receiving this because you requested the Free Fall Pilot at advantage-analytics.com. If any of the details above are wrong, just reply and we'll fix them before we set anything up.",
    ),
    helpBlock(),
  ].join("\n");

  return {
    subject: program
      ? `${program} is on the Free Fall Pilot list`
      : "You're on the Free Fall Pilot list",
    html: emailShell({
      title: "Your Free Fall Pilot request — Advantage",
      preheader:
        "We'll email you the moment the pilot is ready to take programs on. Nothing needed from you until then.",
      body,
    }),
    text: textVersion(input, firstName(input.name), program),
  };
}

// Plain-text alternative. Not decoration: HTML-only mail is a spam-filter
// signal, and some clients still render text by preference.
function textVersion(
  input: PilotRequestInput,
  first: string,
  program: string,
): string {
  const details = [
    program ? `Program: ${program}` : "",
    input.role ? `Your role: ${input.role}` : "",
    input.division ? `Division: ${input.division}` : "",
    `Email: ${input.email}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `YOU'RE ON THE LIST FOR THE FREE FALL PILOT

${first}, thanks for putting ${program || "your program"} forward for the Advantage Free Fall Pilot.

We're still building the program out. Rather than give you a start date we'd have to move, we'll email you the moment the pilot is ready to take programs on — that's the next thing you'll hear from us, and there's nothing you need to do until then.

The offer itself hasn't moved: free through ${PILOT_END_DATE}, ${PILOT_HOURS} of processed video ${PILOT_HOURS_SCOPE}, with no hardware, no contract and no cost.

${details}

You're receiving this because you requested the Free Fall Pilot at advantage-analytics.com. If any of the details above are wrong, just reply and we'll fix them before we set anything up.

Need help? Reach us at team@advantage-analytics.com.

© 2026 Advantage Analytics LLC · advantage-analytics.com`;
}
