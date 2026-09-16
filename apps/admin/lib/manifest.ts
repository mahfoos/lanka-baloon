/**
 * The daily flight manifest: the "Before Flight" and "After Flight" lists the
 * office keeps for each flying day.
 *
 * Both sheets are the same set of guests. The only thing that differs is the
 * headcount: "before" is what was booked, "after" is what actually flew. So this
 * is one query with a flag, not two tables.
 *
 * Pilot and balloon are not stored on the booking. They belong to the flight it
 * is attached to, and reading them through that relation is what stops a guest
 * and their aircraft disagreeing.
 */
import { prisma, toNumber, BOOKING_SOURCE_LABELS, BOOKING_STATUS_LABELS } from "@lanka-baloon/db";

export type ManifestVariant = "before" | "after";

export interface ManifestRow {
  id: string;
  ref: string;
  pax: number;
  bookedPax: number;
  actualPax: number | null;
  name: string;
  hotel: string;
  city: string;
  contact: string;
  pickupTime: string;
  channel: string;
  guide: string;
  pilot: string;
  balloon: string;
  driverPickup: string;
  driverDropoff: string;
  note: string;
  advancePaid: number;
  flightTimeCash: number;
  currency: string;
  status: string;
}

export interface Manifest {
  date: string;
  variant: ManifestVariant;
  rows: ManifestRow[];
  totalPax: number;
  totalAdvance: Record<string, number>;
  totalAtField: Record<string, number>;
}

/** Cancelled guests stay off the list; everyone else is expected at the field. */
export async function getManifest(date: string, variant: ManifestVariant): Promise<Manifest> {
  const day = new Date(`${date}T00:00:00.000Z`);

  const bookings = await prisma.booking.findMany({
    where: { flightDate: day, status: { notIn: ["CANCELLED", "REFUNDED"] } },
    orderBy: [{ pickupTime: "asc" }, { customerName: "asc" }],
    include: {
      flight: {
        select: { balloon: { select: { registration: true } }, pilot: { select: { name: true } } },
      },
    },
  });

  const rows: ManifestRow[] = bookings.map((b) => {
    const bookedPax = b.adults + b.children;
    return {
      id: b.id,
      ref: b.ref,
      // The after-flight list falls back to the booked figure until someone
      // corrects it, so an unedited row still totals correctly.
      pax: variant === "after" ? b.actualPax ?? bookedPax : bookedPax,
      bookedPax,
      actualPax: b.actualPax,
      name: b.customerName,
      hotel: b.hotel ?? "",
      city: b.city ?? "",
      contact: b.phone ?? "",
      pickupTime: b.pickupTime ?? "",
      channel: BOOKING_SOURCE_LABELS[b.source],
      guide: b.guideName ?? "",
      pilot: b.flight?.pilot?.name ?? "",
      balloon: b.flight?.balloon?.registration ?? "",
      driverPickup: b.driverPickup ?? "",
      driverDropoff: b.driverDropoff ?? "",
      note: b.notes ?? "",
      advancePaid: toNumber(b.advancePaid),
      flightTimeCash: toNumber(b.flightTimeCash),
      currency: b.currency,
      status: BOOKING_STATUS_LABELS[b.status],
    };
  });

  // Money is totalled per currency. Adding dollars to rupees would be wrong, and
  // the field collects both.
  const totalAdvance: Record<string, number> = {};
  const totalAtField: Record<string, number> = {};
  for (const r of rows) {
    totalAdvance[r.currency] = (totalAdvance[r.currency] ?? 0) + r.advancePaid;
    totalAtField[r.currency] = (totalAtField[r.currency] ?? 0) + r.flightTimeCash;
  }

  return {
    date,
    variant,
    rows,
    totalPax: rows.reduce((sum, r) => sum + r.pax, 0),
    totalAdvance,
    totalAtField,
  };
}

/** Dates that have anyone booked, so the manifest can offer a day to jump to. */
export async function flyingDates(limit = 30): Promise<{ date: string; pax: number }[]> {
  const rows = await prisma.booking.groupBy({
    by: ["flightDate"],
    where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
    _sum: { adults: true, children: true },
    orderBy: { flightDate: "desc" },
    take: limit,
  });

  return rows.map((r) => ({
    date: r.flightDate.toISOString().slice(0, 10),
    pax: (r._sum.adults ?? 0) + (r._sum.children ?? 0),
  }));
}

/** Flights on a day, for the assignment dropdown. */
export async function flightsOn(date: string) {
  const day = new Date(`${date}T00:00:00.000Z`);
  const flights = await prisma.flight.findMany({
    where: { date: day },
    orderBy: { launchTime: "asc" },
    include: {
      balloon: { select: { registration: true } },
      pilot: { select: { name: true } },
    },
  });
  return flights.map((f) => ({
    id: f.id,
    label: `${f.code} · ${f.launchTime} · ${f.balloon?.registration ?? "no balloon"} · ${f.pilot?.name ?? "no pilot"}`,
  }));
}
