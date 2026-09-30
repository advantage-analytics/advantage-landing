"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MatchBreakdown, MB_H, MB_W } from "./match-breakdown";
import { ProofHead } from "./band-parts";
import { MockFrame } from "./mock-frame";
import {
  EXPORT_GUIDE_HREF,
  VIDEO_MIN_FPS_SHORT,
  VIDEO_MIN_RESOLUTION,
} from "@/lib/match-video";

/* The home page's breakdown band and the how-it-works band. This module
   statically imports the real MatchBreakdown board, so anything that only
   needs the shell (useReveal, Footer, RequestAccess) lives in its own module —
   importing it from here would drag the whole 1440px board onto /about,
   /contact, /pilot and the legal routes, none of which render it.

   The hero already shows the dashboard Home in its browser window; this band
   shows what a visitor gets after an upload — the single-match report — so
   the two product shots are two surfaces of the app, not the same one twice.
   Like the film room and the team board it sits in the plain frame: the hero
   is the one establishing shot with browser chrome, every board after it is
   a closer look at a surface. */

export function DashboardShowcase() {
  return (
    <section className="band alt proof-band" id="dashboard">
      <div className="wrap">
        <ProofHead
          eyebrow="The breakdown"
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
          <MockFrame className="is-light" width={MB_W} height={MB_H}>
            <div inert className="film-inert">
              <MatchBreakdown />
            </div>
          </MockFrame>
        </div>
      </div>
    </section>
  );
}

// Three steps, with the fact a coach checks under each: the footage spec, the
// allowance for each lane, the turnaround. Each fact lives in one place: the
// camera angle in the first step, the export guide in the second.
const HOW_STEPS: readonly { t: string; p: ReactNode; spec: string }[] = [
  {
    t: "Record the match.",
    p: "From behind the baseline, raised up if you can. Side-on film won’t give a full breakdown.",
    spec: `${VIDEO_MIN_RESOLUTION} · ${VIDEO_MIN_FPS_SHORT} · MP4`,
  },
  {
    t: "Upload the file.",
    p: (
      <>
        Straight from the dashboard. The <Link href={EXPORT_GUIDE_HREF}>export guide</Link> shows how to get it off
        the camera.
      </>
    ),
    spec: "2 h players · 75 h pilot",
  },
  {
    t: "Open the breakdown.",
    p: "Serve, return and rally numbers, each linked to the point on film. We email you when it’s ready.",
    spec: "within 24 h",
  },
];

/* How it works, on its own, after the three product boards and before the
   offer: the visitor has seen what comes back before they read how little it
   takes, and the band hands straight into "pick your lane". Built as the
   beta band is: a full-width head (headline left, premise flush right), then
   one panel split into columns. White here, navy there: the same structure
   in the page's two materials, so the two bands read as a pair and the navy
   stays the place a visitor picks a lane. */
export function HowItWorks() {
  return (
    <section className="band how-band" id="how">
      <div className="wrap">
        <div className="how-head reveal">
          <div className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2>No new cameras. No tagging.</h2>
          </div>
          <p className="band-aside">
            The video you already shoot is enough.{" "}
            <span className="how-aside-tail">Three steps from file to breakdown.</span>
          </p>
        </div>
        <ol className="how-panel reveal" aria-label="Three steps">
          {HOW_STEPS.map((s, i) => (
            <li className="how-step" key={s.t}>
              <span className="n">0{i + 1}</span>
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
