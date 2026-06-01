Development Rules
Rule 1: Always read first Before taking any action, always read:

CLAUDE.md
project_specs.md
design.md
If any of these files don't exist, create it before doing anything else.

Rule 2: Define before you build Before writing any code:

Create or update project_specs.md and define:
What the app does and who uses it
Tech stack (framework, database, auth, hosting)
Pages and user flows (public vs authenticated)
Data models and where data is stored (properties, leads, users)
Third-party services being used (Supabase, etc.)
What "done" looks like for this task
Show the file
Wait for approval
No code should be written before this file is approved.

Rule 3: Look before you create Always look at existing files before creating new ones. Don't start building until you understand what's being asked. If anything is unclear, ask before starting.

Rule 4: Test before you respond After making any code changes, run the relevant tests or start the dev server to check for errors before responding. Never say "done" if the code is untested.

Core Rule Do exactly what is asked. Nothing more, nothing less. If something is unclear, ask before starting.

Design tools
- design.md is the source of truth for the EverGreen look — its green/bronze accent, light + dark palette, spacing, and type. Always follow it for colors, typography, and layout, and never override its brand colors.
- ui-ux-pro-max skill: use it to choose refined color palettes, font pairings, spacing, and UX patterns — but keep every choice inside the EverGreen direction set by design.md.
- frontend-design skill: use it for polish and distinctive, non-generic detailing (states, micro-interactions, layout finesse). It may refine how things look and feel, but must never change design.md's brand colors.

How to Respond
Always explain like you're talking to a 15 year old with no coding background.

For every response, include:

What I just did — plain English, no jargon
What you need to do — step by step, assume they've never seen this before
Why — one sentence explaining what it does or why it matters
Next step — one clear action
Errors — if something went wrong, explain it simply and say exactly how to fix it
When a task involves external tools or technical elements that a non-coder wouldn't know (Supabase, Vercel, localhost:3000, etc.):

Walk through exactly where to find what they need (e.g. "go to your Supabase dashboard → Settings → API")
Describe what each key or setting does in one plain sentence
If there's SQL to run, explain what it's doing before they run it
If there's a bucket, folder, or config to create manually, explain what it is and why it exists
Be as concise as possible. Do not ramble. Less is more
Tech Stack
Language: TypeScript
Framework: Next.js@latest (App Router). The website must be built in Next.js — do not build a static HTML site unless explicitly asked.
Backend-as-a-Service: Supabase (Auth, Postgres, Storage, RLS)
Deployment: Vercel
Styling: Tailwind CSS
Key libraries: @supabase/supabase-js, @supabase/ssr
Running the Project
Ensure .env.local has all necessary keys
Install dependencies: npm install
Run: npm run dev
Open your browser at http://localhost:3000
File Structure
/app → All the pages visitors see (home, property catalog, property detail, contact)
/app/api/ → The behind-the-scenes code that handles data (saving leads, fetching listings)
/app/(admin)/ → Pages only the agency can see (dashboard, manage listings, view leads)
/app/properties/ → The catalog page that lists all properties with filters
/app/properties/[id]/ → The detail page for a single property
/components/ → Reusable building blocks (property card, filter bar, buttons, forms)
/lib/ → Shared helper code used throughout the app
/lib/supabase/ → The code that connects the app to your Supabase database
/supabase/ → The SQL that sets up your database tables
/public/ → Images and other static files
.env.local → Your secret keys — never share or commit this to GitHub
project_specs.md → The blueprint Claude reads before doing anything
design.md → The visual design spec Claude follows for all UI
Code organisation rules:

Keep API routes thin — call a service or lib function, don't put business logic in the route handler
One component per file; co-locate page-specific components with the page
Supabase server client (SSR) for server components and API routes; browser client only in client components
Don't create new top-level folders without asking first
How the App Is Built
Think of the app like a series of requests and responses:

A user visits a page or submits the contact form — that's the input
A route or server action receives the request and calls the right service
The service does one job and returns a result (e.g. fetch listings, save a lead)
The route sends the result back to the user — that's the output
If something fails, show a clear error — don't silently break
How to Write Code
Write simple, readable code — clarity matters more than cleverness
Make one change at a time
Don't change code that isn't related to the current task
Don't over-engineer — build exactly what's needed, nothing more
Add a console.log at the start and end of each API route so it's easy to follow what's happening
If a big structural change is needed, explain why before making it.

Supabase Rules
Always use RLS — never disable it
Server-side Supabase client for all sensitive operations (API routes, server components)
Public visitors can READ published listings, but never write — lead submissions go through an API route
Only authenticated agency/admin users can create, edit, or delete listings
Store property photos in Supabase Storage; a public bucket is fine for listing images, but keep any private documents in a non-public bucket with signed URLs
Never expose the service_role key in client-side code
Secrets & Safety
Never put API keys or passwords directly in the code
Never commit .env.local to GitHub
Never expose Supabase service_role key in frontend code
Ask before deleting or renaming any important files
Testing
Before marking any task as done:

Run npm run build and fix any TypeScript or build errors
Start the dev server with npm run dev and check for runtime errors in the console
Manually verify the feature works end-to-end in the browser
Check that existing features weren't broken by the change
When building a new page or API route:

Test the happy path (everything works as expected)
Test the error path (what happens if something goes wrong)
Check that auth is working — logged-in (agency) vs logged-out (visitor) behaviour
Confirm Supabase RLS is doing what it should (visitors can't edit listings; leads save correctly)
Never say "done" if:

The build is failing
There are console errors
The feature hasn't been tested in the browser
Scope
Only build what is described in project_specs.md. If anything is unclear, ask before starting.