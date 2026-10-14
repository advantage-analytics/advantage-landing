"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  MatchBreakdown,
  MatchEndings,
  MatchH2HRows,
  MatchInsight,
  MatchScore,
  MB_H,
  MB_W,
} from "./match-breakdown";
import { ProofHead } from "./band-parts";
import { MockFrame } from "./mock-frame";
import {
  EXPORT_GUIDE_HREF,
  VIDEO_MIN_FPS_SHORT,
  VIDEO_MIN_RESOLUTION,
} from "@/lib/match-video";

/* The home page's how-it-works band, the "what you'll see" strip and the
   breakdown band, in the order the page shows them. This module
   statically imports the real MatchBreakdown board, so anything that only
   needs the shell (useReveal, Footer, RequestAccess) lives in its own module —
   importing it from here would drag the whole 1440px board onto /about,
   /contact, /pilot and the legal routes, none of which render it.

   The hero's computer screen shows the dashboard Home; the breakdown
   band shows what a visitor gets after an upload — the single-match report —
   so the two product shots are two surfaces of the app, not the same one
   twice. The strip above it is three pieces of that same report, pulled out
   and captioned in plain words, so the full board arrives already explained. */

export function DashboardShowcase() {
  return (
    <section className="band proof-band" id="dashboard">
      <div className="wrap">
        <ProofHead
          eyebrow="The full match analysis"
          title="Know exactly what to drill."
          aside="Every serve, return and rally next to your opponent’s, and a read on what decided it."
        />
        {/* Decorative screenshot: role="img" carries the honest description and
            `inert` keeps the pictured controls out of the tab order. */}
        <div
          className="proof-board reveal"
          role="img"
          aria-label="The Advantage match report for one match: the final score, an Advantage Intelligence insight, serve, return and point statistics head to head, the running points margin, rally lengths, and how each player's points ended."
        >
          <MockFrame width={MB_W} height={MB_H}>
            <div inert className="mock-inert">
              <MatchBreakdown />
            </div>
          </MockFrame>
        </div>
      </div>
    </section>
  );
}

/* ---------- step visuals ----------
   One small picture per step, in the page's own hairline-and-blue drawing
   style (the /pilot court diagram's), never stock illustration. The third is
   not drawn at all: it is the report's real scoreboard. */

// A court seen from above with the phone behind one baseline, its view
// taking in the whole court: the filming advice as a picture.
function CaptureVisual() {
  return (
    <svg className="how-art" viewBox="0 0 240 132" role="img" aria-label="A phone set up behind the baseline, seeing the whole court.">
      <path d="M36 66 212 14v104z" fill="var(--signal-blue)" opacity=".09" />
      <g fill="none" stroke="var(--ink-label)" strokeWidth="1">
        <rect x="72" y="22" width="140" height="88" />
        <path d="M72 33h140M72 99h140M107 33v66M177 33v66M107 66h70" />
        <path d="M142 16v100" stroke="var(--ink-muted)" strokeDasharray="2 3" />
      </g>
      <rect x="24" y="54" width="13" height="24" rx="3" fill="var(--signal-blue)" />
      <circle cx="33.5" cy="66" r="1.6" fill="#fff" />
    </svg>
  );
}

// The upload as the visitor will meet it: one video file on its way up.
function UploadVisual() {
  return (
    <div className="how-file" role="img" aria-label="A match video uploading.">
      <span className="ic">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m16 13 5.2 3.1a.5.5 0 0 0 .8-.4V8.3a.5.5 0 0 0-.8-.4L16 11" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
      </span>
      <span className="tx">
        <span className="nm">my-match.mp4</span>
        <span className="st">Uploading…</span>
        <span className="bar"><i /></span>
      </span>
    </div>
  );
}

function AnalyzeVisual() {
  return (
    <div
      className="mb-crop how-score"
      role="img"
      aria-label="The scoreboard from a sample Advantage match report: a three-set win, 6-4, 3-6, 6-3."
    >
      <div inert>
        <MatchScore />
      </div>
    </div>
  );
}

