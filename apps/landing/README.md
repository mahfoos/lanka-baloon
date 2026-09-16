# Sri Lanka Balloon — public website

The public site at https://www.srilankaballoon.com, on **Next.js 15 (App Router) +
Tailwind CSS v4 + Supabase (Postgres)**. All pages, prices, FAQ, team, fleet,
corporate case studies, videos and **every photo** from the old WordPress site are
carried over.

> **This project is the website only — there is no staff area in it.**
> Staff read and work the reservations this site takes in the separate
> [`@lanka-baloon/admin`](../admin) app, under *Website Bookings*.
> Both apps talk to the same Supabase project; the database schema lives with the
> admin app in `apps/admin/supabase/migrations`. See the
> [monorepo README](../../README.md) for how the two fit together.

## Quick start

```bash
pnpm install                    # from the monorepo root — one install for both apps
cp .env.example .env.local      # add your Supabase URL + anon key
pnpm dev:landing                # http://localhost:3000
```

Or `cd apps/landing && pnpm dev` once the root install has run. The workspace uses
pnpm rather than npm on purpose — the [monorepo README](../../README.md#why-pnpm)
explains why, and an `npm install` will break this app's build.

The public pages work without Supabase. Booking/contact forms show a "not connected yet" message until keys are added.

## Pages

| New route    | Old WordPress URL (301 redirect)                    |
|--------------|-----------------------------------------------------|
| `/`          | `/`                                                 |
| `/flights`   | `/hot-air-ballooning-sri-lanka/`                    |
| `/about`     | `/about-lanka-ballooning/`, `/about-us/`            |
| `/corporate` | `/corporate-ballooning/`                            |
| `/faq`       | `/faq-sri-lanka-ballooning/`                        |
| `/contact`   | `/contact-hot-air-balloon-dambulla/`                |
| `/book`      | `/balloon-ride-reservation/`, `/make-a-reservation/`|

Redirects live in `next.config.ts` so Google rankings carry over.

## Supabase setup

1. Create a project at supabase.com.
2. SQL Editor → paste and run `apps/admin/supabase/migrations/0001_init.sql`
   (tables: `bookings`, `contact_messages`, with Row Level Security).
3. Copy Project URL + **anon** key into `.env.local`.

Security model: this site connects as `anon` and RLS lets it **insert** bookings and
messages only — it can never read a reservation back, so nothing sensitive is
reachable from the browser. Totals are always recalculated on the server
(`src/lib/pricing.ts`) rather than trusted from the form.

## Photos

All 71 photos are committed in `public/images` and served locally, so the site no longer
depends on the WordPress host. To re-pull them (e.g. after the client uploads new ones):

```bash
npm run images:download   # WordPress -> public/images, per src/lib/image-manifest.json
npm run images:data       # -> src/lib/image-data.json (paths, sizes, blur placeholders)
```

`images:download` skips files already on disk, so an interrupted run just resumes.
Four "Screenshot-… PM.jpg" files have a space in the name that may be a special macOS space — the script tries both spellings and lists any that fail.

## Where to edit things

- All text, prices, team, fleet, FAQ: `src/lib/content.ts`
- Colours and fonts: `src/app/globals.css` (`@theme`) and `src/app/layout.tsx`
- Booking form: `src/components/BookingForm.tsx` + `src/app/book/actions.ts`

## Design

"Dawn over Kandalama": pre-dawn indigo `#17203a`, sunrise amber `#f3a33b`, balloon red `#c63d2f`, lake teal `#2c6e6a`, cool mist `#eef1f4`.
Young Serif for headings, Figtree for text. The signature element is the morning timeline, whose rail fades from indigo to amber to red as the morning moves from pick-up to sunrise flight.
Adjust colours to the exact logo colours once confirmed with the client.

## Next steps

- Email notifications on new bookings (e.g. Resend) — see the TODO in `src/app/book/actions.ts`
- Online card payment link (the current site emails a secure link manually)
- Availability/capacity per date (56 seats across 4 balloons) to block overbooking
- Deploy on Vercel, add env vars, then point the domain (deploy the admin app
  separately, on its own subdomain)
