"use client";

import type { RefObject } from "react";
import { HONEYPOT_NAME } from "@/lib/honeypot";

/**
 * The hidden field a form-filling bot completes and a person never sees.
 *
 * Off-screen rather than display:none, because a bot that reads computed style
 * skips what isn't rendered. Everything else here exists to keep the browser's
 * own autofill out — a name no heuristic matches, plus the ignore attributes
 * 1Password, LastPass, Bitwarden and Dashlane each look for. The whole reason
 * this is one shared component rather than three copies is that the three forms
 * drifting apart is how the field's name stopped being reviewed. See lib/honeypot.
 */
export function HoneypotField({ valueRef }: { valueRef: RefObject<string> }) {
  return (
    <input
      type="text"
      name={HONEYPOT_NAME}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      data-1p-ignore=""
      data-lpignore="true"
      data-bwignore=""
      data-form-type="other"
      onChange={(e) => {
        valueRef.current = e.target.value;
      }}
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        opacity: 0,
      }}
    />
  );
}
