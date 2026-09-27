"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";
import { FindTeamLink } from "./cta-links";
import { HoneypotField } from "@/components/honeypot-field";
import { HONEYPOT_NAME } from "@/lib/honeypot";
import { links } from "@/lib/links";
import { INDIVIDUAL_BETA_SHORT } from "@/lib/pilot";
import { trackCta } from "@/lib/analytics";

/* The way in for coaches, at the foot of /pilot. Programs no longer apply:
   nearly every college team is already in the dashboard, so a coach signs up
   and finds theirs. A school-email match turns the pilot on at once; anyone
   else is confirmed by hand. The form beside the button is only for the
   schools that aren't listed yet, and it still writes to /api/leads. */
export function RequestAccess() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
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
      [school, "access-school", "your school and team"],
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
        body: JSON.stringify({
          name,
          email,
          university: school,
          source: "Missing school",
          [HONEYPOT_NAME]: honeypot.current,
        }),
      });
      if (!res.ok) throw new Error();
      trackCta("find_your_team", "submitted:missing-school");
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
              <span className="eyebrow">For coaches</span>
              <h3>Your team is already in the dashboard.</h3>
              <p>
                Sign up with your school email and choose your team. If your email is on
                the staff list, the pilot turns on right away. If it isn’t, a person checks
                and emails you when it’s on.
              </p>
              <div className="h-actions access-actions">
                <FindTeamLink className="hbtn hbtn-white" placement="pilot-access-card" />
              </div>
            </div>
            <div className="access-form">
              {sent ? (
                <div className="access-sent" role="status">
                  <div className="chk">
                    <Icon n="check" size={20} />
                  </div>
                  Thanks.
                  <br />
                  We’ll add your team and email you when it’s ready.
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  {/* Honeypot — hidden from users, filled by bots. See lib/honeypot. */}
                  <HoneypotField valueRef={honeypot} />
                  <p className="access-lead">
                    <strong>Can’t find your school?</strong> Tell us which team you coach
                    and we’ll add it.
                  </p>
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
                    <label htmlFor="access-school">School and team</label>
                    <input
                      id="access-school"
                      type="text"
                      autoComplete="organization"
                      autoCapitalize="words"
                      enterKeyHint="send"
                      placeholder="e.g. State University, women’s"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : "Send Request"} <Icon n="arrow" size={16} />
                  </button>
                  {submitError ? (
                    <div className="access-note" role="alert">{submitError}</div>
                  ) : null}
                  <div className="access-note">We’ll email you once your team is added.</div>
                </form>
              )}
            </div>
          </div>
          {/* The second lane. Outside .access-inner so it survives the form's
              sent state, and quiet enough not to compete with the coach CTA. */}
          <div className="access-player">
            <span className="ap-q">Playing on your own?</span>
            <span className="ap-t">{INDIVIDUAL_BETA_SHORT}</span>
            <a
              className="ap-link"
              href={links.signUp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta("join_free_beta", "pilot-access-card")}
            >
              Join Free Beta <Icon n="arrow" size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
