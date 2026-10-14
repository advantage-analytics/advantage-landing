"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MatchEndings, MatchInsight, MatchScore } from "./match-breakdown";
import { KPIS, spark } from "./dashboard-home";
import { ProofHead } from "./band-parts";
import {
  EXPORT_GUIDE_HREF,
  VIDEO_MIN_FPS_SHORT,
  VIDEO_MIN_RESOLUTION,
} from "@/lib/match-video";

/* The home page's how-it-works band and the "what you'll see" strip, in the
   order the page shows them. This module statically imports pieces of the
   real match report, so anything that only needs the shell (useReveal,
   Footer, RequestAccess) lives in its own module — importing it from here
   would drag the board's components onto /about, /contact, /pilot and the
   legal routes, none of which render them.

   The hero's laptop shows the dashboard Home; the strip shows what a visitor
   gets after an upload — a dashboard trend and two pieces of the
   single-match report, pulled out and captioned in plain words. The whole report is not shown as a board of
   its own: the product tour below shows those same numbers live, each one
   opening its point on film, which is the stronger proof. */

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

/* The dashboard's first KPI — 1st serve percentage over the last 30 days —
   drawn at the size of a card instead of a tile: the figure, the change,
   and the trend as a real line with its two ends marked. The
   figures and the trend are the dashboard Home's own (KPIS). */
const TR_W = 300;
const TR_H = 92;
const TREND = KPIS[0];
const TR = spark(TREND.d, { w: TR_W, h: TR_H, px: 6, py: 10, headroom: 1 });
// The ends as % of the box, for the HTML dots laid over the line.
const TR_ENDS = [TR.pts[0], TR.pts[TR.pts.length - 1]].map(([x, y]) => ({ left: `${(x / TR_W) * 100}%`, top: `${(y / TR_H) * 100}%` }));
function KpiTrend() {
  const k = TREND;
  return (
    <section className="dh-card mb-chart see-trend">
      <div className="dh-sh">
        <h2>{k.label}</h2>
        <div className="flex" />
        <span className="mb-micro">Last 30 days</span>
      </div>
      <div className="kv">
        <span className="v tn">{k.value}</span>
        <span className="ch tn" style={{ color: k.color }}>
          {k.up ? "↑" : "↓"} {k.change}
        </span>
      </div>
      <div className="tr-wrap">
        <svg className="tr" viewBox={`0 0 ${TR_W} ${TR_H}`} preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" x2={TR_W} y1={TR_H - 0.5} y2={TR_H - 0.5} className="base" />
          <path d={TR.area} fill={k.color} opacity="0.08" />
          <polyline points={TR.line} fill="none" stroke={k.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* The two ends, as HTML over the line so they stay round at any width. */}
        <div className="tr-marks" aria-hidden="true">
          <i className="is-start" style={TR_ENDS[0]} />
          <i style={{ ...TR_ENDS[1], background: k.color }} />
        </div>
      </div>
      <div className="ax">
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </section>
  );
}

// Three pieces of what comes back, each under a plain-words caption: the
// trend every upload adds to, how the match's points ended, and the read on
// what decided it. They are the dashboard's and the report's own components,
// so every figure here is one the product shows: nothing is redrawn or added.
const SEE_ITEMS: readonly { t: string; p: string; label: string; crop: ReactNode }[] = [
  {
    t: "How you’re trending",
    p: "Every match you upload adds to your trends, like how often your first serve goes in.",
    label: `From a sample dashboard: first serve percentage at ${KPIS[0].value}, up ${KPIS[0].change} over the last 30 days, on a rising trend.`,
    crop: <KpiTrend />,
  },
  {
    t: "How every point ended",
    p: "Winners and aces next to unforced errors and double faults, so you know what to tidy up before the next match.",
    label:
      "From a sample match report: a bar for each player showing how their points ended, in winners, aces, unforced errors and double faults.",
    crop: <MatchEndings large />,
  },
  {
    t: "One thing to work on",
    p: "A short, plain-English read on what decided the match and what to try next time.",
    label:
      "From a sample match report: a written insight naming the pattern that decided the match and what to keep doing.",
    crop: <MatchInsight />,
  },
];

/* What you'll see: the answer to "what do I get back?". Three captioned
   cards on the page's gray, each filling its tile so the row reads as three
   equal cards, the captions carrying the meaning so nobody has to read a
   stats table to follow along. */
export function WhatYouSee() {
  return (
    <section className="band alt see-band" id="see">
      <div className="wrap">
        <ProofHead
          eyebrow="What you’ll see"
          title="Tennis analytics in plain English."
          aside="Three things you get from every match you upload. Shown here: a sample player."
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
