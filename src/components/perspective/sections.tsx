"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { AdvantageDashboard, CourtViz, KpiTile, D_KPIS, InsightChip } from "./dashboard";
import { links } from "@/lib/links";

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

// Scales the real 1440-wide AdvantageDashboard to fit its container.
function ScaledDashboard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const fit = () => {
      const s = wrap.clientWidth / 1440;
      inner.style.transform = `scale(${s})`;
      wrap.style.height = inner.offsetHeight * s + "px";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    const t = setTimeout(fit, 300);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      clearTimeout(t);
      window.removeEventListener("resize", fit);
    };
  }, []);
  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <div ref={innerRef} style={{ width: 1440, transformOrigin: "top left" }}>
        <AdvantageDashboard />
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
              <span className="dot" />
              The Dashboard
            </span>
            <h2>Walk on court knowing exactly what to drill.</h2>
          </div>
          <p style={{ maxWidth: 340, color: "var(--ink-secondary)", font: "var(--fw-regular) 15px/1.6 var(--font-sans)" }}>
            Every serve, return, and rally — distilled into the numbers that decide matches. No noise, no decoration.
          </p>
        </div>
        <div className="browser reveal">
          <div className="browser-bar">
            <div className="browser-dots">
              <i style={{ background: "#FF5F57" }} />
              <i style={{ background: "#FEBC2E" }} />
              <i style={{ background: "#28C840" }} />
            </div>
            <div className="browser-url">
              <Icon n="lock" size={9} /> app.advantage-analytics.com
            </div>
          </div>
          <div className="browser-screen">
            <ScaledDashboard />
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
            <span className="dot" />
            How it works
          </span>
          <h2>From the last point to the next adjustment.</h2>
          <p>Advantage plugs straight into the line-calling data you already capture. Three steps, no manual tagging.</p>
        </div>
        <div className="steps reveal">
          <div className="step">
            <div className="step-num">01</div>
            <h4>Capture the match with SwingVision.</h4>
            <p>Record on court with SwingVision&apos;s electronic line-calling. Every shot, serve, and call is logged automatically.</p>
            <span className="pill">
              <img src="/assets/providers/swingvision-trim.png" alt="SwingVision" /> Only ELC source supported today
            </span>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h4>Export the match and upload.</h4>
            <p>Export the match file from SwingVision and drop it into Advantage. We parse every point — no spreadsheets to wrangle.</p>
          </div>
          <div className="step">
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
            <span className="dot" />
            What you get
          </span>
          <h2>The numbers that breathe. The patterns that win.</h2>
        </div>
        <div className="bento">
          <div className="feat b-stats reveal">
            <div className="ic">
              <Icon n="bar" />
            </div>
            <h4>Match statistics</h4>
            <p>Serve percentages, win rates, break points, and rally length — tabular and exact, trended over your last 30 days.</p>
            <div className="viz">
              <div className="feat-kpistrip">
                <KpiTile {...D_KPIS[0]} />
                <KpiTile {...D_KPIS[1]} />
                <KpiTile {...D_KPIS[3]} />
              </div>
            </div>
          </div>
          <div className="feat b-court reveal">
            <div className="ic">
              <Icon n="target" />
            </div>
            <h4>Court visualization</h4>
            <p>Serve placement and shot maps plotted on a real court, drawn from line-call coordinates — see exactly where the points are going.</p>
            <div className="viz">
              <div className="feat-courtband">
                <div className="adb-court-wrap">
                  <CourtViz />
                </div>
              </div>
            </div>
          </div>
          <div className="feat b-ai reveal">
            <div className="ic">
              <Icon n="msg" />
            </div>
            <h4>AI match insight</h4>
            <p>Plain-language reads on what changed and what to drill next — grounded in your data, written for players who know the game.</p>
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
    <section className="band">
      <div className="wrap cred reveal">
        <span className="eyebrow" style={{ justifyContent: "center" }}>
          <span className="dot" />
          Built for the modern athlete
        </span>
        <h3>Built by former collegiate players. Designed for competitive advantage.</h3>
        <p className="line">Access to Advantage is currently limited to invited players and coaches.</p>
        <div className="cred-stats">
          <div className="cred-stat">
            <div className="n">
              <b>100%</b>
            </div>
            <div className="l">From line-call data</div>
          </div>
          <div className="cred-stat">
            <div className="n">
              &lt;60<b>s</b>
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
                <span className="dot" />
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
          <div className="foot-cols">
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
          </div>
        </div>
        <div className="foot-bottom">
          <span className="cp">© 2026 Advantage Analytics. All rights reserved.</span>
          <span className="sv">
            <img src="/assets/providers/swingvision-trim.png" alt="SwingVision" /> Integrates with SwingVision ELC
          </span>
        </div>
      </div>
    </footer>
  );
}
