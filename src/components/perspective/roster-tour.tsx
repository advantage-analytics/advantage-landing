"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown, ChevronRight, ChevronUp, CircleCheck, CircleX, Pause, Play, X } from "lucide-react";
import { LINEUP, TeamRoster, type Last, type Player } from "./team-roster";
import { MockFrame } from "./mock-frame";
import { DH_W } from "./dashboard-home";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import "./roster-tour.css";

/* The Roster tab, played: the roster board with a cursor working it, in
   the same five beats as the five lines under it, which light up as it
   goes, as the lines under the Statistics tour do.

     1  Maya Chen is dragged from third to first in the lineup.
     2  The Record column lights up.
     3  Her form strip is hovered bar by bar, each showing the dashboard's
        readout: the score, the date and event, the opponent.
     4  Her row is clicked and the player drawer slides in: her record and
        form, a stat with its trend, her recent matches. Then it closes.
     5  Rafael Ortiz's match, which was analyzing, turns ready.

   The tooltip and the drawer follow the dashboard's own (form-strip.tsx and
   player-drawer.tsx there). It is drawn in code, not filmed, so it stays
   sharp at any size, and every name in it is invented. One loop is LOOP
   seconds; it ends with a brief fade back to the start. It plays only while
   it is on screen, its tab is showing and the page is visible;
   reduced-motion visitors get the still board, with the button to play it
   if they choose. */

const LOOP = 18;
// Where each of the five beats starts, in seconds.
const BEATS = [0, 3.4, 6, 9.4, 14.0] as const;
const BOARD_H = 900;

