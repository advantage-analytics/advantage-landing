# Landing: human hero — summary

Branch: `claude/landing-human-hero-b6a12b` (you said to continue here rather
than create `landing-human-hero`). Nothing pushed or deployed; `main` untouched.

## What changed

**Hero** — `src/components/perspective/hero.tsx`, `src/app/perspective.css`
- The blue mesh + tilted full-size dashboard is replaced by plain copy on navy
  with a photo beside it (`public/assets/marketing/hero-fist-pump.jpg`, the
  celebrating-player photo you supplied).
- The photo is on the right and shown whole at its own 4:5 shape, so the
  player is never cropped. Its background is extended to the left
  behind the copy (the photo's own left edge, stretched sideways, so the wall
  and court carry on sharp and seamless), and that whole strip fades into the
  navy on one long gradient.
- The hero backdrop is the original brand mesh gradient with the live dot
  grid over it, as the old hero had.
- A player-tracking box is drawn around the player, labelled "Rudy Quan |
  UCLA", in the style the app uses to mark a tracked player on video.
- Under the copy and the photo, the dashboard sits on a computer screen (a
  browser window, full container width) that fades out into the next section.
  On phones it is drawn wider than the viewport so it stays legible.
- One responsive layout replaces the old pair (a scaled 1440 px artboard for
  desktop plus a separate mobile hero).
- The photo goes through `next/image` (preloaded, blur placeholder) with real
  alt text.
- Kept: the "Free through Dec 31" eyebrow and both sign-up buttons (Join Free
  Beta, Find Your Team). Added: a "See how it works" link to `#how`.
- Earlier passes used `elc-court.jpg`, a cut-out player, and a coaching
  photo; none is used now, and the last two files have been removed.

**How it works** — `src/components/perspective/sections.tsx`
- Moved directly under the hero and reframed as Capture → Upload → Analyze.
- H2: "Upload, analyze, understand your match."
- Each step has a small visual, a short line, and its one fact: a court
  diagram with the phone behind the baseline, a file uploading, and the real
  scoreboard from the match-report mock.
- Filming guidance kept, friendlier: behind the baseline, as high as you can,
  "a fence works great."

**What you'll see** (new) — `WhatYouSee` in `sections.tsx`
- Three captioned crops: where your winners came from, where your errors came
  from, one thing to work on.
- The crops are the match-report mock's own components, exported from
  `match-breakdown.tsx` and reused, so every number is one the full board
  already shows. Nothing was redrawn or invented.

**Page order** — `src/app/page.tsx`
Hero → How it works → What you'll see → DashboardShowcase → Product tour →
Team → Beta → FAQ → Final.

**SEO** — `src/app/layout.tsx`, `opengraph-image.alt.txt`
- `<title>`: "Advantage — Tennis Analytics and Match Analysis From Your Phone"
- Meta description works in "tennis coaching app", "match analysis" and
  "tennis analytics", and no longer names another product.
- H2s: "Upload, analyze, understand your match." / "Tennis analytics in plain
  English." Eyebrow over the full board: "The full match analysis".

**Docs**
- `PRODUCT.md`: users, purpose, personality and principles rewritten for
  human-first imagery and plain language (replaces "show the product" and
  "data over adjectives").
- `DESIGN.md`: one sentence, the hero-imagery line.
- `assets/PHOTO_SHOTLIST.md`: six shots with orientation and crop notes.

**Removed**: `traffic-lights.tsx` and the browser-chrome CSS, which only the
old hero used.

## Headline

Shipped: **"Film your match. See how to win the next one."**

Alternates (in a comment at the top of `hero.tsx`):
- "Let this be your new tennis coach."
- "Your match, explained. From a video on your phone."

Subhead: "Upload a video from your phone. Advantage shows where you won
points, where you lost them, and what to work on."

## Verification

