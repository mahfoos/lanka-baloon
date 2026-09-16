# Sri Lanka Balloon

Monorepo for **Lanka Ballooning (Pvt) Ltd** — the public website and the internal
operations platform behind [srilankaballoon.com](https://www.srilankaballoon.com).

```
apps/
  landing/    @lanka-baloon/landing   public website        Next 15 · Tailwind v4 · :3000
  admin/      @lanka-baloon/admin     ERP + back office     Next 14 · Tailwind v3 · :3001
packages/     shared code (empty for now — see packages/README.md)
```

Two apps rather than one because they answer to different people: the website is a
public, SEO-sensitive marketing site that must stay fast and anonymous, while the
ERP is a role-gated internal tool. Separate apps let them deploy, scale and fail
independently — a broken admin build can't take the website down.

## Quick start

```bash
npm install          # one hoisted install for the whole workspace

npm run dev:landing  # http://localhost:3000
npm run dev:admin    # http://localhost:3001
```

The ports differ so both can run at once, in two terminals. `npm run dev` is a
shorthand for the landing site.

Each app reads its own `.env.local`; copy the `.env.example` next to it and fill in
the values. Both apps start without any env vars — the website's forms and the
ERP's Website Bookings module show a "not connected yet" notice instead.

## Workspace commands

| Command | Does |
| ------- | ---- |
| `npm run dev:landing` / `dev:admin` | Dev server for one app |
| `npm run build` | Production build of both apps |
| `npm run typecheck` | `tsc --noEmit` across both apps |
| `npm run lint` | `next lint` across both apps |
| `npm install <pkg> -w @lanka-baloon/admin` | Add a dependency to one app |

Anything scoped to a single app also works from inside its directory
(`cd apps/admin && npm run dev`).

## How the two apps meet

They share one Supabase project and nothing else — no shared code, no shared
runtime, no network calls between them.

```
visitor ──▶ apps/landing ──insert as `anon`──▶ Supabase ◀──service role── apps/admin ◀── staff
                                              bookings
                                              contact_messages
```

- **The website only writes.** It connects with the `anon` key, and Row Level
  Security permits `insert` and nothing else, so a reservation can never be read
  back from the browser.
- **The ERP reads and updates.** It connects with the service-role key, which
  bypasses RLS entirely — so access is decided by the ERP's own permission matrix
  (`canViewBookings` / `canManageBookings` in `apps/admin/lib/roles.ts`), enforced
  in both the page and its server actions.

The schema lives at `apps/admin/supabase/migrations/0001_init.sql`; run it in the
Supabase SQL editor. The ERP owns it because the ERP is where the data is worked.

> `SUPABASE_SERVICE_ROLE_KEY` bypasses every access rule in the database. Keep it
> out of `NEXT_PUBLIC_*`, and import `apps/admin/lib/website-db.ts` only from
> server components and server actions.

## Dependency versions

The two apps are intentionally not on matching versions — the website is Next 15 /
React 19 / Tailwind v4, the ERP is Next 14 / React 18 / Tailwind v3. npm hoists
what it can and nests the rest, so both work from a single install. Upgrade the ERP
when there's a reason to, not for symmetry.

## Deploying

Two separate deployments from this one repo. On Vercel, create a project per app
and set its **Root Directory** to `apps/landing` or `apps/admin`; both detect
Next.js and build on their own. Put the admin app on a subdomain
(`admin.srilankaballoon.com`) and give it the service-role key; give the public
site only the anon key.

## Per-app docs

- [apps/landing/README.md](apps/landing/README.md) — pages, WordPress redirects, photo pipeline, design system
- [apps/admin/README.md](apps/admin/README.md) — modules, roles, demo accounts, project layout