// The drag: Maya Chen, third in the lineup, to first.
const FROM = 2;
const DRAG = { grab: 0.9, start: 1.0, end: 2.3, drop: 2.4 };
// The form strip: which bar is hovered, and when.
const HOVER = [
  { bar: 0, from: 6.65, to: 8.0 },
  { bar: 3, from: 8.05, to: 9.35 },
] as const;
// The drawer: the row is clicked, it opens; the close button, it shuts.
const CLICK_ROW = { down: 10.1, up: 10.25 };
const OPEN = { start: 10.25, end: 10.55 };
const RECENT_HOVER = { from: 11.2, to: 12.7 };
const CLICK_CLOSE = { down: 13.4, up: 13.55 };
const SHUT = { start: 13.55, end: 13.85 };
const READY_AT = 14.6; // Rafael Ortiz's analysis finishes
const FADE = { start: 17.4, mid: 17.7, end: 18 };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => {
  const x = clamp(v);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
// 0 outside [a, b], 1 inside, with a short ease at each end.
const window_ = (t: number, a: number, b: number, edge = 0.25) => Math.min(span(t, a, a + edge), 1 - span(t, b - edge, b));

const MOVED: readonly Player[] = [LINEUP[FROM], ...LINEUP.filter((_, i) => i !== FROM)];

/* Maya Chen's matches, oldest first, as her form strip runs (W W W L W).
   What a hovered bar reads, and the drawer's recent matches (newest first). */
const MAYA_MATCHES = [
  { won: true, them: "J. Whitcomb", score: "6-1, 6-2", date: "Sep 5", event: "Meridian Fall Open" },
  { won: true, them: "L. Moreno", score: "6-2, 7-5", date: "Sep 9", event: "vs Lakeview" },
  { won: true, them: "A. Ferro", score: "7-6, 6-3", date: "Sep 12", event: "vs Coastal State" },
  { won: false, them: "R. Haldane", score: "4-6, 6-3, 3-6", date: "Sep 19", event: "Ridgeway Invitational" },
  { won: true, them: "S. Patel", score: "6-3, 6-4", date: "Sep 26", event: "vs Northgate" },
] as const;

type Geo = {
  row: number; // one row's height
  rowTop: (i: number) => number; // top of lineup row i, in the card
  spotX: number;
  nameX: number;
  recordX: number;
  recordW: number;
  bars: readonly number[]; // centre x of each form bar
  barTop: number; // top of a form bar, in its row
  lastX: number;
  headTop: number;
  // The card's place on the board, and the drawer's targets on the board.
  cardX: number;
  cardY: number;
  recentRow: { x: number; y: number };
  close: { x: number; y: number };
};

function offsetIn(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function measure(card: HTMLDivElement): Geo | null {
  const board = card.closest<HTMLElement>(".dh");
  const list = card.querySelector<HTMLOListElement>(".tr-list");
  const first = list?.querySelector<HTMLLIElement>(".tr-row");
  const head = card.querySelector<HTMLDivElement>(".tr-head");
  const drawer = board?.querySelector<HTMLElement>(".rd");
  if (!board || !list || !first || !head || !drawer) return null;
  // Every cell offset below is in the card's coordinates (the card is
  // positioned and the rows are not).
  const x = (sel: string) => {
    const el = first.querySelector<HTMLElement>(sel);
    return el ? { left: el.offsetLeft, width: el.offsetWidth } : { left: 0, width: 0 };
  };
  const spot = x(".tr-spot");
  const record = x(".tr-record");
  const name = x(".tr-player .nm");
  const them = x(".tr-last .them");
  const ticks = [...first.querySelectorAll<HTMLElement>(".tr-form .th-ticks i")];
  // Read once, now: the rows are reordered later, so a live read of the
  // first row's offset would follow it down the table.
  const top0 = first.offsetTop;
  const row = first.offsetHeight;
  const card0 = offsetIn(card, board);
  // The drawer is measured where it will sit, open: its left edge is the
  // board's right edge less its width.
  const left = board.offsetWidth - drawer.offsetWidth;
  const at = (sel: string) => {
    const el = drawer.querySelector<HTMLElement>(sel);
    if (!el) return { x: 0, y: 0 };
    const o = offsetIn(el, drawer);
    return { x: left + o.x + el.offsetWidth / 2, y: o.y + el.offsetHeight / 2 };
  };
  return {
    row,
    rowTop: (i) => top0 + i * row,
    spotX: spot.left + spot.width / 2,
    nameX: name.left,
    recordX: record.left - 10,
    recordW: 64,
    bars: ticks.map((t) => t.offsetLeft + t.offsetWidth / 2),
    // The bar's top within its row (its offset is in the card's coordinates).
    barTop: ticks[0] ? ticks[0].offsetTop - first.offsetTop : row / 2 - 6,
    lastX: them.left,
    headTop: head.offsetTop,
    cardX: card0.x,
    cardY: card0.y,
    recentRow: at(".rd-recent .rd-match"),
    close: at(".rd-close"),
  };
}

// The cursor's path: where it is at each moment, on the board.
function cursorAt(t: number, g: Geo): { x: number; y: number; down: boolean; seen: number } {
  const mid = (i: number) => g.rowTop(i) + g.row / 2;
  const C = (x: number, y: number) => ({ x: x + g.cardX, y: y + g.cardY });
  const bar = (i: number) => C(g.bars[i] ?? 0, mid(0) + 1);
  const pts: { t: number; x: number; y: number }[] = [
    { t: 0, ...C(g.lastX + 120, mid(4) + 10) },
    { t: 0.85, ...C(g.spotX, mid(FROM)) },
    { t: DRAG.start, ...C(g.spotX, mid(FROM)) },
    { t: DRAG.end, ...C(g.spotX, mid(0)) },
    { t: 3.5, ...C(g.spotX, mid(0)) },
    { t: 4.1, ...C(g.recordX + 30, mid(0) + 2) },
    { t: 6.0, ...C(g.recordX + 30, mid(0) + 2) },
    { t: 6.6, ...bar(HOVER[0].bar) },
    { t: 7.95, ...bar(HOVER[0].bar) },
    { t: 8.1, ...bar(HOVER[1].bar) },
    { t: 9.4, ...bar(HOVER[1].bar) },
    { t: 9.95, ...C(g.nameX + 50, mid(0) + 2) },
    { t: 10.35, ...C(g.nameX + 50, mid(0) + 2) },
    { t: 11.1, x: g.recentRow.x - 40, y: g.recentRow.y + 2 },
    { t: 12.7, x: g.recentRow.x - 40, y: g.recentRow.y + 2 },
    { t: 13.25, x: g.close.x, y: g.close.y + 1 },
    { t: 13.65, x: g.close.x, y: g.close.y + 1 },
    { t: 14.5, ...C(g.lastX + 150, mid(2) + 2) },
    { t: 17.2, ...C(g.lastX + 150, mid(2) + 2) },
    { t: LOOP, ...C(g.lastX + 120, mid(4) + 10) },
  ];
  let i = 0;
  while (i < pts.length - 2 && t > pts[i + 1].t) i++;
  const a = pts[i];
  const b = pts[i + 1];
  const k = ease(span(t, a.t, b.t));
  const pressed = (c: { down: number; up: number }) => t >= c.down && t < c.up;
  const down = (t >= DRAG.grab && t < DRAG.drop) || pressed(CLICK_ROW) || pressed(CLICK_CLOSE);
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, down, seen: window_(t, 0.05, FADE.start - 0.05, 0.3) };
}

/* The dashboard's form readout (form-strip.tsx): a dark card above the
   hovered bar, no arrow. The score, then the date and event, then the
   opponent, the one name the row does not already say. */
function Readout({ m, x, y, o }: { m: (typeof MAYA_MATCHES)[number]; x: number; y: number; o: number }) {
  return (
    <span className="rt-read" style={{ left: x, top: y, opacity: o, scale: `${0.95 + 0.05 * o}` }}>
      <span className="sc">{m.score}</span>
      <span className="ln">
        {m.date} · {m.event}
      </span>
      <span className="ln">{m.them}</span>
    </span>
  );
}

const ResultMark = ({ won }: { won: boolean }) =>
  won ? (
    <CircleCheck size={14} strokeWidth={1.5} className="rd-res is-won" aria-hidden="true" />
  ) : (
    <CircleX size={14} strokeWidth={1.5} className="rd-res is-lost" aria-hidden="true" />
  );

/* The player drawer (player-drawer.tsx in the dashboard): the 340px panel
   on the right. Its header steps through players and closes; its body is
   the player (name, facts, record and form, how they play), a stat
   selector over that stat's trend, and their recent matches; its foot is
   the one button. */
function Drawer({ open, hoverRecent, form }: { open: number; hoverRecent: boolean; form: readonly ("w" | "l")[] }) {
  // A trend for First serve in, over her last five.
  const pts = [58, 61, 57, 63, 66];
  const W = 296;
  const H = 56;
  const px = (i: number) => 6 + (i * (W - 12)) / (pts.length - 1);
  const py = (v: number) => H - 8 - ((v - 52) / (70 - 52)) * (H - 16);
  const line = pts.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");
  return (
    <aside className="rd" style={{ transform: `translateX(${(1 - open) * 100}%)`, visibility: open > 0 ? "visible" : "hidden" }}>
      <div className="rd-head">
        <span className="rd-ib">
          <ChevronUp size={14} strokeWidth={1.5} />
        </span>
        <span className="rd-ib">
          <ChevronDown size={14} strokeWidth={1.5} />
        </span>
        <span className="rd-who">
          Player <span className="n">1 / 9</span>
        </span>
        <span className="flex" />
        <span className="rd-sep" />
        <span className="rd-ib rd-close">
          <X size={14} strokeWidth={1.5} />
        </span>
      </div>
      <div className="rd-body">
        <div className="rd-id">
          <div className="rd-top">
            <span className="rd-av">MC</span>
            <div>
              <div className="rd-name">Maya Chen</div>
              <div className="rd-facts">Junior · Women&rsquo;s singles</div>
            </div>
          </div>
          <dl className="rd-dl">
            <dt>Record</dt>
            <dd>
              <span className="rec">10–1</span>
              <span className="th-ticks">
                {form.map((f, i) => (
                  <i className={`is-${f}`} key={i} />
                ))}
              </span>
            </dd>
            <dt>Plays</dt>
            <dd>Right-handed, two-handed backhand</dd>
          </dl>
        </div>
        <div className="rd-stat">
          <div className="rd-measures">
            {[
              ["1st serve in", "66%"],
              ["1st serve won", "71%"],
              ["Break points", "48%"],
              ["Return won", "44%"],
            ].map(([l, v], i) => (
              <span className={`rd-m${i === 0 ? " on" : ""}`} key={l}>
                <span className="l">{l}</span>
                <span className="v">{v}</span>
              </span>
            ))}
          </div>
          <div className="rd-chart-head">
            <span>First serve in · Last 5</span>
            <span className="up">+8 pts</span>
          </div>
          <svg className="rd-spark" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <path d={line} fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((v, i) => (
              <circle key={i} cx={px(i)} cy={py(v)} r={i === pts.length - 1 ? 3 : 2} fill={i === pts.length - 1 ? "#3B82F6" : "#fff"} stroke="#3B82F6" strokeWidth="1.5" />
            ))}
          </svg>
        </div>
        <div className="rd-recent">
          <div className="rd-recent-head">
            <span className="eb">Recent matches</span>
            <span className="all">All 11</span>
          </div>
          {[...MAYA_MATCHES].reverse().map((m, i) => (
            <span className={`rd-match${i === 0 && hoverRecent ? " is-hover" : ""}`} key={m.date}>
              <ResultMark won={m.won} />
              <span className="op">{m.them}</span>
              <span className="sc">{m.score}</span>
              <span className="dt">{m.date}</span>
              <ChevronRight size={12} strokeWidth={1.5} className="ch" />
            </span>
          ))}
        </div>
      </div>
      <div className="rd-foot">
        <span className="rd-btn">Upload for Maya</span>
      </div>
    </aside>
  );
}