| Check | Result |
| --- | --- |
| `npm run build` | passes |
| `npm run lint` | passes: 0 errors, 13 warnings, all the existing `<img>` rule |
| Horizontal scroll at 375 and 1440 | none (also none at 320, 390, 768, 1024, 1240, 1920, 844×390) |
| Sign-up above the fold at 375×667 | yes: Join Free Beta ends at 435 px, Find Your Team at 498 px |
| Same at 320×568 | yes: 426 px and 489 px |
| `prefers-reduced-motion` | 0 of 21 reveal elements hidden (18 hidden-until-scrolled with motion on) |
| Copy and floating card overlap | none at any width tested |

Run with Playwright against the production build. Screenshots here:
`before-*` / `after-*`, each as `desktop-fold`, `desktop-full`, `mobile-fold`,
`mobile-full` (desktop 1440×900, mobile 375×667 at 2×).

## Judgment calls

1. **Branch.** Stayed on the existing worktree branch, per your reply.
2. **Headline.** Option 1 over "new tennis coach": it says what you do and
   what you get, and doesn't promise a coach before the page has shown
   anything.
3. **H1 carries no search keyword.** Forcing "tennis analytics" into the
   headline made it worse for a cold visitor. The keywords are in the title,
   description and the two H2s instead.
4. **Three hero actions.** Both sign-up lanes stay as buttons; "See how it
   works" is a text link under them so it doesn't compete.
5. **Dark hero, not light.** The nav is transparent with a white logo at the
   top of the page, so the copy side stays navy and the photo gets a navy
   shade along its top for the nav links.
6. **Floating card is a crop, not a shrunk window.** The whole dashboard at
   that size is unreadable, so the card shows the season summary at 60% scale
   and drops the browser chrome.
7. **Dropped the animated dot grid and scroll tilt** from the home hero; both
   were built for the mesh and fight a photograph. `/pilot` keeps its own.
8. **"Winners / errors came from" uses what the mock has.** The mocks have no
   shot-location view, so the crops are the head-to-head rows (winners, aces,
   return winners, net points; unforced errors, double faults) plus the "How
   points ended" bar. If you want court-position graphics here, that needs a
   new mock.
9. **Step visuals are drawn, not photographed**: a hairline court diagram and
   a file chip (`my-match.mp4`, no numbers), in the style of the `/pilot`
   court diagram. Step 3 is the real scoreboard, minus its tournament line.
10. **Upload-step fact reworded**: "2 h players · 75 h pilot" became "2 h a
    month for players · 75 h for programs". Same figures, from `lib/pilot.ts`.
11. **Step 2 copy** says "Send it in when you're off the court" rather than
    "straight from the dashboard"; the export-guide link is kept.
12. **Band backgrounds.** DashboardShowcase lost its white `alt` background so
    the new strip (white) and it (gray) alternate.
13. **New analytics event**: `see_how_it_works_click` with
    `placement: "home-hero"`.
14. **Open Graph alt text** updated to the new headline. The OG **image
    itself** still shows the old one (see below).
15. **PRODUCT.md** no longer names another product in the sections I rewrote.

## What you need to do

1. **Clear the hero photo and the name for use.** The hero now names the
   player ("Rudy Quan", "UCLA") on a recognisable photo, with a school mark
   and an apparel logo on the kit. Confirm you have the player's written
   consent to use their name and likeness in marketing, and that showing the
   university's name and marks is fine (college athletes' name-and-likeness
   rights and school trademark rules can both apply). The name and team live
   in `HERO_PHOTO.track` in `hero.tsx` if they need to change.
2. **Shoot the rest** (`assets/PHOTO_SHOTLIST.md`) when you can; swapping the
   hero is one import line in `hero.tsx` plus the alt text.
3. **Regenerate `src/app/opengraph-image.jpg`**. Link previews still show
   "Walk on court knowing the pattern."
4. **Confirm phone upload.** The subhead says "Upload a video from your
   phone" (your wording). If the uploader is awkward on mobile, soften it.
5. **Confirm "tennis coaching app"** in the meta description is a claim
   you're comfortable with.
6. **A dev server was already running in this worktree** on port 3004 (not
   started by me); I left it alone.
