# Sri Lanka Balloon

Monorepo for **Lanka Ballooning (Pvt) Ltd** — the public website and the internal
operations platform behind [srilankaballoon.com](https://www.srilankaballoon.com).

```
apps/
  landing/    @lanka-baloon/landing   public website        Next 15 · Tailwind v4 · :3000
  admin/      @lanka-baloon/admin     ERP + back office     Next 14 · Tailwind v3 · :3001
packages/
  db/         @lanka-baloon/db        Prisma schema + client, shared by both
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

Both apps read the same database, so both need `DATABASE_URL` and `DIRECT_URL`.
The repo-root `.env.local` holds them, and each app has a symlink to it:

```bash
ln -sf ../../.env.local apps/admin/.env.local
ln -sf ../../.env.local apps/landing/.env.local
```

Next only loads `.env.local` from its own project directory, which is why the
symlinks exist. On Vercel you set the variables per project instead.

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

They share one Postgres database (Supabase-hosted) through `packages/db`, and
nothing else: no shared UI, no runtime coupling, no calls between them.

```
visitor ──▶ apps/landing ──┐                      ┌── apps/admin ◀── staff
            book / contact │  @lanka-baloon/db    │   every module
            server actions └──▶  Postgres   ◀─────┘
```

A booking made on the website is written into the same `Booking` table the ERP's
Bookings module reads, tagged `source: WEBSITE`, `status: ENQUIRY`. There is no
separate "website bookings" inbox: the front desk works one queue. Contact-form
messages are the exception and have their own page, at `/messages`.

**There is no payment gateway.** Every website booking arrives unpaid, as an
enquiry, for the office to confirm and collect against.

### Currency

Rows carry their own currency. The website quotes in US dollars, the office works
in rupees, so `Booking.currency`, `Voucher.currency` and `Transaction.currency`
record which unit the figure is in. A bare number would silently corrupt every
total, and a hard-coded exchange rate would be worse. The finance summary
therefore sums LKR rows only.

> `DATABASE_URL` is a full Postgres credential. Everything in `packages/db` is
> server-only: import it from server components and server actions, never from a
> `"use client"` file.

### Schema changes

```bash
pnpm --filter @lanka-baloon/db migrate          # create a migration and apply it
pnpm --filter @lanka-baloon/db migrate:deploy   # apply existing migrations
pnpm --filter @lanka-baloon/db studio           # browse the data
```

Migrations run over `DIRECT_URL`, because pgbouncer can't run them. Both commands
load the repo-root `.env.local` themselves.

### Access control

The ERP's own role matrix (`apps/admin/lib/roles.ts`) is the only thing gating
staff access to this data, checked in each page and each server action. There is
no database-level policy behind it, because both apps connect as the same
Postgres role.

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
