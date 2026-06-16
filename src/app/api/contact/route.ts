import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/airtable";
import { sendSubmissionEmail, escapeHtml } from "@/lib/notify";

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
  const company = String(body.company ?? "").trim(); // honeypot

  // Spam gate: bots fill the hidden field. Pretend success, do nothing.
  if (company) return NextResponse.json({ ok: true });

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

  await sendSubmissionEmail({
    subject: `New contact message — ${name}`,
    replyTo: email,
    html: `<h2>New contact message</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Role:</strong> ${escapeHtml(role)}</p>
<p><strong>University:</strong> ${escapeHtml(university) || "—"}</p>
<p><strong>Phone:</strong> ${escapeHtml(phone) || "—"}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  });

  return NextResponse.json({ ok: true });
}
