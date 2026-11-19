import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/airtable";
import { honeypotTripped } from "@/lib/honeypot";
import { EMAIL_RE } from "@/lib/validation";
import { sendSubmissionEmail, escapeHtml } from "@/lib/notify";
import { LEAD_SOURCES, TEAM_CHOICES, type LeadSource, type TeamChoice } from "@/lib/leads";
import { salesReceivedEmail } from "@/lib/emails";
import { COLLEGE_PLANS, SEASON_LABEL, type Season } from "@/lib/plans";

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
  // "Walkthrough" is the Cal.com webhook's, so a browser can't claim it.
  const source =
    LEAD_SOURCES.includes(body.source as LeadSource) && body.source !== "Walkthrough"
      ? (body.source as LeadSource)
      : "Sales";
  // The college form's extra answers. Each is checked against what the form
  // offers, so only a known plan, team or season reaches Airtable.
  const plan = COLLEGE_PLANS.find((p) => p.id === body.plan)?.name ?? "";
  const teams = TEAM_CHOICES.includes(body.teams as TeamChoice) ? (body.teams as TeamChoice) : "";
  const season = body.season === "spring" || body.season === "full-year" ? SEASON_LABEL[body.season as Season] : "";
  const rosterSize = String(body.rosterSize ?? "").replace(/[^0-9]/g, "").slice(0, 3);
  const message = String(body.message ?? "").trim().slice(0, 4000);

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
      // Only sent when filled, so a row from an older form writes the same
      // columns it always did.
      ...(plan ? { Plan: plan } : {}),
      ...(teams ? { Teams: teams } : {}),
      ...(season ? { Season: season } : {}),
      ...(rosterSize ? { "Roster Size": Number(rosterSize) } : {}),
      ...(message ? { Message: message } : {}),
      "Submitted At": new Date().toISOString(),
    });
  } catch (err) {
    console.error("[leads] Airtable write failed:", err);
    return NextResponse.json({ error: "Could not save your request." }, { status: 502 });
  }

  // The row is the source of truth; the emails are best-effort and never fail
  // the request once it's written.
  const label = source === "Sales" ? "New sales request" : source;
  const confirmation =
    source === "Sales" ? salesReceivedEmail({ name, school: university, teams, season, plan, rosterSize }) : null;

  await Promise.all([
    sendSubmissionEmail({
    subject: `${flagged ? "[flagged] " : ""}${label}: ${name}${university ? ` (${university})` : ""}`,
    replyTo: email,
    html: `<h2>${label}</h2>
${
  flagged
    ? "<p><strong>Flagged:</strong> the hidden anti-spam field came back filled. It is recorded either way. If this is a real program, answer them by hand.</p>"
    : ""
}
<p><strong>Source:</strong> ${escapeHtml(source)}</p>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>University:</strong> ${escapeHtml(university) || "-"}</p>
<p><strong>Role:</strong> ${escapeHtml(role) || "-"}</p>
<p><strong>Division:</strong> ${escapeHtml(division) || "-"}</p>
<p><strong>Plan:</strong> ${escapeHtml(plan) || "-"}</p>
<p><strong>Teams:</strong> ${escapeHtml(teams) || "-"}</p>
<p><strong>Season:</strong> ${escapeHtml(season) || "-"}</p>
<p><strong>Roster size:</strong> ${escapeHtml(rosterSize) || "-"}</p>
<p><strong>Note:</strong> ${escapeHtml(message).replace(/\n/g, "<br>") || "-"}</p>`,
    }),
    // Held back on a flagged request: if a bot filled the form, the address
    // belongs to someone who never wrote to us.
    ...(confirmation && !flagged
      ? [
          sendSubmissionEmail({
            to: email,
            replyTo: process.env.CONTACT_NOTIFY_TO,
            subject: confirmation.subject,
            html: confirmation.html,
            text: confirmation.text,
          }),
        ]
      : []),
  ]);

  return NextResponse.json({ ok: true });
}