// Capture → Upload → Analyze. Each step is a picture, a short line, and the
// one fact people ask about under it: the footage spec, the monthly
// allowance for each lane, the turnaround. Each fact lives in one place: the
// camera angle in the first step, the export guide in the second.
const HOW_STEPS: readonly { k: string; t: string; p: ReactNode; spec: string; vis: ReactNode }[] = [
  {
    k: "Capture",
    t: "Film your match.",
    p: "Set your phone behind the baseline, as high up as you can get it. A fence works great. From the side, we can’t see the whole court.",
    spec: `${VIDEO_MIN_RESOLUTION} · ${VIDEO_MIN_FPS_SHORT} · MP4`,
    vis: <CaptureVisual />,
  },
  {
    k: "Upload",
    t: "Upload the video.",
    p: (
      <>
        Send it in when you’re off the court. If it’s stuck on a camera, the{" "}
        <Link href={EXPORT_GUIDE_HREF}>export guide</Link> shows how to get it off.
      </>
    ),
    spec: "2 h a month for players · 75 h for programs",
    vis: <UploadVisual />,
  },
  {
    k: "Analyze",
    t: "Understand what happened.",
    p: "See where you won points, where you lost them, and what to work on, each linked to the moment on video. We email you when it’s ready.",
    spec: "ready within 24 h",
    vis: <AnalyzeVisual />,
  },
];

/* How it works, directly under the hero: a cold visitor has just been told
   "film your match" and the next thing they need is how little that takes.
   A full-width head (headline left, premise flush right), then one white
   panel split into three columns — the same build as the beta band further
   down, in white where that one is navy. */
export function HowItWorks() {
  return (
    <section className="band how-band" id="how">
      <div className="wrap">
        <div className="how-head reveal">
          <div className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2>Upload, analyze, understand your match.</h2>
          </div>
          <p className="band-aside">
            Tennis match analysis from one phone video.{" "}
            <span className="how-aside-tail">No new cameras, no tagging.</span>
          </p>
        </div>
        <ol className="how-panel reveal" aria-label="Three steps">
          {HOW_STEPS.map((s, i) => (
            <li className="how-step" key={s.k}>
              <div className="how-vis">{s.vis}</div>
              <span className="n">
                0{i + 1} · {s.k}
              </span>
              <h3>{s.t}</h3>
              <p>{s.p}</p>
              <span className="spec">{s.spec}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Three pieces of the sample match report shown in the breakdown band below,
// each under a plain-words caption. They are that board's own components, so
// every figure here is one the board also shows: nothing is redrawn or added.
const SEE_ITEMS: readonly { t: string; p: string; label: string; crop: ReactNode }[] = [
  {
    t: "Where your winners came from",
    p: "Serve, return, at the net: the shots that won you points, next to your opponent’s.",
    label:
      "From a sample match report: winners, aces, return winners and net points won, for both players side by side.",
    crop: <MatchH2HRows title="Head to head" labels={["Winners", "Aces", "Return winners", "Net points won"]} />,
  },
  {
    t: "Where your errors came from",
    p: "The points you gave away, so you know what to tidy up before the next match.",
    label:
      "From a sample match report: unforced errors and double faults for both players, and a bar showing how each player’s points ended.",
    crop: (
      <>
        <MatchH2HRows title="Head to head" labels={["Unforced errors", "Double faults"]} />
        <MatchEndings />
      </>
    ),
  },
  {
    t: "One thing to work on",
    p: "A short, plain-English read on what decided the match and what to try next time.",
    label:
      "From a sample match report: a written insight naming the pattern that decided the match and what to keep doing.",
    crop: <MatchInsight />,
  },
];

/* What you'll see: the answer to "what do I get back?", before the full
   board. Three captioned crops on the page's gray, the captions carrying the
   meaning so nobody has to read a stats table to follow along. */
export function WhatYouSee() {
  return (
    <section className="band alt see-band" id="see">
      <div className="wrap">
        <ProofHead
          eyebrow="What you’ll see"
          title="Tennis analytics in plain English."
          aside="Three things you get from every match you upload. Shown here: a sample match."
        />
        <ul className="see-grid reveal">
          {SEE_ITEMS.map((it) => (
            <li className="see-item" key={it.t}>
              <div className="see-crop mb-crop" role="img" aria-label={it.label}>
                <div inert className="see-crop-in">
                  {it.crop}
                </div>
              </div>
              <h3>{it.t}</h3>
              <p>{it.p}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
