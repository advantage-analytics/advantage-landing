// Server-only helper for sending submission notifications via Resend.
// A failed email must never fail the request once the Airtable row is written —
// the row is the source of truth, the email is a convenience ping. So callers
// should treat this as best-effort; it swallows and logs errors rather than throwing.

import { Resend } from "resend";

type SubmissionEmail = {
  subject: string;
  html: string;
  // Plain-text alternative. Optional only because the internal notifications
  // are read by us in one client; anything sent outward should set it, since
  // an HTML-only message is a spam-filter signal against the sending domain.
  text?: string;
  // The person who submitted, so replies go straight to them.
  replyTo?: string;
  // Defaults to CONTACT_NOTIFY_TO — the inbox that receives every submission.
  // Pass an address to send outward instead, e.g. the automatic confirmation
  // the /send-a-match intake sends back to the coach.
  to?: string;
};

export async function sendSubmissionEmail({
  subject,
  html,
  text,
  replyTo,
  to: recipient,
}: SubmissionEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = recipient || process.env.CONTACT_NOTIFY_TO;
  const from = process.env.CONTACT_NOTIFY_FROM;

  if (!apiKey || !to || !from) {
    console.warn(
      "[notify] Resend not configured (RESEND_API_KEY / CONTACT_NOTIFY_TO / CONTACT_NOTIFY_FROM); skipping email.",
    );
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...(text ? { text } : {}),
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) console.error("[notify] Resend returned an error:", error);
  } catch (err) {
    console.error("[notify] Failed to send notification email:", err);
  }
}

// Small helper to escape user-supplied text before interpolating into email HTML.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
