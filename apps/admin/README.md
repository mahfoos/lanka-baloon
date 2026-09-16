# Sri Lanka Balloon — ERP & Back Office

A Next.js 14 (App Router, TypeScript) ERP for **Lanka Ballooning (Pvt) Ltd**, the
operator behind [srilankaballoon.com](https://www.srilankaballoon.com). Every
staff-facing screen lives here; the public website is the separate
[`@lanka-baloon/landing`](../landing) app. See the
[monorepo README](../../README.md) for how the two fit together.

> **Status:** demo build — most modules read from in-memory **dummy data**
> (`lib/data.ts`), and their "Add / Edit" buttons are stubbed (`disabled`) ready to
> be wired to forms + a real store later.
>
> The exception is **Website Bookings** (`/web-bookings`), which is live: it reads
> and updates the real reservations and contact messages the public site writes
> into Supabase.

## Stack

- **Next.js 14** App Router, **TypeScript** (strict)
- **Tailwind CSS** — sky-blue + sunrise-orange brand theme
- Cookie-based auth (HMAC-signed session, in-memory user directory)
- **Supabase** for the website's reservations — the only external service

## Getting started

```bash
pnpm install                 # from the monorepo root — one install for both apps
cp .env.example .env.local   # optional — needed only for Website Bookings
pnpm dev:admin               # http://localhost:3001
```

Or `cd apps/admin && pnpm dev` once the root install has run. The workspace uses
pnpm rather than npm on purpose — see the
[monorepo README](../../README.md#why-pnpm).

Without Supabase keys the ERP runs fine; `/web-bookings` just shows a
"not connected" notice instead of the reservation queue.

- `/` — operator sign-in (the app's entry point)
- `/dashboard` and module routes — role-gated ERP

### Demo accounts

All accounts share the password **`balloon123`**.

| Username   | Role                | Sees                                              |
| ---------- | ------------------- | ------------------------------------------------- |
| `admin`    | Administrator       | Everything                                        |
| `ops`      | Operations Manager  | Flights, fleet, crew, vehicles, maintenance, compliance |
| `desk`     | Reservations        | Bookings, customers, vouchers, schedule           |
| `accounts` | Accountant          | Finance, vouchers, bookings                       |
| `pilot`    | Pilot               | Read-only schedule, fleet, crew, compliance       |
| `viewer`   | Viewer              | Read-only dashboards                              |

## Modules

| Area | Route | Notes |
| ---- | ----- | ----- |
| Dashboard | `/dashboard` | KPIs, upcoming flights, alerts |
| Bookings | `/bookings` | Reservations, payment balances, occasions (dummy data) |
| Website Bookings | `/web-bookings` | **Live** — reservations + contact messages from the public site |
| Customers | `/customers` | CRM — guests, agents, hotels |
| Gift Vouchers | `/vouchers` | Issue / redeem, 1-year validity |
| Flight Schedule | `/flights` | Launches, balloon + pilot, load factor, weather |
| Balloon Fleet | `/fleet` | Ultramagic / Lindstrand, airworthiness |
| Crew & Pilots | `/crew` | CAASL licences, validation, hours |
| Ground Transport | `/vehicles` | DMT compliance, A/C vans, chase/recovery |
| Finance | `/finance` | Income / expense ledger, category breakdown |
| Maintenance | `/maintenance` | Balloon + vehicle servicing & inspections |
| Compliance | `/compliance` | CAASL certs, insurance, revenue licences |
| Reviews | `/reviews` | Guest testimonials |
| Users & Access | `/users` | Accounts + role permissions |

## Project layout

```
app/
  page.tsx                # operator sign-in (root)
  (erp)/                  # auth-gated route group (sidebar layout)
    layout.tsx
    dashboard/ bookings/ flights/ fleet/ crew/ customers/
    vehicles/ vouchers/ finance/ maintenance/ compliance/ reviews/ users/
    web-bookings/         # live Supabase module (page + server actions)
  api/auth/               # login / logout / me
components/               # Sidebar, UserProvider, Spinner, ui toolkit
lib/
  roles.ts                # roles + permission matrix
  auth.ts                 # session + in-memory user directory
  data.ts                 # all dummy data + accessors/summaries
  website-db.ts           # Supabase client + row types for the website's data
supabase/migrations/      # the shared database schema (used by both projects)
types/
  index.ts                # domain types, constants, formatters, colour maps
  react-form-actions.d.ts # lets <form action={serverAction}> type-check on React 18
middleware.ts             # gatekeeper (public: / and /login)
```

## The website database

The public site inserts into Supabase as `anon`; Row Level Security lets it write
reservations and messages and read nothing back. This ERP connects with the
**service-role key**, which bypasses RLS — so who may see and change a reservation
is decided by the ERP's own permission matrix (`canViewBookings` /
`canManageBookings` in `lib/roles.ts`), checked in both the page and the server
actions.

That means `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser: keep
it out of `NEXT_PUBLIC_*`, and import `lib/website-db.ts` only from server
components and server actions.

Schema: `supabase/migrations/0001_init.sql` — run it in the Supabase SQL editor.

## Next steps (TODO)

- Swap `lib/data.ts` for a real store (Prisma/Postgres) — accessor signatures already isolate the UI from storage.
- Wire the stubbed **Add / Edit** buttons to forms + API routes (mirror the ALKUF `/hr` CRUD pattern).
- Hash passwords and move the user directory to the database.
- Fold `/web-bookings` into `/bookings` once the dummy booking store is replaced,
  so the front desk works one queue instead of two.
- Deploy on its own subdomain (e.g. `admin.srilankaballoon.com`), separate from the
  public site.
