import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/airtable";
import { honeypotTripped } from "@/lib/honeypot";
import { sendSubmissionEmail, escapeHtml } from "@/lib/notify";
import { LEAD_SOURCES, type LeadSource } from "@/lib/leads";
import { pilotRequestEmail } from "@/lib/emails";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const university = String(body.university ?? "").trim();
  const role = String(body.role ?? "").trim();
  const division = String(body.division ?? "").trim();
  // Which form produced the row. Client-supplied, so it is checked against the
  // shared allowlist rather than written through — an arbitrary string from a
  // POST would otherwise land in the Airtable column that triage sorts on.
  const source = LEAD_SOURCES.includes(body.source as LeadSource)
    ? (body.source as LeadSource)
    : "Landing CTA";

  // Spam signal, not a spam verdict — the request is recorded either way. The
  // old gate returned { ok: true } and wrote nothing, which meant a browser
  // autofilling the hidden field lost the lead in silence. See lib/honeypot.
  const flagged = honeypotTripped(body);
  if (flagged) {
    console.warn("[leads] Honeypot tripped; recording the request and flagging it.");
  }

  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });

  try {
    await createAirtableRecord(process.env.AIRTABLE_LEADS_TABLE || "Leads", {
      Name: name,
      Email: email,
      University: university,
      Role: role,
      Division: division,
      Source: source,
      "Submitted At": new Date().toISOString(),
    });
  } catch (err) {
    console.error("[leads] Airtable write failed:", err);
    return NextResponse.json({ error: "Could not save your request." }, { status: 502 });
  }

  // The row is the source of truth; both emails are best-effort and never fail
  // the request once it's written. They go out together rather than in series —
  // sequential awaits put a whole extra Resend round-trip between the coach and
  // their confirmation screen.
  const confirmation = pilotRequestEmail({ name, email, university, role, division });

  await Promise.all([
    sendSubmissionEmail({
      subject: `${flagged ? "[flagged] " : ""}New pilot request: ${name}${university ? ` (${university})` : ""}`,
      replyTo: email,
      html: `<h2>New pilot request</h2>
${
  flagged
    ? "<p><strong>Flagged:</strong> the hidden anti-spam field came back filled. It is recorded either way, and no automatic reply was sent — if this is a real program, answer them by hand.</p>"
    : ""
}
<p><strong>Source:</strong> ${escapeHtml(source)}</p>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>University:</strong> ${escapeHtml(university) || "-"}</p>
<p><strong>Role:</strong> ${escapeHtml(role) || "-"}</p>
<p><strong>Division:</strong> ${escapeHtml(division) || "-"}</p>`,
    }),
    // Replies go to the inbox that will answer, not back to the coach. Held
    // back on a flagged request: the address came from the submitter, and if a
    // bot supplied it, it belongs to someone who never wrote to us.
    ...(flagged ? [] : [sendSubmissionEmail({
      to: email,
      replyTo: process.env.CONTACT_NOTIFY_TO,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    })]),
  ]);

  return NextResponse.json({ ok: true });
}
