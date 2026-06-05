"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { Icon } from "./icons";
import { AdvantageDashboard, CourtViz, KpiTile, D_KPIS } from "./dashboard";
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
            <div className="step-num"><span className="z">0</span>1</div>
            <h4>Capture the match with SwingVision.</h4>
            <p>Record on court with SwingVision&apos;s electronic line-calling. Every shot, serve, and call is logged automatically.</p>
            <span className="pill">
              <img src="/assets/providers/swingvision-trim.png" alt="SwingVision" /> Only ELC source supported today
            </span>
          </div>
          <div className="step reveal" style={{ "--ri": 1 } as CSSProperties}>
            <div className="step-num"><span className="z">0</span>2</div>
            <h4>Export the match and upload.</h4>
            <p>Export the match file from SwingVision and drop it into Advantage. We parse every point — no spreadsheets to wrangle.</p>
          </div>
          <div className="step reveal" style={{ "--ri": 2 } as CSSProperties}>
            <div className="step-num"><span className="z">0</span>3</div>
            <h4>Read the dashboard, find the pattern.</h4>
            <p>Statistics, court visualizations, and AI insight are ready in seconds — on the surfaces your whole team can read.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Multi-match trend — first-serve-won rising across the last eight matches.
// Real metric shape (matches the dashboard's DSpark language), not decoration.
function FeatTrend() {
  const data = [42, 49, 45, 54, 51, 60, 64, 71];
  const W = 320, H = 138, padX = 16, padTop = 16, padBot = 20;
  const min = 38, max = 74;
  const pts = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (W - padX * 2),
    y: padTop + (1 - (v - min) / (max - min)) * (H - padTop - padBot),
  }));
  const line = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area =
    `M ${pts[0].x.toFixed(1)},${H - padBot} ` +
    pts.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
    ` L ${pts[pts.length - 1].x.toFixed(1)},${H - padBot} Z`;
  const last = pts[pts.length - 1];
  const delta = data[data.length - 1] - data[0];
  const gid = useId();
  return (
    <div className="feat-trend">
      <div className="feat-trend-head">
        <span className="feat-trend-label">1st serve won · 8 matches</span>
        <span className="feat-trend-delta">↑ {delta} pts</span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`First-serve points won rose from ${data[0]}% to ${data[data.length - 1]}%, up ${delta} points across the last eight matches`}
      >
        <defs>
          {/* Same gradient mechanics as the dashboard sparkline (DSpark): the
              stroke fades in left-to-right, the fill falls off top-to-bottom.
              One blue, no gridlines or axis chrome, the product's own voice. */}
          <linearGradient id={`${gid}-line`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={`${gid}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gid}-area)`} />
        <polyline points={line} fill="none" stroke={`url(#${gid}-line)`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* one filled endpoint marks the latest match, the single accent */}
        <circle cx={last.x} cy={last.y} r="3.5" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
      </svg>
    </div>
  );
}

// Match-activity calendar — a month of play intensity on the dashboard's blue
// ramp (counts sum to 12, mirroring the real heatmap), footed with the win-loss
// record and recent W/L form. These are real product surfaces, not invented.
function FeatActivity() {
  const cells = [
    0, 1, 0, 1, 0, 2, 0,
    0, 1, 0, 2, 0, 0, 0,
    1, 0, 0, 3, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0,
  ];
  const form = ["W", "W", "W", "L", "W"];
  return (
    <div className="feat-form">
      <div className="feat-form-grid">
        {cells.map((c, i) => (
          <span key={i} className="feat-form-cell" data-l={c} />
        ))}
      </div>
      <div className="feat-form-foot">
        <span className="feat-form-rec">12 matches <b>8W–4L</b></span>
        <span className="feat-form-streak" aria-hidden="true">
          {form.map((r, i) => (
            <i key={i} className={r === "W" ? "w" : "l"} />
          ))}
        </span>
      </div>
    </div>
  );
}

// Four reads on every match, as open image/copy rows (no card module) — the
// site's native language, per DESIGN.md. The serve court leads as the marquee;
// rows alternate sides and are divided by hairlines like the How-it-works steps.
const FEAT_ROWS = [
  {
    viz: <div className="feat-court-wrap"><CourtViz labels={false} /></div>,
    mod: "court",
    kicker: "Serve placement",
    title: "Where every serve landed.",
    copy: "Each serve plotted on a real court from line-call coordinates. Your wide, body, and T patterns, exposed.",
  },
  {
    viz: <div className="feat-kpis"><KpiTile {...D_KPIS[1]} /><KpiTile {...D_KPIS[2]} /></div>,
    mod: "kpi",
    kicker: "Key metrics",
    title: "Your numbers, quantified.",
    copy: "First-serve points won, break points saved, return games. Every metric that decides matches, tracked match over match.",
  },
  {
    viz: <FeatTrend />,
    mod: "trend",
    kicker: "Multi-match trends",
    title: "Trends across every match.",
    copy: "Multi-match aggregates show how your form actually moves over weeks, not the noise of any single result.",
  },
  {
    viz: <FeatActivity />,
    mod: "form",
    kicker: "Match activity",
    title: "Your form, match over match.",
    copy: "A calendar of match activity with win-loss form and current streak, so workload and momentum read at a glance.",
  },
];

export function Features() {
  return (
    <section className="band alt" id="features">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">
            What you get
          </span>
          <h2>Every match, read four ways.</h2>
          <p>The analysis that used to live with ATP and WTA teams — your serve placement, your numbers, your next adjustment.</p>
        </div>
        <div className="feat-rows">
          {FEAT_ROWS.map((c, i) => (
            <div
              className={`feat-row feat-row--${c.mod}${i % 2 === 1 ? " feat-row--flip" : ""} reveal`}
              key={c.mod}
              style={{ "--ri": i } as CSSProperties}
            >
              <div className={`feat-viz feat-viz--${c.mod}`}>{c.viz}</div>
              <div className="feat-row-body">
                <span className="feat-kicker">{c.kicker}</span>
                <h3>{c.title}</h3>
                <p>{c.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Credibility() {
  return (
    <section className="band cred-band">
      <div className="wrap cred">
        <div className="cred-head reveal">
          <span className="eyebrow">
            In serious hands
          </span>
          <h3>Built by former collegiate players. Designed for competitive advantage.</h3>
          <p className="line">Access to Advantage is currently limited to invited players and coaches.</p>
        </div>
        <div className="cred-stats">
          <div className="cred-stat reveal" style={{ "--ri": 0 } as CSSProperties}>
            <div className="n">100%</div>
            <div className="l">From line-call data</div>
          </div>
          <div className="cred-stat reveal" style={{ "--ri": 1 } as CSSProperties}>
            <div className="n">
              <b>&lt;60s</b>
            </div>
            <div className="l">Match to insight</div>
          </div>
          <div className="cred-stat reveal" style={{ "--ri": 2 } as CSSProperties}>
            <div className="n">1</div>
            <div className="l">ELC provider</div>
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
