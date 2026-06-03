"use client";

import { useEffect, useRef } from "react";
import { AdvantageDashboard } from "./dashboard";
import { links } from "@/lib/links";

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
        Get started →
      </a>
      <a className="hbtn hbtn-glass" href="#dashboard">
        See the dashboard
      </a>
    </div>
  );
}

function PHNav() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        zIndex: 6,
      }}
    >
      <img className="h-logo" src="/assets/logos/logo4-white.svg" alt="Advantage" />
      <div className="h-nav" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
        <a href="#dashboard">Dashboard</a>
        <a href="#how">How it works</a>
        <a href="#features">Features</a>
        <a href="#access">Pricing</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <a href={links.signIn} style={{ color: "#fff", font: "500 13px var(--font-sans)", textDecoration: "none", opacity: 0.9 }}>
          Sign in
        </a>
        <a className="hbtn hbtn-glass" href="#access" style={{ height: 38, padding: "0 16px", fontSize: 13 }}>
          Get started
        </a>
      </div>
    </div>
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
        <div className="windots">
          <i style={{ background: "#FF5F57" }} />
          <i style={{ background: "#FEBC2E" }} />
          <i style={{ background: "#28C840" }} />
        </div>
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
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(11,20,55,.36) 0%, rgba(11,20,55,0) 42%)",
        }}
      />
      <PHNav />
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
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const W = 1440,
      H = 860;
    const fit = () => {
      const s = stage.clientWidth / W;
      canvas.style.transform = `scale(${s})`;
      stage.style.height = H * s + "px";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  return (
    <header className="heroC-stage" id="top" ref={stageRef}>
      <div ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, transformOrigin: "top left" }}>
        <HeroCCanvas />
      </div>
    </header>
  );
}
