"use client";

import { Icon } from "./icons";
import { DashboardHome, DH_H, DH_W } from "./dashboard-home";
import { BandHead, Trio, type TrioItem } from "./band-parts";
import { TrafficLights } from "./traffic-lights";
import { useScaleToFit } from "@/lib/use-scale-to-fit";

/* The home page's dashboard and how-it-works bands. This module statically imports the real
   DashboardHome, so anything that only needs the shell (useReveal, Footer,
   RequestAccess) lives in its own module — importing it from here would drag
   the whole 1440px dashboard tree onto /about, /contact, /pilot and the legal
   routes, none of which render it. */

// Scales the fixed 1440×900 dashboard Home to fit its container. aspect-ratio
// reserves the fitted height before the fit effect runs, so every anchor
// position below this section is already right before hydration.
function ScaledDashboard() {
  const { outerRef, innerRef } = useScaleToFit({ width: DH_W, height: DH_H });
  return (
    <div
      ref={outerRef}
      style={{ position: "relative", width: "100%", overflow: "hidden", aspectRatio: `${DH_W} / ${DH_H}` }}
    >
      <div ref={innerRef} style={{ width: DH_W, transformOrigin: "top left" }}>
        <DashboardHome />
      </div>
    </div>
  );
}

/* The dashboard sits flat and pin-sharp. It fades and rises into place once on
   entry through the shared `.reveal` observer — the same single motion the
   section heading uses — then stays put. No scroll-scrubbed 3D tilt: the
   product itself is the proof, not the motion. Reduced-motion users get it
   static (handled in the `.reveal` CSS). */
function LandingDashboard() {
  return (
    <div
      className="browser reveal"
      role="img"
      aria-label="The Advantage dashboard Home: season KPI trends, recent matches, a year of activity, an Advantage Intelligence insight, and serve placement by court."
    >
      <div className="browser-bar">
        <TrafficLights className="browser-dots" />
        <div className="browser-url">
          <Icon n="lock" size={9} /> app.advantage-analytics.com
        </div>
      </div>
      {/* Decorative screenshot: `inert` keeps its buttons out of the tab order
          and the a11y tree (the role="img" label above is the honest
          representation), and CSS kills pointer-events so its hover states
          never fire. */}
      <div className="browser-screen" inert>
        <ScaledDashboard />
      </div>
    </div>
  );
}

export function DashboardShowcase() {
  return (
    <section className="band alt" id="dashboard">
      <div className="wrap">
        <BandHead
          eyebrow="The Dashboard"
          title="Walk on court knowing exactly what to drill."
          aside="Every serve, return, and rally, distilled into the numbers that decide matches. No noise, no decoration."
        />
        {/* The dashboard "lands" full-width, scaled to fit at every size — the
            whole product surface is visible at once. On a phone it reads as a
            complete product shot; the Features section below carries the legible
            close-ups of each read. */}
        <LandingDashboard />
      </div>
    </section>
  );
}

// Three steps, one line each. The footage qualifier (behind the baseline, not
// side-on) lives in the FAQ and on /pilot, where a coach deciding whether to
// upload will look for it; here the point is how little there is to do.
const HOW_STEPS: readonly TrioItem[] = [
  {
    k: "Film",
    t: "Record the match.",
    p: "Any full-court angle you already use. The export guide covers getting the file off the camera.",
  },
  {
    k: "Upload",
    t: "Drop in the file.",
    p: "Upload straight from the dashboard. Each match counts against your monthly hours.",
  },
  {
    k: "Read",
    t: "Open the breakdown.",
    p: "Serve, return and rally numbers, each one linked to the point on film.",
  },
];

export function HowItWorks() {
  return (
    <section className="band" id="how">
      <div className="wrap">
        <BandHead
          eyebrow="How it works"
          title="Film it. Upload it. Read it."
          aside="No new cameras, no tagging. The video your program already shoots is enough."
        />
        <Trio items={HOW_STEPS} label="Three steps" />
      </div>
    </section>
  );
}
