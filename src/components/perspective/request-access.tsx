"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";
import { HoneypotField } from "@/components/honeypot-field";
import { HONEYPOT_NAME } from "@/lib/honeypot";
import { CONTACT_EMAIL, links } from "@/lib/links";
import { INDIVIDUAL_BETA_SHORT } from "@/lib/pilot";
import { trackCta } from "@/lib/analytics";

const REPLY_LINE = "We reply by email with your start date.";
import type { LeadSource } from "@/lib/leads";

export function RequestAccess({ source = "Landing CTA" }: { source?: LeadSource }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [role, setRole] = useState("");
  const [division, setDivision] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Honeypot: hidden from users, filled by bots.
  const honeypot = useRef("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    // The form is noValidate so one inline message, in the card's own voice,
    // replaces the browser's bubbles. Checked in field order; the first miss
    // takes focus. Whitespace-only answers count as blank, and the email needs
    // a domain dot ("coach@school" is a typo, not an address).
    const form = e.currentTarget;
    const blank = [
      [name, "access-name", "your name"],
      [university, "access-university", "your university or college"],
      [role, "access-role", "your role"],
    ].find(([v]) => !v.trim());
    if (blank) {
      setSubmitError(`Please add ${blank[2]}.`);
      form.querySelector<HTMLElement>(`#${blank[1]}`)?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubmitError("Please enter a valid email address.");
      form.querySelector<HTMLElement>("#access-email")?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, university, role, division, source, [HONEYPOT_NAME]: honeypot.current }),
      });
      if (!res.ok) throw new Error();
      trackCta("apply_for_pilot", `submitted:${source}`);
      setSent(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="band access" id="access">
      <div className="wrap">
        <div className="access-card reveal">
          <div className="ac-glow" />
          <div className="ac-grain" aria-hidden="true" />
          <div className="access-inner">
            <div>
              <span className="eyebrow">Apply</span>
              <h3>Apply for the fall pilot.</h3>
              <p>
                The terms above are the whole pitch. Tell us about your team and a person
                replies with next steps.
              </p>
            </div>
            <div className="access-form">
              {sent ? (
                <div className="access-sent" role="status">
                  <div className="chk">
                    <Icon n="check" size={20} />
                  </div>
                  Application received.
                  <br />
                  {REPLY_LINE}
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  {/* Honeypot — hidden from users, filled by bots. This form
                      asks for a university with autocomplete="organization", so
                      the field also has to be invisible to the browser's own
                      autofill; see lib/honeypot. */}
                  <HoneypotField valueRef={honeypot} />
                  <div className="uline">
                    <label htmlFor="access-name">Name</label>
                    <input
                      id="access-name"
                      type="text"
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="uline">
                    <label htmlFor="access-email">Email</label>
                    <input
                      id="access-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="next"
                      placeholder="you@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="uline">
                    <label htmlFor="access-university">University / College</label>
                    <input
                      id="access-university"
                      type="text"
                      autoComplete="organization"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      placeholder="Where your team competes"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="uline-row">
                    <div className="uline">
                      <label htmlFor="access-role">Role</label>
                      <select
                        id="access-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select role
                        </option>
                        <option value="Coach">Coach</option>
                        <option value="Player">Player</option>
                        <option value="Analyst">Analyst</option>
                      </select>
                    </div>
                    <div className="uline">
                      <label htmlFor="access-division">Division</label>
                      <select
                        id="access-division"
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                      >
                        <option value="">Optional</option>
                        <option value="NCAA D I">NCAA D I</option>
                        <option value="NCAA D II">NCAA D II</option>
                        <option value="NCAA D III">NCAA D III</option>
                        <option value="NAIA">NAIA</option>
                        <option value="JUCO">JUCO</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <p className="access-ask">
                    Question first? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </p>
                  <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : "Apply for Pilot"} <Icon n="arrow" size={16} />
                  </button>
                  {submitError ? (
                    <div className="access-note" role="alert">{submitError}</div>
                  ) : null}
                  <div className="access-note">{REPLY_LINE}</div>
                </form>
              )}
            </div>
          </div>
          {/* The second lane. Programs fill the form; individuals never needed
              to — this keeps that path visible without competing with the CTA. */}
          <div className="access-player">
            <span className="ap-q">For individuals</span>
            <span className="ap-t">{INDIVIDUAL_BETA_SHORT}</span>
            <a
              className="ap-link"
              href={links.signUp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta("join_free_beta", `access-card:${source}`)}
            >
              Join Free Beta <Icon n="arrow" size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
