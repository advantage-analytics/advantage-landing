"use client";

import { ArrowUpRight } from "lucide-react";
import { AdvantageDashboard } from "./dashboard";
import { TrafficLights } from "./traffic-lights";
import { links } from "@/lib/links";
import { useScaleToFit } from "@/lib/use-scale-to-fit";

/* ===========================================================
   Perspective hero (iteration C) — faithful reproduction of
   heroes.jsx → HeroC. A native 1440×860 mesh-gradient artboard
   with centered copy and the real AdvantageDashboard tilted in
   3D perspective, scaled to fill the viewport width.
   =========================================================== */

function PHBtns() {
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

// Native-resolution overlay nav. Rendered OUTSIDE the scaled artboard so the
// logo and text stay crisp and the logo size is independent of the artboard
// scale (matches the dashboard login nav: logo-white.svg at 28px).
function PHNav() {
  return (
    <nav className="phero-nav">
      <a href="#top" aria-label="Advantage — Home">
        <img className="phero-logo" src="/assets/logos/logo-white.svg" alt="Advantage" />
      </a>
      <div className="phero-nav-center h-nav">
        <a href="#dashboard">Dashboard</a>
        <a href="#how">How it works</a>
        <a href="#features">Features</a>
        <a href="#access">Pricing</a>
      </div>
      <div className="phero-nav-actions">
        <a className="phero-signin" href={links.signIn}>
          Sign in
        </a>
        <a className="hbtn hbtn-glass phero-nav-cta" href="#access">
          Get started
        </a>
      </div>
    </nav>
  );
}

function PHDashWindow() {
  const scale = 0.76;
  return (
    <div
      className="winframe"
      style={{
        position: "absolute",
        transformOrigin: "top left",
        width: 1440,
        left: (1440 - 1440 * scale) / 2,
        top: 0,
        transform: `scale(${scale}) rotateX(32deg)`,
        boxShadow: "0 60px 120px -30px rgba(8,17,50,.7)",
      }}
    >
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
      <AdvantageDashboard />
    </div>
  );
}

function HeroCCanvas() {
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
          <span className="dot" />
          Performance Intelligence
        </span>
        <h1 className="h-title" style={{ fontSize: 62, maxWidth: 820 }}>
          Walk on court knowing the pattern.
        </h1>
        <p className="h-sub" style={{ maxWidth: 540 }}>
          Professional-grade match analytics, built from electronic line-calling data.
        </p>
        <div style={{ marginTop: 4 }}>
          <PHBtns />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, bottom: 0, perspective: "2000px", perspectiveOrigin: "50% 0%", zIndex: 3 }}>
        <PHDashWindow />
      </div>
    </div>
  );
}

export function PerspectiveHero() {
  const { outerRef, innerRef } = useScaleToFit<HTMLElement, HTMLDivElement>({ height: 860 });

  return (
    <header className="heroC-stage" id="top" ref={outerRef}>
      <div ref={innerRef} style={{ position: "absolute", top: 0, left: 0, transformOrigin: "top left" }}>
        <HeroCCanvas />
      </div>
      <PHNav />
    </header>
  );
}
