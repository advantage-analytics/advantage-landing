import { useSyncExternalStore } from "react";

const RM_QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const getSnapshot = () => window.matchMedia(RM_QUERY).matches;
const getServerSnapshot = () => false;

/* Reads prefers-reduced-motion directly. We avoid framer-motion's
   useReducedMotion() because it logs a dev-only console warning every time it
   detects the setting. useSyncExternalStore subscribes to the media query,
   stays SSR-safe (server snapshot is false), and updates live if the OS
   preference changes. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
