# Photo shot list — landing page

Six shots for the home page, in priority order. Shot 1 is the one the page is
waiting on: the hero currently runs an interim image (`elc-court.jpg`) in a
marked placeholder slot at the top of `src/components/perspective/hero.tsx`.

## How the hero uses a photo

- The photo fills the whole hero, edge to edge, on every screen size, and is
  cropped (`object-fit: cover`), never stretched.
- **Desktop** (roughly 16:9, 1440×780): headline and buttons sit on the **left
  half** under a dark navy scrim; a dashboard card floats in the **bottom
  right**. The subject therefore needs to live in the **right-centre**, upper
  two thirds of the frame.
- **Mobile** (roughly 9:16, 375×700): the same file is cropped to a tall slice
  about a third of its width, with copy over the top two thirds and the card
  at the bottom. The subject must survive that slice.
- The scrim darkens the picture by about 60–90% on the copy side, so what
  reads is shape, light and expression, not fine detail.

## For every shot

- Landscape master, **at least 3000 px wide** (the interim is 1024 px and is
  visibly soft). Shoot a little loose: we crop, we never add.
- Real players, real courts, natural light. Smiling, laughing, mid-effort.
  Not posed stock-photo smiles.
- A mix of ages, genders and levels across the set. Club and public courts
  are as welcome as college facilities.
- **No visible third-party logos**: no sponsor banners, no scoreboard brands,
  keep apparel and racket logos small or turned away. (The interim image
  shows a sponsor's banners, which is one reason to replace it soon.)
- Signed releases from everyone recognisable.
- Deliver as sRGB JPEG, named as below, into `public/assets/marketing/`.

## Shots

### 1. Phone setup on the fence — HERO (`hero-fence.jpg`)

A player clipping or propping a phone on the back fence, behind the baseline,
looking pleased with it. Court and net visible beyond them.

- **Orientation:** landscape master, plus a portrait alternate if time allows.
- **Desktop crop:** player and phone in the right half; left half is calm
  (fence, court surface, sky) so the headline sits on something quiet. Leave
  the bottom-right corner uncluttered: the dashboard card covers it.
- **Mobile crop:** player's face and the phone must both fit inside one
  vertical third of the frame, in the upper half. Hands and phone close to
  the face, not at arm's length across the frame.

### 2. "Ready to play?" laugh at the net (`hero-net-laugh.jpg`)

Two hitting partners at the net before a match, mid-laugh, rackets in hand.
The warmest picture in the set; the alternate hero.

- **Orientation:** landscape.
- **Desktop crop:** both players right of centre, net running out to the left
  as a leading line under the copy.
- **Mobile crop:** frame them close enough together that both faces fit a
  vertical third. If only one fits, the one facing camera wins.

### 3. Mid-rally (`rally.jpg`)

A player at full stretch hitting a groundstroke, seen from behind the
baseline: the same angle the app asks people to film from.

- **Orientation:** landscape, plus a portrait frame of the same moment.
- **Desktop crop:** player in the lower right third, court opening up to the
  left. Works as a wide band image.
- **Mobile crop:** the portrait frame, player filling the lower two thirds.
- Fast shutter; a little motion in the ball or strings is fine, a blurred
  face is not.

### 4. Two players comparing stats on a phone (`compare-phone.jpg`)

Courtside after the match, two players leaning over one phone, one pointing
at the screen, both reacting. The screen itself can be unreadable; we show
real product UI beside it.

- **Orientation:** landscape and a square-ish frame (4:5) for cards.
- **Desktop crop:** players centre-right, phone between them.
- **Mobile crop:** tight on the two faces and the phone; lose the bench.
- Screen on, brightness up, no notifications, nothing personal visible.

### 5. Coach and player at a screen (`coach-review.jpg`)

A coach and a player looking at a laptop or tablet together, coach
mid-explanation, player nodding or grinning. For the team/program section.

- **Orientation:** landscape.
- **Desktop crop:** the pair on the right, screen angled toward the left so
  the composition points at the copy.
- **Mobile crop:** both faces in a vertical third; the screen can be cropped
  to an edge.
- Same screen rules as shot 4.

### 6. The phone's view of the court (`phone-view.jpg`) — optional

Over-the-shoulder or straight-on of the phone on the fence with the court
visible on its screen, a match going on behind. Pairs with the "Capture"
step in How it works.

- **Orientation:** landscape, with room to crop to 3:2.
- **Desktop / mobile crop:** phone centred; this one is used small, in a
  card, so keep it simple and high-contrast.

## Swapping the hero photo

1. Put the file at `public/assets/marketing/hero-fence.jpg`.
2. In `src/components/perspective/hero.tsx`, change the one `heroPhoto`
   import to point at it.
3. Rewrite `HERO_PHOTO.alt` to describe the new picture, and adjust
   `focusDesktop` / `focusMobile` (CSS `object-position` values) until the
   subject sits right at 1440 px and 375 px.
