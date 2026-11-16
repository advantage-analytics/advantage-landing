"use client";

import { useEffect, useRef } from "react";

/* The site's dot grid, alive: the hero's mesh and every navy surface (the
   final band, the /pricing masthead, the /contact card).
   The same 6px grid, drawn on a canvas so each dot can carry its own light: a few slow waves at random
   angles and speeds pass through the field, and where they overlap the dots
   dim and recover in drifting, irregular patches. The pointer brings up a
   soft pool of light that follows it with a lag, so the field answers the
   cursor without chasing it.

   Cost: one pixel per dot written straight into an ImageData (no per-dot draw
   calls), 30 fps, and nothing at all while the hero is off screen or the tab
   is hidden. Reduced motion gets one still frame: the grid, no waves, no
   cursor. The pattern is reseeded on every mount, so no two visits match.
   Callers place and mask it with their own class (the navy surfaces tie it
   to their glow). */

const PITCH = 6; // grid spacing, px (matches the dark bands' grid)
const OFFSET = 3; // first dot's inset, px
const CREST = 0.14; // dot alpha where the waves are brightest
const DIM = 0.35; // how far a trough dims the dots (fraction of CREST)
const CURSOR = 0.08; // extra alpha at the centre of the pointer's pool
const RADIUS = 80; // pool falloff (gaussian sigma), px
const LAG = 0.06; // share of the gap to the pointer closed per 60fps frame: lower is lazier
const FPS = 30;
const WAVES = 4;

// The wake, for a surface with `energy`: what the pointer leaves in the field
// as it moves, in two layers.
//   The trail: light laid along the pointer's path, a mote every few pixels,
//   each carrying on a little way in the direction the pointer was going
//   while it widens and fades, so the field streams after the cursor.
//   The ripples: every 110px or so of travel a ring also opens from the
//   path and spreads, a few of them out at once, each older and wider than
//   the next, like the rings a skipped stone leaves along its line.
// At rest there is no path, so the field gets one ripple: a single ring
// opening from a point of its own every few seconds.
const MOTE_LIFE = 1.9; // seconds until a mote, and its ring, have faded out
const MOTE_GAP = 12; // px of travel between motes
const MOTE_SIZE = 25; // a new mote's spread (gaussian sigma), px
const MOTE_GROW = 40; // how much wider it gets over its life, px
const MOTE_CARRY = 0.22; // share of the pointer's speed a mote keeps
const MOTE_DRAG = 3.2; // how quickly that carry dies away, per second
const TRAIL_POINTER = 0.085; // extra alpha at the centre of a pointer mote
const RING_EVERY = 9; // one mote in this many sends a ring: about every 110px of travel
const RING_SPEED = 140; // px per second a ring opens
const RING_WIDTH = 11; // a ring's thickness (gaussian sigma), px
const RING_POINTER = 0.115; // extra alpha on a ring the pointer sent
const RING_IDLE = 0.13; // and on the one that opens at rest
const RING_IDLE_LIFE = 2.6; // seconds the resting ring lasts
const RING_IDLE_SPEED = 170; // px per second it opens
const MAX_MOTES = 64;

// `amp` is the mote's own light, `ring` its ring's (0: none).
type Mote = { x: number; y: number; vx: number; vy: number; born: number; amp: number; ring: number; life: number; speed: number };

type Wave = { dx: number; dy: number; k: number; speed: number; phase: number };

function seedWaves(): Wave[] {
  return Array.from({ length: WAVES }, () => {
    const a = Math.random() * Math.PI * 2;
    return {
      dx: Math.cos(a),
      dy: Math.sin(a),
      k: 0.004 + Math.random() * 0.007, // wavelength ~ 570–1570px
      speed: 0.18 + Math.random() * 0.32, // radians per second
      phase: Math.random() * Math.PI * 2,
    };
  });
}

