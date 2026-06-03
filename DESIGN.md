# Design

Visual system for the Advantage landing page, vendored from the `advantage-dashboard` webapp so the two share one identity. Tailwind v4 with `@theme` tokens.

## Visual Theme

Light, clean, high-clarity — Stripe/Linear tech-minimal. One deliberate dark band (final CTA) for contrast as punctuation. Borders for structure, soft shadows for elevation, generous whitespace. The product UI itself is the hero imagery.

## Color

Strategy: **Restrained.** Tinted-neutral ink ramp + a single accent blue used for ≤10% of any surface (CTAs, data highlights, focus rings).

- **Accent blue:** `#3B82F6` (`--color-blue`), hover `#2563EB` (`--color-blue-hover`).
- **Blue tints:** `rgba(59,130,246, .04/.08/.12)`; rings `.30/.40`.
- **Ink scale (neutrals):** 900 `#0D0D0D` · 700 `#525252` · 500 `#888888` · 400 `#AAAAAA` · 300 `#CCCCCC` · 200 `#E5E5EA` · 100 `#F3F3F3` · border `#EAECF0`.
- **Surfaces:** card `#FFFFFF`, muted `#FAFAFA`, border-card `#F3F3F3`.
- **Semantic:** success `#5DB955`, error `#E51837` / `#FF453A`.
- **Base (oklch):** background `oklch(1 0 0)`, foreground `oklch(0.145 0 0)`, primary `oklch(0 0 15)`.
- **Brand mesh gradient** (`.brand-mesh-gradient`): layered blue/cyan/indigo radials — used sparingly for brand panels / hero glow.
- Never `#000`/`#fff` for text; use ink-900 / surfaces.

## Typography

- **Sans:** Inter, weights 300–700 (`--font-inter`, `--font-sans`). Body and UI.
- **Mono:** Roboto Mono (`--font-mono`). Data/stat labels only.
- Display font scale `--font-size-xs … -9xl` (0.75rem → 8rem).
- Large headers: weight 300–500 mix, negative tracking `-0.02em`. Body capped ~68ch.

## Elevation & Radius

- `--radius: 0.625rem` (10px) base. Buttons/inputs `rounded-md` (~8px), cards `rounded-xl` / `14px` via `surface-card`.
- `--shadow-card: 0 2px 8px rgba(0,0,0,.06)`; `--shadow-card-elevated: 0 6px 20px rgba(0,0,0,.12)`.
- Reusable surfaces: `.surface-card`, `.surface-card-elevated`, `.surface-card-ghost`.

## Components

- shadcn/ui primitives vendored from the dashboard: **Button** (`rounded-md`, `h-9` default, blue `default` variant, 3px focus ring), **Card** (`rounded-xl border shadow-sm`), **Input** (`h-9 rounded-md border`, subtle gray focus ring).
- `cn()` from `lib/utils.ts` (clsx + tailwind-merge).

## Motion

- Scroll reveals: fade + translateY ~16px, ease-out-quint, staggered. Disabled under `prefers-reduced-motion`.
- Hover: subtle scale (≤1.02) + color transition, ~200ms ease-out. No bounce/elastic.

## Layout

- Varied vertical rhythm between sections (not uniform padding). Container max ~1200px, generous gutters.
- Alternating image/copy rows for features (not identical card grids). Single immersive deep-dive band.
