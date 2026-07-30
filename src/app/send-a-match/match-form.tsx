"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { CONTACT_EMAIL } from "@/lib/links";
import {
  CAMERA_POSITIONS,
  SIDE_ANGLE,
  START_ENDS,
  TURNAROUND,
  UPLOAD_URL,
} from "@/lib/match-intake";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// UPLOAD_URL is inlined at build time, so this is a constant on both the server
// and the client — no hydration mismatch, and no flash of a path that isn't
// there. With no upload destination configured the panel disappears and the
// link becomes the only way in.
const HAS_UPLOAD = Boolean(UPLOAD_URL);

type Values = {
  name: string;
  program: string;
  email: string;
  videoUrl: string;
  willUpload: boolean;
  player: string;
  startEnd: string;
  opponent: string;
  matchDate: string;
  score: string;
  cameraPosition: string;
  notes: string;
};

const EMPTY: Values = {
  name: "",
  program: "",
  email: "",
  videoUrl: "",
  willUpload: false,
  player: "",
  startEnd: "",
  opponent: "",
  matchDate: "",
  score: "",
  cameraPosition: "",
  notes: "",
};

// Both routes are open at once, so the record has to say which one they took —
// it's the difference between Cj opening a share link and going to look in
// Dropbox for a file. "Upload" now means one is on its way rather than already
// landed; Status tracks whether it actually arrived.
function sendMethodOf(v: Values): string {
  const hasLink = Boolean(v.videoUrl.trim());
  if (hasLink && v.willUpload) return "Link + upload";
  return v.willUpload ? "Upload" : "Link";
}

/* Shape check only. We deliberately never fetch the URL to confirm the sharing
   settings: CORS blocks the request from the browser, so a "broken" verdict
   would be a false negative on a link that works fine — and refusing a good
   link at peak intent costs the lead outright. Cj opens it by hand instead. */
function looksLikeUrl(raw: string): boolean {
  const value = raw.trim();
  if (!value || /\s/.test(value)) return false;
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    return url.hostname.includes(".") && !url.hostname.endsWith(".");
  } catch {
    return false;
  }
}

// Every message names the specific thing that's missing. A bare red rule tells
// a coach on a phone nothing.
function validate(v: Values): Partial<Record<keyof Values, string>> {
  const e: Partial<Record<keyof Values, string>> = {};
  if (!v.name.trim()) e.name = "Tell us your name.";
  if (!v.program.trim()) e.program = "Tell us where you coach.";
  if (!v.email.trim()) e.email = "Add an email so we can send the breakdown.";
  else if (!EMAIL_RE.test(v.email.trim()))
    e.email = "That email doesn't look right.";
  // Either route satisfies this: a link now, or a file to follow. We just need
  // to know which.
  if (!v.videoUrl.trim()) {
    if (!(HAS_UPLOAD && v.willUpload))
      e.videoUrl = HAS_UPLOAD
        ? "Paste a link, or tick the box below to send the file instead."
        : "Paste the link to the video.";
  } else if (!looksLikeUrl(v.videoUrl)) {
    e.videoUrl = "That doesn't look like a link — it should start with https://";
  }
  if (!v.player.trim()) e.player = "Tell us which player to analyze.";
  if (!v.startEnd) e.startEnd = "Pick the end they started on.";
  if (!v.cameraPosition) e.cameraPosition = "Tell us where the camera was.";
  return e;
}

/* The visual required marker. Screen readers get the same information from the
   inputs' `required` / `aria-required`, so the glyph itself is hidden from them:
   announcing "star" after every label is noise, not information. The legend at
   the top of the form is what gives the asterisk its meaning for sighted users. */
const REQ = (
  <span className="sm-req" aria-hidden="true">
    *
  </span>
);

// Focus order for jumping to the first problem on a failed submit.
const ORDER: (keyof Values)[] = [
  "name",
  "program",
  "email",
  "videoUrl",
  "player",
  "startEnd",
  "cameraPosition",
];

