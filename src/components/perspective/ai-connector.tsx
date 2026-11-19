"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Source_Serif_4 } from "next/font/google";
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Globe,
  Infinity as InfinityIcon,
  LayoutGrid,
  Mic,
  Paperclip,
  Plus,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import advantageIcon from "@/app/icon.png";
import { AskAi } from "./ask-ai";
import "./ai-connector.css";

/* The AI connector band: the centred head, then a full-width row of tall
   cards, one per AI app Advantage connects to. Each card is painted in its
   app's own colours, with the app's mark at the top, a piece of that app's
   own interface in the middle doing something with a match (running off the
   card's right edge, as a window would, and ending with the app's message
   box), and the app's name and one line at the bottom.

   The marks are the owners' trademarks, used to name the apps Advantage
   connects to: the line under the row says so. LEGAL REVIEW: confirm each
   owner's brand guidelines allow the mark here before launch. The match data
   in the cards is invented and labelled as sample data.

   The row is drawn three times so the loop has no seam and there is room to
   scroll either way; the extra copies are hidden from assistive tech. It
   drifts on its own and can be scrolled by hand at any time (useDrift,
   below); it does not drift under prefers-reduced-motion.

   Only apps with a setup tab on /mcp belong here. Gemini waits behind
   SHOW_GEMINI until the connector is confirmed to work there. */

export const SHOW_GEMINI = false;

// Claude writes its answers in a serif of its own that is not available to
// us; Source Serif 4 is the closest open face, used on the Claude card only.
const claudeSerif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600"], display: "swap", variable: "--aic-serif", preload: false });

type Skin = "claude" | "chatgpt" | "gemini" | "cursor" | "claude-code";

type Card = {
  skin: Skin;
  app: string;
  // The app's mark, in /public/assets/logos/ai.
  logo: string;
  line: string;
};

const CARDS: readonly Card[] = [
  {
    skin: "claude",
    app: "Claude",
    logo: "/assets/logos/ai/claude.png",
    line: "Ask why you lost in plain English. Claude reads the match and answers from your own stats.",
  },
  {
    skin: "chatgpt",
    app: "ChatGPT",
    logo: "/assets/logos/ai/chatgpt.png",
    line: "Switch Advantage on as a source and ask about any match, opponent or season.",
  },
  {
    skin: "gemini",
    app: "Gemini",
    logo: "/assets/logos/ai/gemini.png",
    line: "Ask how your form has moved over any run of matches, from your own numbers.",
  },
  {
    skin: "cursor",
    app: "Cursor",
    logo: "/assets/logos/ai/cursor.png",
    line: "Query your team’s matches from the editor and build reports on real numbers.",
  },
  {
    skin: "claude-code",
    app: "Claude Code",
    logo: "/assets/logos/ai/claude.png",
    line: "Pull a season’s stats into a table or a CSV, straight from the terminal.",
  },
];

const VISIBLE = CARDS.filter((c) => SHOW_GEMINI || c.skin !== "gemini");
// The apps named in the trademark line: the ones on show, once each. Claude
// Code is Claude's, so it adds no name of its own.
const MARKS = [...new Set(VISIBLE.map((c) => (c.skin === "claude-code" ? "Claude" : c.app)))];

const ICON = <Image src={advantageIcon} alt="" width={14} height={14} />;
const I = { size: 15, strokeWidth: 1.7, "aria-hidden": true } as const;

