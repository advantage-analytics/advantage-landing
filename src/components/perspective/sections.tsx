"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { MatchBreakdown, MB_H, MB_W } from "./match-breakdown";
import { ProofSide } from "./band-parts";
import { MockFrame } from "./mock-frame";
import { EXPORT_GUIDE_HREF } from "@/lib/match-intake";

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
        <div className="proof" style={{ "--ratio": MB_W / MB_H } as CSSProperties}>
          <ProofSide
            eyebrow="The breakdown"
            title="Know exactly what to drill."
            aside="One match, every serve, return and rally, distilled into the numbers that decided it. No noise, no decoration."
          />
          {/* Decorative screenshot: role="img" carries the honest description and
              `inert` keeps the pictured controls out of the tab order. */}
          <div
            className="proof-board"
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
      </div>
    </section>
  );
}

// Three steps, one line each, with the fact a coach checks beside each: the
// footage spec, the allowance, the turnaround. The footage qualifier (behind
// the baseline, not side-on) lives in the FAQ and on /pilot in full; here the
// point is how little there is to do.
const HOW_STEPS = [
  {
    t: "Record the match.",
    p: "Any full-court angle you already use. The export guide covers getting the file off the camera.",
    spec: "1080p · 30fps · MP4",
  },
  {
    t: "Drop in the file.",
    p: "Upload straight from the dashboard. Each match counts against your monthly hours.",
    spec: "2 h / month · beta",
  },
  {
    t: "Open the breakdown.",
    p: "Serve, return and rally numbers, each one linked to the point on film.",
    spec: "within 24 h",
  },
] as const;

/* How it works, on its own, after the three product boards and before the
   offer: the visitor has seen what comes back before they read how little it
   takes, and the band hands straight into "pick your lane". An editorial
   split — the premise and the one real still of the angle Advantage reads on
   the left, the three steps as a hairline ledger on the right. The only
   photograph on the page, which is where the band's weight comes from. */
export function HowItWorks() {
  return (
    <section className="band how-band" id="how">
      <div className="wrap how-split">
        <div className="how-intro reveal">
          <span className="eyebrow">How it works</span>
          <h2>No new cameras. No tagging.</h2>
          <p>
            The video your program already shoots is enough. Behind the baseline, raised up if you can. The same
            file that produced the point you just watched.
          </p>
          <figure className="how-still">
            <img src="/assets/marketing/elc-court.jpg" alt="A singles court filmed from behind the baseline, the angle Advantage reads." />
            <figcaption>
              <i aria-hidden="true" />
              Works · behind the baseline
            </figcaption>
          </figure>
        </div>
        <ol className="how-ledger reveal" aria-label="Three steps">
          {HOW_STEPS.map((s, i) => (
            <li key={s.t}>
              <span className="n">0{i + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.p}</p>
              <span className="spec">{s.spec}</span>
            </li>
          ))}
          <li className="how-foot">
            Side-on film won’t give a full breakdown. The <Link href={EXPORT_GUIDE_HREF}>export guide</Link> shows how to get the file off the camera.
          </li>
        </ol>
      </div>
    </section>
  );
}
