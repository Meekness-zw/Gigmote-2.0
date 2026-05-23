# Gigmote — Vercel deployment

Production-deploy guide. Reflects the current state of the codebase (Prisma + Auth.js trusted-device + Brevo SMTP + Vercel Blob + security headers + rate limiting).

---

## TL;DR — Vercel env vars

Paste these into **Project → Settings → Environment Variables** on Vercel.
Mark every variable as **Production** (and optionally Preview/Development too — see notes below).

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | `postgres://USER:PASS@HOST:5432/DBNAME?sslmode=require` | From your Postgres provider (Neon / Supabase / Vercel Postgres). |
| `AUTH_SECRET` | `1tWga4/PvuZvICSKKFYUKshWEbGUetTYvncgKCVuJuM=` | Fresh secret I generated for you. Or run `openssl rand -base64 32`. |
| `AUTH_TRUST_HOST` | `true` | Required when running on Vercel. |
| `ADMIN_EMAILS` | `meeknesskaboti@gmail.com,zen@gigmote.com,michaelmudau@gmail.com,shonge@gigmote.com` | Only these can sign in. |
| `NEXT_PUBLIC_SITE_URL` | `https://gigmote.com` | Or `https://your-project.vercel.app` until you add a custom domain. |
| `SMTP_HOST` | `smtp-relay.brevo.com` | Brevo. |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | *see `.env.local`* | Your Brevo SMTP user. |
| `SMTP_PASS` | *see `.env.local`* | Brevo SMTP key. **Rotate** the key before pasting into Vercel if it was ever exposed. |
| `SMTP_FROM_EMAIL` | `zen@gigmote.com` | Verified sender on Brevo. |
| `CONTACT_TO_EMAIL` | `zen@gigmote.com` | Where contact/application notifications get sent. |
| `BLOB_READ_WRITE_TOKEN` | *see `.env.local`* | Vercel Blob read/write token. **Rotate** before pasting if ever exposed. |

That's it — **13 variables**. Once they're set and the build succeeds, the site is fully operational.

---

## Step-by-step

### 1. Rotate the secrets that were ever in `.env` (if they were pushed to git)

Open Brevo → SMTP & API → rotate the SMTP password. Get the new value.
Open Vercel → Storage → Blob → rotate the read/write token. Get the new value.

Paste both new values into Vercel env vars below. If you never pushed `.env` to GitHub, skip this step.

### 2. Push the repo to GitHub

```bash
cd /Users/cpu1/Desktop/gigmote
git init -b main
git add -A
git commit -m "Initial commit — Gigmote redesign"

# Create the repo + push (using gh CLI):
gh repo create gigmote --private --source=. --remote=origin --push

# Or manually:
git remote add origin git@github.com:<you>/gigmote.git
git push -u origin main
```

`.env.local` is gitignored — your secrets stay local. Only `.env` (dev defaults, no secrets) is committed.

### 3. Provision Postgres

Two solid options on Vercel:

**Neon Postgres** (recommended — generous free tier, autoscaling):
1. Vercel → Storage → Create Database → **Neon Postgres**
2. Pick the closest region to your users
3. Vercel auto-creates the env vars `DATABASE_URL`, `POSTGRES_PRISMA_URL`, etc.
4. **You'll override `DATABASE_URL`** below to use the pooled connection string. Use the value labeled "DATABASE_URL" (it's the pooled one ending in `?pgbouncer=true&...`).

**Supabase Postgres** (alternative):
1. Vercel Marketplace → Supabase → Create
2. Find the connection string under Project Settings → Database → Connection String → URI (pooled, port 6543)

Either way, you'll end up with one `postgres://...` URL.

### 4. Provision Vercel Blob (if you haven't already)

You already have it. If you ever start fresh:

1. Vercel → Storage → Create Database → **Blob**
2. Note: there are two access modes — **Public** and **Private**. You're using **Private** (matches our SSRF-guarded resume-proxy route).
3. Copy the `BLOB_READ_WRITE_TOKEN` value.

### 5. Import the repo into Vercel