// The piece of each app's interface. Sample data: the same invented players.
function Scene({ skin }: { skin: Skin }) {
  switch (skin) {
    case "claude":
      return (
        <div className="aic-win aic-cl">
          <p className="aic-q">Why did I lose to Chen on Saturday?</p>
          <span className="aic-tool">
            {ICON}
            Searched Advantage
            <ChevronDown size={13} strokeWidth={2} aria-hidden="true" />
          </span>
          <div className="aic-a">
            <p>The second serve decided it:</p>
            <ul>
              <li><b>71%</b> of points won behind your first serve</li>
              <li><b>38%</b> behind your second</li>
              <li><b>6</b> double faults, 4 at deuce</li>
            </ul>
          </div>
          <div className="aic-box">
            <span className="ph">Reply to Claude…</span>
            <span className="bar">
              <i className="ib"><Plus {...I} /></i>
              <i className="ib"><SlidersHorizontal {...I} /></i>
              <span className="model">
                Opus 4.5 <ChevronDown size={13} strokeWidth={2} aria-hidden="true" />
              </span>
              <i className="send"><ArrowUp size={15} strokeWidth={2.2} aria-hidden="true" /></i>
            </span>
          </div>
        </div>
      );
    case "chatgpt":
      return (
        <div className="aic-gp">
          <div className="aic-menu">
            <span className="row"><Paperclip {...I} />Add photos &amp; files</span>
            <span className="sep" />
            <span className="row"><Globe {...I} />Web search</span>
            <span className="row is-on">{ICON}Advantage<i className="sw" /></span>
            <span className="row"><LayoutGrid {...I} />More<ChevronRight size={14} strokeWidth={2} className="end" aria-hidden="true" /></span>
          </div>
          <div className="aic-box">
            <span className="ph">What’s my record against my next opponent?</span>
            <span className="bar">
              <i className="ib"><Plus {...I} /></i>
              <span className="chip">{ICON}Advantage</span>
              <i className="ib push"><Mic {...I} /></i>
              <i className="send"><ArrowUp size={15} strokeWidth={2.2} aria-hidden="true" /></i>
            </span>
          </div>
        </div>
      );
    case "gemini":
      return (
        <div className="aic-win aic-ge">
          <p className="aic-q">How has my first serve moved over my last five matches?</p>
          <span className="aic-tool">{ICON}Advantage</span>
          <p className="aic-a">
            Up from <b>54%</b> to <b>63%</b>. The biggest jumps came against left-handers.
          </p>
          <div className="aic-box">
            <span className="ph">Ask Gemini</span>
          </div>
        </div>
      );
    case "cursor":
      return (
        <div className="aic-win aic-cu">
          <div className="tabs">
            <span className="t is-on">Team serve report</span>
            <span className="t">+</span>
          </div>
          <div className="msg">Which of our players dropped first-serve percentage this month?</div>
          <div className="call">
            <Wrench size={14} strokeWidth={1.6} aria-hidden="true" />
            <span>Called MCP tool</span>
            <b>run_query</b>
            <ChevronRight size={13} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="aic-a">
            <p>Two players dropped:</p>
            <ul>
              <li><b>Reyes</b> down 6 points, to 55%</li>
              <li><b>Park</b> down 4 points, to 58%</li>
            </ul>
          </div>
          <div className="aic-box">
            <span className="ph">Plan, search, build anything</span>
            <span className="bar">
              <span className="mode">
                <InfinityIcon size={13} strokeWidth={1.8} aria-hidden="true" />
                Agent <ChevronDown size={11} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="model">
                Auto <ChevronDown size={11} strokeWidth={2} aria-hidden="true" />
              </span>
              <i className="send"><ArrowUp size={12} strokeWidth={2.4} aria-hidden="true" /></i>
            </span>
          </div>
        </div>
      );
    case "claude-code":
      return (
        <div className="aic-win aic-cc">
          <p className="user">&gt; export my break-point stats for the season</p>
          <p>
            <span className="ok">⏺</span> <b>advantage - run_query</b> <span className="dim">(MCP)</span>(season: &quot;2026&quot;)
          </p>
          <p className="dim out">{"  ⎿  "}14 matches</p>
          <p>
            <span className="ok">⏺</span> <b>Write</b>(break_points_2026.csv)
          </p>
          <p className="dim out">{"  ⎿  "}Wrote 15 lines to break_points_2026.csv</p>
          <p>
            ⏺ Saved <b>61%</b> of break points, converted <b>44%</b>. One row per match, newest first.
          </p>
          <div className="aic-box">
            &gt; <i className="cursor" />
          </div>
          <p className="hint">? for shortcuts</p>
        </div>
      );
  }
}

