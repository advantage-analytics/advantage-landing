"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { MatchEndings, MatchInsight } from "./match-breakdown";
import { CourtFrame } from "@/components/guide/court-frame";
import { KPIS, spark } from "./dashboard-home";
import { ProofHead } from "./band-parts";
import { useQueryString } from "@/lib/use-query-string";
import {
  EXPORT_GUIDE_HREF,
  RECORDING_GUIDE_HREF,
  VIDEO_FORMATS,
  VIDEO_MAX_SIZE,
  VIDEO_MIN_FPS_SHORT,
  VIDEO_MIN_RESOLUTION,
} from "@/lib/match-video";

/* The home page's how-it-works band and the "what you'll see" strip, in the
   order the page shows them. This module statically imports pieces of the
   real match report, so anything that only needs the shell (useReveal,
   Footer, RequestAccess) lives in its own module — importing it from here
   would drag the board's components onto /about, /contact, /pricing and the
   legal routes, none of which render them.

   The hero's laptop shows the dashboard Home; the strip shows what a visitor
   gets after an upload — a dashboard trend and two pieces of the
   single-match report, pulled out and captioned in plain words. The whole report is not shown as a board of
   its own: the product tour below shows those same numbers live, each one
   opening its point on film, which is the stronger proof. */

/* ---------- step visuals ----------
   One picture per step, each a piece the product already draws, on a white
   card: the recording guide's camera frame (the uploader's own diagram), the
   dashboard's upload stepper, and the match report's scoreboard. Markup and
   measurements follow the dashboard's components (VerticalStep,
   AnalysisProgressTrack, RailScoreboard); if those are redrawn, redraw these. */

// What the camera should see: the guide's "works" frame, shown in the
// viewfinder of a phone that is recording.
function CaptureVisual() {
  return (
    <figure className="how-card how-frame">
      <div className="phone">
        <CourtFrame variant="works" />
        <span className="rec" aria-hidden="true">
          <i />
          REC
        </span>
      </div>
    </figure>
  );
}

// The dashboard's dashed "not started" ring: twelve arcs, drawn not bordered.
const RING_HALF = ((2 * Math.PI) / 12) * 0.55 * 0.5;
const RING_DX = 5.9 * Math.sin(RING_HALF);
const RING_Y = 7 - 5.9 * Math.cos(RING_HALF);
const RING_DASH = `M ${7 - RING_DX} ${RING_Y} A 5.9 5.9 0 0 1 ${7 + RING_DX} ${RING_Y}`;

// The upload as the visitor will meet it: the stepper the dashboard shows
// while a video goes up. Saved, uploading, analysis still to come.
function UploadVisual() {
  return (
    <div className="how-card how-stepper" role="img" aria-label="The upload screen: match saved, video uploading at 64 percent, 1.2 of 1.9 gigabytes, analysis next.">
      <ol>
        <li className="is-done">
          <span className="rail">
            <span className="mk"><Check size={10} strokeWidth={2.25} aria-hidden="true" /></span>
          </span>
          <span className="bd"><span className="lb">Match saved</span></span>
        </li>
        <li className="is-now">
          <span className="rail">
            <span className="mk" />
          </span>
          <span className="bd">
            <span className="lb">Uploading video<b>64%</b></span>
            <span className="bar"><i /></span>
            <span className="by">1.2 GB of 1.9 GB</span>
          </span>
        </li>
        <li className="is-later">
          <span className="rail">
            <span className="mk">
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  {Array.from({ length: 12 }, (_, i) => (
                    <path key={i} d={RING_DASH} transform={`rotate(${30 * i} 7 7)`} />
                  ))}
                </g>
              </svg>
            </span>
          </span>
          <span className="bd"><span className="lb">Analysis</span></span>
        </li>
      </ol>
    </div>
  );
}

// The report's scoreboard as it reads once a match is in: the winner checked,
// each set's winning digit in bold, the points count under it.
const SCORE_ROWS: readonly { name: string; won: boolean; sets: readonly [number, boolean][] }[] = [
  { name: "Rudy Quan", won: true, sets: [[6, true], [3, false], [6, true]] },
  { name: "Federico Gomez", won: false, sets: [[4, false], [6, true], [3, false]] },
];

