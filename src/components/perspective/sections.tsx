"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Icon } from "./icons";
import { AdvantageDashboard, CourtViz, KpiTile, D_KPIS, InsightChip } from "./dashboard";
import { TrafficLights } from "./traffic-lights";
import { links } from "@/lib/links";
import { useScaleToFit } from "@/lib/use-scale-to-fit";

/* Reveal-on-scroll — fades sections in as they enter the viewport.
   Honors prefers-reduced-motion via the CSS (.reveal stays visible). */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Scales the real 1440-wide AdvantageDashboard to fit its container. The hook's
// ResizeObserver watches the inner artboard, so a late height change (mounted
// children) re-fits silently — no settle-timeout jump.
function ScaledDashboard() {
  const { outerRef, innerRef } = useScaleToFit();
  return (
    <div ref={outerRef} style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <div ref={innerRef} style={{ width: 1440, transformOrigin: "top left" }}>
        <AdvantageDashboard />
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
      aria-label="The Advantage dashboard: KPI trends, recent matches, a serve-placement court, and an AI insight."
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
        <div className="show-head reveal">
          <div className="sec-head">
            <span className="eyebrow">
              The Dashboard
            </span>
            <h2>Walk on court knowing exactly what to drill.</h2>
          </div>
          <p style={{ maxWidth: 340, color: "var(--ink-secondary)", font: "var(--fw-regular) 15px/1.6 var(--font-sans)" }}>
            Every serve, return, and rally, distilled into the numbers that decide matches. No noise, no decoration.
          </p>
        </div>
        {/* Desktop: the dashboard "lands" full-width, scaled to fit. */}
        <div className="show-dash-desktop">
          <LandingDashboard />
        </div>
        {/* Mobile: a fixed-scale, legible slice — cropped and faded at the
            bottom — instead of shrinking the whole 1440 artboard to a ~2px
            thumbnail. Purely decorative, so aria-hidden; the headline above
            carries the meaning. */}
        <div className="show-dash-mobile reveal" aria-hidden="true">
          <div className="browser">
            <div className="browser-bar">
              <TrafficLights className="browser-dots" />
              <div className="browser-url">
                <Icon n="lock" size={9} /> app.advantage-analytics.com
              </div>
            </div>
            <div className="browser-screen show-crop" inert>
              <div className="show-crop-inner">
                <AdvantageDashboard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="band" id="how">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">
            How it works
          </span>
          <h2>From the last point to the next adjustment.</h2>
          <p>Advantage plugs straight into the line-calling data you already capture. Three steps, no manual tagging.</p>
        </div>
        {/* Each step reveals on its own with a stagger index, so 01 → 02 → 03
            cascade in sequence rather than appearing as one block. */}
        <div className="steps">
          <div className="step reveal" style={{ "--ri": 0 } as CSSProperties}>
            <div className="step-num">01</div>
            <h4>Capture the match with SwingVision.</h4>
            <p>Record on court with SwingVision&apos;s electronic line-calling. Every shot, serve, and call is logged automatically.</p>
            <span className="pill">
              <img src="/assets/providers/swingvision-trim.png" alt="SwingVision" /> Only ELC source supported today
            </span>
          </div>
          <div className="step reveal" style={{ "--ri": 1 } as CSSProperties}>
            <div className="step-num">02</div>
            <h4>Export the match and upload.</h4>
            <p>Export the match file from SwingVision and drop it into Advantage. We parse every point — no spreadsheets to wrangle.</p>
          </div>
          <div className="step reveal" style={{ "--ri": 2 } as CSSProperties}>
            <div className="step-num">03</div>
            <h4>Read the dashboard, find the pattern.</h4>
            <p>Statistics, court visualizations, and AI insight are ready in seconds — on the surfaces your whole team can read.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  return (
    <section className="band alt" id="features">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">
            What you get
          </span>
          <h2>Every match, read three ways.</h2>
          <p>The analysis that used to live with ATP and WTA teams — your serve placement, your numbers, your next adjustment.</p>
        </div>
        {/* Cards cascade court → stats → ai instead of popping together. */}
        <div className="bento">
          <div className="feat b-court reveal" style={{ "--ri": 0 } as CSSProperties}>
            <div className="feat-top">
              <div className="ic">
                <Icon n="target" />
              </div>
              <div>
                <h4>Court visualization</h4>
                <p>Every serve and shot plotted on a real court from line-call coordinates. See exactly where the points go.</p>
              </div>
            </div>
            <div className="viz">
              <div className="feat-courtband">
                <div className="adb-court-wrap">
                  <CourtViz />
                </div>
              </div>
              <div className="court-legend">
                <span className="court-leg"><span className="sw first" /> First serve</span>
                <span className="court-leg"><span className="sw second" /> Second serve</span>
              </div>
            </div>
          </div>
          <div className="feat b-stats reveal" style={{ "--ri": 1 } as CSSProperties}>
            <div className="ic">
              <Icon n="bar" />
            </div>
            <h4>Match statistics</h4>
            <p>Serve %, win rate, break points, rally length — exact and trended across your last 30 days.</p>
            <div className="viz">
              <div className="feat-kpistrip">
                <KpiTile {...D_KPIS[0]} countUp />
                <KpiTile {...D_KPIS[1]} countUp />
                <KpiTile {...D_KPIS[3]} countUp />
              </div>
            </div>
          </div>
          <div className="feat b-ai reveal" style={{ "--ri": 2 } as CSSProperties}>
            <div className="ic">
              <Icon n="msg" />
            </div>
            <h4>AI match insight</h4>
            <p>Plain-language reads on what changed and what to drill next — grounded in your numbers, written for players who know the game.</p>
            <div className="viz">
              <p className="insight-mini">
                <b>Second-serve points won dropped to 48%.</b> Against deep returners, a heavier kick serve is the pattern to drill this week.
              </p>
              <div className="adb-chips">
                <InsightChip label="1st Serve Won" value="74%" change={3} />
                <InsightChip label="2nd Serve Won" value="48%" change={-5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Credibility() {
  return (
    <section className="band cred-band">
      <div className="wrap cred reveal">
        <span className="eyebrow">
          Built for the modern athlete
        </span>
        <h3>Built by former collegiate players. Designed for competitive advantage.</h3>
        <p className="line">Access to Advantage is currently limited to invited players and coaches.</p>
        <div className="cred-stats">
          <div className="cred-stat">
            <div className="n">100%</div>
            <div className="l">From line-call data</div>
          </div>
          <div className="cred-stat">
            <div className="n">
              <b>&lt;60s</b>
            </div>
            <div className="l">Match to insight</div>
          </div>
          <div className="cred-stat">
            <div className="n">1</div>
            <div className="l">ELC source · SwingVision</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RequestAccess() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <section className="band access" id="access">
      <div className="wrap">
        <div className="access-card reveal">
          <div className="ac-glow" />
          <div className="access-inner">
            <div>
              <span className="eyebrow">
                Request access
              </span>
              <h3>Get the advantage. By invitation.</h3>
              <p>
                Tell us where to reach you. We&apos;re onboarding players and coaches in waves — you&apos;ll get an invite when a spot
                opens for your level.
              </p>
            </div>
            <div className="access-form">
              {sent ? (
                <div className="access-sent">
                  <div className="chk">
                    <Icon n="check" size={20} />
                  </div>
                  You&apos;re on the list.
                  <br />
                  We&apos;ll be in touch at {email || "your inbox"}.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="uline">
                    <label>Name</label>
                    <input type="text" placeholder="Your name" required />
                  </div>
                  <div className="uline">
                    <label>Email</label>
                    <input type="email" placeholder="you@club.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="uline">
                    <label>Role</label>
                    <input type="text" placeholder="Player, coach, or program" />
                  </div>
                  <button className="btn btn-primary" type="submit">
                    Request access <Icon n="arrow" size={16} />
                  </button>
                  <div className="access-note">Invite-only · no spam · unsubscribe anytime</div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <img src="/assets/logos/logo.svg" alt="Advantage" />
            <p>Performance intelligence for competitive tennis. Built by former collegiate players.</p>
          </div>
          <nav className="foot-cols">
            <div className="foot-col">
              <h5>Product</h5>
              <a href="#dashboard">Dashboard</a>
              <a href="#features">Statistics</a>
              <a href="#features">Court visualization</a>
              <a href="#features">AI insight</a>
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              <a href="#how">How it works</a>
              <a href="#access">Request access</a>
              <a href={links.signIn}>Sign in</a>
            </div>
          </nav>
        </div>
        <div className="foot-bottom">
          <span className="cp">© 2026 Advantage Analytics. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