function AppCard({ card, hidden }: { card: Card; hidden?: boolean }) {
  return (
    <article className="aic-card" data-skin={card.skin} aria-hidden={hidden || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="aic-mark" src={card.logo} alt="" width={36} height={36} loading="lazy" />
      <div className="aic-scene">
        <Scene skin={card.skin} />
      </div>
      <div className="aic-cap">
        <h3>{card.app}</h3>
        <p>{card.line}</p>
      </div>
    </article>
  );
}

/* The row's motion. It is a real scroller, so a trackpad, a shift-wheel,
   touch and the arrow keys all move it; a mouse can also drag it. On its own
   it drifts left at an easy pace, by moving scrollLeft. It keeps drifting
   under a resting pointer; it stops only when someone moves it by hand (a
   two-finger swipe, a drag, a touch) or while it has keyboard focus, and it
   never starts or stops with a jolt: the drift eases up to speed when it
   resumes and eases down when keyboard focus or the page scrolling it away
   stops it. (A hand simply takes over: the drift gives way at once and comes
   back gently a moment after the hand lets go.) The row holds three copies of the cards and sits in the
   middle one; whenever it strays out of the middle copy it is moved back by
   exactly one copy, which looks like nothing at all: that is the loop, in
   either direction. */
const DRIFT_SECONDS_PER_CARD = 11; // the old marquee's pace
const RESUME_AFTER = 1600; // ms of no hand movement before it drifts again
const EASE_SECONDS = 0.9; // how long the drift takes to reach speed, or to stop

function useDrift(n: number) {
  const ref = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  useEffect(() => {
    const rail = ref.current;
    const track = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !track) return;

    // One copy's width, the loop's period: how far the second copy's first
    // card sits from the first copy's, as drawn. Measured from the drawn
    // positions so it stays right when the cards are zoomed on a short
    // screen. Measured on resize, not per frame.
    const measure = () => {
      const first = track.children[0];
      const second = track.children[n];
      if (!first || !second) return 0;
      return second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    };
    // The loop keeps the row inside a window exactly one copy wide, so a
    // jump by one copy lands back inside it and looks like nothing. It ends
    // at the end of the middle copy, or at the end of the row if that comes
    // first (it does when one copy is narrower than the window, as with the
    // zoomed cards on a short screen).
    let p = 0;
    let lo = 0;
    let end = 0;
    const remeasure = () => {
      p = measure();
      end = Math.min(2 * p, rail.scrollWidth - rail.clientWidth - 1);
      lo = Math.max(0, end - p);
    };
    remeasure();
    const ro = new ResizeObserver(remeasure);
    ro.observe(track);
    ro.observe(rail);
    // Back into the middle copy, by whole copies. While a hand is scrolling
    // only near the ends, so a scroll in progress is never pulled about.
    const wrap = (always: boolean) => {
      if (p <= 0) return;
      const x = rail.scrollLeft;
      if (always ? x < lo : x < lo + 120) rail.scrollLeft = x + p;
      else if (always ? x >= end : x > end - 120) rail.scrollLeft = x - p;
    };

    let pos = rail.scrollLeft; // the drift's own position, fractional
    let held = false; // keyboard focus inside
    let speed = 0; // the drift's current speed, px per second, eased
    let handUntil = 0; // drift waits until this time after a hand scroll
    let onScreen = false;
    let raf = 0;
    let last = 0;

    // The loop runs only while the row is on screen in a visible tab; it
    // stops itself otherwise and start() picks it up again.
    const tick = (t: number) => {
      if (!onScreen || document.hidden) {
        raf = 0;
        speed = 0;
        pos = rail.scrollLeft;
        return;
      }
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(t - last, 64) : 0;
      last = t;
      // A hand has it: no drift, and it will ease back up from rest.
      if (t < handUntil) {
        speed = 0;
        pos = rail.scrollLeft;
        return;
      }
      // Ease toward full speed, or toward rest while keyboard focus holds it:
      // about two thirds of the way in each third of EASE_SECONDS.
      const target = held ? 0 : p / (n * DRIFT_SECONDS_PER_CARD);
      speed += (target - speed) * (1 - Math.exp(-(dt / 1000) / (EASE_SECONDS / 3)));
      if (speed < 0.05 && held) {
        speed = 0;
        pos = rail.scrollLeft;
        return;
      }
      if (pos < lo || pos >= end) {
        wrap(true);
        pos = rail.scrollLeft;
      }
      pos += speed * (dt / 1000);
      rail.scrollLeft = pos;
    };

    // Any scroll the drift did not make is a hand: hold the drift a moment.
    const onScroll = () => {
      if (Math.abs(rail.scrollLeft - pos) > 1.5) {
        handUntil = performance.now() + RESUME_AFTER;
        wrap(false);
      }
      pos = rail.scrollLeft;
    };

    // Drag with a mouse (touch and trackpads scroll natively).
    let dragX = 0;
    let dragFrom = 0;
    let dragging = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      handUntil = performance.now() + RESUME_AFTER;
      dragX = e.clientX;
      dragFrom = rail.scrollLeft;
      rail.setPointerCapture(e.pointerId);
      rail.classList.add("is-dragging");
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const want = dragFrom - (e.clientX - dragX);
      rail.scrollLeft = want;
      handUntil = performance.now() + RESUME_AFTER;
      // A wrap moves scrollLeft by one copy: keep the drag anchored to it.
      if (Math.abs(rail.scrollLeft - want) > 2) dragFrom += rail.scrollLeft - want;
    };
    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (rail.hasPointerCapture(e.pointerId)) rail.releasePointerCapture(e.pointerId);
      rail.classList.remove("is-dragging");
    };

    // Only keyboard focus holds it: a click or a drag also focuses the row,
    // and a resting pointer does not.
    const focusIn = () => (held = rail.matches(":focus-visible, :has(:focus-visible)"));
    const focusOut = () => (held = false);

    const start = () => {
      if (raf || still || !onScreen || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    // Start at the middle copy, so the row can be scrolled back as well.
    rail.scrollLeft = p;
    pos = rail.scrollLeft;

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      start();
    });
    io.observe(rail);
    rail.addEventListener("scroll", onScroll, { passive: true });
    rail.addEventListener("pointerdown", down);
    rail.addEventListener("pointermove", move);
    rail.addEventListener("pointerup", up);
    rail.addEventListener("pointercancel", up);
    rail.addEventListener("focusin", focusIn);
    rail.addEventListener("focusout", focusOut);
    document.addEventListener("visibilitychange", start);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", start);
      rail.removeEventListener("scroll", onScroll);
      rail.removeEventListener("pointerdown", down);
      rail.removeEventListener("pointermove", move);
      rail.removeEventListener("pointerup", up);
      rail.removeEventListener("pointercancel", up);
      rail.removeEventListener("focusin", focusIn);
      rail.removeEventListener("focusout", focusOut);
    };
  }, [n, still]);
  return ref;
}

