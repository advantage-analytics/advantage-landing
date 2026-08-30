import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/airtable";
import { honeypotTripped } from "@/lib/honeypot";
import { sendSubmissionEmail, escapeHtml } from "@/lib/notify";
import { TURNAROUND, UPLOAD_URL } from "@/lib/match-intake";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Where the internal ping lands. Falls back to the address the contact form
// already uses, so this route works the moment it ships.
const NOTIFY_TO = process.env.MATCH_NOTIFY_TO || process.env.CONTACT_NOTIFY_TO;

// Only linkify what we know is a web address — the notification email is read
// in a mail client, and an unchecked href is not worth the convenience.
function linkify(url: string): string {
  const safe = escapeHtml(url);
  return /^https?:\/\//i.test(url)
    ? `<a href="${safe}">${safe}</a>`
    : safe || "-";
}

function row(label: string, value: string): string {
  return `<p><strong>${label}:</strong> ${escapeHtml(value) || "-"}</p>`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Trim and cap everything: a lead form is an open pipe to our Airtable base.
  const field = (key: string, limit = 300) =>
    String(body[key] ?? "")
      .trim()
      .slice(0, limit);

  const name = field("name");
  const program = field("program");
  const email = field("email");
  const videoUrl = field("videoUrl", 2000);
  const willUpload = body.willUpload === true;
  const player = field("player");
  const startEnd = field("startEnd");
  const opponent = field("opponent");
  const matchDate = field("matchDate", 40);
  const score = field("score", 120);
  const cameraPosition = field("cameraPosition");
  const notes = field("notes", 2000);

  // Spam signal, not a spam verdict. This route used to return { ok: true } and
  // write nothing when the hidden field came back filled, which is how a coach
  // reached the success screen — and the Dropbox upload window behind it — with
  // no row anywhere. The submission is now always recorded; the flag only marks
  // the internal ping and holds back the automatic reply. See lib/honeypot.
  const flagged = honeypotTripped(body);
  if (flagged) {
    console.warn(
      "[send-a-match] Honeypot tripped; recording the submission and flagging it.",
    );
  }

  // Derived server-side rather than trusted from the client, so the record
  // always matches what actually arrived. "Upload" means a Dropbox upload is on
  // its way, not that it has landed — Status carries that.
  const sendMethod =
    videoUrl && willUpload ? "Link + upload" : willUpload ? "Upload" : "Link";

  // Mirrors validate() in match-form.tsx.
  if (!name)
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!program)
    return NextResponse.json({ error: "Program is required." }, { status: 400 });
  if (!EMAIL_RE.test(email))
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  if (!videoUrl && !willUpload)
    return NextResponse.json(
      { error: "A link or an upload is required." },
      { status: 400 },
    );
  if (!player)
    return NextResponse.json({ error: "Player is required." }, { status: 400 });
  if (!startEnd)
    return NextResponse.json({ error: "Starting end is required." }, { status: 400 });
  if (!cameraPosition)
    return NextResponse.json(
      { error: "Camera position is required." },
      { status: 400 },
    );

  // The URL is never fetched to verify access — CORS blocks it from the
  // browser, and a server-side check would still fail on any Drive or
  // PlaySight link behind an interstitial. Cj opens it by hand.
  const fields: Record<string, unknown> = {
    Name: name,
    Program: program,
    Email: email,
    "Send Method": sendMethod,
    "Video URL": videoUrl,
    Player: player,
    "Start End": startEnd,
    Opponent: opponent,
    "Match Date": matchDate,
    Score: score,
    "Camera Position": cameraPosition,
    Notes: notes,
    // new -> confirmed -> processing -> delivered
    Status: "new",
    Source: "Send a match",
    "Submitted At": new Date().toISOString(),
  };
  // Airtable's typecast chokes on an empty string for a date field, and blank
  // columns beat placeholder ones for querying.
  for (const [key, value] of Object.entries(fields)) {
    if (value === "") delete fields[key];
  }

  try {
    await createAirtableRecord(
      process.env.AIRTABLE_MATCHES_TABLE || "Match Submissions",
      fields,
    );
  } catch (err) {
    console.error("[send-a-match] Airtable write failed:", err);
    return NextResponse.json(
      { error: "Could not save your submission." },
      { status: 502 },
    );
  }

  // The row is the source of truth; both emails are best-effort and never fail
  // the request once it's written. They're independent, so they go out together
  // rather than in series — sequential awaits put a whole extra Resend
  // round-trip between the coach and their confirmation screen.
  await Promise.all([
    sendSubmissionEmail({
    to: NOTIFY_TO,
    subject: `${flagged ? "[flagged] " : ""}New match: ${player || name} — ${program || "unknown program"}`,
    replyTo: email,
    html: `<h2>New match submission</h2>
${
  flagged
    ? "<p><strong>Flagged:</strong> the hidden anti-spam field came back filled. It is recorded either way, and no automatic reply was sent — if this is a real coach, answer them by hand.</p>"
    : ""
}
${row("Coach", name)}
${row("Program", program)}
${row("Email", email)}
${row("Sent via", sendMethod)}
<p><strong>Video:</strong> ${
      videoUrl
        ? `${linkify(videoUrl)}${willUpload ? " <em>(plus a Dropbox upload to follow)</em>" : ""}`
        : "<em>Dropbox upload to follow &mdash; check /Pilot Video Submissions</em>"
    }</p>
${row("Player", player)}
${row("Started on", startEnd)}
${row("Opponent", opponent)}
${row("Match date", matchDate)}
${row("Score", score)}
${row("Camera", cameraPosition)}
<p><strong>Notes:</strong></p>
<p>${escapeHtml(notes).replace(/\n/g, "<br>") || "-"}</p>`,
    }),
    // The automatic reply goes to an address the submitter typed in, so a
    // flagged submission does not get one: if it really was a bot, that inbox
    // belongs to someone who never asked us for anything, and unrequested mail
    // from this domain is precisely what the cold campaign cannot afford.
    ...(flagged ? [] : [sendSubmissionEmail({
    to: email,
    subject: "We've got your match",
    replyTo: NOTIFY_TO,
    html: `<p>Thanks ${escapeHtml(name)} — your match is in.</p>
<p>Here's what you sent us:</p>
${row("Player", player)}
${row("Program", program)}
${opponent ? row("Opponent", opponent) : ""}
${matchDate ? row("Match date", matchDate) : ""}
${score ? row("Score", score) : ""}
${
  willUpload
    ? `<p><strong>Still to come:</strong> the film itself. Upload it here whenever suits — ${UPLOAD_URL} — and we'll match it to this submission.</p>`
    : ""
}
<p>Your breakdown will be with you within ${TURNAROUND}${
    willUpload ? " of the film arriving" : ""
  }. If anything about the file needs sorting out, I'll email you directly.</p>
<p>— Cj<br>Advantage Analytics</p>`,
    })]),
  ]);

  return NextResponse.json({ ok: true });
}
