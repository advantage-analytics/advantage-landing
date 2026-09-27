"use client";

import type { ReactNode } from "react";
import { useScaleToFit } from "@/lib/use-scale-to-fit";
import "./mocks.css";

/* The frame the product mocks sit in: a fixed artboard (1440×944 by
   default; the roster board passes the dashboard's 1440×900), drawn at its
   native size and scaled to the band's width, the same way the dashboard
   showcase fits its artboard. aspect-ratio reserves the fitted height
   before the fit effect runs, so anchors below this band land on target. */

export const MOCK_W = 1440;
export const MOCK_H = 944;

export function MockFrame({
  children,
  className = "",
  width = MOCK_W,
  height = MOCK_H,
}: {
  children: ReactNode;
  className?: string;
  width?: number;
  height?: number;
}) {
  const { outerRef, innerRef } = useScaleToFit({ width, height });
  return (
    <div className={`mock-frame reveal ${className}`.trim()}>
      <div ref={outerRef} className="mock-fit" style={{ aspectRatio: `${width} / ${height}` }}>
        <div ref={innerRef} className="mock-art" style={{ width, height }}>
          {children}
        </div>
      </div>
    </div>
  );
}
