import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listBookings } from "@/lib/data";
import {
  formatCurrency, formatDate, BOOKING_STATUS_COLORS, ACTIVE_BOOKING_STATUSES,
} from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

import { countries } from "@/lib/countries";
import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveBooking, deleteBooking } from "../actions";

export const dynamic = "force-dynamic";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
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

  const editing =
    manage && searchParams.edit
      ? await prisma.booking.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  // Pick-lists come from Master Data. They are offered as combo boxes rather
  // than hard dropdowns: the office takes bookings faster than master data gets
  // maintained, and a hotel missing from the list must not block a reservation.
  const [agentRows, hotelRows, cityRows] = await Promise.all([
    prisma.agent.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.hotel.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
  ]);

  const FIELDS: FieldSpec[] = [
    { name: "customerName", label: "Lead guest / agency", type: "combo", required: true,
      options: agentRows.map((a) => a.name),
      hint: "Pick an agent from Master Data, or type a guest name for a direct booking." },
    { name: "passengerNames", label: "Passenger names", type: "textarea", span: 2,
      placeholder: "Jane Smith, John Smith", hint: "Everyone flying, as given." },
    { name: "flightDate", label: "Flight date", type: "date", required: true },
    // Only the shared flight is sold at the moment; the other packages stay in
    // the schema so historic bookings keep their type.
    { name: "packageType", label: "Package", type: "select", options: [{ value: "SHARED_FLIGHT", label: "Shared Flight" }] },
    { name: "adults", label: "Adults", type: "number" },
    { name: "children", label: "Children", type: "number" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "ENQUIRY", label: "Enquiry" }, { value: "PENDING_PAYMENT", label: "Pending Payment" },
      { value: "CONFIRMED", label: "Confirmed" }, { value: "FLOWN", label: "Flown" },
      { value: "WEATHER_HOLD", label: "Weather Hold" }, { value: "CANCELLED", label: "Cancelled" },
      { value: "REFUNDED", label: "Refunded" }] },
    { name: "source", label: "Booked via", type: "select", required: true, options: [
      { value: "AGENT", label: "Agent booking" }, { value: "GUIDE", label: "Guide booking" },
      { value: "ONLINE", label: "Online booking" }, { value: "HOTEL", label: "Hotel booking" },
      { value: "SIGIRIYA_POINT", label: "Sigiriya booking point" },
      { value: "LAST_MINUTE", label: "Last minute booking" }, { value: "DIRECT", label: "Direct" }] },
    { name: "currency", label: "Currency", type: "select", options: [
      { value: "USD", label: "USD" }, { value: "LKR", label: "LKR" },
      { value: "EUR", label: "EUR" }, { value: "TRY", label: "TRY" }] },
    { name: "pricePerHead", label: "Price per head", type: "money", placeholder: "212.50" },
    { name: "exchangeRate", label: "Rate (LKR per unit)", type: "money", placeholder: "333", hint: "Used to work out the rupee total." },
    { name: "totalAmount", label: "Total", type: "money" },
    { name: "paidAmount", label: "Paid", type: "money" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "country", label: "Country", type: "select", options: countries.map((c) => ({ value: c, label: c })) },
    { name: "hotel", label: "Hotel", type: "combo", options: hotelRows.map((h) => h.name), hint: "From Master Data." },
    { name: "city", label: "City", type: "combo", options: cityRows.map((c) => c.name) },
    { name: "pickupTime", label: "Pick-up time", type: "time" },
    { name: "vatRegistered", label: "Agent is VAT registered", type: "checkbox" },
    { name: "vatNumber", label: "VAT number", type: "text", hint: "Required when VAT registered is ticked." },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  // FIELDS is built inside the component: its options come from master data.

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Bookings"
        subtitle="Reservations across shared, private and special-occasion flights."
        action={manage && !showForm ? <Link href="/bookings?new=1" className="btn-primary">+ New Booking</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveBooking}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/bookings"
            title={editing ? `Edit ${editing.ref}` : "New Booking"}
            submitLabel={editing ? "Save changes" : "Save"}
            values={editing ?? { status: "ENQUIRY", source: "AGENT", currency: "USD", adults: 2, children: 0, packageType: "SHARED_FLIGHT" }}
          />
        </div>
      )}

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
              {manage && <Th />}
            </>
          }
        >
          {bookings.length === 0 ? (
            <EmptyRow colSpan={manage ? 9 : 8} label="No bookings." />
          ) : bookings.map((b) => {
            const balance = Math.max(0, b.totalAmount - b.paidAmount);
            return (
              <Tr key={b.id}>
                <Td className="font-mono text-xs text-brand-700">{b.ref}</Td>
                <Td>
                  <p className="font-semibold text-brand-950">{b.customerName}</p>
                  {b.passengerNames && (
                    <p className="text-[11px] leading-snug text-ink/50">{b.passengerNames}</p>
                  )}
                  <p className="text-xs text-ink/45">{b.source}{b.hotel ? ` · ${b.hotel}` : ""}</p>
                </Td>
                <Td>
                  <span className="text-ink/70">{b.packageType}</span>
                  {b.specialOccasion && <p className="text-[11px] text-accent-600">{b.specialOccasion}</p>}
                </Td>
                <Td className="text-ink/70">{formatDate(b.flightDate)}</Td>
                <Td className="text-center text-ink/70">{b.adults + b.children}</Td>
                <Td className="whitespace-nowrap text-right font-semibold text-brand-950">
                  {b.currency} {b.totalAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  {b.totalLkr !== undefined && b.currency !== "LKR" && (
                    <span className="block text-[11px] font-normal text-ink/45">
                      = LKR {Math.round(b.totalLkr).toLocaleString("en-LK")} @ {b.exchangeRate}
                    </span>
                  )}
                </Td>
                <Td className={`text-right font-semibold ${balance > 0 ? "text-red-600" : "text-green-700"}`}>{balance > 0 ? formatCurrency(balance) : "Paid"}</Td>
                <Td><Badge label={b.status} className={BOOKING_STATUS_COLORS[b.status]} /></Td>
                {manage && (
                  <Td>
                    <RowActions editHref={`/bookings?edit=${b.id}`} deleteAction={deleteBooking} id={b.id} label={String(b.ref)} />
                  </Td>
                )}
              </Tr>
            );
          })}
        </TableCard>
      </div>
    </div>
  );
}
