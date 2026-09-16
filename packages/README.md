# packages/

Shared code lives here — anything both apps need, published as a workspace package
and imported by name (`@lanka-baloon/<name>`).

Nothing is shared yet. The obvious first candidate is the booking domain: the row
types and status vocabulary in `apps/admin/lib/website-db.ts` describe the same
tables that `apps/landing/src/app/book/actions.ts` writes into, and today the two
apps each keep their own copy. If a third place ever needs them, move them here as
`@lanka-baloon/booking` rather than copying again.

Resist extracting UI. The two apps deliberately look nothing alike — the website is
Tailwind v4 with a "dawn over Kandalama" palette, the ERP is Tailwind v3 with a
dense admin theme — so a shared component library would fight both.
