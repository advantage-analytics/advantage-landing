"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const ROLES = ["Player", "Coach", "Parent", "Other"];

type Values = {
  name: string;
  role: string;
  university: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY: Values = {
  name: "",
  role: "",
  university: "",
  email: "",
  phone: "",
  message: "",
};

// Plain, specific validation. Optional fields (university, phone) are never
// checked; the rest carry a message rather than a bare red rule.
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

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
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
        <div className="form-sent" role="status" aria-live="polite">
          <div className="chk">
            <Check size={22} strokeWidth={2} aria-hidden="true" />
          </div>
          <h3 ref={sentRef} tabIndex={-1}>
            Message sent.
          </h3>
          <p>Thanks. We read every message and reply in person.</p>
        </div>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setSent(true);
  };

  return (
    <div className="form-panel">
      <div className="form-head">
        <span className="eyebrow">Send a message</span>
      </div>

      <form onSubmit={onSubmit} noValidate>
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
            <label htmlFor={id("university")}>
              University <span className="opt">Optional</span>
            </label>
            <input
              className="control"
              id={id("university")}
              type="text"
              autoComplete="organization"
              placeholder="Where you compete"
              value={values.university}
              onChange={set("university")}
            />
          </div>
        </div>

        <div className="field-row">
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
          <div className="field">
            <label htmlFor={id("phone")}>
              Phone <span className="opt">Optional</span>
            </label>
            <input
              className="control"
              id={id("phone")}
              type="tel"
              autoComplete="tel"
              placeholder="+1 (000) 000-0000"
              value={values.phone}
              onChange={set("phone")}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor={id("message")}>Message</label>
          <textarea
            className={cls("message")}
            id={id("message")}
            rows={4}
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

        <button className="btn btn-primary" type="submit">
          Send message
          <ArrowRight size={15} strokeWidth={1.6} aria-hidden="true" />
        </button>
        <p className="form-foot">
          Access to Advantage is currently limited to invited players and coaches.
        </p>
      </form>
    </div>
  );
}