// `glow` scales the pointer's pool (CURSOR and RADIUS) for a surface that
// wants the cursor to read more strongly; 1 is the shared default, the
// value advantage-dashboard's copy of this file uses.
// `energy` (0 to 1) makes the field livelier for the one surface that leads
// the page: the waves run faster and dim the troughs further, and the pointer
// leaves a wake: a trail of light along its path with ripples spreading from
// it. At rest a single ripple opens on its own. 0, the default, is the quiet field.
// `strength` multiplies every dot's light, for a lighter surface where white
// dots at the navy surfaces' strength all but disappear (the /pricing
// masthead's bright mesh). 1 is the navy default.
export function LiveDots({
  className = "",
  glow = 1,
  energy = 0,
  strength = 1,
}: {
  className?: string;
  glow?: number;
  energy?: number;
  strength?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const waves = seedWaves();
    waves.forEach((v) => (v.speed *= 1 + energy * 0.9));
    const crest = CREST * (1 + energy * 0.3);
    const dim = Math.min(0.9, DIM + energy * 0.45);
    const motes: Mote[] = [];

    let w = 0;
    let h = 0;
    let img: ImageData | null = null;
    let xs = new Float32Array(0); // dot x, px
    let ys = new Float32Array(0); // dot y, px
    let at = new Uint32Array(0); // dot's alpha byte index in img.data
    let extra = new Float32Array(0); // this frame's light from the trail, per dot
    let cols = 0;
    let rows = 0;
    let proj: Float32Array[] = []; // per wave: each dot's position along it

    function build() {
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      if (!w || !h) return;
      canvas!.width = w;
      canvas!.height = h;
      img = ctx!.createImageData(w, h);
      cols = Math.ceil((w - OFFSET) / PITCH);
      rows = Math.ceil((h - OFFSET) / PITCH);
      const n = cols * rows;
      xs = new Float32Array(n);
      ys = new Float32Array(n);
      at = new Uint32Array(n);
      extra = new Float32Array(n);
      proj = waves.map(() => new Float32Array(n));
      let i = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, i++) {
          const x = OFFSET + c * PITCH;
          const y = OFFSET + r * PITCH;
          xs[i] = x;
          ys[i] = y;
          const p = (y * w + x) * 4;
          img.data[p] = img.data[p + 1] = img.data[p + 2] = 255;
          at[i] = p + 3;
          for (let k = 0; k < WAVES; k++) proj[k][i] = (x * waves[k].dx + y * waves[k].dy) * waves[k].k;
        }
      }
    }

    // Pointer: the target, the lagging position that follows it, and how
    // present the pool is (eases in on enter, out on leave).
    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    let inside = false;
    let pool = 0;

    const mote = (x: number, y: number, vx: number, vy: number, t: number, amp: number, ring: number, life = MOTE_LIFE, speed = RING_SPEED) => {
      if (motes.length >= MAX_MOTES) motes.shift();
      motes.push({ x, y, vx: vx * MOTE_CARRY, vy: vy * MOTE_CARRY, born: t / 1000, amp: amp * energy, ring: ring * energy, life, speed });
    };
    // Where the pointer last left a mote, when, and how many it has left.
    let laidX = 0;
    let laidY = 0;
    let laidT = 0;
    let laid = 0;
    let nextIdle = 1400; // ms: when the resting ripple next opens

    // Add every live mote's light into `extra`. The grid is regular, so each
    // mote only visits the dots inside its own reach.
    const RING_REACH = RING_WIDTH * 2.6;
    const RING_W2 = 2 * RING_WIDTH * RING_WIDTH;
    function trail(s: number) {
      extra.fill(0);
      for (let k = motes.length - 1; k >= 0; k--) {
        const m = motes[k];
        const age = (s - m.born) / m.life;
        if (age >= 1) {
          motes.splice(k, 1);
          continue;
        }
        const travel = (1 - Math.exp(-MOTE_DRAG * (s - m.born))) / MOTE_DRAG;
        const mx = m.x + m.vx * travel;
        const my = m.y + m.vy * travel;
        if (m.amp > 0) {
          const sigma = MOTE_SIZE + MOTE_GROW * age;
          const amp = m.amp * (1 - age) * Math.sqrt(1 - age);
          const reach = sigma * 2.6;
          const c0 = Math.max(0, Math.floor((mx - reach - OFFSET) / PITCH));
          const c1 = Math.min(cols - 1, Math.ceil((mx + reach - OFFSET) / PITCH));
          const r0 = Math.max(0, Math.floor((my - reach - OFFSET) / PITCH));
          const r1 = Math.min(rows - 1, Math.ceil((my + reach - OFFSET) / PITCH));
          const s2 = 2 * sigma * sigma;
          for (let r = r0; r <= r1; r++) {
            const dy = OFFSET + r * PITCH - my;
            for (let c = c0; c <= c1; c++) {
              const dx = OFFSET + c * PITCH - mx;
              extra[r * cols + c] += amp * Math.exp(-(dx * dx + dy * dy) / s2);
            }
          }
        }
        if (m.ring > 0) {
          // The ring: quiet as it leaves the path, full a moment later, then
          // fading with the mote.
          const R = (s - m.born) * m.speed;
          const amp = m.ring * Math.min(1, age * 6) * Math.pow(1 - age, 1.4);
          const far = R + RING_REACH;
          const near = R - RING_REACH;
          const c0 = Math.max(0, Math.floor((mx - far - OFFSET) / PITCH));
          const c1 = Math.min(cols - 1, Math.ceil((mx + far - OFFSET) / PITCH));
          const r0 = Math.max(0, Math.floor((my - far - OFFSET) / PITCH));
          const r1 = Math.min(rows - 1, Math.ceil((my + far - OFFSET) / PITCH));
          const far2 = far * far;
          const near2 = near > 0 ? near * near : 0;
          for (let r = r0; r <= r1; r++) {
            const dy = OFFSET + r * PITCH - my;
            for (let c = c0; c <= c1; c++) {
              const dx = OFFSET + c * PITCH - mx;
              const dd = dx * dx + dy * dy;
              if (dd > far2 || dd < near2) continue;
              const off = Math.sqrt(dd) - R;
              extra[r * cols + c] += amp * Math.exp((-off * off) / RING_W2);
            }
          }
        }
      }
    }

    function draw(t: number) {
      if (!img) return;
      const d = img.data;
      const s = t / 1000;
      const phases = waves.map((v) => s * v.speed + v.phase);
      const rad = RADIUS * Math.sqrt(glow);
      const r2 = 2 * rad * rad;
      const reach2 = 9 * rad * rad;
      const flowing = energy > 0 && motes.length > 0;
      if (flowing) trail(s);
      for (let i = 0; i < at.length; i++) {
        let v = 0;
        for (let k = 0; k < WAVES; k++) v += Math.sin(proj[k][i] + phases[k]);
        // v in [-WAVES, WAVES] -> 0..1, eased so the troughs read as patches
        const n = (v / WAVES + 1) / 2;
        let a = crest * (1 - dim * (1 - n * n * (3 - 2 * n)));
        if (pool > 0.001) {
          const ddx = xs[i] - px;
          const ddy = ys[i] - py;
          const dd = ddx * ddx + ddy * ddy;
          if (dd < reach2) a += CURSOR * glow * pool * Math.exp(-dd / r2);
        }
        if (flowing) a += extra[i];
        a *= strength;
        d[at[i]] = a >= 1 ? 255 : (a * 255) | 0;
      }
      ctx!.putImageData(img, 0, 0);
    }

    build();
    if (reduce) {
      waves.forEach((v) => (v.speed = 0));
      draw(0);
      const ro = new ResizeObserver(() => {
        build();
        draw(0);
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = 0;
    let onScreen = true;

    function frame(t: number) {
      raf = 0;
      if (!onScreen || document.hidden) return;
      raf = requestAnimationFrame(frame);
      if (t - last < 1000 / FPS - 1) return;
      // Ease by elapsed time, so the follow feels the same at any frame rate.
      const steps = Math.min((t - last) / (1000 / 60), 4);
      last = t;
      // A lively field keeps its pool close under the pointer.
      const follow = 1 - Math.pow(1 - (LAG + energy * 0.3), steps);
      px += (tx - px) * follow;
      py += (ty - py) * follow;
      pool += ((inside ? 1 : 0) - pool) * (1 - Math.pow(0.96, steps));
      if (energy > 0) {
        // The pointer's wake: a mote for every stretch it has covered, and a
        // ring from every few of them.
        if (inside) {
          const gone = Math.hypot(tx - laidX, ty - laidY);
          if (gone > MOTE_GAP) {
            const dt = Math.max((t - laidT) / 1000, 1 / 120);
            const lim = Math.min(1, 900 / (gone / dt));
            mote(tx, ty, ((tx - laidX) / dt) * lim, ((ty - laidY) / dt) * lim, t, TRAIL_POINTER, laid % RING_EVERY === 0 ? RING_POINTER : 0);
            laid++;
            laidX = tx;
            laidY = ty;
            laidT = t;
          }
        }
        // At rest, one ripple. It waits while the pointer is making its own.
        if (t >= nextIdle) {
          if (pool < 0.2 && motes.length === 0) {
            mote(w * (0.1 + Math.random() * 0.8), h * (0.15 + Math.random() * 0.7), 0, 0, t, 0, RING_IDLE, RING_IDLE_LIFE, RING_IDLE_SPEED);
          }
          nextIdle = t + 3200 + Math.random() * 3200;
        }
      }
      draw(t);
    }
    const start = () => {
      if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    };

    function onMove(e: PointerEvent) {
      // Off screen there is nothing to react to, and no layout read to pay.
      if (e.pointerType === "touch" || !onScreen) return;
      const r = canvas!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const now = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
      if (now && !inside && pool < 0.01) {
        // Enter from rest: start the pool where the pointer is, not at 0,0.
        px = x;
        py = y;
      }
      if (now && !inside) {
        laidX = x;
        laidY = y;
        laidT = performance.now();
      }
      inside = now;
      tx = x;
      ty = y;
    }
    const onLeave = () => (inside = false);

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      start();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", start);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", start);
    };
  }, [glow, energy, strength]);

  return <canvas ref={ref} className={`live-dots ${className}`.trim()} aria-hidden="true" />;
}
