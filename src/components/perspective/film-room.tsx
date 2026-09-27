"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  Layers,
  Minimize,
  MoreVertical,
  PanelRightClose,
  Pause,
  Repeat,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  TimerOff,
  Volume2,
  X,
} from "lucide-react";
import { BandHead, Trio, type TrioItem } from "./band-parts";
import { MockFrame } from "./mock-frame";

/* Film room — the dashboard's fullscreen film viewer, ported from the design
   board's 1280×720 mock and driven, as the real one is, by the video's clock.

   The footage is one real point (public/assets/marketing/film-room.mp4:
   Quan v Gomez, Indian Wells, set 1 game 5 at 2-2, 40-AD, Quan serving). Its
   five shots are timed below against that file. While it plays, every surface
   follows the playhead the way the app's does: the clock counts, the playhead
   and the point's bar advance, the live shot row in the point list lights and
   the ones still to come wait dimmed, and the mini court draws each contact
   and landing as it happens with the three-shot fading trail.

   The clock is read from the <video> every animation frame. Continuous things
   (bars, playhead) read it as a CSS custom property, --film-t, so they move
   smoothly without a React render; text and identity (the readout, which row
   is live, which dots are drawn) update in state at 10 Hz. That is the split
   the app's own film-clock makes.

   Decorative: role="img" on the wrapper carries the description and `inert`
   keeps the pictured controls out of the tab order. The video loads and plays
   only while the band is on screen, and reduced-motion visitors get the
   finished point on a still frame, with no playback. */

const FILM_SRC = "/assets/marketing/film-room.mp4";
const FILM_POSTER = "/assets/marketing/film-room-poster.jpg";
/** The file's length, and the moment the last ball meets the net. */
const DURATION = 6;
/** Match clock at the file's first frame; the readout counts on from it. */
const MATCH_CLOCK_AT_ZERO = 41 * 60 + 6;
const MATCH_LENGTH = "1:42:18";
/** How long the finished point holds on screen before the clip restarts. */
const END_HOLD_MS = 1800;

const YOU = "#60A5FA";
const OPP = "#94A3B8";
const OUT = "#E5484D";

type Who = "you" | "opp";
const MARK: Record<Who, { bg: string; fg: string; initials: string; name: string }> = {
  you: { bg: "#FFFFFF", fg: "#141416", initials: "RQ", name: "Quan" },
  opp: { bg: "rgba(255,255,255,0.14)", fg: "rgba(255,255,255,0.9)", initials: "FG", name: "Gomez" },
};

/* The rally, timed against the file (seconds) and placed on the mini court
   (percent of its 152×227 box: far baseline at y 3, net at 50, near baseline
   at 97; singles sidelines at x 17 and 83). Times come from the CV ball track
   for this clip: a hit is where the ball's direction reverses, a landing is
   the kink as it meets the court. Quan is the near player. */
type Shot = {
  who: Who;
  stroke: string;
  place: string;
  result: string;
  at: number;
  lands: number;
  contact: [number, number];
  bounce: [number, number];
  out?: boolean;
  label: string;
};
const RALLY: readonly Shot[] = [
  { who: "you", stroke: "Serve", place: "T, ad court", result: "In", at: 0.06, lands: 0.4, contact: [40, 99], bounce: [54, 27], label: "Quan serve, T, ad court" },
  { who: "opp", stroke: "Forehand", place: "Middle", result: "In", at: 1.34, lands: 2.32, contact: [48, 1], bounce: [44, 90], label: "Gomez forehand, middle" },
  { who: "you", stroke: "Forehand", place: "Inside out", result: "In", at: 2.64, lands: 3.48, contact: [40, 93], bounce: [68, 20], label: "Quan forehand, inside out" },
  { who: "opp", stroke: "Forehand", place: "Inside out", result: "In", at: 4.16, lands: 5.04, contact: [67, 2], bounce: [35, 78], label: "Gomez forehand, inside out" },
  { who: "you", stroke: "Forehand", place: "Inside in", result: "Net", at: 5.58, lands: 5.94, contact: [16, 91], bounce: [40, 51], out: true, label: "Quan forehand, inside in, into the net" },
];
const TRAIL = [1, 0.5, 0.22];

/** Index of the shot in play at `t`, or -1 before the serve. */
function activeShotAt(t: number) {
  let i = -1;
  RALLY.forEach((s, k) => {
    if (s.at <= t) i = k;
  });
  return i;
}

type Row =
  | { head: string; note: string }
  | { who: Who; t: string; d: string; score: string; playing?: boolean };
