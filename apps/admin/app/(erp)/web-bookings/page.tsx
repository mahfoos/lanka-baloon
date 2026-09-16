/**
 * Website reservations and contact messages.
 *
 * This is the only module backed by a real database — the reservation form on
 * srilankaballoon.com (the `lanka-baloon-landing` project) inserts straight into
 * Supabase, and the front desk works the queue from here. Everything else in the
 * ERP still reads dummy data from lib/data.ts.
 */
import { getSession, can } from "@/lib/auth";
import {
  isWebsiteDbConfigured,
  listWebBookings,
  listWebMessages,
  formatUsd,
  WEB_BOOKING_STATUSES,
  WEB_BOOKING_STATUS_LABELS,
  WEB_BOOKING_STATUS_COLORS,
} from "@/lib/website-db";
import { formatDate, formatDateTime } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";
import { updateWebBookingStatus, markMessageHandled } from "./actions";

export const dynamic = "force-dynamic";

const OPEN_STATUSES = ["new", "confirmed", "paid"] as const;

export default async function WebBookingsPage() {
  const user = getSession()!;
  if (!can(user, "canViewBookings")) {
    return <AccessRestricted message="Website reservations are visible to reservations, operations and finance roles." />;
  }
  const manage = can(user, "canManageBookings");

  if (!isWebsiteDbConfigured()) {
    return (
      <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Website Bookings"
          subtitle="Reservations and messages from srilankaballoon.com."
        />
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-card">
          <p className="font-bold text-brand-950">Not connected to the website database</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">
            Add <code className="font-mono text-brand-700">SUPABASE_URL</code> and{" "}
            <code className="font-mono text-brand-700">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
            <code className="font-mono text-brand-700">.env.local</code> (see{" "}
            <code className="font-mono text-brand-700">.env.example</code>), then restart the
            server. The keys are in the Supabase dashboard under Project Settings → API.
          </p>
        </div>
      </div>
    );
  }

  const [{ rows: bookings, error }, messages] = await Promise.all([
    listWebBookings(),
    listWebMessages(),
  ]);

  const open = bookings.filter((b) => (OPEN_STATUSES as readonly string[]).includes(b.status));
  const unanswered = messages.filter((m) => !m.handled).length;
  const revenue = bookings
    .filter((b) => !b.status.startsWith("cancelled"))
    .reduce((sum, b) => sum + b.total_usd, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Website Bookings"
        subtitle="Reservations and messages that came in through srilankaballoon.com."
      />

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          Couldn&apos;t load reservations from Supabase: {error}
        </p>
      )}

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Reservations" value={bookings.length} hint={`${open.length} still open`} tone="brand" />
          <StatCard label="Awaiting action" value={bookings.filter((b) => b.status === "new").length} hint="new, not yet confirmed" tone={bookings.some((b) => b.status === "new") ? "negative" : "positive"} />
          <StatCard label="Booked value" value={formatUsd(revenue)} hint="excl. cancellations" />
          <StatCard label="Unanswered messages" value={unanswered} hint={`of ${messages.length} recent`} tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>Flight Date</Th>
              <Th>Ref</Th>
              <Th>Guest</Th>
              <Th className="text-center">Pax</Th>
              <Th>Hotel</Th>
              <Th>Extras</Th>
              <Th className="text-right">Total</Th>
              <Th>Status</Th>
            </>
          }
        >
          {bookings.length === 0 ? (
            <EmptyRow colSpan={8} label="No website reservations yet." />
          ) : bookings.map((b) => {
            const extras = [b.gift_voucher && "Gift voucher", b.birthday_cake && "Birthday cake"]
              .filter(Boolean)
              .join(", ");
            return (
              <Tr key={b.id}>
                <Td className="whitespace-nowrap font-semibold text-brand-950">{formatDate(b.flight_date)}</Td>
                <Td className="font-mono text-xs text-ink/60">{b.reference}</Td>
                <Td>
                  <p className="font-semibold text-brand-950">{b.full_name}</p>
                  <a href={`mailto:${b.email}`} className="block text-xs text-brand-700 hover:underline">{b.email}</a>
                  <a
                    href={`https://wa.me/${b.phone.replace(/\D/g, "")}`}
                    className="block text-xs text-brand-700 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {b.phone}
                  </a>
                  <p className="text-xs text-ink/45">{b.country}</p>
                  {b.requests && <p className="mt-1 max-w-xs text-xs italic text-ink/55">“{b.requests}”</p>}
                </Td>
                <Td className="whitespace-nowrap text-center">
                  {b.adults}A{b.children > 0 && ` ${b.children}C`}
                  {b.flight_type === "private" && (
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-accent-600">Private</span>
                  )}
                </Td>
                <Td className="text-ink/70">{b.hotel}</Td>
                <Td className="text-ink/70">{extras || "—"}</Td>
                <Td className="whitespace-nowrap text-right font-semibold text-brand-950">{formatUsd(b.total_usd)}</Td>
                <Td>
                  {manage ? (
                    <form action={updateWebBookingStatus} className="flex items-center gap-1.5">
                      <input type="hidden" name="id" value={b.id} />
                      <select
                        name="status"
                        defaultValue={b.status}
                        aria-label={`Status for ${b.reference}`}
                        className="rounded-lg border border-brand-900/15 bg-white px-2 py-1 text-xs font-semibold text-brand-950"
                      >
                        {WEB_BOOKING_STATUSES.map((s) => (
                          <option key={s} value={s}>{WEB_BOOKING_STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                      <button className="rounded-lg bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-brand-800">
                        Save
                      </button>
                    </form>
                  ) : (
                    <Badge label={WEB_BOOKING_STATUS_LABELS[b.status]} className={WEB_BOOKING_STATUS_COLORS[b.status]} />
                  )}
                </Td>
              </Tr>
            );
          })}
        </TableCard>
      </div>

      <h2 className="mt-10 text-lg font-black text-brand-950">Latest messages</h2>
      <p className="mt-1 text-sm text-ink/55">From the contact form on the website.</p>

      <ul className="mt-4 space-y-3">
        {messages.length === 0 && (
          <li className="rounded-2xl bg-white p-6 text-center text-sm text-ink/40 shadow-card">No messages yet.</li>
        )}
        {messages.map((m) => (
          <li key={m.id} className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-brand-950">
                  {m.name}{" "}
                  <a href={`mailto:${m.email}`} className="text-sm font-normal text-brand-700 hover:underline">
                    {m.email}
                  </a>
                </p>
                <p className="text-xs text-ink/40">{formatDateTime(m.created_at)}</p>
              </div>
              {manage ? (
                <form action={markMessageHandled}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="handled" value={String(!m.handled)} />
                  <button
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      m.handled
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-accent-100 text-accent-600 hover:bg-accent-200"
                    }`}
                  >
                    {m.handled ? "Handled" : "Mark handled"}
                  </button>
                </form>
              ) : (
                <Badge
                  label={m.handled ? "Handled" : "Open"}
                  className={m.handled ? "bg-green-50 text-green-700" : "bg-accent-100 text-accent-600"}
                />
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">{m.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