/* `prompts` adds the "Ask any AI to…" row under the cards, for a page that
   keeps those chips here instead of under each product band. */
export function AiConnector({ prompts }: { prompts?: readonly string[] }) {
  const railRef = useDrift(VISIBLE.length);
  return (
    <section className={`band alt aic ${claudeSerif.variable}`} id="ai" aria-labelledby="aic-title">
      <div className="wrap aic-head reveal">
        <div className="sec-head">
          <span className="eyebrow">AI connector</span>
          <h2 id="aic-title">
            Ask your AI <span className="aic-tail">why you lost.</span>
          </h2>
          <p>
            Connect Advantage to Claude, ChatGPT or the AI app you already use. It has your match now, so it answers
            from your own stats.
          </p>
        </div>
        <Link
          className="proof-link aic-cta"
          href="/mcp"
          onClick={() => trackEvent("ai_connector_setup_clicked", { app: "all" })}
        >
          Set it up in two minutes
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      {/* Focusable so the row can be scrolled with the arrow keys. */}
      <div ref={railRef} className="aic-rail reveal" tabIndex={0} role="group" aria-label="What each AI app can do with Advantage">
        <div className="aic-track" style={{ "--aic-n": VISIBLE.length } as CSSProperties}>
          {VISIBLE.map((c) => (
            <AppCard card={c} key={`a-${c.skin}`} />
          ))}
          {VISIBLE.map((c) => (
            <AppCard card={c} key={`b-${c.skin}`} hidden />
          ))}
          {VISIBLE.map((c) => (
            <AppCard card={c} key={`c-${c.skin}`} hidden />
          ))}
        </div>
      </div>

      {prompts ? (
        <div className="wrap aic-prompts">
          <AskAi prompts={prompts} placement="home-ai" />
        </div>
      ) : null}

      <p className="wrap aic-note reveal">
        Sample match data. {MARKS.join(", ").replace(/, ([^,]*)$/, " and $1")} are trademarks of their owners;
        Advantage is not affiliated with them.
      </p>
    </section>
  );
}
