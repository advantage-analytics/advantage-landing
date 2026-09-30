// What a match video has to be for the dashboard uploader to take it. The
// uploader's own address is links.uploadMatch.
//
// The home page's How it works spec, the footage checklist on /pilot, the
// export guide and the /send-a-match notice all quote these. The uploader
// enforces the same limits in the dashboard repo, so when they move there,
// change them here in the same breath: a stale figure is a coach told their
// file is fine and then refused.

export const VIDEO_MIN_RESOLUTION = "1080p";
export const VIDEO_MIN_FPS = "30 fps";
// The compact form the home page's step spec uses ("1080p · 30fps · MP4").
export const VIDEO_MIN_FPS_SHORT = "30fps";
export const VIDEO_FORMATS = "MP4 or MOV";
export const VIDEO_MAX_SIZE = "8 GB";

// About 60 MB a minute at 1080p30 on a phone, so an hour is ~3.5 GB and a
// long three-setter can cross the limit. The export guide leads with this so a
// coach can judge their own file before they try.
export const VIDEO_SIZE_PER_HOUR = "3.5 GB";

export const EXPORT_GUIDE_HREF = "/export-guide";
