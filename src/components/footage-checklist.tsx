import type { ReactNode } from "react";

/* What a coach's film has to be for the tracking to read it.
 *
 * Shared by /send-a-match and /pilot, which both invite a coach to upload and
 * both have to answer this before they ask. It lives beside <CourtDiagram />
 * because the two are one unit — the drawing shows where the camera goes, the
 * list says what the file has to be — and because the day doubles ships or the
 * frame-rate floor moves, one edit has to reach both pages.
 *
 * Content only: each page keeps its own row markup and check icon, since one
 * renders inside the campaign shell and the other inside the site theme.
 */
export const FOOTAGE_CHECKLIST: ReactNode[] = [
  <>
    Filmed from <strong>behind the baseline</strong>, roughly centered on the
    court
  </>,
  <>
    Elevated if possible &mdash; a fence post, a balcony, the top row of
    bleachers
  </>,
  <>Far service line visible</>,
  <>Near court outside of baseline visible</>,
  <>
    <strong>1080p or better, 30fps</strong>
  </>,
  <>MP4 / H.264 &mdash; most phone and PlaySight exports already are</>,
];
