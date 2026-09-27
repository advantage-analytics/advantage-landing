"use client";

import type { ReactNode } from "react";
import { useScaleToFit } from "@/lib/use-scale-to-fit";
import "./mocks.css";

/* The frame both product mocks sit in: a 1280×720 artboard, drawn at its
   native size and scaled to the band's width, the same way the dashboard
   showcase fits its 1440 artboard. aspect-ratio reserves the fitted height
   before the fit effect runs, so anchors below this band land on target. */

export const MOCK_W = 1280;
export const MOCK_H = 720;

export function MockFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { outerRef, innerRef } = useScaleToFit({ width: MOCK_W, height: MOCK_H });
  return (
    <div className={`mock-frame reveal ${className}`.trim()}>
      <div ref={outerRef} className="mock-fit" style={{ aspectRatio: `${MOCK_W} / ${MOCK_H}` }}>
        <div ref={innerRef} className="mock-art" style={{ width: MOCK_W, height: MOCK_H }}>
          {children}
        </div>
      </div>
    </div>
  );
}
