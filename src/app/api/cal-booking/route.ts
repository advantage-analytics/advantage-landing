import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/airtable";
import { sendSubmissionEmail, escapeHtml } from "@/lib/notify";
import type { LeadSource } from "@/lib/leads";

/* Cal.com's webhook for the pilot walkthrough (see CAL_WALKTHROUGH in
   lib/links). Subscribed to BOOKING_CREATED only: Cal.com already emails the
   host about reschedules and cancellations, so those need no row.

   A booking lands where every other coach lead does: a Leads row in Airtable
   (Source "Walkthrough") and a note to the team inbox. The row is the source
   of truth; the email is best-effort, as in /api/leads.

   Cal.com signs the raw body with the webhook's secret (HMAC-SHA256, hex, in
   x-cal-signature-256). Anything unsigned or mis-signed is refused, so a
   stranger can't post fake bookings into the Leads table. */

const SOURCE: LeadSource = "Walkthrough";

type Responses = Record<string, { value?: unknown } | unknown>;

type CalWebhook = {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    title?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    attendees?: { name?: string; email?: string; timeZone?: string }[];
    responses?: Responses;
    metadata?: Record<string, unknown>;
  };
};

function signatureValid(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = createHmac("sha256", secret).update(raw).digest();
  const given = Buffer.from(header.trim(), "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// A booking-form answer arrives as { label, value } in webhooks; read either shape.
function answer(responses: Responses | undefined, key: string): string {
  const v = responses?.[key];
  const value = v && typeof v === "object" && "value" in v ? (v as { value?: unknown }).value : v;
  return typeof value === "string" ? value.trim() : "";
}

function when(start?: string, tz = "America/Los_Angeles"): string {
  if (!start) return "-";
  const d = new Date(start);
  if (Number.isNaN(d.getTime())) return start;
  return d.toLocaleString("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[cal-booking] CAL_WEBHOOK_SECRET is not set; refusing the webhook.");
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const raw = await request.text();
  if (!signatureValid(raw, request.headers.get("x-cal-signature-256"), secret)) {
    return NextResponse.json({ error: "Bad signature." }, { status: 401 });
  }

  let body: CalWebhook;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Cal.com's "Ping test" in the webhook settings, and any trigger we didn't
  // subscribe to: acknowledge and do nothing.
  if (body.triggerEvent !== "BOOKING_CREATED") {
    return NextResponse.json({ ok: true, ignored: body.triggerEvent ?? null });
  }

  const p = body.payload ?? {};
  const attendee = p.attendees?.[0] ?? {};
  const name = answer(p.responses, "name") || attendee.name?.trim() || "";
  const email = answer(p.responses, "email") || attendee.email?.trim() || "";
  const school = answer(p.responses, "school");
  const notes = answer(p.responses, "notes");
  const placement = typeof p.metadata?.placement === "string" ? p.metadata.placement : "";
  const slot = when(p.startTime);

  if (!email) {
    console.warn("[cal-booking] Booking without an attendee email:", p.uid);
    return NextResponse.json({ ok: true, skipped: "no email" });
  }

  try {
    await createAirtableRecord(process.env.AIRTABLE_LEADS_TABLE || "Leads", {
      Name: name,
      Email: email,
      University: school,
      Source: SOURCE,
      "Submitted At": new Date().toISOString(),
    });
  } catch (err) {
    // A 5xx makes Cal.com retry the delivery, which is what we want here.
    console.error("[cal-booking] Airtable write failed:", err);
    return NextResponse.json({ error: "Could not save the booking." }, { status: 502 });
  }

  await sendSubmissionEmail({
    subject: `Walkthrough booked: ${name || email}${school ? ` (${school})` : ""} · ${slot}`,
    replyTo: email,
    html: `<h2>Walkthrough booked</h2>
<p><strong>When:</strong> ${escapeHtml(slot)}</p>
<p><strong>Name:</strong> ${escapeHtml(name) || "-"}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>School and team:</strong> ${escapeHtml(school) || "-"}</p>
<p><strong>Look at first:</strong> ${escapeHtml(notes) || "-"}</p>
<p><strong>Booked from:</strong> ${escapeHtml(placement) || "-"}</p>
<p><strong>Call link:</strong> ${escapeHtml(p.location ?? "") || "in the calendar invite"}</p>`,
  });

  return NextResponse.json({ ok: true });
}
