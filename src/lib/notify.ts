// Server-only helper for sending submission notifications via Resend.
// A failed email must never fail the request once the Airtable row is written —
// the row is the source of truth, the email is a convenience ping. So callers
// should treat this as best-effort; it swallows and logs errors rather than throwing.

import { Resend } from "resend";

type SubmissionEmail = {
  subject: string;
  html: string;
  // The person who submitted, so replies go straight to them.
  replyTo?: string;
};

export async function sendSubmissionEmail({
  subject,
  html,
  replyTo,
}: SubmissionEmail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_TO;
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
