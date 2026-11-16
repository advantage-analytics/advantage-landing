// Sent to whoever fills the /contact form, right after their message is filed.
//
// The one thing this email has that the others don't is the message quoted back
// verbatim. That is not politeness: it is proof the text arrived intact and a
// chance to notice a typo'd address before our reply bounces into nothing.
//
// Pricing is the thing to point at, because it's what most people writing in
// are asking about. The sender might be a player, a parent or a coach, so the
// copy assumes no program.

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
  strong,
  textFooter,
} from "./layout";

export type ContactReceivedInput = {
  name: string;
  email: string;
  role: string;
  message: string;
  // The API route accepts both; the form doesn't collect them today. Rendered
  // when present rather than reserved as empty rows.
  university?: string;
  phone?: string;
};

// Paragraph breaks survive as blank lines; single breaks become <br>. Anything
// less and a message written in short lines arrives as one run-on block.
function quoteMessage(message: string): string {
  const text = message.trim();
  if (!text) return "(no message)";
  return escapeHtml(text)
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n/g, "<br>"))
    .join("<br><br>");
}


export function contactReceivedEmail(input: ContactReceivedInput): EmailContent {
  const first = escapeHtml(firstName(input.name));
  // One compact line rather than four labelled rows — the message is the
  // substance here, and the sender already knows who they are.
  const sentAs = [input.name, input.role, input.university?.trim(), input.email]
    .filter((v): v is string => Boolean(v && v.trim()))
    .map((v) => escapeHtml(v.trim()))
    .join(" &middot; ");

  const body = [
    heading("MESSAGE RECEIVED", "We've got your message"),
    paras([
      `Thanks for writing in, ${first}. This went to an inbox a person actually reads, not a ticket queue.`,
      `We read every message and reply within ${strong("two business days")}. If something changes in the meantime, just reply to this email. It lands in the same place.`,
    ]),

    panel([
      { l: "Your message", v: quoteMessage(input.message), multiline: true },
      { l: "Sent as", v: sentAs, multiline: true },
    ]),

    paras([
      `If you're asking about plans, the pricing page has every plan for players, coaches and college programs.`,
    ]),

    button("See pricing", PRICING_URL),
    fallbackLink(PRICING_URL),
    note(
      "You're receiving this because you sent us a message at advantage-analytics.com.",
    ),
    helpBlock(),
  ].join("\n");

  return {
    subject: "We've got your message",
    html: emailShell({
      title: "We've got your message | Advantage",
      preheader:
        "Read by a person, not a ticket queue. We'll reply within two business days.",
      body,
    }),
    text: textVersion(input, firstName(input.name)),
  };
}

function textVersion(input: ContactReceivedInput, first: string): string {
  const sentAs = [input.name, input.role, input.university?.trim(), input.email]
    .filter((v) => v && v.trim())
    .join(" · ");

  return `WE'VE GOT YOUR MESSAGE

Thanks for writing in, ${first}. This went to an inbox a person actually reads, not a ticket queue.

We read every message and reply within two business days. If something changes in the meantime, just reply to this email. It lands in the same place.

Your message
${input.message.trim() || "(no message)"}

Sent as
${sentAs}

If you're asking about plans, the pricing page has every plan for players, coaches and college programs.

${PRICING_URL}

You're receiving this because you sent us a message at advantage-analytics.com.

${textFooter()}`;
}
