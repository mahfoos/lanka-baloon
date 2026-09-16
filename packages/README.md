# packages/

Shared code, imported by name (`@lanka-baloon/<name>`).

## db

`@lanka-baloon/db` holds the Prisma schema and the client both apps use. It is
the only place either app touches Postgres, and it is server-only: the
connection string is a full database credential.

The schema covers the whole operation, not just the website: bookings, flights,
fleet, crew, customers, vehicles, vouchers, transactions, maintenance,
compliance, reviews and contact messages.

## What does not belong here

UI. The two apps deliberately look nothing alike, so a shared component library
would fight both.
