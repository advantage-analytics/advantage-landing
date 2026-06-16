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
  const email = String(body.email ?? "").trim();
  const role = String(body.role ?? "").trim();
  const company = String(body.company ?? "").trim(); // honeypot

  // Spam gate: bots fill the hidden field. Pretend success, do nothing.
  if (company) return NextResponse.json({ ok: true });

  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });

  try {
    await createAirtableRecord(process.env.AIRTABLE_LEADS_TABLE || "Leads", {
      Name: name,
      Email: email,
      Role: role,
      Source: "Landing CTA",
      "Submitted At": new Date().toISOString(),
    });
  } catch (err) {
    console.error("[leads] Airtable write failed:", err);
    return NextResponse.json({ error: "Could not save your request." }, { status: 502 });
  }

  await sendSubmissionEmail({
    subject: `New access request — ${name}`,
    replyTo: email,
    html: `<h2>New access request</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Role:</strong> ${escapeHtml(role) || "—"}</p>`,
  });

  return NextResponse.json({ ok: true });
}
