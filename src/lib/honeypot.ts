// The hidden field every intake form carries, and the one rule for reading it.
//
// It used to be named "company" — the exact string Chrome's address autofill
// matches to ORGANIZATION. Both /send-a-match and the pilot CTA also carry a
// real autocomplete="organization" input, so choosing a saved profile filled
// the visible fields and the hidden one in the same pass, and autocomplete="off"
// does not stop Chrome from filling an address profile. The routes read that as
// a bot and returned { ok: true } without writing anything, so the form showed
// its success screen while the submission went nowhere.
//
// That cost a real coach on 2026-08-27: /send-a-match confirmed his submission,
// handed him the Dropbox upload window on the way out, and he uploaded a 1.2GB
// match — with no Airtable row, no internal notification and no confirmation
// email behind it. A film in the bucket with nobody's name on it.
//
// Two things changed. The field is named something no autofill heuristic
// recognises and carries the ignore attributes the major password managers look
// for, and tripping it no longer discards the submission.
export const HONEYPOT_NAME = "form-reference";

/**
 * True when the hidden field came back with something in it.
 *
 * This is a suspicion, never a verdict: a tripped honeypot suppresses the
 * automatic reply and marks the internal notification, and that is all. The row
 * is still written. Silently dropping a submission trades a spam row we can
 * delete for a lead we never learn existed, and this funnel takes a handful of
 * submissions a week — the trade is the wrong way round.
 */
export function honeypotTripped(body: Record<string, unknown>): boolean {
  return String(body[HONEYPOT_NAME] ?? "").trim().length > 0;
}
