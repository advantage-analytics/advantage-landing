# Visualizations tab video: shot list

The home page's product section has three tabs. Statistics plays a short
looping video of the real dashboard; Roster is animated in code. This is the
brief for the Visualizations tab's video, which plays the same way.

**Status (Nov 15, 2026):** recorded as `product-viz-v1` from Rudy Quan vs Nikita
Volonski (Sep 26, won 7-5, 6-3) in the UCLA Men's workspace, at the owner's
choice. The cut hovers a bar segment on each map in turn (serves, returns,
return contact, rally), opens the Rally shots map, goes over its Statistics
panel (Deep, then Mid) and clicks Mid to filter the map, closes it, and ends
on the Quan/Volonski toggle (at 16.4s). 20.5 seconds. Times match `VIZ_CUT`.

## Where it goes

- Files: `public/assets/marketing/product-viz-v1-2880.webm`, `-2880.mp4`,
  `product-viz-v1.webm`, `product-viz-v1.mp4`, and the posters
  `product-viz-v1-poster.jpg` and `-poster-2880.jpg` (the loop's first frame).
- Then in `src/components/perspective/product-showcase.tsx` set
  `VIZ_TOUR = VIZ_CUT`. The tab plays it, pauses off screen, offers the same
  play/pause button and keeps the still for reduced motion.
- If the beats below land at different times, change the `at` values in
  `VIZ_CUT` to match the cut.

## Format

Match the Statistics tour (`product-tour-v2`) exactly:

- 16:10, the dashboard alone at 1440×900. No captions, no cursor trails, no
  sound.
- Master 2880×1800 (the 2× size, what sharp laptop screens need), plus a
  1920×1200 encode. VP9 WebM and H.264 MP4 of each.
- About 16 seconds. The last half-second dissolves back to the first frame so
  the loop has no seam.
- Made either way the Statistics tour was: rendered in the Remotion project
  (`advantage-video`), or a clean screen recording at 2× scaled to size.

## Data

- Superseded: the owner chose a real UCLA match (see Status). The
  signed-in person's photo is swapped for initials during recording.
- No plan or usage pill in the top bar, no signed-in person's photo.
- "Verified by Advantage" on the match is fine; it is a real plan feature.

## Beats

Each beat ends where the next line under the video lights up. Times are
seconds from the start of the file.

| Time | Line under the video | On screen |
|---|---|---|
| 0.0 | See where every serve landed. | The Visualizations page settles. The cursor moves to the All serves map and hovers the T segment of its bar; the serves to the T stay lit and the rest dim. |
| 3.0 | See where your returns went. | The cursor moves to Returns and clicks Crosscourt; the map keeps only crosscourt returns, won in green and lost in red. |
| 6.0 | See where you stood to return. | The contact map below: the cursor hovers the deep band and the returns hit from behind the baseline light up. |
| 9.0 | See every shot of the rally. | The rally map. The cursor clicks Backhand in the legend; the map keeps only backhands. A click on the map opens its lightbox with the point list beside it; one point is hovered. |
| 12.5 | Switch to your opponent. | The lightbox closes. The cursor clicks the opponent's name in the player toggle; every map redraws for the opponent. |
| 15.5 | (loop) | Hold, then the half-second dissolve back to the first frame. |

Keep each move unhurried: one action per beat, a beat of stillness after
each so the change can be read, and the cursor never crossing the maps while
they redraw.

## Before it ships

- Check each beat against the dashboard as it is that week; if a control has
  moved or been renamed, follow the dashboard and change the line under the
  video to match.
- Watch it at the size it is shown on the page (about 1080 wide) on a sharp
  screen and on a phone.
