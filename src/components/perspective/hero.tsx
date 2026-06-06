"use client";

import { useRef, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { AdvantageDashboard } from "./dashboard";
import { TrafficLights } from "./traffic-lights";
import { useScaleToFit } from "@/lib/use-scale-to-fit";

/* ===========================================================
   Perspective hero — two compositions, one section.

   • Desktop / tablet (≥768px): a native 1440×860 mesh-gradient
     artboard with centered copy and the real AdvantageDashboard
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

function HeroActions() {
  return (
    <div className="h-actions">
      <a className="hbtn hbtn-white" href="#access">
        Get started
        <ArrowUpRight size={16} />
      </a>
      <a className="hbtn hbtn-glass" href="#dashboard">
        See the dashboard
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
      <AdvantageDashboard />
    </motion.div>
  );
}

function HeroCCanvas({ dashRotateX }: { dashRotateX: MotionValue<number> | number }) {
  return (
    <div className="brand-mesh heroC-canvas">
      <div className="mesh-grain" />
      <div
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          paddingTop: 136,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <span className="h-eyebrow">
          Performance Intelligence
        </span>
        <h1 className="h-title" style={{ fontSize: 62, maxWidth: 820 }}>
          Walk on court knowing the pattern.
        </h1>
        <p className="h-sub" style={{ maxWidth: 540 }}>
          Professional-grade match analytics, built from electronic line-calling data.
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
        <span className="h-eyebrow">Performance Intelligence</span>
        <h1 className="mh-title">Walk on court knowing the pattern.</h1>
        <p className="mh-sub">
          Professional-grade match analytics, built from electronic line-calling data.
        </p>
        <HeroActions />
      </div>
      <div className="mh-peek" aria-hidden="true">
        <div className="mh-window winframe">
          <BrowserBar />
          <div className="mh-dash">
            <AdvantageDashboard />
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

export function PerspectiveHero() {
  // maxScale caps the upscaling on wide monitors (the hook then centers the
  // 1440 artboard, letting the blue backstop show as side gutters) so the hero
  // stays proportional to the 1240px content sections instead of ballooning.
  const { outerRef, innerRef } = useScaleToFit<HTMLDivElement, HTMLDivElement>({ height: 860, maxScale: 1.15 });
  const heroRef = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  // As the hero scrolls away, its tilted dashboard "stands up" (32°→14°),
  // handing the perspective off to the showcase below, which then lands flat.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const dashRotateX = useTransform(scrollYProgress, [0, 1], [32, 14]);

  return (
    <header className="heroC-stage" id="top" ref={heroRef}>
      <div className="heroC-desktop" ref={outerRef}>
        <div ref={innerRef} style={{ position: "absolute", top: 0, transformOrigin: "top left" }}>
          <HeroCCanvas dashRotateX={reduce ? 32 : dashRotateX} />
        </div>
      </div>
      <MobileHero />
    </header>
  );
}
