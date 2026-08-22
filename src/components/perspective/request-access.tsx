"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";
import { CONTACT_EMAIL, links } from "@/lib/links";
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
  const company = useRef("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, university, role, division, source, company: company.current }),
      });
      if (!res.ok) throw new Error();
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
              <span className="eyebrow">Join the pilot</span>
              <h3>Get your program on the fall pilot.</h3>
              <p>
                The terms above are the whole pitch. Tell us about your team and we will email
                you the moment the pilot opens.
              </p>
            </div>
            <div className="access-form">
              {sent ? (
                <div className="access-sent">
                  <div className="chk">
                    <Icon n="check" size={20} />
                  </div>
                  Request received.
                  <br />
                  We will email {email || "your inbox"} the moment the pilot opens.
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  {/* Honeypot — hidden from users, filled by bots. */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    onChange={(e) => {
                      company.current = e.target.value;
                    }}
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  />
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
                    {submitting ? "Sending…" : "Join the pilot"} <Icon n="arrow" size={16} />
                  </button>
                  {submitError ? (
                    <div className="access-note" role="alert">{submitError}</div>
                  ) : null}
                  <div className="access-note">We will email you when the pilot opens.</div>
                </form>
              )}
            </div>
          </div>
          {/* The second lane. Programs fill the form; individuals never needed
              to — this keeps that path visible without competing with the CTA. */}
          <div className="access-player">
            <span className="ap-q">For individuals</span>
            <span className="ap-t">Free allocation, self-serve — no program required.</span>
            <a className="ap-link" href={links.signUp} target="_blank" rel="noopener noreferrer">
              Create a free account <Icon n="arrow" size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
