// Sent when the film itself lands — i.e. when the Dropbox upload a coach
// promised on /send-a-match actually finishes.
//
// This is the second half of a two-part handoff. The form's confirmation goes
// out immediately and says "still to come: the film itself"; a coach who then
// uploads a 6GB match from a laptop has no way of knowing it arrived intact,
// because a Dropbox File Request gives the uploader no receipt worth the name.
// Until this email exists, the honest answer to "did it go through?" is a reply
// from a human. So the job is narrow: confirm the bytes are ours, tie them to
// the submission already on file, and restart the clock — the turnaround runs
// from the film arriving, not from the form.
//
// One case is deliberately not glossed over. A side-on camera can't be tracked
// yet, and /send-a-match warns about it without blocking the submission. If
// that's what landed, this email must not promise a breakdown in three days; it
// says a person will look and write back instead.

import {
  type EmailContent,
  SITE_URL,
  button,
  emailShell,
  escapeHtml,
  fallbackLink,
  heading,
  helpBlock,
  note,
  panel,
  paras,
  strong,
} from "./layout";
import { SIDE_ANGLE, TURNAROUND } from "../match-intake";

export type MatchReceivedInput = {
  // From the Airtable row the form wrote.
  name: string;
  program: string;
  player: string;
  opponent?: string;
  matchDate?: string;
  score?: string;
  startEnd?: string;
  cameraPosition?: string;
  // From the upload itself. Dropbox File Requests prefix the stored filename
  // with the name the uploader typed, e.g. "Marcus Ellison - court3.mov", which
  // is what makes a file matchable to a row in the first place.
  fileName?: string;
  fileSizeBytes?: number;
  receivedAt?: Date | string;
};

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

// Coaches think in GB for match film and MB for a clip; bytes tell them
// nothing, and a wrong-looking number here is the point of showing it at all —
// it's how someone spots an upload that stopped short.
function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const gb = bytes / 1_000_000_000;
  if (gb >= 1) return `${gb.toFixed(gb >= 10 ? 0 : 1)} GB`;
  const mb = bytes / 1_000_000;
  return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`;
}

// Pinned to Pacific rather than the server's zone, so the timestamp matches the
// one we see in Dropbox when a coach asks about it.
function formatReceived(at: Date | string): string {
  const date = at instanceof Date ? at : new Date(at);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(date);
}

const MATCH_URL = `${SITE_URL}/send-a-match`;

export function matchReceivedEmail(input: MatchReceivedInput): EmailContent {
  const first = escapeHtml(firstName(input.name));
  const player = input.player.trim();
  const playerPhrase = player ? escapeHtml(player) : "your player";
  // The soft gate on /send-a-match warns and lets the coach through, so this
  // can and does arrive.
  const sideOn = input.cameraPosition === SIDE_ANGLE;

  const size = input.fileSizeBytes ? formatSize(input.fileSizeBytes) : "";
  const received = input.receivedAt ? formatReceived(input.receivedAt) : "";
  const arrival = [size, received].filter(Boolean).join(" &middot; ");

  // Opponent, date and score are one fact about the match, not three fields.
  const matchLine = [
    input.opponent?.trim() ? `vs ${input.opponent.trim()}` : "",
    input.matchDate?.trim() ?? "",
    input.score?.trim() ?? "",
  ]
    .filter(Boolean)
    .map((v) => escapeHtml(v))
    .join(" &middot; ");

  const promise = sideOn
    ? `Before the clock starts, someone needs to watch this one. You flagged the camera as side-on — the angle our tracking can't read yet — so rather than run it and send you something thin, we'll check the first game by hand and email you today either way.`
    : `Your breakdown will be with you ${strong(`within ${TURNAROUND}`)} — the clock starts with the film, not with the form. If anything about the file needs sorting out, we'll email you directly rather than leave you waiting on it.`;

  const body = [
    heading("FILM RECEIVED", "Your film's in. Nothing else needed from you."),
    paras([
      `${first}, the upload finished and ${strong(playerPhrase)}'s match is with us. Your match details were already saved when you filled the form, so the file and the submission are matched up.`,
      promise,
    ]),

    panel(
      [
        { l: "File", v: escapeHtml(input.fileName ?? "Your upload") },
        { l: "Received", v: arrival || "Just now" },
        { l: "Player", v: escapeHtml(player) },
        { l: "Program", v: escapeHtml(input.program) },
        { l: "Match", v: matchLine },
        { l: "Started on", v: escapeHtml(input.startEnd?.trim() ?? "") },
        { l: "Camera", v: escapeHtml(input.cameraPosition?.trim() ?? "") },
      ].filter((r) => r.v),
    ),

    paras([
      `Got another match already filmed? Send it whenever — there's no reason to ration it.`,
    ]),

    button("Send another match", MATCH_URL),
    fallbackLink(MATCH_URL),
    note(
      "You're receiving this because you sent us a match at advantage-analytics.com. If anything above is wrong, reply before we start cutting it up.",
    ),
    helpBlock(),
  ].join("\n");

  return {
    subject: player
      ? `${player}'s film landed — we've got everything`
      : "Your film landed — we've got everything",
    html: emailShell({
      title: "Your film landed — Advantage",
      preheader: sideOn
        ? "The upload finished. One thing to check on the camera angle before we run it — we'll email you today."
        : `The upload finished and nothing else is needed from you. Breakdown back within ${TURNAROUND}.`,
      body,
    }),
    text: textVersion(input, firstName(input.name), player, sideOn, arrival),
  };
}

function textVersion(
  input: MatchReceivedInput,
  first: string,
  player: string,
  sideOn: boolean,
  arrival: string,
): string {
  const matchLine = [
    input.opponent?.trim() ? `vs ${input.opponent.trim()}` : "",
    input.matchDate?.trim() ?? "",
    input.score?.trim() ?? "",
  ]
    .filter(Boolean)
    .join(" · ");

  const details = [
    `File: ${input.fileName ?? "Your upload"}`,
    `Received: ${arrival.replace(/&middot;/g, "·") || "Just now"}`,
    player ? `Player: ${player}` : "",
    input.program ? `Program: ${input.program}` : "",
    matchLine ? `Match: ${matchLine}` : "",
    input.startEnd?.trim() ? `Started on: ${input.startEnd.trim()}` : "",
    input.cameraPosition?.trim() ? `Camera: ${input.cameraPosition.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const promise = sideOn
    ? `Before the clock starts, someone needs to watch this one. You flagged the camera as side-on — the angle our tracking can't read yet — so rather than run it and send you something thin, we'll check the first game by hand and email you today either way.`
    : `Your breakdown will be with you within ${TURNAROUND} — the clock starts with the film, not with the form. If anything about the file needs sorting out, we'll email you directly rather than leave you waiting on it.`;

  return `YOUR FILM'S IN. NOTHING ELSE NEEDED FROM YOU.

${first}, the upload finished and ${player || "your player"}'s match is with us. Your match details were already saved when you filled the form, so the file and the submission are matched up.

${promise}

${details}

Got another match already filmed? Send it whenever — there's no reason to ration it.

${MATCH_URL}

You're receiving this because you sent us a match at advantage-analytics.com. If anything above is wrong, reply before we start cutting it up.

Need help? Reach us at team@advantage-analytics.com.

© 2026 Advantage Analytics LLC · advantage-analytics.com`;
}
