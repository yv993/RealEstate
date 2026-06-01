# EverGreen — Build Roadmap (skill-aware, copy-paste into Claude Code)

How to use: paste each command block into Claude Code **one at a time, in order** (A → G).
Wait for each to finish and test it in the browser before pasting the next. The order keeps
the site working at every step while applying the design skills without breaking the green
EverGreen look.

**Prerequisites for the design skills**
- These commands reference two skills, `ui-ux-pro-max` and `frontend-design`.
- `ui-ux-pro-max` needs **Python installed**, and Claude Code must be **restarted** after the
  skill is added so it loads.
- `design.md` is always the source of truth — the skills refine within it and must never
  override the EverGreen brand colors.

> **Status:** A–G have already been implemented in this codebase. Re-running a block is safe —
> Claude will refine rather than rebuild. Keep the blocks here as the canonical, skill-aware plan.

---

## A — Teach Claude when to use each style guide (do this first)   ✅ done
```
Update CLAUDE.md to add a short "Design tools" section with these rules:
- design.md is the source of truth for the EverGreen look (green accent, light/dark palette, spacing) — always follow it for colors, type, and layout.
- Use the ui-ux-pro-max skill to pick refined color palettes, font pairings, spacing, and UX patterns that stay within the EverGreen direction.
- Use the frontend-design skill for polish and distinctive, non-generic detailing — but never override design.md's brand colors.
Keep the section brief and in plain English.
```

---

## B — Localize everything to Armenia (keep images)   ✅ done
```
Use the ui-ux-pro-max skill for tasteful copywriting tone. Change all text content to be about Armenia only — do NOT change any image URLs or IMG ids, the photos must stay exactly as they are.
In lib/data.ts: rewrite every property location to real Armenian places (Yerevan – Kentron, Arabkir, Dilijan, Tsaghkadzor, Sevan, Gyumri, Jermuk, Goris, Ijevan), set realistic USD prices (sales ~$90,000–$600,000; rentals ~$400–$2,500/month), and rewrite each title and description to fit its town. Rewrite STATS labels, FAQS, and TESTIMONIALS with Armenian names and local references.
Also update hero, value section, map band, CTA banner, and footer (Yerevan address + a +374 phone). Keep the EverGreen brand and green design. Do not touch /public or /project/uploads. Run npm run build and confirm it renders.
```

---

## C — Property detail page + clickable cards (if not done yet)   ✅ done
```
Use the frontend-design and ui-ux-pro-max skills while strictly following design.md. Create app/properties/[id]/page.tsx: read the id from the URL, find it in PROPERTIES (clean not-found state if missing), show a large main image with a clickable thumbnail gallery, a stat row (beds, baths, area, garage, year built, type), the description, a features list, and a "Request a viewing" button. Then update components/PropertyCard.tsx so each card links to /properties/[id]. Run npm run build and confirm clicking a property opens its detail page with no errors.
```

---

## D — Add For Rent houses (buy + rent)   ✅ done
```
Following design.md and using ui-ux-pro-max for UX patterns: in lib/data.ts add a "listingType" field ("sale" | "rent") and a "rentPeriod" ("month") for rentals, and add 4-5 Armenian rental properties (reuse existing IMG ids so photos stay the same) with realistic monthly rents and badge "For Rent". On the catalog (components/properties/Catalog.tsx) add a Buy / Rent / All toggle and show rentals as "$X,XXX / month". On the detail page show "/ month" and change the button to "Request a tour" for rentals. Make PropertyCard render the rent format. Works in light and dark mode. Run npm run build.
```

---

## E — Dark mode   ✅ done
```
Following design.md and using ui-ux-pro-max for accessible dark palettes: add a polished light/dark theme. Define dark CSS variables in globals.css reusing the existing --bg/--surface/--fg1/--fg2/--border/--accent names (dark background ~#0F1411, light text, green accent kept readable). Add a sun/moon toggle in the Nav that defaults to system preference, remembers the choice in localStorage, and avoids a flash on load. Verify every section and the detail page look right in both themes with smooth transitions.
```

---

## F — Slide + motion graphics   ✅ done
```
Using the frontend-design skill for tasteful motion, and the existing components/motion helpers + lib/gsap.ts, keep it subtle per design.md and respect prefers-reduced-motion:
- Hero: auto-playing image slideshow with soft slide/cross-fade, arrows, and dots.
- Testimonials: sliding carousel, auto-advance, pause on hover.
- Cards: slide-and-fade up in a stagger on scroll into view.
- Detail gallery: thumbnails slide the main image in from the side.
- Value section and map band: gentle slide-in from alternating sides.
- Stats: count up on enter.
Run npm run build and confirm no layout shift or console errors.
```

---

## G — Final design polish pass with the skills   ✅ done
```
Do a final UI polish pass using frontend-design and ui-ux-pro-max while staying 100% within design.md's EverGreen brand colors. Refine spacing, visual hierarchy, button and card states, empty/loading states, and mobile responsiveness in both light and dark mode. No emoji, no generic gradients. Run npm run build and fix every warning, then list what you changed.
```

---

### Earlier backend roadmap (already implemented — see SETUP.md to switch on)
- Supabase schema + clients (`supabase/schema.sql`, `supabase/seed.sql`, `lib/supabase/`)
- DB-backed property reads with static fallback (`lib/properties.ts`)
- Lead capture API (`app/api/leads/route.ts`) wired to the contact form + "request a viewing"
- Agency admin area: login, leads dashboard, listings CRUD + image upload (`app/(admin)/`)
- Production polish: loading/error states, styled 404, per-page SEO metadata
- **To go live:** follow **SETUP.md** (Supabase keys + SQL, then Vercel deploy)

