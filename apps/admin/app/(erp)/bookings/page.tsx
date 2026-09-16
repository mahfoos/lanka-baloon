import { getSession, can } from "@/lib/auth";
import { listBookings } from "@/lib/data";
import {
  formatCurrency, formatDate, BOOKING_STATUS_COLORS, ACTIVE_BOOKING_STATUSES,
} from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const user = getSession()!;
  if (!can(user, "canViewBookings")) {
    return <AccessRestricted message="Bookings are visible to reservations, operations and finance roles." />;
  }
  const manage = can(user, "canManageBookings");
  const bookings = await listBookings();

  const revenue = bookings.filter((b) => b.status !== "Cancelled").reduce((s, b) => s + b.totalAmount, 0);
  const outstanding = bookings.filter((b) => b.status !== "Cancelled" && b.status !== "Refunded")
    .reduce((s, b) => s + Math.max(0, b.totalAmount - b.paidAmount), 0);
  const upcoming = bookings.filter((b) => ACTIVE_BOOKING_STATUSES.includes(b.status)).length;
  const flown = bookings.filter((b) => b.status === "Flown").length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Bookings"
        subtitle="Reservations across shared, private and special-occasion flights."
        action={manage ? <button className="btn-primary" disabled title="Demo — wiring forms next">+ New Booking</button> : undefined}
      />

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Total Bookings" value={bookings.length} hint={`${upcoming} upcoming · ${flown} flown`} tone="brand" />
          <StatCard label="Booked Revenue" value={formatCurrency(revenue)} hint="excl. cancellations" />
          <StatCard label="Outstanding" value={formatCurrency(outstanding)} hint="balance to collect" tone={outstanding > 0 ? "negative" : "positive"} />
          <StatCard label="Special Occasions" value={bookings.filter((b) => b.specialOccasion).length} hint="proposals, birthdays…" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>Ref</Th>
              <Th>Customer</Th>
              <Th>Package</Th>
              <Th>Flight Date</Th>
              <Th className="text-center">Pax</Th>
              <Th className="text-right">Total</Th>
              <Th className="text-right">Balance</Th>
              <Th>Status</Th>
            </>
          }
        >
          {bookings.length === 0 ? (
            <EmptyRow colSpan={8} label="No bookings." />
          ) : bookings.map((b) => {
            const balance = Math.max(0, b.totalAmount - b.paidAmount);
            return (
              <Tr key={b.id}>
                <Td className="font-mono text-xs text-brand-700">{b.ref}</Td>
                <Td>
                  <p className="font-semibold text-brand-950">{b.customerName}</p>
                  <p className="text-xs text-ink/45">{b.source}{b.hotel ? ` · ${b.hotel}` : ""}</p>
                </Td>
                <Td>
                  <span className="text-ink/70">{b.packageType}</span>
                  {b.specialOccasion && <p className="text-[11px] text-accent-600">{b.specialOccasion}</p>}
                </Td>
                <Td className="text-ink/70">{formatDate(b.flightDate)}</Td>
                <Td className="text-center text-ink/70">{b.adults + b.children}</Td>
                <Td className="text-right font-semibold text-brand-950">{formatCurrency(b.totalAmount)}</Td>
                <Td className={`text-right font-semibold ${balance > 0 ? "text-red-600" : "text-green-700"}`}>{balance > 0 ? formatCurrency(balance) : "Paid"}</Td>
                <Td><Badge label={b.status} className={BOOKING_STATUS_COLORS[b.status]} /></Td>
              </Tr>
            );
          })}
        </TableCard>
      </div>
    </div>
  );
}
