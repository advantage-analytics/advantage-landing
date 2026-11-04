"use client";

import { useEffect } from "react";
import { RECORDING_GUIDE_HREF } from "@/lib/match-video";

/* The camera sections used to live on this page and moved to the recording
   guide. The dashboard's Help page, search results and old messages still link
   /export-guide#iphone and the like, and a fragment never reaches the server,
   so the forward happens here: a known old anchor replaces this history entry
   with the same section on the recording guide. */
const MOVED: Record<string, string> = {
  settings: "settings",
  iphone: "iphone",
  android: "android",
  gopro: "gopro",
  playsight: "playsight",
  "what-we-read": "frame",
};

export function MovedAnchors() {
  useEffect(() => {
    const target = MOVED[window.location.hash.slice(1)];
    if (target) window.location.replace(`${RECORDING_GUIDE_HREF}#${target}`);
  }, []);
  return null;
}
