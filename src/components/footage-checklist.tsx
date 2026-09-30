import type { ReactNode } from "react";
import {
  VIDEO_FORMATS,
  VIDEO_MAX_SIZE,
  VIDEO_MIN_FPS,
  VIDEO_MIN_RESOLUTION,
} from "@/lib/match-video";

/* What a coach's film has to be for the tracking to read it.
 *
 * Rendered on /pilot, which invites a coach to upload and has to answer this
 * before it asks. It lives beside <CourtDiagram /> because the two are one
 * unit — the drawing shows where the camera goes, the list says what the file
 * has to be. The file limits come from lib/match-video, which the uploader and
 * the export guide read too.
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
    <strong>
      {VIDEO_MIN_RESOLUTION} or better, {VIDEO_MIN_FPS} or higher
    </strong>
  </>,
  <>
    {VIDEO_FORMATS}, under {VIDEO_MAX_SIZE}
    {" "}&mdash; most phone and PlaySight exports already are
  </>,
];