1. Vercel dashboard → Add New → Project
2. Import the GitHub repo
3. Framework Preset: **Next.js** (auto-detected)
4. Build & Output settings: leave default — `vercel.json` overrides `buildCommand` to `npm run vercel-build`, which:
   - Switches Prisma schema to Postgres
   - Generates the client
   - Runs `prisma db push` against your prod DB (creates all tables on first deploy)
   - Builds Next

   You don't have to set anything in the UI — the override is in source.

### 6. Add the 13 env vars

Vercel → Project → Settings → Environment Variables → paste each from the table at the top. Mark each for **Production** at minimum.

If you also want Preview deploys (per-PR URLs) to work, mark Preview too — but use a separate `DATABASE_URL` for preview so PR runs don't pollute prod data.

### 7. Deploy

After the env vars are saved, trigger a fresh deploy: Vercel → Deployments → "Redeploy" the latest commit (or push any commit). The build will:

1. Install deps
2. Run `vercel-build` which copies the Postgres schema over, pushes it to your DB
3. Build Next
4. Deploy

First-build logs to watch for:
- `Your database is now in sync with your Prisma schema.` ← Prisma db push worked
- `✓ Compiled successfully` ← Next built

### 8. Seed the jobs (one-time)

The seed isn't run automatically (it would duplicate jobs on every deploy). Run it once after the first successful deploy:

```bash
# From your local machine
vercel env pull .env.production.local  # pulls all prod env vars locally
npx prisma db seed
```

Or via the Vercel CLI:
```bash
vercel exec -- npx prisma db seed
```

The seed will upsert the 4 real roles. Idempotent — safe to run again.

### 9. Sign in to the admin panel

Visit `https://your-project.vercel.app/admin/login`. Enter your email (must be one of the 4 in `ADMIN_EMAILS`). Click Continue → magic-link arrives via Brevo → click the link → you're in.

That browser is now trusted for 365 days. Subsequent sign-ins on the same browser skip the email step.

### 10. Custom domain

Vercel → Project → Settings → Domains → Add Domain → `gigmote.com`. Add the suggested A/CNAME records at your registrar. Add `www.gigmote.com` as a redirect-to-apex. Once DNS propagates:

1. Update `NEXT_PUBLIC_SITE_URL` env var to `https://gigmote.com`
2. Redeploy so the sitemap + OG images use the right host
3. Update `SMTP_FROM_EMAIL` if you want emails to come from `@gigmote.com` (and verify the sender on Brevo)

---

## What each env var actually does

**`DATABASE_URL`** — Postgres connection string. Prisma reads this to find the DB. The Vercel build runs `prisma db push` against it to sync the schema.

**`AUTH_SECRET`** — Signs JWT session tokens (Auth.js) AND signs the HMAC trust cookie that lets a browser skip the magic link on repeat visits. Rotating it forcibly signs out every trusted device — useful if a laptop is lost.

**`AUTH_TRUST_HOST`** — Tells Auth.js to trust the X-Forwarded-Host header (Vercel sets it via its edge proxy). Required for any non-localhost deployment.

**`ADMIN_EMAILS`** — Comma-separated allowlist. No one outside this list can sign in, regardless of how they try.

**`NEXT_PUBLIC_SITE_URL`** — Public site URL. Embedded in sitemap.xml, robots.txt, and the OG card metadata. The `NEXT_PUBLIC_` prefix means it's shipped to the client — that's fine, it's already a public value.

**`SMTP_*`** — Brevo credentials for outbound transactional email. Powers three flows:
1. Magic-link admin sign-in (Auth.js Nodemailer provider)
2. Contact form notifications (admin gets the email)
3. Application notifications (admin gets the email with resume link)

If you ever change SMTP providers, only these 5 vars change — code stays the same.

**`SMTP_FROM_EMAIL`** — The "From" address on outbound mail. Must be a verified sender on your Brevo account.

**`CONTACT_TO_EMAIL`** — Where contact/application notifications get delivered.

**`BLOB_READ_WRITE_TOKEN`** — Read/write access to the Vercel Blob store. Used for:
1. Resume uploads from the application form (private store)
2. Admin-only proxy route to stream resumes back to admins