function AnalyzeVisual() {
  return (
    <div
      className="how-card how-sb"
      role="img"
      aria-label="The scoreboard from a sample Advantage match report: a three-set win, 6-4, 3-6, 6-3, with 187 points tagged."
    >
      <div className="hd">
        <span>Final</span>
        <span className="clock">1:42:18</span>
      </div>
      <div className="rows">
        {SCORE_ROWS.map((r) => (
          <div className={`row${r.won ? "" : " is-lost"}`} key={r.name}>
            <span className="nm">{r.name}</span>
            {r.won ? <Check size={12} strokeWidth={2} className="win" aria-hidden="true" /> : null}
            <span className="sets">
              {r.sets.map(([g, w], i) => (
                <b key={i} className={w ? "w" : "l"}>{g}</b>
              ))}
            </span>
          </div>
        ))}
      </div>
      <span className="cap">Match complete · 187 points tagged</span>
    </div>
  );
}

// Film → Upload → Analyze. Each step is a picture, a short line, and the
// one fact people ask about under it: the footage spec, the file
// limits, how you hear back. Each fact lives in one place: the
// camera angle and the recording guide in the first step, the export guide in
// the second.
const HOW_STEPS: readonly { k: string; t: string; p: ReactNode; spec: string; vis: ReactNode }[] = [
  {
    k: "Film",
    t: "Film your match.",
    p: (
      <>
        Put a phone or camera behind the baseline, as high as you can, so the whole court is in the frame. The{" "}
        <Link href={RECORDING_GUIDE_HREF}>recording guide</Link> covers setup and settings.
      </>
    ),
    spec: `${VIDEO_MIN_RESOLUTION} · ${VIDEO_MIN_FPS_SHORT} · MP4`,
    vis: <CaptureVisual />,
  },
  {
    k: "Upload",
    t: "Upload the video.",
    p: (
      <>
        Send it from a computer or tablet after the match. If the video is on a camera or a court system, the{" "}
        <Link href={EXPORT_GUIDE_HREF}>export guide</Link> shows how to get it off.
      </>
    ),
    spec: `${VIDEO_FORMATS} · up to ${VIDEO_MAX_SIZE}`,
    vis: <UploadVisual />,
  },
  {
    k: "Analyze",
    t: "See what decided it.",
    p: "Where you won points, where you lost them and what to work on, each linked to the moment on video. You get an email when it’s ready.",
    spec: "Singles matches · doubles coming",
    vis: <AnalyzeVisual />,
  },
];

/* How it works, directly under the hero: a cold visitor has just been told
   "film your match" and the next thing they need is how little that takes.
   A full-width head (headline left, premise flush right), then one white
   panel split into three columns — the same build as the beta band further
   down, in white where that one is navy. */
/* How the three steps are laid out, while the design is being decided:
   "panel" is three columns in one panel, picture on top; "rows" gives each
   step a full-width row, words left and picture right; "flow" joins the three
   pictures into one strip with an arrow between them; "first" puts the words
   first under a rule and the picture at the foot. ?how= in the address
   overrides it, for comparing them. Keep one and delete the rest. */
type HowLayout = "panel" | "rows" | "flow" | "first";
const HOW_LAYOUT: HowLayout = "flow";
const isHowLayout = (v: string | null): v is HowLayout => v === "panel" || v === "rows" || v === "flow" || v === "first";

/* How big the three pictures are, while that is being decided: "natural"
   leaves each card its own height; "equal" makes all three the same box;
   "grow" steps them up toward the result. ?vis= overrides it. Keep one. */
type HowVis = "natural" | "equal" | "grow";
const HOW_VIS: HowVis = "equal";
const isHowVis = (v: string | null): v is HowVis => v === "natural" || v === "equal" || v === "grow";

export function HowItWorks() {
  const query = new URLSearchParams(useQueryString());
  const asked = query.get("how");
  const layout = isHowLayout(asked) ? asked : HOW_LAYOUT;
  const askedVis = query.get("vis");
  const vis = isHowVis(askedVis) ? askedVis : HOW_VIS;
  return (
    <section className="band how-band" id="how" data-how={layout} data-vis={vis}>
      <div className="wrap">
        <div className="how-head reveal">
          <div className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2>
              Film, upload, <span className="h-tail">see&nbsp;what&nbsp;happened.</span>
            </h2>
          </div>
          <p className="band-aside">
            Tennis match analysis from a single video of your match.{" "}
            <span className="how-aside-tail">No new cameras, no tagging.</span>
          </p>
        </div>
        <ol className="how-panel reveal" aria-label="Three steps">
          {HOW_STEPS.map((s, i) => (
            <li className="how-step" key={s.k}>
              <div className="how-vis">{s.vis}</div>
              {/* The number alone: the title under it already names the step. */}
              <span className="n" aria-hidden="true">
                0{i + 1}
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
export function KpiTrend() {
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
    p: "Winners and aces next to errors and double faults, so you know what to tidy up before the next match.",
    label:
      "From a sample match report: a bar for each player showing how their points ended, in winners, aces, errors and double faults.",
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
