// Shared constants for the /send-a-match intake page, its form, and its API
// route. Everything a coach is promised lives here so the page, the
// confirmation email, and the cold email that sent them can't drift apart.

// The delivery promise, spoken in the hero, the success state, and the coach's
// confirmation email. It must match the cold-email CTA word for word.
export const TURNAROUND = "three business days";

// Dropbox File Request backing the upload fallback — uploads land in
// /Pilot Video Submissions, and the uploader needs no Dropbox account. The env
// var lets it be repointed without a code change; if it is ever blanked, the
// upload path — and the question that offers it — disappears rather than
// shipping a button that goes nowhere, leaving link-paste as the only route in.
export const UPLOAD_URL =
  process.env.NEXT_PUBLIC_DROPBOX_FILE_REQUEST_URL ??
  "https://www.dropbox.com/request/uqjzic2w35d4yls7kxk5";

export const START_ENDS = [
  "Near end (closest to the camera)",
  "Far end",
  "Not sure",
] as const;

export const CAMERA_POSITIONS = [
  "Behind the baseline, elevated",
  "Behind the baseline, at ground level",
  "To the side of the court",
  "Not sure",
] as const;

// The one answer that trips the soft gate. It warns; it never blocks.
export const SIDE_ANGLE = CAMERA_POSITIONS[2];

export const EXPORT_GUIDE_HREF = "/export-guide";

// The upload ceiling exists to stop the Dropbox request being abused, not
// because anything downstream needs a small file — so it sits high enough that
// a real match effectively never trips it. At the ~60MB/min a phone shoots
// 1080p30, three hours is about 10.5GB, so 12GB holds a full three-setter with
// room over. Coaches with something larger paste a link, which has no limit.
export const MAX_UPLOAD_LABEL = "12GB";
export const MAX_UPLOAD_HOURS = "three hours";
