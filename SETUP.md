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