---

## Pointer / cursor interaction layer (H–L)   ✅ done

Reusable, brand-safe motion primitives in `components/motion/`, all of which respect
`prefers-reduced-motion` and **disable themselves on touch / coarse-pointer devices**.

```
H — Reusable cursor/pointer interaction primitives
Create small reusable client components in components/motion that respect prefers-reduced-motion and disable on touch/coarse-pointer devices: Magnetic.tsx (button/link pulls ~8px toward cursor, spring-back), Tilt.tsx (card 3D tilt ~6deg + soft scale, perspective), SpotlightCard.tsx (radial --accent glow following cursor). GPU-friendly transforms only. npm run build.
```
```
I — Apply them to the real UI
Wrap each PropertyCard in SpotlightCard + a subtle Tilt. Wrap the primary CTAs (hero "Search Properties", "Get Started", "Request a viewing") in Magnetic. Keep effects subtle, green accent only, works in light + dark on home/catalog/detail. npm run build.
```
```
J — Pointer parallax + micro-movement on the hero
Hero background image and floating search card drift a few px in opposite directions with the cursor (max ~12px), damped; keep scroll parallax; add gentle pointer drift to value-section and map-band images. Off on touch. npm run build.
```
```
K — Optional custom cursor (desktop only)
components/motion/Cursor.tsx — soft ring (--fg) + dot trailing the pointer via GSAP, grows over links/buttons, hides native cursor only on fine pointers, fully off on touch + reduced-motion. Mount once in app/layout.tsx; easy to remove (delete file + one line). npm run build.
```
```
L — Polish & performance check
Motion polish pass (frontend-design) within design.md: ensure all pointer/parallax/tilt effects are subtle, consistent, GPU-accelerated, paused for reduced-motion, off on touch. No jank/layout shift on home/catalog/detail in both themes. List changes.
```

> **Primitives:** `Magnetic.tsx`, `Tilt.tsx`, `SpotlightCard.tsx`, `PointerParallax.tsx`,
> `Cursor.tsx` (+ `isFinePointer()` in `lib/gsap.ts`). The custom cursor (K) is optional —
> remove it by deleting `components/motion/Cursor.tsx` and the `<Cursor />` line in `app/layout.tsx`.

---

# Phase 2: Performance & Portal Features   ✅ all done

Order: **P1 → P5** (perf + SEO foundation), then **F1 → F4** (features), then **P6** (verify).

> **Status:** P1–P6 and F1–F4 are all implemented and building clean (30 routes). A follow-up
> perf pass added `optimizePackageImports`, lazy-loaded the Lightbox, and a `LazyOnVisible`
> wrapper that defers the Leaflet map on the detail page until it scrolls into view.

## P1 — Migrate every image to next/image
```
Audit all raw <img> tags across app/ and components/ and convert to next/image: width/height or fill with a sized parent, responsive sizes, priority only on the hero/above-the-fold image, lazy-load the rest, blur placeholder where possible. Confirm unsplash + Supabase storage hostnames in next.config remotePatterns. Same visual layout. npm run build, verify no layout shift / warnings.
```
## P2 — Trim client components to server-first
```
Review every "use client" file. Move stateless/effectless components back to server (PropertyCard, PageHero, Footer, static home sections); split tiny interactive bits (favorite button) into small client children. No behavior/design change. npm run build, confirm home/catalog JS shrinks.
```
## P3 — Code-split heavy client widgets
```
Use next/dynamic to lazy-load below-the-fold/optional widgets (Cursor, MortgageCalculator, testimonials carousel, map). Disable SSR where right, show a light skeleton, keep reduced-motion handling. npm run build, report bundle change.
```
## P4 — Caching / ISR for property data
```
Add ISR (revalidate ~300s) for property reads, generateStaticParams for detail pages, and revalidate affected paths on lead writes / admin mutations. Keep static fallback. npm run build, confirm detail pages are static.
```
## P5 — SEO: structured data + sitemap + robots + social images
```
app/sitemap.ts (all pages + property URLs), app/robots.ts, JSON-LD (schema.org RealEstateListing/Residence) on detail pages, per-page generateMetadata + Open Graph/Twitter, dynamic opengraph-image for property pages. npm run build.
```
## F1 — Interactive map view (Leaflet + OSM, no paid key)
```
Add lat/lng to Property (real Armenian coords). Leaflet + OpenStreetMap via next/dynamic (client-only). Catalog List/Map toggle with green pins + popup cards synced to filters; small map on detail page. Dark-mode aware. npm run build.
```
## F2 — Detail-page upgrades
```
Fullscreen image lightbox (keyboard + swipe), "Similar properties" (same listingType, nearby price/location) reusing PropertyCard, share button (Web Share + copy-link fallback), breadcrumbs. Accessible + dark-mode aware. npm run build.
```
## F3 — Stronger catalog filters + pagination
```
Dual-handle price range slider, area (m²) filter, keep type/beds/search/sort. Reflect filters in URL query (shareable, survives refresh). Pagination or infinite scroll + result count + empty state. Memoize filtering. npm run build.
```
## F4 — Recently viewed + compare
```
"Recently viewed" rail (last few ids in localStorage) on catalog + detail; "Compare" 2–3 properties side-by-side specs. Client-light + dark-mode aware. npm run build.
```
## P6 — Final performance verification
```
Add @next/bundle-analyzer (dev), report largest bundles, fix obvious wins (unused imports, oversized client components, eager GSAP imports). Confirm images optimized, no layout shift, next/font display swap, reduced-motion respected. List before/after sizes + changes.
```
