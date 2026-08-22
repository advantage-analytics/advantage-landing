// Dev-only: renders every transactional email with representative data so they
// can be eyeballed and test-sent without filling the real forms. Not imported
// by the app.
import { writeFileSync } from "node:fs";
import { pilotRequestEmail } from "./pilot-request";
import { contactReceivedEmail } from "./contact-received";
import { matchReceivedEmail } from "./match-received";
import { SIDE_ANGLE } from "../match-intake";

const out = process.argv[2];

const samples = {
  "pilot-request": pilotRequestEmail({
    name: "Marcus Ellison",
    email: "mellison@northbay.edu",
    university: "North Bay University",
    role: "Coach",
    division: "NCAA D I",
  }),
  "contact-received": contactReceivedEmail({
    name: "Priya Raman",
    email: "priya.raman@example.com",
    role: "Player",
    message:
      "I play D III and film most of my matches on a phone from the fence behind the baseline. Two questions before I sign up.\n\nDoes the analysis work on doubles, or singles only for now? And can my coach see my matches without me exporting anything to her?",
  }),
  "match-received": matchReceivedEmail({
    name: "Marcus Ellison",
    program: "North Bay University",
    player: "Diego Ferrer",
    opponent: "T. Okafor",
    matchDate: "August 19, 2026",
    score: "6-4, 3-6, 7-5",
    startEnd: "Near end (closest to the camera)",
    cameraPosition: "Behind the baseline, elevated",
    fileName: "ferrer-vs-okafor-08-19.mp4",
    fileSizeBytes: 7_420_000_000,
    receivedAt: new Date("2026-08-22T15:41:00-07:00"),
  }),
  // The soft-gated case: side-on film can't be tracked, so the three-day
  // promise has to give way to a personal reply.
  "match-received-side-angle": matchReceivedEmail({
    name: "Marcus Ellison",
    program: "North Bay University",
    player: "Diego Ferrer",
    cameraPosition: SIDE_ANGLE,
    fileName: "ferrer-court3.mov",
    fileSizeBytes: 2_100_000_000,
    receivedAt: new Date("2026-08-22T15:41:00-07:00"),
  }),
};

for (const [name, email] of Object.entries(samples)) {
  writeFileSync(`${out}/${name}.html`, email.html);
  writeFileSync(`${out}/${name}.txt`, `Subject: ${email.subject}\n\n${email.text}`);
  console.log(`${name.padEnd(28)} ${String(email.html.length).padStart(6)} bytes  "${email.subject}"`);
}