/* Set 1 · game 5 on Quan's serve, the points that brought it to 40-AD, then
   the one on film. Score is the score before the point, as the app shows it. */
const ROWS: readonly Row[] = [
  { head: "Set 1 · Game 5", note: "2-2 · Quan serves" },
  { who: "you", t: "Ace · Quan, wide", d: "Set 1 · game 5", score: "0-0" },
  { who: "opp", t: "Winner · Gomez forehand", d: "Set 1 · game 5 · 5 shots", score: "15-0" },
  { who: "opp", t: "Forced error · Quan backhand", d: "Set 1 · game 5 · 7 shots", score: "15-15" },
  { who: "you", t: "Ace · Quan, T", d: "Set 1 · game 5", score: "15-30" },
  { who: "opp", t: "Winner · Gomez return", d: "Set 1 · game 5 · 2 shots", score: "30-30" },
  { who: "you", t: "Winner · Quan backhand", d: "Set 1 · game 5 · 6 shots", score: "30-40" },
  { who: "opp", t: "Winner · Gomez forehand", d: "Set 1 · game 5 · 4 shots", score: "40-40" },
  { who: "you", t: "Unforced error · Quan forehand", d: "Set 1 · game 5 · 5 shots", score: "40-AD", playing: true },
];

const RM_QUERY = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(RM_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  );
}

/**
 * Plays the clip while it is on screen and the tab is visible, and reports
 * its clock: every frame onto `--film-t` on the root, and at 10 Hz into
 * state. Before the first frame plays (and always under reduced motion) the
 * clock sits at the end of the point, so the still reads as the whole rally.
 */
