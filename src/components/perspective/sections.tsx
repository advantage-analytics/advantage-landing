"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import { AdvantageDashboard, CourtViz } from "./dashboard";
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
        {/* The dashboard "lands" full-width, scaled to fit at every size — the
            whole product surface is visible at once. On a phone it reads as a
            complete product shot; the Features section below carries the legible
            close-ups of each read. */}
        <LandingDashboard />
      </div>
    </section>
  );
}

const HOW_STEPS = [
  {
    t: "Capture the match with SwingVision.",
    p: "Record on court with SwingVision’s electronic line-calling. Every shot, serve, and call is logged automatically.",
  },
  {
    t: "Export the match and upload.",
    p: "Export the match file from SwingVision and drop it into Advantage. We parse every point — no spreadsheets to wrangle.",
  },
  {
    t: "Read the dashboard, find the pattern.",
    p: "Statistics, court visualizations, and AI insight are ready in seconds — on the surfaces your whole team can read.",
  },
];

// Editorial split: a left intro column states the premise and the one supported
// source, a right column runs the three steps as a tight numbered ledger. The
// asymmetry (narrow intro, wider list) and the hairline-divided rows are the
// page's native voice — mono indices in the data-blue, generous whitespace.
export function HowItWorks() {
  return (
    <section className="band" id="how">
      <div className="wrap">
        <div className="hiw-split reveal">
          <div className="hiw-intro">
            <span className="eyebrow">How it works</span>
            <h2>From the last point to the next adjustment.</h2>
            <p>Advantage plugs straight into the line-calling data you already capture. Three steps, no manual tagging.</p>
            <span className="hiw-works">
              Works with
              <i className="hiw-works-div" aria-hidden="true" />
              <img src="/assets/providers/swingvision-trim.png" alt="SwingVision" />
            </span>
          </div>
          {/* Each row reveals on its own with a stagger index, so 01 → 02 → 03
              cascade in sequence rather than appearing as one block. */}
          <div className="hiw-list">
            {HOW_STEPS.map((s, i) => (
              <div className="hiw-item reveal" key={s.t} style={{ "--ri": i } as CSSProperties}>
                <span className="hiw-num">0{i + 1}</span>
                <div className="hiw-item-body">
                  <h4>{s.t}</h4>
                  <p>{s.p}</p>
                </div>
              </div>
            ))}
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

// Four reads on every match. Each is a genuine product surface — the serve
// court, the KPI tiles, a multi-match trend, the activity calendar — lifted
// straight from the dashboard, never an abstract graphic.
const FEAT_READS = [
  {
    id: "court",
    title: "Serve placement",
    copy: "Every serve plotted on a real court from line-call coordinates — your wide, body, and T patterns, exposed.",
    viz: (
      <div className="feat-court">
        <div className="feat-court-head">
          <span className="feat-court-label">Last 4 matches · 22 serves</span>
          <span className="feat-court-stat">2 aces</span>
        </div>
        <div className="feat-court-wrap"><CourtViz labels={false} bare /></div>
      </div>
    ),
  },
  {
    id: "trend",
    title: "Multi-match trends",
    copy: "Multi-match aggregates show how your form actually moves over weeks, not the noise of any single result.",
    viz: <FeatTrend />,
  },
  {
    id: "form",
    title: "Match activity",
    copy: "A calendar of match activity with win-loss form and current streak, so workload and momentum read at a glance.",
    viz: <FeatActivity />,
  },
];

// Showcase + index. One large stage holds the live product surface; the index
// beside it lists the four reads and selects which one the stage shows. The
// active read carries the blue and a "Shown" marker, exactly as the dashboard
// flags its active view. Selection is keyboard-driven and honors focus.
export function Features() {
  const [active, setActive] = useState(0);
  const read = FEAT_READS[active];
  return (
    <section className="band alt" id="features">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">
            What you get
          </span>
          <h2>The numbers that breathe. The patterns that win.</h2>
          <p>The analysis that used to live with ATP and WTA teams — your serve placement, your numbers, your next adjustment.</p>
        </div>
        <div className="show2 reveal">
          <div className={`show2-stage show2-stage--${read.id}`} role="img" aria-label={`${read.title}: ${read.copy}`}>
            {FEAT_READS.map((r) => (
              <div key={r.id} className="show2-viz" hidden={r.id !== read.id} aria-hidden={r.id !== read.id}>
                {r.viz}
              </div>
            ))}
          </div>
          <div className="show2-index" role="tablist" aria-label="Choose a read">
            {FEAT_READS.map((r, i) => {
              const on = i === active;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  className={`show2-item${on ? " active" : ""}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="show2-item-top">
                    <span className="n">0{i + 1}</span>
                    <span className="show2-item-title">{r.title}</span>
                    {on && <span className="show2-badge">Shown</span>}
                  </span>
                  <span className="show2-item-copy">{r.copy}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

const ATH_STATS = [
  { n: "100%", l: "From line-call data" },
  { n: <>&lt;60s</>, l: "Match to insight" },
  { n: "1", l: "ELC source · SwingVision" },
];

// Documentary panel (design C3): a photograph of electronic line-calling on a
// show court sits beside the statement and proof stats. The image is the
// credibility — the physical origin of the data the product reads.
export function BuiltForAthletes() {
  return (
    <section className="band athletes" id="athletes">
      <div className="wrap">
        <div className="ath-c3 reveal">
          <div className="ath-c3-photo">
            <img
              src="/assets/marketing/elc-court.jpg"
              alt="An electronic line-calling camera overlooking a show court during live play"
            />
            <div className="ath-c3-veil" aria-hidden="true" />
            <span className="ath-c3-cap">
              <i className="dot" aria-hidden="true" />
              Electronic line calling · live capture
            </span>
          </div>
          <div className="ath-c3-body">
            <span className="eyebrow">Built for the modern athlete</span>
            <h3>Built by former collegiate players. Designed for competitive advantage.</h3>
            <p className="ath-c3-line">Access to Advantage is currently limited to invited players and coaches.</p>
            {/* Proof stats as the scoreboard baseline — hairline grid, tabular
                figures, mono captions, the page's one data vocabulary. */}
            <ul className="ath-c3-ledger">
              {ATH_STATS.map((s) => (
                <li className="ath-stat" key={s.l}>
                  <span className="ath-stat-n">{s.n}</span>
                  <span className="ath-stat-l">{s.l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RequestAccess() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Honeypot: hidden from users, filled by bots.
  const company = useRef("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, company: company.current }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="band access" id="access">
      <div className="wrap">
        <div className="access-card reveal">
          <div className="ac-glow" />
          <div className="ac-grain" aria-hidden="true" />
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
                <form onSubmit={onSubmit}>
                  {/* Honeypot — hidden from users, filled by bots. */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    onChange={(e) => {
                      company.current = e.target.value;
                    }}
                    style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                  />
                  <div className="uline">
                    <label>Name</label>
                    <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="uline">
                    <label>Email</label>
                    <input type="email" placeholder="you@club.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="uline">
                    <label>Role</label>
                    <input type="text" placeholder="Player, coach, or program" value={role} onChange={(e) => setRole(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? "Sending…" : "Request access"} <Icon n="arrow" size={16} />
                  </button>
                  {submitError && (
                    <div className="access-note" role="alert">{submitError}</div>
                  )}
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
              <Link href="/#dashboard">Dashboard</Link>
              <Link href="/#how">How it works</Link>
              <Link href="/#features">Features</Link>
              <Link href="/#access">Pricing</Link>
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <a href={links.signIn}>Sign in</a>
            </div>
          </nav>
        </div>
        <div className="foot-bottom">
          <span className="cp">© 2026 Advantage Analytics. All rights reserved.</span>
          <span className="foot-legal">
            <Link href="/legal/privacy-policy">Privacy Policy</Link>
            <Link href="/legal/terms-and-conditions">Terms &amp; Conditions</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