function Scene({ t, still }: { t: number; still: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);

  // Measured once, on the board at its native size (offsets ignore the
  // frame's scaling), and again if the fonts change the row heights.
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const run = () => setGeo(measure(card));
    run();
    document.fonts?.ready.then(run).catch(() => {});
  }, []);

  const committed = t >= DRAG.drop && t < FADE.mid;
  const lineup = committed ? MOVED : LINEUP;
  const p = ease(span(t, DRAG.start, DRAG.end));
  const dragging = t >= DRAG.grab && t < DRAG.drop;
  const R = geo?.row ?? 52;
  const hovered = still ? undefined : HOVER.find((h) => t >= h.from && t < h.to);

  const rowStyle = (_: Player, i: number): CSSProperties | undefined => {
    if (committed || !dragging) return undefined;
    if (i === FROM) return { transform: `translateY(${-FROM * R * p}px)` };
    if (i === 1) return { transform: `translateY(${R * ease(span(p, 0.2, 0.5))}px)` };
    if (i === 0) return { transform: `translateY(${R * ease(span(p, 0.55, 0.85))}px)` };
    return undefined;
  };
  // While a bar is hovered, the strip does what the dashboard's does: that
  // bar grows and the others fade.
  const rowClass = (_: Player, i: number) =>
    dragging && i === FROM ? "rt-lifted" : hovered && i === 0 ? `rt-fh rt-fh-${hovered.bar}` : undefined;

  const ready = t >= READY_AT && t < FADE.mid;
  const lastFor = (pl: Player): Last =>
    ready && pl.name === "Rafael Ortiz" ? { won: true, them: "K. Brandt", when: "Sep 26" } : pl.last;

  const c = geo ? cursorAt(t, geo) : null;
  const show = (a: number, b: number, edge = 0.25) => (still ? 0 : window_(t, a, b, edge));
  const flash = show(READY_AT, READY_AT + 1.4);
  const open = still ? 0 : ease(span(t, OPEN.start, OPEN.end)) - ease(span(t, SHUT.start, SHUT.end));

  const overlay = geo ? (
    <div className="rt-layer" aria-hidden="true">
      {/* 2: the Record column, lit from the head to the last lineup row. */}
      <i
        className="rt-col"
        style={{
          left: geo.recordX,
          width: geo.recordW,
          top: geo.headTop + 4,
          height: geo.rowTop(LINEUP.length) - geo.headTop - 8,
          opacity: show(4.0, 5.9),
        }}
      />
      {/* 4: Maya Chen's row, hovered, then selected while her drawer is open. */}
      <i className="rt-row" style={{ top: geo.rowTop(0), height: R, opacity: show(9.75, 13.75) }} />
      {/* 5: Rafael Ortiz's row, flashing as his match turns ready. */}
      <i className="rt-row is-ready" style={{ top: geo.rowTop(2), height: R, opacity: flash }} />
      {HOVER.map((h) => (
        <Readout key={h.bar} m={MAYA_MATCHES[h.bar]} x={geo.bars[h.bar] ?? 0} y={geo.rowTop(0) + geo.barTop - 10} o={show(h.from, h.to, 0.12)} />
      ))}
    </div>
  ) : null;

  const top = geo ? (
    <div className="rt-top" aria-hidden="true">
      {c && !still ? (
        <span className={`rt-cursor${c.down ? " is-down" : ""}`} style={{ transform: `translate(${c.x}px, ${c.y}px)`, opacity: c.seen }}>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M5 3.2v15.6l4.3-4.1 2.8 6.4 2.6-1.1-2.8-6.3h6z" fill="#0D0D0D" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </span>
      ) : null}
      {/* The loop's seam: a quick fade to the page and back. */}
      <i className="rt-fade" style={{ opacity: still ? 0 : Math.min(span(t, FADE.start, FADE.mid), 1 - span(t, FADE.mid, FADE.end)) }} />
    </div>
  ) : null;

  return (
    <TeamRoster
      lineup={lineup}
      rowStyle={rowStyle}
      rowClass={rowClass}
      lastFor={lastFor}
      cardRef={cardRef}
      overlay={overlay}
      drawer={
        <>
          <Drawer open={open} hoverRecent={t >= RECENT_HOVER.from && t < RECENT_HOVER.to} form={LINEUP[FROM].form as readonly ("w" | "l")[]} />
          {top}
        </>
      }
    />
  );
}

