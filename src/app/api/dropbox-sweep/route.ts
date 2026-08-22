// Fires the "your film landed" email for uploads that have arrived in the
// Dropbox File Request folder since the last run.
//
// The /send-a-match form and the film arrive separately: the form writes an
// Airtable row immediately, then the coach uploads a multi-gigabyte match from
// wherever suits them, sometimes hours later. Nothing in the app hears about
// that upload, so until this route existed the coach's last word from us was
// "still to come: the film itself" and their only way to confirm it landed was
// to ask a person.
//
// Matching is by the "<uploader name> - <filename>" prefix Dropbox File
// Requests write, against the Name on the submission. It is not a strong key —
// see the skip cases below — so the route never guesses: an unmatched file is
// left alone and reported, which leaves a human doing exactly the work they
// were already doing, rather than a coach getting mail about someone else's
// match.
//
// Idempotency comes free from the existing schema. Only rows with Status "new"
// are eligible, and sending flips them to "confirmed", so a re-run — or two
// overlapping runs — cannot send the same email twice. No cursor to persist,
// and a missed run is simply picked up by the next one.
//
// Nothing schedules this right now. The `crons` block that ran it every 15
// minutes is out of vercel.json, because production stopped deploying the
// moment that block was added and stayed pinned to the commit before it — with
// the confirmation emails that shipped alongside never going live. Vercel's
// Hobby plan only permits daily crons and rejects anything more frequent at
// deploy validation, which fits, though the build log was never read to confirm
// it. Restoring the schedule means putting back:
//
//   "crons": [{ "path": "/api/dropbox-sweep", "schedule": "*/15 * * * *" }]
//
// on a plan that allows it. Until then this route only runs if something calls
// it, so the "your film landed" email does not go out on its own. Losing the
// schedule costs nothing yet — see isDropboxConfigured below, which no-ops the
// whole sweep until the Dropbox credentials are set.
//
// Env: DROPBOX_APP_KEY / DROPBOX_APP_SECRET / DROPBOX_REFRESH_TOKEN, plus
// DROPBOX_ROOT_NAMESPACE_ID for the team root. CRON_SECRET guards the route.

import { NextRequest, NextResponse } from "next/server";
import {
  listAirtableRecords,
  updateAirtableRecord,
  type AirtableRecord,
} from "@/lib/airtable";
import { isDropboxConfigured, listFolderFiles, uploaderNameFrom } from "@/lib/dropbox";
import { matchReceivedEmail } from "@/lib/emails";
import { sendSubmissionEmail } from "@/lib/notify";

export const dynamic = "force-dynamic";

const SUBMISSIONS_PATH =
  process.env.DROPBOX_SUBMISSIONS_PATH || "/Pilot Video Submissions";
const MATCHES_TABLE = process.env.AIRTABLE_MATCHES_TABLE || "Match Submissions";

// Files older than this are ignored. Every eligible row is one a coach filled
// in recently, so a file from months ago has either been handled already or
// never had a submission to attach to — and re-examining the whole folder every
// run gets slower forever.
const LOOKBACK_DAYS = 30;

// Only submissions that promised an upload and haven't been confirmed yet.
const PENDING_UPLOADS = `AND({Status}='new', OR({Send Method}='Upload', {Send Method}='Link + upload'))`;

function field(record: AirtableRecord, name: string): string {
  const value = record.fields[name];
  return typeof value === "string" ? value : "";
}

// Coaches are inconsistent about capitalisation and spacing between the form
// and the Dropbox upload box; nothing else about the two strings should differ.
function normalize(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isDropboxConfigured()) {
    console.warn("[dropbox-sweep] Dropbox not configured; nothing to do.");
    return NextResponse.json({ ok: true, skipped: "dropbox-not-configured" });
  }

  let files;
  let pending: AirtableRecord[];
  try {
    // Independent reads, so they go together rather than in series.
    [files, pending] = await Promise.all([
      listFolderFiles(SUBMISSIONS_PATH),
      listAirtableRecords(MATCHES_TABLE, {
        filterByFormula: PENDING_UPLOADS,
        sort: [{ field: "Submitted At", direction: "asc" }],
        maxRecords: 100,
      }),
    ]);
  } catch (err) {
    console.error("[dropbox-sweep] Lookup failed:", err);
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }

  const cutoff = Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const recent = files
    .filter((f) => {
      const at = Date.parse(f.serverModified);
      return Number.isNaN(at) ? true : at >= cutoff;
    })
    // Oldest first, so when one coach has two pending submissions the first
    // file they uploaded is paired with the first form they filled.
    .sort((a, b) => a.serverModified.localeCompare(b.serverModified));

  const sent: string[] = [];
  const skipped: { file: string; reason: string }[] = [];
  // A row can only absorb one file per run; without this, two files from the
  // same coach would both match the same submission and send twice before the
  // Status write landed.
  const claimed = new Set<string>();

  for (const file of recent) {
    const uploader = uploaderNameFrom(file.name);
    if (!uploader) {
      skipped.push({ file: file.name, reason: "no uploader-name prefix" });
      continue;
    }

    const row = pending.find(
      (r) => !claimed.has(r.id) && normalize(field(r, "Name")) === normalize(uploader),
    );
    if (!row) {
      skipped.push({ file: file.name, reason: `no pending submission for "${uploader}"` });
      continue;
    }

    const email = field(row, "Email");
    if (!email) {
      skipped.push({ file: file.name, reason: "submission has no email" });
      continue;
    }

    claimed.add(row.id);

    const content = matchReceivedEmail({
      name: field(row, "Name"),
      program: field(row, "Program"),
      player: field(row, "Player"),
      opponent: field(row, "Opponent"),
      matchDate: field(row, "Match Date"),
      score: field(row, "Score"),
      startEnd: field(row, "Start End"),
      cameraPosition: field(row, "Camera Position"),
      fileName: file.name,
      fileSizeBytes: file.sizeBytes,
      receivedAt: file.serverModified,
    });

    // Status is written first and deliberately. If the write succeeds and the
    // send then fails, one coach misses a receipt and we find it in the logs;
    // if the send succeeded and the write failed, every later run would mail
    // them again. Silence beats a loop.
    try {
      await updateAirtableRecord(MATCHES_TABLE, row.id, { Status: "confirmed" });
    } catch (err) {
      console.error(`[dropbox-sweep] Could not confirm ${row.id}:`, err);
      skipped.push({ file: file.name, reason: "airtable update failed" });
      claimed.delete(row.id);
      continue;
    }

    await sendSubmissionEmail({
      to: email,
      replyTo: process.env.CONTACT_NOTIFY_TO,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    sent.push(file.name);
  }

  // Unmatched files are the interesting output: each one is a coach waiting on
  // a confirmation nobody knows to send.
  if (skipped.length) console.warn("[dropbox-sweep] Unmatched uploads:", skipped);

  return NextResponse.json({
    ok: true,
    scanned: recent.length,
    sent: sent.length,
    skipped,
  });
}
