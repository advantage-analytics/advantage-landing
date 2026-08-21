"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { links } from "@/lib/links";

const ROLES = ["Player", "Coach", "Parent", "Other"];

type Values = {
  name: string;
  role: string;
  email: string;
  message: string;
};

const EMPTY: Values = {
  name: "",
  role: "",
  email: "",
  message: "",
};

// Plain, specific validation: every field carries a message rather than a
// bare red rule.
function validate(v: Values): Record<string, string> {
  const e: Record<string, string> = {};
  if (!v.name.trim()) e.name = "Tell us your name.";
  if (!v.role) e.role = "Select a role.";
  if (!v.email.trim()) e.email = "Add an email so we can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "That email doesn't look right.";
  if (!v.message.trim()) e.message = "Add a short message.";
  return e;
}

/* Bringing a team is the likelier reason a coach is on this page than a general
   enquiry, and the pilot is free — so it is offered before the form, not after
   it. The individual lane stays a footnote under the submit. Module scope: it
   closes over nothing, and this form re-renders on every keystroke. */
const TEAM_LEAD = (
  <p className="form-lead">
    Bringing your team? <Link href="/pilot">Join the pilot</Link> — free through the
    fall season.
  </p>
);

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Honeypot: real users never fill this; bots that auto-fill every field do.
  const company = useRef("");
  const sentRef = useRef<HTMLHeadingElement>(null);

  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  // Move focus to the confirmation so keyboard and screen-reader users land on
  // the result, not back at the top of a now-replaced form.
  useEffect(() => {
    if (sent) sentRef.current?.focus();
  }, [sent]);

  const set =
    (field: keyof Values) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };

  const cls = (field: string) => `control${errors[field] ? " is-error" : ""}`;
  const describe = (field: string) =>
    errors[field] ? id(`${field}-error`) : undefined;

  if (sent) {
    return (
      <div className="form-panel">
        {TEAM_LEAD}
        <div className="form-sent" role="status" aria-live="polite">
          <div className="chk">
            <Check size={22} strokeWidth={2} aria-hidden="true" />
          </div>
          <h3 ref={sentRef} tabIndex={-1}>
            Message sent.
          </h3>
          <p>Thanks. We read every message and reply within two business days.</p>
          <p className="form-foot">
            Individual player?{" "}
            <a href={links.signUp} target="_blank" rel="noopener noreferrer">
              Create a free account
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    if (Object.keys(next).length) {
      setErrors(next);
      // Take keyboard and screen-reader users straight to the first problem
      // instead of leaving focus on the submit button.
      const order: (keyof Values)[] = ["name", "role", "email", "message"];
      const first = order.find((f) => next[f]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: company.current }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-panel">
      {TEAM_LEAD}
      <form onSubmit={onSubmit} noValidate>
        {/* Honeypot — hidden from users, ignored by them, filled by bots. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          onChange={(e) => {
            company.current = e.target.value;
          }}
          style={{
            position: "absolute",
            left: "-9999px",
            width: 1,
            height: 1,
            opacity: 0,
          }}
        />
        <div className="field">
          <label htmlFor={id("name")}>Full name</label>
          <input
            className={cls("name")}
            id={id("name")}
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={describe("name")}
            required
          />
          {errors.name && (
            <p className="field-error" id={id("name-error")}>
              {errors.name}
            </p>
          )}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor={id("role")}>Role</label>
            <select
              className={cls("role")}
              id={id("role")}
              value={values.role}
              onChange={set("role")}
              aria-invalid={!!errors.role}
              aria-describedby={describe("role")}
              required
            >
              <option value="" disabled hidden>
                Select
              </option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="field-error" id={id("role-error")}>
                {errors.role}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor={id("email")}>Email</label>
            <input
              className={cls("email")}
              id={id("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@club.com"
              value={values.email}
              onChange={set("email")}
              aria-invalid={!!errors.email}
              aria-describedby={describe("email")}
              required
            />
            {errors.email && (
              <p className="field-error" id={id("email-error")}>
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="field">
          <label htmlFor={id("message")}>Message</label>
          <textarea
            className={cls("message")}
            id={id("message")}
            rows={5}
            placeholder="Tell us about your season and goals."
            value={values.message}
            onChange={set("message")}
            aria-invalid={!!errors.message}
            aria-describedby={describe("message")}
            required
          />
          {errors.message && (
            <p className="field-error" id={id("message-error")}>
              {errors.message}
            </p>
          )}
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send message"}
          <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" />
        </button>
        {submitError && (
          <p className="field-error" role="alert">
            {submitError}
          </p>
        )}
        <p className="form-foot">
          Individual player?{" "}
          <a href={links.signUp} target="_blank" rel="noopener noreferrer">
            Create a free account
          </a>
          .
        </p>
      </form>
    </div>
  );
}