function useFilmClock(reduce: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(DURATION);

  useEffect(() => {
    const v = videoRef.current;
    const root = rootRef.current;
    if (!v || !root) return;
    root.style.setProperty("--film-t", String(DURATION));
    if (reduce) return;

    let frame = 0;
    let last = -1;
    const tick = () => {
      const now = v.currentTime;
      root.style.setProperty("--film-t", String(now));
      const q = Math.floor(now * 10) / 10;
      if (q !== last) {
        last = q;
        setT(q);
      }
      frame = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    const onPause = () => cancelAnimationFrame(frame);
    // A seek while paused (and the loop's jump back to 0) repaints once, the
    // way the app's clock syncs on `seeked` when no frame loop is running.
    const onSeeked = () => {
      if (!v.paused) return;
      root.style.setProperty("--film-t", String(v.currentTime));
      setT(Math.floor(v.currentTime * 10) / 10);
    };
    // No native `loop`: at the end the point holds, finished — the net
    // error, its landing and the "· net" result — before starting again.
    let hold = 0;
    const onEnded = () => {
      root.style.setProperty("--film-t", String(DURATION));
      setT(DURATION);
      hold = window.setTimeout(() => {
        v.currentTime = 0;
        sync();
      }, END_HOLD_MS);
    };
    v.addEventListener("playing", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("ended", onEnded);

    // Nothing is fetched until the band nears the viewport (preload="none"),
    // and the loop pauses once it leaves or the tab hides — Chrome pauses
    // muted video in a hidden tab and does not reliably resume it.
    let inView = false;
    function sync() {
      clearTimeout(hold);
      if (inView && document.visibilityState === "visible") {
        if (v!.ended) v!.currentTime = 0;
        v!.play().catch(() => {});
      } else v!.pause();
    }
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      v.removeEventListener("playing", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("ended", onEnded);
      clearTimeout(hold);
      cancelAnimationFrame(frame);
      v.pause();
    };
  }, [reduce]);

  return { videoRef, rootRef, t };
}

/** `width` of a fill that grows across [start, end] as --film-t runs. */
function growWidth(start: number, end: number) {
  const span = Math.max(end - start, 0.001);
  return `clamp(0%, calc((var(--film-t, ${DURATION}) - ${start}) / ${span} * 100%), 100%)`;
}

const clock = (sec: number) => {
  const s = Math.floor(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

function RallyDots({ active, t }: { active: number; t: number }) {
  const dots: { key: string; x: number; y: number; o: number; col: string; contact: boolean; ring: boolean }[] = [];
  RALLY.forEach((s, i) => {
    const age = active - i;
    if (age < 0 || age >= TRAIL.length) return;
    const col = s.out ? OUT : s.who === "you" ? YOU : OPP;
    dots.push({ key: `c${i}`, x: s.contact[0], y: s.contact[1], o: TRAIL[age], col, contact: true, ring: false });
    // The landing is drawn once the ball has actually landed.
    if (t >= s.lands) {
      dots.push({ key: `b${i}`, x: s.bounce[0], y: s.bounce[1], o: TRAIL[age], col, contact: false, ring: age === 0 });
    }
  });
  return (
    <>
      {dots.map((d) => (
        <span
          key={d.key}
          className="film-dot"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            opacity: d.o,
            border: d.contact ? `1px solid ${d.col}` : "none",
            background: d.contact ? "transparent" : d.col,
            boxShadow: d.ring ? "0 0 0 1px rgba(255,255,255,0.85)" : "none",
          }}
        />
      ))}
    </>
  );
}

function FilmRoomMock() {
  const reduce = usePrefersReducedMotion();
  const { videoRef, rootRef, t } = useFilmClock(reduce);
  const active = activeShotAt(t);
  const live = active >= 0 ? RALLY[active] : null;
  const ended = t >= RALLY[RALLY.length - 1].lands;
  const matchClock = clock(MATCH_CLOCK_AT_ZERO + t);
  const shown = active + 1;

  // The scoreboard's foot names the stroke in play, and how the point ended
  // once it has.
  const foot = !live
    ? { who: "you" as Who, text: "Quan to serve" }
    : ended
      ? { who: live.who, text: `${MARK[live.who].name} ${live.stroke.toLowerCase()} · net` }
      : { who: live.who, text: `${MARK[live.who].name} ${live.stroke.toLowerCase()}` };

  return (
    <div className="film" ref={rootRef}>
      <video
        ref={videoRef}
        className="film-still"
        src={reduce ? undefined : FILM_SRC}
        poster={FILM_POSTER}
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
      <span className="film-veil" />

      <div className="film-score">
        <div className="hd">
          <span className="st">Playing</span>
          <span className="flex" />
          <span className="tm">{matchClock}</span>
        </div>
        <div className="rows">
          <span className="row">
            <span className="nm">Rudy Quan</span>
            <span className="srv on" />
            <span className="flex" />
            <span className="pts">
              <b className="dim">2</b>
              <b className="w2">40</b>
            </span>
          </span>
          <span className="row">
            <span className="nm is-opp">Federico Gomez</span>
            <span className="srv" />
            <span className="flex" />
            <span className="pts">
              <b className="dim">2</b>
              <b className="w2">AD</b>
            </span>
          </span>
        </div>
        <div className="ft">
          <span className="av">{MARK[foot.who].initials}</span>
          <span className="lb">{foot.text}</span>
        </div>
      </div>

      <div className="film-mini">
        <div className="hd">
          <span className="t">This point</span>
          <span className="flex" />
          <span className="ib">
            <Layers size={11} strokeWidth={1.6} />
          </span>
          <span className="ib">
            <X size={11} strokeWidth={1.6} />
          </span>
        </div>
        <div className="court">
          <i className="c-box" />
          <i className="c-v" style={{ left: "17%" }} />
          <i className="c-v" style={{ left: "83%" }} />
          <i className="c-h" style={{ top: "24.7%" }} />
          <i className="c-h" style={{ top: "75.3%" }} />
          <i className="c-mid" />
          <i className="c-net" />
          <RallyDots active={active} t={t} />
        </div>
        <div className="ft">
          <span className="lg">
            <i className="ring" />
            Contact
          </span>
          <span className="lg">
            <i className="fill" />
            Bounce
          </span>
          <span className="flex" />
          <span className="ct">
            {shown} {shown === 1 ? "shot" : "shots"}
          </span>
        </div>
      </div>

      <div className="film-transport">
        <div className="meta">
          <div className="ti">
            <span className="a">Rudy Quan v Federico Gomez</span>
            <span className="b">Indian Wells Masters 1000 · Qualifying R1 · Mar 5</span>
          </div>
          <span className="flex" />
          <div className="pt">
            <span className="n">Point 36 / 112</span>
            <ChevronLeft size={14} strokeWidth={1.6} />
            <ChevronRight size={14} strokeWidth={1.6} />
          </div>
        </div>
        {/* One segment per game; the playhead crosses game 5's segment as the
            point plays. */}
        <div className="prog">
          <span style={{ left: 0, width: "calc(22% - 2.5px)", background: "#3B82F6" }} />
          <span className="cur" style={{ left: "calc(22% + 2.5px)", width: "calc(19% - 5px)" }}>
            <span className="fill" style={{ width: `calc(78% + ${growWidth(0, DURATION)} * 0.22)` }} />
          </span>
          <span style={{ left: "calc(41% + 2.5px)", width: "calc(24% - 5px)" }} />
          <span style={{ left: "calc(65% + 2.5px)", width: "calc(35% - 2.5px)" }} />
          <b
            className="head"
            style={{ left: `calc(22% + 2.5px + (19% - 5px) * (0.78 + 0.22 * clamp(0, var(--film-t, ${DURATION}) / ${DURATION}, 1)))` }}
          />
        </div>
        <div className="ctrl">
          <Pause size={15} strokeWidth={1.6} fill="currentColor" />
          <SkipBack size={15} strokeWidth={1.6} fill="currentColor" />
          <SkipForward size={15} strokeWidth={1.6} fill="currentColor" />
          <span className="tc">
            {matchClock} / {MATCH_LENGTH}
          </span>
          <span className="flex" />
          <Bookmark size={15} strokeWidth={1.6} className="hi" />
          <TimerOff size={15} strokeWidth={1.6} />
          <span className="sp">1×</span>
          <Repeat size={15} strokeWidth={1.6} />
          <Volume2 size={15} strokeWidth={1.6} />
          <Grid2x2 size={15} strokeWidth={1.6} className="hi" />
          <Minimize size={15} strokeWidth={1.6} />
          <MoreVertical size={15} strokeWidth={1.6} style={{ opacity: 0.45 }} />
        </div>
      </div>

      <aside className="film-list">
        <div className="hd">
          <span className="flt">
            <SlidersHorizontal size={13} strokeWidth={1.5} />
            <span>All points</span>
            <ChevronDown size={12} strokeWidth={1.5} className="dim" />
          </span>
          <span className="flex" />
          <span className="ct">
            112 <span>/</span> 112
          </span>
          <span className="ib">
            <PanelRightClose size={14} strokeWidth={1.6} />
          </span>
        </div>
        <div className="body">
          {ROWS.map((r, i) =>
            "head" in r ? (
              <div className="gh" key={i}>
                <span className="h">{r.head}</span>
                <span className="flex" />
                <span className="n">{r.note}</span>
              </div>
            ) : (
              <div key={i}>
                <div className={`pr${r.playing ? " is-playing" : ""}`}>
                  <span className="mk" style={{ background: MARK[r.who].bg, color: MARK[r.who].fg } as CSSProperties}>
                    {MARK[r.who].initials}
                  </span>
                  <span className="tx">
                    <span className="t">{r.t}</span>
                    <span className="d">{r.d}</span>
                  </span>
                  <span className="flex" />
                  <span className="sc">{r.score}</span>
                  {r.playing ? <span className="bar" style={{ width: growWidth(0, DURATION) }} /> : null}
                </div>
                {r.playing ? (
                  <div className="shots">
                    {RALLY.map((s, j) => {
                      const state = j === active ? " is-live" : j > active ? " is-ahead" : "";
                      return (
                        <div className={`sh${state}`} key={j}>
                          <span className="n">{j + 1}</span>
                          <span className="mk" style={{ background: MARK[s.who].bg, color: MARK[s.who].fg }}>
                            {MARK[s.who].initials}
                          </span>
                          <span className="st">{s.stroke}</span>
                          <span className="pl">{s.place}</span>
                          <span className={`rs${s.out ? " is-err" : ""}`}>{s.result}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ),
          )}
        </div>
      </aside>
    </div>
  );
}

const FILM_NOTES: readonly TrioItem[] = [
  { k: "Board", t: "Pick a stat.", p: "Every point behind the number, filtered by serve, return or rally length." },
  {
    k: "Video",
    t: "Watch the rally.",
    p: "Film cues to the first ball with the score pinned. Step point to point from the transport bar.",
  },
  {
    k: "Court",
    t: "See where it landed.",
    p: "Each shot plots on the court as it plays, so the pattern and the footage read together.",
  },
];

export function FilmRoom() {
  return (
    <section className="band alt" id="film">
      <div className="wrap">
        <BandHead
          eyebrow="Film room"
          title="Every number opens the point."
          aside="Tap any stat and the film jumps to that rally, with the score, the shots and where each ball landed."
        />
        <div
          role="img"
          aria-label="The Advantage film room: match video with the live score, a mini court plotting each shot of the rally, and the point list open on the current point."
        >
          <MockFrame className="is-film">
            <div inert className="film-inert">
              <FilmRoomMock />
            </div>
          </MockFrame>
        </div>
        <Trio items={FILM_NOTES} label="How the film room reads" />
      </div>
    </section>
  );
}
