# EverGreen — Design Spec (design.md)

The single source of truth for how the EverGreen site looks and moves. Claude must
follow this for all UI work. The actual tokens live in `app/globals.css` (CSS
variables) and `tailwind.config.ts`; this file explains them in plain English.

> Brand feeling: **quiet luxury**. Calm, premium, uncluttered. Lots of whitespace,
> soft shadows, one warm accent used sparingly. Never loud, never bouncy.

---

## 1. Color

All colors are CSS variables defined in `app/globals.css` under `:root`. Always use
the variable, never a raw hex, so dark mode (roadmap ④) can swap them in one place.

| Variable          | Light value | Use                                          |
| ----------------- | ----------- | -------------------------------------------- |
| `--bg`            | `#FAFAF8`   | Page background (off-white)                  |
| `--surface`       | `#FFFFFF`   | Cards, header, modals, inputs                |
| `--fg1`           | `#1A1A1A`   | Headings, prices, primary text               |
| `--fg2`           | `#6B6B6B`   | Labels, descriptions, meta                   |
| `--border`        | `#EAEAEA`   | Card edges, separators                       |
| `--accent`        | `#B08D57`   | The one "pop" — buttons, links, active state |
| `--accent-hover`  | `#94733F`   | Hover / pressed accent                       |
| `--accent-tint`   | `#F4EFE7`   | Faint wash — selected rows, icon chips       |
| `--success`       | `#3F7D5A`   | "Available" badge, success states            |
| `--charcoal`      | `#181818`   | Footer, dark stat band                       |
| `--on-charcoal`   | `#FFFFFF`   | Text on charcoal                             |
| `--on-charcoal-2` | `#9A9A98`   | Muted text on charcoal                       |

**Accent discipline:** the bronze/gold accent is the *only* saturated color. Use it
for primary buttons, links, the active nav underline, icon chips, and small
highlights — never for large fills.

> Dark mode (roadmap ④): reuse these exact variable names. Target dark bg ~`#0F1411`,
> dark surfaces, light text, and keep `--accent` readable on dark.

---

## 2. Typography

Two families, loaded via `next/font/google` in `app/layout.tsx`:

- **Manrope** (`--font-sans`) — all UI, body, labels, section titles.
- **Playfair Display** (`--font-display`) — display serif for hero titles, stat
  numbers, testimonial quotes, and a few card headlines. Luxury accent only.

| Token            | Size | Weight | Use                         |
| ---------------- | ---- | ------ | --------------------------- |
| `--text-hero`    | 52px | 600    | Page / hero titles (serif)  |
| `--text-section` | 30px | 600    | Section titles              |
| `--text-price`   | 22px | 600    | Property price              |
| `--text-card`    | 16px | 500    | Card title                  |
| `--text-body`    | 15px | 400    | Body / meta                 |
| `--text-label`   | 12px | 500    | Uppercase labels, eyebrows  |

Helper classes: `.h-hero`, `.h-section`, `.t-price`, `.t-card-title`, `.t-meta`,
`.t-label`, `.eyebrow` (uppercase accent label with a short leading rule), `.lead`
(muted intro paragraph). Headlines use tight tracking (`-0.02em`).

---

## 3. Spacing, radii, shadows

- **Spacing**: 8px grid — `--space-1..5` = 8 / 16 / 24 / 40 / 64px. Section vertical
  padding is `--space-5` (64px). Layout max width `--content-max` = 1280px, centered
  with 32px side padding (20px on mobile) via `.wrap`.
- **Radii**: inputs `10px`, cards/surfaces `16px`, buttons `12px`, pills/badges
  `999px`.
- **Shadows** (soft, premium, never heavy): `--shadow-sm` / `--shadow-md` /
  `--shadow-lg`. Cards rest on `md`, lift to `lg` on hover.

---

## 4. Components

- **Buttons** (`.btn`): `.btn-primary` (accent fill), `.btn-outline` (accent border,
  tint on hover), `.btn-ghost` (text only). `.btn-pill` for rounded, `.btn-lg` for
  hero CTAs. Icons sit left or right at 16px.
- **Inputs** (`.field`): white, 1px border, accent border + soft tint ring on focus.
- **Badges** (`.badge`): pill, uppercase. `.badge-success` (green) for "Available",
  `.badge-dark` (translucent dark) over photos, plain white for "New".
- **Property card** (`components/PropertyCard.tsx`): 4:3 image with zoom-on-hover,
  badge top-left, favorite heart top-right, meta row (beds/baths), title, price + location.
  Whole card lifts `-4px` with a larger shadow on hover.
- **Nav** (`components/Nav.tsx`): fixed, frosted/blur, transparent border until
  scrolled; center pill of links with an animated accent underline; Search icon + Sign
  Up button; collapses to a burger under 900px.
- **Footer** (`components/Footer.tsx`): charcoal band, big serif headline, contact
  column, social pills, link rows.
- **Page hero** (`components/PageHero.tsx`): full-bleed image, dark scrim, centered
  eyebrow + serif title + sub, used on inner pages.

---

## 5. Motion (subtle, consistent)

Standard easing `--ease` = `cubic-bezier(0.22, 0.61, 0.36, 1)` (ease-out). Durations:
`--t-fast` 200ms (hovers), `--t-card` 350ms (card lifts).

GSAP drives scroll/entrance motion via reusable helpers in `components/motion/`:

- **`Reveal`** — fade + small slide-in for a single element on scroll.
- **`RevealStagger`** — fades a container's children in sequence (grids, lists).
- **`CountUp`** — number counts up when it enters the viewport.
- **`Parallax`** — gentle vertical drift on hero/CTA background images.
- **`ScrollProvider`** — refreshes ScrollTrigger after load and route changes.

Rules: **fades and small lifts only — never bouncy, never spinning UI.** Keep travel
short (≤ ~30px). **Always respect `prefers-reduced-motion`** (helpers already do — they
snap to the final state). Animations must not cause layout shift.

---

## 6. Responsive

- Container padding drops 32px → 20px under 900px; nav collapses to a burger.
- Multi-column grids collapse to 2-up at ≤1023px and 1-up at ≤639px (home, about,
  properties, contact). Sticky FAQ column goes static on small screens.
- Touch targets ≥ 40px; never rely on hover-only affordances on mobile.

---

## 7. Do / Don't

**Do:** use the variables; keep one accent; lean on whitespace; soft shadows; serif
for display only; subtle motion.
**Don't:** add new colors; use heavy drop-shadows; animate aggressively; cram
sections; use emoji as icons (use `lucide-react` line icons).
