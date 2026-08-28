# Snap Shield — Admin Dashboard Setup

The admin dashboard lets your team log in and manage the shop (products, prices,
finishes, images, badges, best-sellers). It lives at **`/admin`**.

Until it's configured, the site keeps working and shows the built-in catalogue —
so nothing breaks while you set this up.

---

## 1. Set a team password

Every worker logs in with one shared password. Add these to your environment
(`.env.local` for local dev, and your Vercel project's Environment Variables for
production):

```
ADMIN_PASSWORD=choose-a-strong-shared-password
ADMIN_SESSION_SECRET=any-long-random-string
```

- `ADMIN_PASSWORD` — what the team types on the login screen.
- `ADMIN_SESSION_SECRET` — signs the login cookie. Any long random string.

That's enough to log in. To **save** edits, connect Supabase next.

---

## 2. Connect Supabase (database + image storage)

1. Create a free project at <https://supabase.com>.
2. In the dashboard: **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and **Run**. This creates the
   `products` table and the public `product-images` storage bucket.
3. In **Project Settings → API**, copy these three values into your environment:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
```

> ⚠️ The **service-role key** is a secret. It's only ever used on the server
> (never shipped to the browser). Never commit it or expose it publicly.

Restart the dev server (or redeploy) after adding env vars.

---

## 3. Seed your catalogue

On the **Overview** page, the setup checklist shows a **Seed now** button once
Supabase is connected. Click it to load the current 40+ finishes into the
database. (Safe to run again — it updates existing products in place.)

You can also `POST /api/admin/seed` directly.

---

## What each key does

| Variable | Required for | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | Login | Shared team password |
| `ADMIN_SESSION_SECRET` | Login | Signs the session cookie |
| `NEXT_PUBLIC_SUPABASE_URL` | Saving edits | Public project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public reads | Safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin writes / uploads | **Server-only secret** |

---

## How it works

- The storefront reads products from Supabase when configured, and falls back to
  the built-in static catalogue otherwise — so the site always renders.
- All writes (create / edit / delete / image upload) go through server routes
  under `/api/admin/*`, protected by the login cookie via `middleware.ts`.
- Product images uploaded from the dashboard are stored in the Supabase
  `product-images` bucket and served from its public URL.

## Security notes

- `/admin` and `/api/admin/*` are gated by middleware; unauthenticated requests
  are redirected to the login page (or get a 401 for APIs).
- The login cookie is httpOnly, `SameSite=Lax`, and expires after 12 hours.
- Rotate `ADMIN_PASSWORD` any time by changing the env var and redeploying.