export function MatchForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Honeypot: real coaches never see this; bots that fill every field do.
  const company = useRef("");
  const sentRef = useRef<HTMLHeadingElement>(null);

  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  // Land keyboard and screen-reader users on the confirmation, not at the top
  // of a form that no longer exists.
  useEffect(() => {
    if (sent) sentRef.current?.focus();
  }, [sent]);

  const clearError = (field: keyof Values) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const set =
    (field: keyof Values) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      clearError(field);
    };

  const pick = (field: keyof Values, value: string) => () => {
    setValues((v) => ({ ...v, [field]: value }));
    clearError(field);
  };

  const cls = (field: keyof Values) =>
    `sm-input${errors[field] ? " is-error" : ""}`;
  const describe = (field: keyof Values, hint?: boolean) =>
    [hint ? id(`${field}-hint`) : null, errors[field] ? id(`${field}-error`) : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldError = (field: keyof Values) =>
    errors[field] ? (
      <p className="sm-error" id={id(`${field}-error`)}>
        {errors[field]}
      </p>
    ) : null;

  if (sent) {
    // The details are banked at this point, so the file is the only thing that
    // can still go missing — and that's recoverable, because the row carries an
    // email to chase. Hence the upload prompt sits above the confirmation prose:
    // it's the one thing left to do.
    const awaitingFile = HAS_UPLOAD && values.willUpload;
    return (
      <div className="sm-sent" role="status" aria-live="polite">
        <h2 ref={sentRef} tabIndex={-1}>
          Got it.
        </h2>
        {awaitingFile && (
          <div className="sm-handoff">
            <p className="sm-handoff-head">
              One thing left &mdash; the film itself.
            </p>
            <a
              className="campaign-btn campaign-btn-secondary"
              href={UPLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open upload window
              <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
            </a>
            <p>
              Your details are already saved, so we&rsquo;ll match the file to
              this submission when it lands. The window stays open if you&rsquo;d
              rather upload from a laptop later.
            </p>
          </div>
        )}
        <p>
          A confirmation is on its way to <strong>{values.email}</strong>. Your
          breakdown will be with you within {TURNAROUND}
          {awaitingFile ? " of the film arriving" : ""}. If anything about the
          file needs sorting out, I&rsquo;ll email you directly.
        </p>
        <p className="sm-sign">&mdash; Cj</p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    if (Object.keys(next).length) {
      setErrors(next);
      const first = ORDER.find((f) => next[f]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    const sendMethod = sendMethodOf(values);
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/send-a-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, sendMethod, company: company.current }),
      });
      if (!res.ok) throw new Error();
      trackEvent("send_a_match_submitted", {
        send_method: sendMethod,
        camera_position: values.cameraPosition,
        // The share of side-angle film is the number that decides whether the
        // tracking constraint is worth engineering around.
        side_angle: values.cameraPosition === SIDE_ANGLE,
      });
      setSent(true);
    } catch {
      setSubmitError(
        `Something went wrong sending that. Try again, or email the details to ${CONTACT_EMAIL} and I'll sort it out.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="sm-form" onSubmit={onSubmit} noValidate>
      {/* Honeypot — off-screen, out of the tab order, invisible to a coach. */}
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

      <p className="sm-required-note">
        Fields marked {REQ} are required.
      </p>

      {/* 1 — Your name */}
      <div className="sm-field">
        <label htmlFor={id("name")}>Your name {REQ}</label>
        <input
          className={cls("name")}
          id={id("name")}
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={set("name")}
          aria-invalid={!!errors.name}
          aria-describedby={describe("name")}
          required
        />
        {fieldError("name")}
      </div>

      {/* 2 — Program */}
      <div className="sm-field">
        <label htmlFor={id("program")}>Program, school, or academy {REQ}</label>
        <input
          className={cls("program")}
          id={id("program")}
          type="text"
          autoComplete="organization"
          value={values.program}
          onChange={set("program")}
          aria-invalid={!!errors.program}
          aria-describedby={describe("program")}
          required
        />
        {fieldError("program")}
      </div>

      {/* 3 — Email */}
      <div className="sm-field">
        <label htmlFor={id("email")}>Email {REQ}</label>
        <p className="sm-hint" id={id("email-hint")}>
          Where we&rsquo;ll send the breakdown.
        </p>
        <input
          className={cls("email")}
          id={id("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          aria-invalid={!!errors.email}
          aria-describedby={describe("email", true)}
          required
        />
        {fieldError("email")}
      </div>

      {/* 4 — The link, offered first and always. Most college film already
          lives in a cloud, where pasting a link takes ten seconds and
          re-uploading 15GB takes an hour. Both routes are open at once so a
          coach never has to answer a question about how they'd like to answer
          the question — they just use whichever they have. */}
      <div className="sm-field">
        <label htmlFor={id("videoUrl")}>Link to the video {REQ}</label>
        <p className="sm-hint" id={id("videoUrl-hint")}>
          Google Drive, Dropbox, PlaySight, Hudl, WeTransfer &mdash; anything
          works. Make sure sharing is set to &ldquo;anyone with the link can
          view.&rdquo;
        </p>
        <input
          className={cls("videoUrl")}
          id={id("videoUrl")}
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="https://"
          value={values.videoUrl}
          onChange={set("videoUrl")}
          aria-required="true"
          aria-invalid={!!errors.videoUrl}
          aria-describedby={describe("videoUrl", true)}
        />
        {fieldError("videoUrl")}
      </div>

      {/* 5 — The fallback, for film that only exists on a laptop. The upload
          window deliberately does NOT open from here: sending a coach to
          Dropbox mid-form means they can upload 15GB and never come back, and
          then there's a video in the bucket with no idea whose match it is.
          Ticking this box submits the details first and hands over the upload
          link on the way out, so the worst case is a known coach with a missing
          file rather than an unattributable file. Dropbox file requests can't
          carry custom fields, so this is the only place the metadata can come
          from. */}
      {HAS_UPLOAD && (
        <div className="sm-panel">
          <p className="sm-panel-head">No link? Send us the file instead.</p>
          <label className="sm-checkline">
            <input
              className="sm-checkbox"
              type="checkbox"
              checked={values.willUpload}
              onChange={(e) => {
                const { checked } = e.target;
                setValues((v) => ({ ...v, willUpload: checked }));
                clearError("videoUrl");
              }}
            />
            <span>I&rsquo;ll upload the file instead.</span>
          </label>
          <p>
            Tick that and an upload window opens as soon as you send this form.
            No Dropbox account needed.
          </p>
        </div>
      )}

      {/* 6 — Player */}
      <div className="sm-field">
        <label htmlFor={id("player")}>Which player should we analyze? {REQ}</label>
        <p className="sm-hint" id={id("player-hint")}>
          Full name, so we can label the report.
        </p>
        <input
          className={cls("player")}
          id={id("player")}
          type="text"
          value={values.player}
          onChange={set("player")}
          aria-invalid={!!errors.player}
          aria-describedby={describe("player", true)}
          required
        />
        {fieldError("player")}
      </div>

      {/* 7 — Starting end. The invalid/described state belongs to the group,
          not to each radio — aria-invalid means nothing on a single option. */}
      <fieldset
        className="sm-fieldset"
        role="radiogroup"
        aria-required="true"
        aria-invalid={!!errors.startEnd}
        aria-describedby={describe("startEnd")}
      >
        <legend className="sm-legend">Which end did they start on? {REQ}</legend>
        <div className="sm-options is-tight">
          {START_ENDS.map((option, i) => (
            <label className="sm-option" key={option}>
              <input
                className="sm-radio"
                id={i === 0 ? id("startEnd") : undefined}
                type="radio"
                name={id("startEnd-group")}
                value={option}
                checked={values.startEnd === option}
                onChange={pick("startEnd", option)}
              />
              <span className="sm-option-label">{option}</span>
            </label>
          ))}
        </div>
        {fieldError("startEnd")}
      </fieldset>

      {/* 8–10 — the optional match record */}
      <div className="sm-field">
        <label htmlFor={id("opponent")}>Opponent</label>
        <input
          className={cls("opponent")}
          id={id("opponent")}
          type="text"
          value={values.opponent}
          onChange={set("opponent")}
        />
      </div>

      <div className="sm-pair">
        <div className="sm-field">
          <label htmlFor={id("matchDate")}>Match date</label>
          <input
            className={cls("matchDate")}
            id={id("matchDate")}
            type="date"
            value={values.matchDate}
            onChange={set("matchDate")}
          />
        </div>
        <div className="sm-field">
          <label htmlFor={id("score")}>Final score</label>
          <input
            className={cls("score")}
            id={id("score")}
            type="text"
            placeholder="6-4, 7-5"
            value={values.score}
            onChange={set("score")}
          />
        </div>
      </div>

      {/* 11 — The soft gate. It warns; it never blocks. */}
      <fieldset
        className="sm-fieldset"
        role="radiogroup"
        aria-required="true"
        aria-invalid={!!errors.cameraPosition}
        aria-describedby={describe("cameraPosition")}
      >
        <legend className="sm-legend">Where was the camera? {REQ}</legend>
        <div className="sm-options is-tight">
          {CAMERA_POSITIONS.map((option, i) => (
            <label className="sm-option" key={option}>
              <input
                className="sm-radio"
                id={i === 0 ? id("cameraPosition") : undefined}
                type="radio"
                name={id("cameraPosition-group")}
                value={option}
                checked={values.cameraPosition === option}
                onChange={pick("cameraPosition", option)}
              />
              <span className="sm-option-label">{option}</span>
            </label>
          ))}
        </div>
        {fieldError("cameraPosition")}
        {/* The live region is mounted up front so the caution is announced when
            it appears, not just rendered. */}
        <div role="status" aria-live="polite">
          {values.cameraPosition === SIDE_ANGLE && (
            <p className="campaign-note is-caution">
              Side-angle footage doesn&rsquo;t work with our tracking yet. Send
              it anyway &mdash; I&rsquo;ll take a look and tell you straight
              away whether we can do anything with it.
            </p>
          )}
        </div>
      </fieldset>

      {/* 12 — Notes */}
      <div className="sm-field">
        <label htmlFor={id("notes")}>
          Anything specific you want us to look at?
        </label>
        <p className="sm-hint" id={id("notes-hint")}>
          Optional. A pattern you&rsquo;re curious about, a player you&rsquo;re
          working with.
        </p>
        <textarea
          className={cls("notes")}
          id={id("notes")}
          rows={3}
          value={values.notes}
          onChange={set("notes")}
          aria-describedby={describe("notes", true)}
        />
      </div>

      <div className="sm-submit-row">
        <button
          className="campaign-btn campaign-btn-primary sm-submit"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Sending…" : "Send it over"}
        </button>
        {submitError && (
          <p className="sm-error" role="alert">
            {submitError}
          </p>
        )}
        <p className="sm-privacy">
          We&rsquo;ll only use this film to produce your breakdown.
        </p>
      </div>
    </form>
  );
}
