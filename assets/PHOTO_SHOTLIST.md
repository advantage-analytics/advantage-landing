# Photo shot list — landing page

Six shots for the home page, in priority order. The hero currently runs
`public/assets/marketing/hero-fist-pump.jpg` (a player celebrating a point);
the slot is at the top of `src/components/perspective/hero.tsx`.

## How the hero uses a photo

- The photo is shown **whole, at its own shape**, on the right of the hero. It
  is never cropped, so the player stays fully in frame, head to shoes.
- A **blurred copy of the same photo** sits around it as a soft halo and fades
  out toward the headline. The photo's own edges are faded into it, so there
  is no frame. Keep the subject out of the outer ~12% of
  the frame on every side: that is the fade.
- This works best when the **background is dark and simple** (a windscreen, a
  wall, an evening sky). A bright or busy background makes the fade into the navy
  much more visible.
- **Desktop**: copy on the left, photo on the right, as tall as the top of
  the hero. **Mobile**: copy first, then the photo, right-aligned.
- So: **portrait (4:5), full body with room around it, dark plain backdrop.**
  A subject facing left looks toward the headline.

## For every shot

- **At least 3000 px on the long side.** Shoot a little loose: we crop, we
  never add.
- Real players, real courts, natural light. Smiling, laughing, mid-effort.
  Not posed stock-photo smiles.
- A mix of ages, genders and levels across the set. Club and public courts
  are as welcome as college facilities.
- **No visible third-party logos**: no sponsor banners, no scoreboard brands,
  keep apparel and racket logos small or turned away. (The current hero
  photo shows a school mark and an apparel logo on the shirt, cap, shorts
  and shoes.)
- Signed releases from everyone recognisable.
- Deliver as sRGB JPEG, named as below, into `public/assets/marketing/`.

## Shots

The desktop and mobile crop notes below are for using a shot full-frame
elsewhere on the page. For the hero, the rules above win.

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

1. Put the photo at `public/assets/marketing/hero-<name>.jpg`.
2. In `src/components/perspective/hero.tsx`, change the one `heroPhoto`
   import to point at it.
3. Rewrite `HERO_PHOTO.alt` to describe the new picture, and set
   `HERO_PHOTO.ratio` to the file's width / height.