/* `steps` are the five lines under the board, in beat order. `active` is
   false while the tab is not showing: the board stays laid out but stops. */
export function RosterTour({ steps, active = true }: { steps: readonly string[]; active?: boolean }) {
  const reduce = usePrefersReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const want = useRef(true);
  const activeRef = useRef(active);
  const syncRef = useRef<() => void>(() => {});
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    want.current = !reduce;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let inView = false;
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 100) / 1000 : 0;
      last = now;
      clock = (clock + dt) % LOOP;
      setT(clock);
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      const run = inView && document.visibilityState === "visible" && want.current && activeRef.current;
      if (run && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
        setPlaying(true);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        setPlaying(false);
      }
    };
    syncRef.current = sync;
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    io.observe(box);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduce]);

  useEffect(() => {
    activeRef.current = active;
    syncRef.current();
  }, [active]);

  const toggle = () => {
    want.current = !playing;
    syncRef.current();
  };

  // No line is singled out before the board has moved.
  const still = !playing && t === 0;
  const step = still ? -1 : BEATS.filter((b) => b <= t).length - 1;

  return (
    <>
      <div className="proof-board reveal" ref={boxRef}>
        <div className="rt-frame">
          <div
            role="img"
            aria-label="The team workspace's Roster page: a player is dragged to the top of the lineup, the record column is pointed out, her form strip is hovered match by match, her player drawer opens with her record, a stat trend and recent matches, and another player's match turns ready."
          >
            <MockFrame width={DH_W} height={BOARD_H}>
              <div inert className="mock-inert">
                <Scene t={t} still={still} />
              </div>
            </MockFrame>
          </div>
          <button
            type="button"
            className="tour-toggle"
            onClick={toggle}
            aria-label={playing ? "Pause the roster tour" : "Play the roster tour"}
          >
            {playing ? (
              <Pause size={14} strokeWidth={1.6} fill="currentColor" aria-hidden="true" />
            ) : (
              <Play size={14} strokeWidth={1.6} fill="currentColor" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <ol className="tour-steps reveal" aria-label="What the roster shows">
        {steps.map((line, i) => (
          <li className={`tour-step${i === step ? " is-on" : ""}`} key={line}>
            <span className="n" aria-hidden="true">
              0{i + 1}
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
