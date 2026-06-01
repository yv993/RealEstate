# EverGreen — Project Specs (project_specs.md)

The blueprint Claude reads before building. Defines *what* we're building and *what
"done" means*, so code stays in scope. Pairs with `design.md` (how it looks) and
`CLAUDE.md` (how we work).

---

## 1. What the app does

EverGreen is the website for a **boutique real-estate agency**. Visitors browse a
small, curated set of premium property listings, view full details, and reach out
(contact form / "request a viewing"). The agency manages listings and reads incoming
enquiries through a private admin area.

The feeling is **quiet luxury** — calm, premium, uncluttered (see `design.md`).

## 2. Who uses it

- **Public visitor** (not logged in) — browses listings, filters/searches, opens a
  property detail page, submits the contact form or a viewing request, signs up for an
  account. Read-only on data; can only *create* leads (via a server route).
- **Agency admin** (logged in) — creates / edits / deletes listings, uploads photos,
  and reads all incoming leads. Full write access, gated by auth.

## 3. Tech stack

| Layer        | Choice                                              |
| ------------ | --------------------------------------------------- |
| Language     | TypeScript                                          |
| Framework    | Next.js (App Router)                                |
| Styling      | Tailwind CSS + CSS design tokens (`app/globals.css`)|
| Animation    | GSAP (+ ScrollTrigger) via `components/motion/`     |
| Icons / Fonts| `lucide-react`; Manrope + Playfair via `next/font`  |
| Backend      | Supabase — Postgres, Auth, Storage, RLS *(planned)* |
| Hosting      | Vercel *(planned)*                                  |

## 4. Pages & user flows

**Public (built):**
- `/` Home — hero + search, value section, stats, animated map band, premier houses,
  FAQ, testimonials carousel, CTA.
- `/about` About — story, principles, stats band, team.
- `/properties` Property List — filter/sort bar + animated results grid + load more.
- `/properties/[id]` Property Detail — gallery, full stats, description, features,
  "request a viewing". *(planned — roadmap ②)*
- `/contact` Contact — info cards + validated message form.
- `/signup` Sign Up — account creation form (currently UI only).

**Agency admin (planned — roadmap ⑨), under `app/(admin)`:**
- `/admin/login` — Supabase email + password auth.
- `/admin` dashboard — list all incoming leads.
- `/admin/listings` — create / edit / delete properties, upload images to Storage.
- All admin routes protected; logged-out users are redirected.

**Flows:** visitor browses → filters → opens detail → submits lead → sees success.
Admin logs in → reviews leads → manages listings.

## 5. Data models & where data lives

Currently listings come from a hardcoded array in `lib/data.ts`. The plan is to move
**properties** and **leads** into Supabase Postgres (roadmap ⑥–⑧); static marketing
content (stats, FAQs, testimonials) stays in `lib/data.ts`.

- **properties** — `id`, `title`, `location`, `price`, `type`, `beds`, `baths`,
  `area`, `badge`, `img`, `description`, `gallery` (jsonb), `features` (jsonb),
  `yearBuilt`, `garage`, `published` (bool), `created_at`.
- **leads** — `id`, `name`, `email`, `phone`, `message`, `property_id` (nullable),
  `created_at`.
- **users** — agency staff, managed by **Supabase Auth** (no custom table needed
  initially).

**Security (RLS, when DB lands):** public can `SELECT` only `published` properties;
only authenticated users can `INSERT/UPDATE/DELETE` properties; leads are inserted
**server-side only** (via an API route using the server client). Never expose the
`service_role` key to the browser.

## 6. Third-party services

- **Supabase** — database, auth, file storage, row-level security *(planned)*.
- **Vercel** — hosting / deploy *(planned)*.
- **Unsplash** — listing/demo imagery (already whitelisted in `next.config.mjs`).
- **simpleicons CDN** — brand/social icons.

## 7. Current status

Built and verified (light mode): all 5 public pages, the full design system, shared
components, and the GSAP motion layer. `npm run build` passes with no TypeScript
errors. **Not yet built:** property detail page, working DB, real lead capture, auth,
admin area, dark mode, deploy — these are the roadmap phases below.

## 8. What "done" looks like

A phase is "done" only when (per `CLAUDE.md` testing rules):
- `npm run build` passes with **no TypeScript errors or warnings**.
- `npm run dev` runs with **no console errors**.
- The feature is **manually verified in the browser**, happy path *and* error path.
- Auth behaves correctly (visitor vs agency) and Supabase RLS holds — visitors can't
  edit listings; leads save correctly — once the backend exists.
- Existing features still work and the UI matches `design.md` (eventually in both
  light and dark mode).

**Build order:** follow `ROADMAP.md` phases ①→⑪ — one at a time, tested in the browser
before moving on.
