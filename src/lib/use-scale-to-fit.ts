import { useEffect, useRef } from "react";

type Options = {
  /** Native (unscaled) content width in px. */
  width?: number;
  /** Fixed native height in px. Omit to measure the inner element's offsetHeight on each fit. */
  height?: number;
  /** Re-fit once after this delay (ms) to catch late layout (fonts, images, mounted children). */
  settleMs?: number;
  /**
   * Upper bound on the scale factor. Without it the artboard upscales without
   * limit on wide monitors. With it, the scale caps here and the inner element
   * is centered in the container (its leftover width split into side gutters),
   * keeping a fixed artboard proportional to the rest of the page on large
   * screens. Requires the inner element to be absolutely positioned.
   */
  maxScale?: number;
};

/**
 * Scales an inner element to fit its outer container's width
 * (`scale(outer.clientWidth / width)`) and sets the outer height to the scaled
 * content height, re-fitting on container resize. Used to render the fixed
 * 1440-wide design artboards (hero canvas, dashboard mock) responsively.
 *
 * Returns refs to attach: `outerRef` to the container, `innerRef` to the
 * native-width content.
 */
export function useScaleToFit<
  O extends HTMLElement = HTMLDivElement,
  I extends HTMLElement = HTMLDivElement,
>({ width = 1440, height, settleMs, maxScale }: Options = {}) {
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const fit = () => {
      let s = outer.clientWidth / width;
      if (maxScale) s = Math.min(s, maxScale);
      inner.style.transform = `scale(${s})`;
      outer.style.height = (height ?? inner.offsetHeight) * s + "px";
      // Center the artboard once the scale is capped: below the cap the gutter
      // is 0 (it fills the width), above it the surplus splits left/right.
      if (maxScale) inner.style.left = (outer.clientWidth - width * s) / 2 + "px";
    };
    fit();
    // Observe BOTH boxes: `outer` for container-width changes (the scale), and
    // `inner` so late layout — fonts, images, mounted children growing the
    // artboard's height — re-fits silently. A scale transform doesn't change
    // either element's observed box, so this can't feedback-loop. This replaces
    // the old fixed settle timeout, which produced a visible post-paint jump.
    const ro = new ResizeObserver(fit);
    ro.observe(outer);
    ro.observe(inner);
    const t = settleMs ? setTimeout(fit, settleMs) : undefined;
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      if (t) clearTimeout(t);
      window.removeEventListener("resize", fit);
    };
  }, [width, height, settleMs, maxScale]);
  return { outerRef, innerRef };
}
