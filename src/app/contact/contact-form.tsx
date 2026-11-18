"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Clock } from "lucide-react";
import { HoneypotField } from "@/components/honeypot-field";
import { HONEYPOT_NAME } from "@/lib/honeypot";
import { EMAIL_RE } from "@/lib/validation";
import { COLLEGE_PLANS } from "@/lib/plans";
import { FreeMatchLink } from "@/components/perspective/cta-links";
import { useQueryString } from "@/lib/use-query-string";
import { CONTACT_EMAIL } from "@/lib/links";
import type { LeadSource } from "@/lib/leads";

/* /contact's message form: a details panel on the left (who reads it, what
   it is for, when you hear back), the fields on the right.

   One form, two destinations, chosen by the role. A coach's message is a
   quote request, so it files a Sales lead (/api/leads, with the school, role,
   message and any plan the link carried) and the coach gets the sales
   confirmation email. Everyone else's goes to /api/contact as a message.

   A link that arrives with ?plan= (an older /pricing link, or "Talk to us"
   with a plan) starts the message with that plan, and ?for=college or a plan
   picks the head coach role, so a quote request needs one less step. */

const COACH_ROLES = ["Head coach", "Assistant coach"];
const ROLES = [...COACH_ROLES, "Player", "Parent", "Other"];

type Values = { name: string; email: string; school: string; role: string; message: string };
type Field = keyof Values;
const ORDER: readonly Field[] = ["name", "email", "school", "role", "message"];

// Plain, specific validation: every field carries a message rather than a
// bare red rule.
function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!v.name.trim()) e.name = "Tell us your name.";
  if (!v.email.trim()) e.email = "Add an email so we can reply.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email doesn't look right.";
  if (!v.role) e.role = "Choose your role.";
  if (!v.message.trim()) e.message = "Add a short message.";
  return e;
}

export function ContactForm() {
  const query = useQueryString();
  const preset = useMemo(() => {
    const q = new URLSearchParams(query);
    const plan = COLLEGE_PLANS.find((p) => p.id === q.get("plan"));
    const college = Boolean(plan) || q.get("for") === "college";
    return {
      plan: plan?.id ?? "",
      role: college ? "Head coach" : "",
      message: plan ? `We’re looking at the ${plan.name} plan. ` : "",
    };
  }, [query]);

  return <Form key={query} preset={preset} />;
}

function Form({ preset }: { preset: { plan: string; role: string; message: string } }) {
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    school: "",
    role: preset.role,
    message: preset.message,
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Honeypot: real users never fill this; bots that auto-fill every field do.
  const honeypot = useRef("");
  const sentRef = useRef<HTMLHeadingElement>(null);

  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  // Move focus to the confirmation so keyboard and screen-reader users land on
  // the result, not back at the top of a now-replaced form.
  useEffect(() => {
    if (sent) sentRef.current?.focus();
  }, [sent]);

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const control = (field: Field) => ({
    id: id(field),
    className: `ct-control${errors[field] ? " is-error" : ""}`,
    value: values[field],
    onChange: set(field),
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? id(`${field}-error`) : undefined,
  });
  const error = (field: Field) =>
    errors[field] ? (
      <p className="ct-error" id={id(`${field}-error`)}>
        {errors[field]}
      </p>
    ) : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    if (Object.keys(next).length) {
      setErrors(next);
      // Take keyboard and screen-reader users straight to the first problem.
      const first = ORDER.find((f) => next[f]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      const coach = COACH_ROLES.includes(values.role);
      const res = await fetch(coach ? "/api/leads" : "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(coach ? { source: "Sales" satisfies LeadSource, plan: preset.plan } : {}),
          name: values.name,
          email: values.email,
          university: values.school,
          role: values.role,
          message: values.message,
          [HONEYPOT_NAME]: honeypot.current,
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setSubmitError(`Your message didn’t send. Try again, or email ${CONTACT_EMAIL}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mock-frame ct-write">
      <aside className="ct-side">
        <span className="ct-person">
          <img src="/assets/marketing/founder-avatar.jpg" alt="" width={32} height={32} />
          Cj Gimena
        </span>
        <span className="ct-title">Questions and quotes</span>
        <ul className="ct-facts">
          <li>
            <Clock size={16} strokeWidth={1.5} aria-hidden="true" />
            Replies within two business days
          </li>
        </ul>
      </aside>

      {sent ? (
        <div className="ct-main ct-sent" role="status" aria-live="polite">
          <span className="chk">
            <Check size={22} strokeWidth={2} aria-hidden="true" />
          </span>
          <h3 ref={sentRef} tabIndex={-1}>
            Message sent.
          </h3>
          <p>Thanks. We read every message and reply within two business days.</p>
          <p className="ct-sent-foot">
            Playing yourself? <FreeMatchLink placement="contact-sent" icon={false} />.
          </p>
        </div>
      ) : (
        <form className="ct-main" onSubmit={onSubmit} noValidate>
          {/* Hidden from people and from the browser's autofill; see lib/honeypot. */}
          <HoneypotField valueRef={honeypot} />
          <div className="ct-grid">
            <div className="ct-field">
              <label htmlFor={id("name")}>Full name</label>
              <input
                {...control("name")}
                type="text"
                autoComplete="name"
                autoCapitalize="words"
                enterKeyHint="next"
                placeholder="Your name"
                required
              />
              {error("name")}
            </div>
            <div className="ct-field">
              <label htmlFor={id("email")}>Email</label>
              <input
                {...control("email")}
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                placeholder="you@example.com"
                required
              />
              {error("email")}
            </div>
            <div className="ct-field">
              <label htmlFor={id("school")}>
                School <span className="opt">if you coach one</span>
              </label>
              <input
                {...control("school")}
                type="text"
                autoComplete="organization"
                enterKeyHint="next"
                placeholder="School or program"
              />
            </div>
            <div className="ct-field">
              <label htmlFor={id("role")}>Role</label>
              <select {...control("role")} required>
                <option value="" disabled>
                  Select your role
                </option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {error("role")}
            </div>
          </div>
          <div className="ct-field">
            <label htmlFor={id("message")}>Message</label>
            <textarea {...control("message")} rows={4} placeholder="Your teams and season, or your question" required />
            {error("message")}
          </div>
          <button className="btn btn-primary ct-send" type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send message"}
          </button>
          {submitError ? (
            <p className="ct-error" role="alert">
              {submitError}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