---

## Optional env vars (defaults are fine)

| Variable | Default | Purpose |
|---|---|---|
| `NODE_ENV` | `production` (set by Vercel) | Disables the dev-signin escape hatch. |
| `SMTP_FROM` | falls back from `SMTP_FROM_EMAIL` | Older alias — only set this if you can't change the new one. |
| `CONTACT_NOTIFY_TO` | falls back from `CONTACT_TO_EMAIL` | Older alias. |
| `NEXT_PUBLIC_SMOOTH_SCROLL` | `0` (off) | Set to `1` to enable Lenis smooth scroll in production. Off by default for perf. |

---

## Local development

Locally you keep using SQLite (no Postgres setup needed):

```bash
npm install
npm run db:sqlite  # ensures schema.prisma is the SQLite variant
npx prisma db push
npx prisma db seed
npm run dev
```

Your `.env.local` carries the real SMTP + Blob credentials so even dev sees production-style email + storage.

To switch your local back to Postgres temporarily:
```bash
npm run db:postgres
```

---

## Verifying the deploy

After `https://your-project.vercel.app` is live, run:

```bash
ROUTES=(
  "/" "/about" "/company" "/solutions" "/services" "/services/global-staffing"
  "/industries" "/industries/healthcare" "/case-studies"
  "/case-studies/accounting-financial-operations-optimization"
  "/pricing" "/contact" "/careers" "/jobs" "/jobs/senior-frontend-engineer"
  "/how-it-works" "/hire-a-dev" "/resources" "/join-gigmote"
  "/sitemap.xml" "/robots.txt"
  "/admin/login"
  "/opengraph-image"
)
for r in "${ROUTES[@]}"; do
  printf "  %-60s " "$r"
  curl -s -o /dev/null -w "%{http_code}\n" "https://your-project.vercel.app$r"
done
```

Expect all 200s. Then sign in at `/admin/login` and verify you can:
- Add a job (`/admin/jobs/new`)
- See it on the public `/jobs` page
- Submit a test application at `/join-gigmote`
- See the application in `/admin/applications`
- Delete the test job (which cascade-deletes the test application)

---

## Future maintenance

- **Schema changes**: edit `prisma/schema.sqlite.prisma` AND `prisma/schema.postgres.prisma` (they're identical except for the `provider` line). Locally test with SQLite, then push — the build will db-push the Postgres version. Eventually you'll want real migrations: `npx prisma migrate dev --name <change>` against a Postgres dev DB, commit the migration files, switch vercel-build from `db push` to `migrate deploy`.
- **Rotating the magic-link signing secret**: change `AUTH_SECRET` on Vercel + redeploy. Every "trusted device" cookie is invalidated, so every admin has to re-do the magic link on next sign-in.
- **Adding/removing an admin**: edit `ADMIN_EMAILS` on Vercel + redeploy.
- **Rotating SMTP password**: change in Brevo → update `SMTP_PASS` on Vercel + redeploy.

---

## Troubleshooting

**Build fails with "Cannot resolve `@vercel/turbopack-next/internal/font/google/font`"**
We don't use `next/font/google` (a known Next 16 + Turbopack bug). Fonts come from the Google Fonts CDN via a `<link>` tag in `src/app/layout.tsx`. If this error appears, something pulled `next/font/google` back into the tree — search for `from "next/font/google"` and remove.

**Magic-link emails don't arrive**
Check the Brevo dashboard → Logs. Common causes:
- The sender `SMTP_FROM_EMAIL` isn't a verified sender on Brevo
- The recipient blocked emails from Brevo
- DKIM/SPF not set up on your domain (`gigmote.com`)

**`/admin/*` returns 500 in production**
Almost always means `DATABASE_URL` isn't set or unreachable. Check Vercel → Logs → look for "Can't reach database server".

**Resume upload returns 503**
`BLOB_READ_WRITE_TOKEN` isn't set on Vercel.

**Trusted-device sign-in always fails after a deploy**
You rotated `AUTH_SECRET` — that's by design. Every previously trusted browser must redo the magic link.
