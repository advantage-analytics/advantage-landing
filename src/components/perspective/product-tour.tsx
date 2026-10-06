"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { ProofHead } from "./band-parts";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/* Product tour — a 16.8 s screen recording of the real dashboard: a match's
   Statistics page, a click on "Winners", the Video tab filtered to those
   points, then the film room playing one of them shot by shot. The file is
   the dashboard alone (no captions, no sound) and its last half-second
   dissolves back to its first frame, so `loop` has no seam. The five caption
   lines are text under the frame, and the one the video is on lights up.

   It plays only while it is on screen and the tab is visible, and the file is
   not requested before its first play; until then the frame shows a still of
   the loop's first frame. Reduced-motion visitors keep the still, with the
   same button to play it if they choose. The button is also the pause a
   looping video owes everyone else.

   The video is rendered from the dashboard repo's Remotion project (`_video/`,
   composition `ProductTourWeb`). Ask for a new cut there rather than editing
   the files, and bump the version in TOUR when one lands (see next.config.ts). */

const TOUR = "/assets/marketing/product-tour-v2";
/* Two sizes of the same cut. The frame is up to ~1160px wide, which a 2×
   screen draws at ~2320 device pixels, so wide high-density screens get the
   2880 encode and still, and everything else (phones included) the 1920. */
const HD_MEDIA = "(min-width: 900px) and (min-resolution: 1.5dppx)";

/** Each line, and the second of the file at which the video reaches it. */
const STEPS: readonly { at: number; line: string }[] = [
  { at: 0, line: "See every stat from the match." },
  { at: 2.6, line: "Click a stat to watch its points." },
  { at: 4.3, line: "Watch only those points." },
  { at: 5.6, line: "Go full screen." },
  { at: 6.6, line: "Follow every point, shot by shot." },
];

/** Plays the video, choosing its file (size and codec) on the first call. */
function start(v: HTMLVideoElement) {
  if (!v.getAttribute("src")) {
    const size = window.matchMedia(HD_MEDIA).matches ? "-2880" : "";
    const type = v.canPlayType('video/webm; codecs="vp9"') ? "webm" : "mp4";
    v.src = `${TOUR}${size}.${type}`;
  }
  v.play().catch(() => {});
}

function TourPlayer() {
  const reduce = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  // Whether the video should be running when it is on screen: on by default,
  // off under reduced motion, and the button's to change either way.
  const wantPlay = useRef(true);
  const [playing, setPlaying] = useState(false);
  // -1 until the video has played: no line is singled out on a still.
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    wantPlay.current = !reduce;

    const onTime = () => setStep(STEPS.filter((s) => s.at <= v.currentTime).length - 1);
    const onPlaying = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);

    // Chrome pauses muted video in a hidden tab and does not reliably resume
    // it, so visibility is handled here as well as the scroll position.
    let inView = false;
    const sync = () => {
      if (inView && document.visibilityState === "visible" && wantPlay.current) start(v);
      else v.pause();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      v.pause();
    };
  }, [reduce]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    wantPlay.current = v.paused;
    if (v.paused) start(v);
    else v.pause();
  };

  return (
    <>
      <div className="proof-board reveal">
        <div className="mock-frame tour-frame reveal">
          <picture>
            <source media={HD_MEDIA} srcSet={`${TOUR}-poster-2880.jpg`} />
            <img
              className="tour-still"
              src={`${TOUR}-poster.jpg`}
              alt=""
              width={1920}
              height={1200}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <video
            ref={videoRef}
            className="tour-video"
            muted
            loop
            playsInline
            preload="none"
            aria-label="Product tour: from a match statistic to the points behind it, played shot by shot"
          />
          <button
            type="button"
            className="tour-toggle"
            onClick={toggle}
            aria-label={playing ? "Pause the product tour" : "Play the product tour"}
          >
            {playing ? (
              <Pause size={14} strokeWidth={1.6} fill="currentColor" aria-hidden="true" />
            ) : (
              <Play size={14} strokeWidth={1.6} fill="currentColor" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <ol className="tour-steps reveal" aria-label="What the tour shows">
        {STEPS.map((s, i) => (
          <li className={`tour-step${i === step ? " is-on" : ""}`} key={s.line}>
            <span className="n" aria-hidden="true">
              0{i + 1}
            </span>
            <span>{s.line}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

export function ProductTour({ alt = false }: { alt?: boolean }) {
  return (
    <section className={`band${alt ? " alt" : ""} proof-band`} id="tour">
      <div className="wrap">
        <ProofHead
          eyebrow="Product tour"
          title="Every number opens the point."
          aside="Pick any number and the film jumps to that point, every shot and where it landed."
        />
        <TourPlayer />
      </div>
    </section>
  );
}
