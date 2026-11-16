"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { HoneypotField } from "@/components/honeypot-field";
import { HONEYPOT_NAME } from "@/lib/honeypot";
import { EMAIL_RE } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";
import { TEAM_CHOICES } from "@/lib/leads";
import { COLLEGE_PLANS, SEASON_LABEL, allowance, usd, type Season } from "@/lib/plans";

/* The college form: what a quote needs and nothing else. It files a lead
   (/api/leads, Source "Sales") and the coach gets a confirmation email that
   repeats their answers. Plan and season arrive preselected from /pricing. */

type Values = {
  name: string;
  email: string;
  school: string;
  teams: string;
  rosterSize: string;
  season: string;
  plan: string;
  message: string;
};

const REQUIRED: readonly (keyof Values)[] = ["name", "email", "school", "teams"];

function validate(v: Values): Partial<Record<keyof Values, string>> {
  const e: Partial<Record<keyof Values, string>> = {};
  if (!v.name.trim()) e.name = "Tell us your name.";
  if (!v.email.trim()) e.email = "Add an email so we can send the quote.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email doesn't look right.";
  if (!v.school.trim()) e.school = "Tell us your school.";
  if (!v.teams) e.teams = "Choose your team or teams.";
  return e;
}

export function SalesForm({ preset }: { preset: { plan: string; season: string } }) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    school: "",
    teams: "",
    rosterSize: "",
    season: preset.season,
    plan: preset.plan,
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const honeypot = useRef("");
  const sentRef = useRef<HTMLHeadingElement>(null);

  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  useEffect(() => {
    if (sent) sentRef.current?.focus();
  }, [sent]);

  const set =
    (field: keyof Values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };

  const control = (field: keyof Values) => ({
    id: id(field),
    className: `control${errors[field] ? " is-error" : ""}`,
    value: values[field],
    onChange: set(field),
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? id(`${field}-error`) : undefined,
    required: REQUIRED.includes(field),
  });

  const error = (field: keyof Values) =>
    errors[field] ? (
      <p className="field-error" id={id(`${field}-error`)}>
        {errors[field]}
      </p>
    ) : null;

  if (sent) {
    return (
      <div className="form-sent" role="status" aria-live="polite">
        <div className="chk">
          <Check size={22} strokeWidth={2} aria-hidden="true" />
        </div>
        <h3 ref={sentRef} tabIndex={-1}>
          Request sent.
        </h3>
        <p>Thanks. A person reads it and replies with a quote. We emailed you a copy of your answers.</p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    if (Object.keys(next).length) {
      setErrors(next);
      const first = REQUIRED.find((f) => next[f]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          university: values.school,
          role: "Coach",
          teams: values.teams,
          rosterSize: values.rosterSize,
          season: values.season,
          plan: values.plan,
          message: values.message,
          source: "Sales",
          [HONEYPOT_NAME]: honeypot.current,
        }),
      });
      if (!res.ok) throw new Error();
      // Plan and teams only: nothing here identifies the person or the school.
      trackEvent("sales_form_submitted", { plan: values.plan || "unsure", teams: values.teams });
      setSent(true);
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <HoneypotField valueRef={honeypot} />
      <div className="field-row">
        <div className="field">
          <label htmlFor={id("name")}>Full name</label>
          <input {...control("name")} type="text" autoComplete="name" autoCapitalize="words" placeholder="Your name" />
          {error("name")}
        </div>
        <div className="field">
          <label htmlFor={id("email")}>School email</label>
          <input
            {...control("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="you@school.edu"
          />
          {error("email")}
        </div>
      </div>

      <div className="field">
        <label htmlFor={id("school")}>School</label>
        <input {...control("school")} type="text" autoComplete="organization" placeholder="Your college or university" />
        {error("school")}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor={id("teams")}>Team or teams</label>
          <select {...control("teams")}>
            <option value="" disabled hidden>
              Select
            </option>
            {TEAM_CHOICES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {error("teams")}
        </div>
        <div className="field">
          <label htmlFor={id("rosterSize")}>Roster size</label>
          <input {...control("rosterSize")} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3} placeholder="Players per team" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor={id("season")}>Season</label>
          <select {...control("season")}>
            {(Object.keys(SEASON_LABEL) as Season[]).map((s) => (
              <option key={s} value={s}>
                {SEASON_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={id("plan")}>Plan</label>
          <select {...control("plan")}>
            <option value="">Not sure yet</option>
            {COLLEGE_PLANS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {usd(allowance(p, values.season as Season).price)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor={id("message")}>Anything else (optional)</label>
        <textarea {...control("message")} rows={3} placeholder="Your schedule, your cameras, a purchase order process." />
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Ask for a quote"}
        <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" />
      </button>
      {submitError && (
        <p className="field-error" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
