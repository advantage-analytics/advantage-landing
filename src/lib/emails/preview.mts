// Dev-only: renders every transactional email with representative data so they
// can be eyeballed and test-sent without filling the real forms. Not imported
// by the app.
import { writeFileSync } from "node:fs";
import { contactReceivedEmail } from "./contact-received";

const out = process.argv[2];

const samples = {
  "contact-received": contactReceivedEmail({
    name: "Priya Raman",
    email: "priya.raman@example.com",
    role: "Player",
    message:
      "I play D III and film most of my matches on a phone from the fence behind the baseline. Two questions before I sign up.\n\nDoes the analysis work on doubles, or singles only for now? And can my coach see my matches without me exporting anything to her?",
  }),
};

for (const [name, email] of Object.entries(samples)) {
  writeFileSync(`${out}/${name}.html`, email.html);
  writeFileSync(`${out}/${name}.txt`, `Subject: ${email.subject}\n\n${email.text}`);
  console.log(`${name.padEnd(28)} ${String(email.html.length).padStart(6)} bytes  "${email.subject}"`);
}
