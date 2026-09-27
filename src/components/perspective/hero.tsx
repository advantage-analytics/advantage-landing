"use client";

import { useRef, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { DashboardHome } from "./dashboard-home";
import { TrafficLights } from "./traffic-lights";
import { useScaleToFit } from "@/lib/use-scale-to-fit";
import { links } from "@/lib/links";
import { trackCta } from "@/lib/analytics";
import { BETA_END_SHORT } from "@/lib/pilot";

const HERO_EYEBROW = `Public beta · Free through ${BETA_END_SHORT}`;

/* ===========================================================
   Perspective hero — two compositions, one section.

   • Desktop / tablet (≥768px): a native 1440×860 mesh-gradient
     artboard with centered copy and the dashboard Home
     tilted in 3D, scaled to fill the viewport width (HeroCCanvas).
   • Mobile (<768px): a real flowing layout — full-size headline,
     subhead, stacked CTAs over the mesh, with a legible slice of
     the dashboard peeking from the bottom to invite the scroll.
     The fixed artboard is NOT shrunk to phone width; only the
     dashboard preview is cropped, so the type stays readable.
   The two are toggled with CSS so each renders at its true size.
   =========================================================== */

const BrowserBar = () => (
  <div className="winbar">
    <TrafficLights className="windots" />
    <div className="winurl">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      app.advantage-analytics.com
    </div>
  </div>
);

// The two lanes: individuals sign up in the app, and so do coaches, who then
// find their team there.
function HeroActions() {
  return (
    <div className="h-actions">
      <a
        className="hbtn hbtn-white"
        href={links.signUp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCta("join_free_beta", "home-hero")}
      >
        Join Free Beta
        <ArrowUpRight size={16} />
      </a>
      <a
        className="hbtn hbtn-glass"
        href={links.signUp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCta("find_your_team", "home-hero")}
      >
        Find Your Team
        <ArrowUpRight size={16} />
      </a>
    </div>
  );
}

function PHDashWindow({ rotateX }: { rotateX: MotionValue<number> | number }) {
  const scale = 0.76;
  return (
    <motion.div
      className="winframe"
      style={{
        position: "absolute",
        transformOrigin: "top left",
        width: 1440,
        left: (1440 - 1440 * scale) / 2,
        top: 0,
        scale,
        rotateX,
        boxShadow: "0 60px 120px -30px rgba(8,17,50,.7)",
      }}
    >
      <BrowserBar />
      <div inert>
        <DashboardHome />
      </div>
    </motion.div>
  );
}

function HeroCCanvas({ dashRotateX }: { dashRotateX: MotionValue<number> | number }) {
  return (
    // Transparent: the mesh and grain are painted by .heroC-desktop across the
    // full viewport width, so they keep going past the artboard once its
    // scale is capped on wide screens (or a zoomed-out browser).
    <div className="heroC-canvas">
      <div
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          paddingTop: 126,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <span className="h-eyebrow">{HERO_EYEBROW}</span>
        <h1 className="h-title" style={{ fontSize: 62, maxWidth: 820 }}>
          Walk on court knowing the pattern.
        </h1>
        <p className="h-sub" style={{ maxWidth: 560 }}>
          Shot-by-shot match analytics, built from the video your program already shoots. Film the
          match, upload the file, read the breakdown.
        </p>
        <div style={{ marginTop: 4 }}>
          <HeroActions />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, bottom: 0, perspective: "2000px", perspectiveOrigin: "50% 0%", zIndex: 3 }}>
        <PHDashWindow rotateX={dashRotateX} />
      </div>
    </div>
  );
}

/* Mobile hero — real DOM at real sizes. The dashboard slice is held at a
   fixed, legible scale (transform on .mh-dash) and cropped by .mh-peek's
   overflow, so the visible region (sidebar + greeting + KPI strip) stays
   readable instead of being shrunk to thumbnail size. */
function MobileHero() {
  return (
    <div className="heroC-mobile brand-mesh">
      <div className="mesh-grain" />
      <div className="mh-inner">
        <span className="h-eyebrow">{HERO_EYEBROW}</span>
        <h1 className="mh-title">Walk on court knowing the pattern.</h1>
        <p className="mh-sub">
          Shot-by-shot match analytics, built from the video your program already shoots.
        </p>
        <HeroActions />
      </div>
      <div className="mh-peek" aria-hidden="true">
        <div className="mh-window winframe">
          <BrowserBar />
          <div className="mh-dash" inert>
            <DashboardHome />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reads prefers-reduced-motion directly. We avoid framer-motion's
   useReducedMotion() because it logs a dev-only console warning every time it
   detects the setting. useSyncExternalStore subscribes to the media query,
   stays SSR-safe (server snapshot is false), and updates live if the OS
   preference changes. */
const RM_QUERY = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(RM_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(RM_QUERY).matches,
    () => false
  );
}

// Native artboard geometry — the single source for the fit hook AND the
// pre-hydration height reservation inlined on .heroC-desktop below. Keeping
// them tied is load-bearing: if the reserved height drifts from the fitted
// height, anchor jumps to sections below the hero land off-target again.
const ART_W = 1440;
const ART_H = 860;
const ART_MAX_SCALE = 1.15;

export function PerspectiveHero() {
  // maxScale caps the upscaling on wide monitors (the hook then centers the
  // 1440 artboard, letting the blue backstop show as side gutters) so the hero
  // stays proportional to the 1240px content sections instead of ballooning.
  const { outerRef, innerRef } = useScaleToFit<HTMLDivElement, HTMLDivElement>({
    width: ART_W,
    height: ART_H,
    maxScale: ART_MAX_SCALE,
  });
  const heroRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  // As the hero scrolls away, its tilted dashboard "stands up" (32°→14°),
  // handing the perspective off to the showcase below, which then lands flat.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const dashRotateX = useTransform(scrollYProgress, [0, 1], [32, 14]);

  return (
    <header className="heroC-stage" id="top" ref={heroRef}>
      <div
        className="heroC-desktop"
        ref={outerRef}
        style={{ aspectRatio: `${ART_W} / ${ART_H}`, maxHeight: ART_H * ART_MAX_SCALE }}
      >
        <div className="mesh-grain" aria-hidden="true" />
        <div ref={innerRef} className="heroC-fit">
          <HeroCCanvas dashRotateX={reduce ? 32 : dashRotateX} />
        </div>
      </div>
      <MobileHero />
    </header>
  );
}
