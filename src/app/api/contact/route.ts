import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/airtable";
import { honeypotTripped } from "@/lib/honeypot";
import { sendSubmissionEmail, escapeHtml } from "@/lib/notify";
import { contactReceivedEmail } from "@/lib/emails";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const role = String(body.role ?? "").trim();
  const university = String(body.university ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = String(body.message ?? "").trim();

  // Spam signal, not a spam verdict — the message is recorded either way. The
  // old gate returned { ok: true } and wrote nothing, which meant a browser
  // autofilling the hidden field lost the message in silence. See lib/honeypot.
  const flagged = honeypotTripped(body);
  if (flagged) {
    console.warn("[contact] Honeypot tripped; recording the message and flagging it.");
  }

  // Mirror the client-side validate() in contact-form.tsx.
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!role) return NextResponse.json({ error: "Role is required." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  if (!message) return NextResponse.json({ error: "Message is required." }, { status: 400 });

  try {
    await createAirtableRecord(process.env.AIRTABLE_CONTACT_TABLE || "Contact Messages", {
      Name: name,
      Email: email,
      Role: role,
      University: university,
      Phone: phone,
      Message: message,
      "Submitted At": new Date().toISOString(),
    });
  } catch (err) {
    console.error("[contact] Airtable write failed:", err);
    return NextResponse.json({ error: "Could not send your message." }, { status: 502 });
  }

  // Best-effort and parallel, for the same reason as the other intake routes:
  // the Airtable row is already written, so neither send can fail the request,
  // and serialising them would sit a second Resend round-trip in front of the
  // sender's confirmation screen.
  const confirmation = contactReceivedEmail({
    name,
    email,
    role,
    message,
    university,
    phone,
  });

  await Promise.all([
    sendSubmissionEmail({
      subject: `${flagged ? "[flagged] " : ""}New contact message — ${name}`,
      replyTo: email,
      html: `<h2>New contact message</h2>
${
  flagged
    ? "<p><strong>Flagged:</strong> the hidden anti-spam field came back filled. It is recorded either way, and no automatic reply was sent — if this is a real person, answer them by hand.</p>"
    : ""
}
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Role:</strong> ${escapeHtml(role)}</p>
<p><strong>University:</strong> ${escapeHtml(university) || "-"}</p>
<p><strong>Phone:</strong> ${escapeHtml(phone) || "-"}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    }),
    // Replies land in the inbox that will answer, not back at the sender. Held
    // back on a flagged message: the address came from whoever filled the form,
    // and if that was a bot, it belongs to someone who never wrote to us.
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
