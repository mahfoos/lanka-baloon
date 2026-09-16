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
pnpm install          # one install for the whole workspace

pnpm dev:landing      # http://localhost:3000
pnpm dev:admin        # http://localhost:3001
```

**This workspace uses pnpm, not npm** — see [Why pnpm](#why-pnpm) below; `npm
install` here will reintroduce a build failure. If you don't have it:
`brew install pnpm`, or `corepack enable && corepack prepare pnpm@10.26.2 --activate`.

The ports differ so both can run at once, in two terminals. `pnpm dev` is a
shorthand for the landing site.

Each app reads its own `.env.local`; copy the `.env.example` next to it and fill in
the values. Both apps start without any env vars — the website's forms and the
ERP's Website Bookings module show a "not connected yet" notice instead.

## Workspace commands

| Command | Does |
| ------- | ---- |
| `pnpm dev:landing` / `dev:admin` | Dev server for one app |
| `pnpm build` | Production build of both apps |
| `pnpm typecheck` | `tsc --noEmit` across both apps |
| `pnpm lint` | `next lint` across both apps |
| `pnpm add <pkg> --filter @lanka-baloon/admin` | Add a dependency to one app |

Anything scoped to a single app also works from inside its directory
(`cd apps/admin && pnpm dev`).

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

## Why pnpm

The two apps are deliberately not on matching versions — the website is Next 15 /
React 19 / Tailwind v4, the ERP is Next 14 / React 18 / Tailwind v3. Upgrade the
ERP when there's a reason to, not for symmetry.

Two React majors in one workspace is what forces pnpm. npm keeps a single flat
`node_modules`, so a package like `styled-jsx` — which Next depends on and which
calls React hooks — gets hoisted once and resolves whichever React happens to sit
at the root. For the app on the *other* React, that means two React instances in
one render, a null dispatcher, and a build that dies with
`Cannot read properties of null (reading 'useContext')` while prerendering.

pnpm links each workspace's dependencies in isolation and resolves peer
dependencies per package context, so `styled-jsx` sees React 19 under `landing` and
React 18 under `admin`. That is the whole reason for the switch — don't move this
repo back to npm while the versions differ.

`.npmrc` additionally keeps `@types/react` out of pnpm's private hoisted directory.
That directory holds one version of a name, and when it held React 18's types the
landing app compiled against both 18 and 19 at once. The file explains itself;
both lines can go once the apps share a React major.

## Deploying

Two separate Vercel projects from this one repo, each with:

| Setting | Value |
| ------- | ----- |
| Root Directory | `apps/landing` or `apps/admin` |
| Include files outside root | **on** (needed — the lockfile lives at the repo root) |
| Install Command | leave default; Vercel runs `pnpm install` at the workspace root |
| Build Command | leave default (`next build`) |

Vercel picks pnpm up from `pnpm-lock.yaml` and the `packageManager` field in the
root `package.json`. If a deployment ever installs with npm instead, that is the
thing to check first — an npm install here fails the landing build for the reason
described under [Why pnpm](#why-pnpm).

Put the admin app on its own subdomain (`admin.srilankaballoon.com`) with the
service-role key; give the public site only the anon key.

Both projects rebuild on every push by default, including pushes that only touched
the other app. If that gets annoying, set each project's *Ignored Build Step* to
skip when its own directory is unchanged.

## Per-app docs

- [apps/landing/README.md](apps/landing/README.md) — pages, WordPress redirects, photo pipeline, design system
- [apps/admin/README.md](apps/admin/README.md) — modules, roles, demo accounts, project layout
