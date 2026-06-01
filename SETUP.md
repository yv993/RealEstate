# EverGreen — Setup & Deploy Guide

Written for someone who has **never coded**. Follow the parts in order. You can stop
after Part A and still have a fully working, animated website — the database and
deploy steps are optional upgrades.

---

## Part A — Run the site on your computer (no account needed)

1. Open a terminal in the `realest` folder.
2. Type `npm install` and press Enter. *(Downloads the building blocks. One-time.)*
3. Type `npm run dev` and press Enter.
4. Open **http://localhost:3000** in your browser.

You'll see all the pages working, with animations and the light/dark toggle (top-right
sun/moon button). The contact form and "Sign Up" show success messages but don't save
anywhere yet — that's Part B.

> **What works without a database:** every page, all 9 property listings, detail pages,
> filters/search, dark mode, and animations. The data comes from a built-in list, so
> nothing looks empty.

---

## Part B — Turn on the database (Supabase) — optional

This makes the contact form save real leads, lets you log into an admin area, and lets
you manage listings. It's free to start.

### B1. Create a Supabase project
1. Go to **https://supabase.com** → sign up → **New project**.
2. Give it a name and a database password (save the password somewhere safe).
3. Wait ~2 minutes for it to finish setting up.

### B2. Get your keys
1. In your project, click **Settings (gear) → API**.
2. You'll see three things you need:
   - **Project URL** — the web address of your database.
   - **anon public** key — safe to use in the browser (for reading + login).
   - **service_role** key — *secret*, used only on the server to save leads. Never share it.

### B3. Add the keys to the project
1. In the `realest` folder, find the file `.env.local.example`.
2. Make a copy of it named exactly **`.env.local`**.
3. Open `.env.local` and paste your values in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=   ← your Project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=   ← your anon public key
   SUPABASE_SERVICE_ROLE_KEY=   ← your service_role key
   ```
4. Save the file. **Never share or upload `.env.local`** — it holds your secret key.

### B4. Create the tables
1. In Supabase, click **SQL Editor → New query**.
2. Open the file `supabase/schema.sql` from this project, copy everything, paste it in,
   and click **Run**. *(This creates the `properties` and `leads` tables, the security
   rules, and the image storage bucket. Comments in the file explain each part.)*
3. Open `supabase/seed.sql`, copy/paste/**Run** it the same way. *(This fills the
   database with the current 9 listings so the site isn't empty.)*

### B5. Create your admin login
1. In Supabase, click **Authentication → Users → Add user → Create new user**.
2. Enter your email and a password, and tick **Auto Confirm User**.
3. That email + password is now your login for the admin area.

### B6. Try it
1. Stop the dev server (Ctrl+C in the terminal) and run `npm run dev` again so it picks
   up the new keys.
2. Go to **http://localhost:3000/admin/login**, sign in, and you'll see:
   - **Leads** — every contact-form / viewing request that comes in.
   - **Listings** — add, edit, delete properties, and upload photos.
3. Submit the contact form on the public site, then refresh the admin Leads page — your
   message should appear.

---

## Part C — Put it on the internet (Vercel) — optional

### C1. Put the code on GitHub
1. Make a free account at **https://github.com**.
2. Create a **New repository** (e.g. `evergreen`), keep it private if you like.
3. Follow GitHub's "push an existing folder" instructions, OR use the GitHub Desktop app
   (easier with no coding): open the `realest` folder, commit, and publish.
   *(The `.gitignore` already keeps your secret `.env.local` out of GitHub.)*

### C2. Import into Vercel
1. Make a free account at **https://vercel.com** and click **Add New → Project**.
2. Choose **Import** next to your `evergreen` GitHub repo.
3. Vercel auto-detects Next.js — you don't need to change build settings.

### C3. Add your keys to Vercel
1. On the import screen (or later under **Settings → Environment Variables**), add the
   same three keys from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Click **Deploy**. After ~1–2 minutes you'll get a live web address (e.g.
   `evergreen.vercel.app`).

### C4. Confirm it works
1. Open your live address — the site should look exactly like local.
2. Submit the contact form, then check **/admin** on the live site to see the lead.

> Every time you push changes to GitHub, Vercel rebuilds and updates the live site
> automatically.

---

## Where things live (quick map)
- `app/` — the pages. `components/` — reusable UI. `lib/` — data + Supabase helpers.
- `supabase/schema.sql` + `seed.sql` — your database setup.
- `design.md` / `project_specs.md` — the blueprints. `ROADMAP.md` — the build plan.
- `.env.local` — your secret keys (never shared).

---

# Part D — Going fully live (database, email, monitoring)

The code is deployed, but a few switches only **you** can flip (they need your own
accounts). Do them in this order. After each, the site gets more "real."

## D0. The one-glance health check
Once deployed, open **`https://YOUR-DOMAIN/api/health`** any time. It tells you the truth:
- `"source":"static"` → still on the built-in demo data (leads are only logged, not saved).
- `"source":"database"` → connected to your real Supabase (leads persist, admin works).

## D1. Add environment variables in Vercel
Vercel → your project → **Settings → Environment Variables**. Add these (the file
`.env.local.example` lists them too). After adding, **Redeploy** so they take effect.

| Variable | Where to find it | Powers |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → **Project URL** | database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same page → **anon public** | reads + admin login |
| `SUPABASE_SERVICE_ROLE_KEY` | same page → **service_role** (secret!) | saving leads, admin writes |
| `NEXT_PUBLIC_SITE_URL` | your live domain, e.g. `https://real-estate.vercel.app` | SEO, sitemap, share cards |
| `RESEND_API_KEY` | resend.com → **API Keys** (optional) | lead/newsletter emails |
| `AGENCY_EMAIL` | your inbox, e.g. `you@gmail.com` | where lead alerts go |
| `SENTRY_DSN` | sentry.io → Project → **Client Keys (DSN)** (optional) | error alerts |

## D2. Turn the database on (Supabase)
1. supabase.com → **New project** (save the DB password).
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**. This makes the
   `properties`, `leads`, and `subscribers` tables, the security rules (public can read only
   published listings; only logged-in staff can edit; leads save server-side only), and the
   `property-images` storage bucket.
3. New query → paste `supabase/seed.sql` → **Run** (fills in the 20 demo listings so nothing
   looks empty).
4. **Authentication → Users → Add user** → your email + password, tick **Auto Confirm**. That's
   your login for `/admin`.
5. Make sure the three Supabase vars from D1 are in Vercel, then **Redeploy**.
6. Check `/api/health` → it should now say `"source":"database"`. Log into `/admin`, edit a
   listing, and watch the public page update.

## D3. Make leads reach your inbox (Resend — optional but recommended)
1. resend.com → sign up → **API Keys → Create**. Copy the key.
2. Add `RESEND_API_KEY` and `AGENCY_EMAIL` in Vercel → Redeploy.
3. Submit the contact form on your live site — you get an email, and the visitor gets an
   auto-reply. (Without the key, leads still save; emails are just skipped.)
4. To send from your own domain later: Resend → **Domains** → verify `evergreen.am`, then set
   `EMAIL_FROM` to e.g. `EverGreen <hello@evergreen.am>`.

## D4. Analytics & error alerts (optional)
- **Vercel Analytics + Speed Insights**: no keys — open the **Analytics** and **Speed Insights**
  tabs in your Vercel project and click **Enable**. Traffic + Core Web Vitals start flowing.
- **Sentry**: add `SENTRY_DSN` in Vercel for runtime error alerts. Skipped entirely if unset.
