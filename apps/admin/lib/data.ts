/**
 * Every ERP module reads through here.
 *
 * This file used to hold in-memory dummy records. It now queries Postgres via
 * the shared `@lanka-baloon/db` package, but deliberately keeps the same
 * function names and returns the same shapes from `types/index.ts`, so the
 * module pages only had to become async.
 *
 * Three translations happen at this boundary and nowhere else:
 *   - Prisma enums (SCREAMING_CASE) become the title-case labels the UI shows.
 *   - Decimal columns become plain numbers.
 *   - DateTime columns become ISO date strings, because every page formats
 *     them with the helpers in types/index.ts.
 *
 * Server-only: importing this from a client component would pull the database
 * credential into the browser bundle.
 */
import {
  prisma,
  toNumber,
  PACKAGE_LABELS,
  BOOKING_STATUS_LABELS,
  BOOKING_SOURCE_LABELS,
  FLIGHT_STATUS_LABELS,
  BALLOON_STATUS_LABELS,
  MANUFACTURER_LABELS,
  CREW_ROLE_LABELS,
  CREW_STATUS_LABELS,
  CUSTOMER_TYPE_LABELS,
  VEHICLE_TYPE_LABELS,
  VEHICLE_STATUS_LABELS,
  VOUCHER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  MAINTENANCE_TYPE_LABELS,
  MAINTENANCE_STATUS_LABELS,
  COMPLIANCE_KIND_LABELS,
} from "@lanka-baloon/db";
import type {
  Balloon,
  Booking,
  BookingStatus,
  ComplianceRecord,
  ComplianceStatus,
  CrewMember,
  Customer,
  Flight,
  MaintenanceLog,
  Review,
  Transaction,
  Vehicle,
  Voucher,
} from "@/types";

const iso = (d: Date | null | undefined): string => (d ? d.toISOString().slice(0, 10) : "");

/* ------------------------------------------------------------------ *
 * Bookings
 * ------------------------------------------------------------------ */

export async function listBookings(): Promise<Booking[]> {
  const rows = await prisma.booking.findMany({
    orderBy: { flightDate: "desc" },
    include: { flight: { select: { code: true } } },
  });

  return rows.map((b) => ({
    id: b.id,
    ref: b.ref,
    customerId: b.customerId ?? "",
    customerName: b.customerName,
    packageType: PACKAGE_LABELS[b.packageType],
    flightDate: iso(b.flightDate),
    flightId: b.flightId ?? undefined,
    adults: b.adults,
    children: b.children,
    pricePerHead: toNumber(b.pricePerHead),
    totalAmount: toNumber(b.totalAmount),
    paidAmount: toNumber(b.paidAmount),
    status: BOOKING_STATUS_LABELS[b.status],
    source: BOOKING_SOURCE_LABELS[b.source],
    specialOccasion: b.specialOccasion ?? undefined,
    hotel: b.hotel ?? undefined,
    notes: b.notes ?? undefined,
    createdAt: b.createdAt.toISOString(),
    currency: b.currency,
    email: b.email ?? undefined,
    phone: b.phone ?? undefined,
    country: b.country ?? undefined,
    passengerNames: b.passengerNames ?? undefined,
    vatRegistered: b.vatRegistered,
    exchangeRate: b.exchangeRate ? toNumber(b.exchangeRate) : undefined,
    totalLkr: b.exchangeRate ? toNumber(b.totalAmount) * toNumber(b.exchangeRate) : undefined,
  }));
}

/* ------------------------------------------------------------------ *
 * Flights
 * ------------------------------------------------------------------ */

export async function listFlights(): Promise<Flight[]> {
  const rows = await prisma.flight.findMany({
    orderBy: { date: "desc" },
    include: {
      balloon: { select: { registration: true } },
      pilot: { select: { name: true } },
      // `booked` is derived rather than stored, so it can never drift from the
      // bookings actually attached to the flight.
      _count: { select: { bookings: true } },
    },
  });

  return rows.map((f) => ({
    id: f.id,
    code: f.code,
    date: iso(f.date),
    launchTime: f.launchTime,
    launchSite: f.launchSite,
    balloonId: f.balloonId ?? "",
    balloonReg: f.balloon?.registration ?? "Unassigned",
    pilotId: f.pilotId ?? "",
    pilotName: f.pilot?.name ?? "Unassigned",
    capacity: f.capacity,
    booked: f._count.bookings,
    status: FLIGHT_STATUS_LABELS[f.status],
    windSpeedKts: f.windSpeedKts ?? undefined,
    windDirection: f.windDirection ?? undefined,
    durationMins: f.durationMins ?? undefined,
    notes: f.notes ?? undefined,
  }));
}

/* ------------------------------------------------------------------ *
 * Fleet
 * ------------------------------------------------------------------ */

export async function listBalloons(): Promise<Balloon[]> {
  const rows = await prisma.balloon.findMany({ orderBy: { registration: "asc" } });

  return rows.map((b) => ({
    id: b.id,
    registration: b.registration,
    name: b.name,
    manufacturer: MANUFACTURER_LABELS[b.manufacturer],
    model: b.model,
    envelopeVolumeM3: b.envelopeVolumeM3,
    basketCapacity: b.basketCapacity,
    yearBuilt: b.yearBuilt ?? 0,
    totalFlightHours: toNumber(b.totalFlightHours),
    status: BALLOON_STATUS_LABELS[b.status],
    airworthinessExpiry: iso(b.airworthinessExpiry),
    lastInspection: iso(b.lastInspection),
    hasSafetyBelts: b.hasSafetyBelts,
  }));
}

/* ------------------------------------------------------------------ *
 * Crew
 * ------------------------------------------------------------------ */

export async function listCrew(): Promise<CrewMember[]> {
  const rows = await prisma.crewMember.findMany({ orderBy: { empId: "asc" } });

  return rows.map((c) => ({
    id: c.id,
    empId: c.empId,
    name: c.name,
    role: CREW_ROLE_LABELS[c.role],
    status: CREW_STATUS_LABELS[c.status],
    licenseNo: c.licenseNo ?? undefined,
    licenseExpiry: c.licenseExpiry ? iso(c.licenseExpiry) : undefined,
    validationExpiry: c.validationExpiry ? iso(c.validationExpiry) : undefined,
    yearsExperience: c.yearsExperience,
    totalFlightHours: c.totalFlightHours ? toNumber(c.totalFlightHours) : undefined,
    phone: c.phone ?? undefined,
    email: c.email ?? undefined,
    joinDate: iso(c.joinDate),
  }));
}

/* ------------------------------------------------------------------ *
 * Customers
 * ------------------------------------------------------------------ */

export async function listCustomers(): Promise<Customer[]> {
  const rows = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    include: {
      // Totals are computed from the bookings themselves. Storing running
      // totals on the customer row is what makes CRM figures go stale.
      bookings: { select: { totalAmount: true, status: true } },
    },
  });

  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    type: CUSTOMER_TYPE_LABELS[c.type],
    country: c.country ?? "",
    email: c.email ?? undefined,
    phone: c.phone ?? undefined,
    totalBookings: c.bookings.length,
    totalSpent: c.bookings
      .filter((b) => b.status !== "CANCELLED" && b.status !== "REFUNDED")
      .reduce((sum, b) => sum + toNumber(b.totalAmount), 0),
    firstSeen: iso(c.firstSeen),
    notes: c.notes ?? undefined,
  }));
}

/* ------------------------------------------------------------------ *
 * Ground transport
 * ------------------------------------------------------------------ */

export async function listVehicles(): Promise<Vehicle[]> {
  const rows = await prisma.vehicle.findMany({ orderBy: { registration: "asc" } });

  return rows.map((v) => ({
    id: v.id,
    registration: v.registration,
    type: VEHICLE_TYPE_LABELS[v.type],
    makeModel: v.makeModel,
    seats: v.seats,
    hasAirConditioning: v.hasAirConditioning,
    status: VEHICLE_STATUS_LABELS[v.status],
    revenueLicenseExpiry: iso(v.revenueLicenseExpiry),
    insuranceExpiry: iso(v.insuranceExpiry),
    lastServiceOdo: v.lastServiceOdo,
    notes: v.notes ?? undefined,
  }));
}

/* ------------------------------------------------------------------ *
 * Vouchers
 * ------------------------------------------------------------------ */

export async function listVouchers(): Promise<Voucher[]> {
  const rows = await prisma.voucher.findMany({
    orderBy: { issuedDate: "desc" },
    include: { redeemedBooking: { select: { ref: true } } },
  });

  return rows.map((v) => ({
    id: v.id,
    code: v.code,
    packageType: PACKAGE_LABELS[v.packageType],
    purchaserName: v.purchaserName,
    recipientName: v.recipientName ?? undefined,
    amount: toNumber(v.amount),
    issuedDate: iso(v.issuedDate),
    expiryDate: iso(v.expiryDate),
    status: VOUCHER_STATUS_LABELS[v.status],
    redeemedBookingRef: v.redeemedBooking?.ref ?? undefined,
  }));
}

/* ------------------------------------------------------------------ *
 * Finance
 * ------------------------------------------------------------------ */

export async function listTransactions(): Promise<Transaction[]> {
  const rows = await prisma.transaction.findMany({ orderBy: { date: "desc" } });

  return rows.map((t) => ({
    id: t.id,
    date: iso(t.date),
    type: t.type === "INCOME" ? "income" : "expense",
    category: t.category,
    amount: toNumber(t.amount),
    method: PAYMENT_METHOD_LABELS[t.method],
    reference: t.reference ?? undefined,
    description: t.description ?? undefined,
  }));
}

/* ------------------------------------------------------------------ *
 * Maintenance
 * ------------------------------------------------------------------ */

export async function listMaintenance(): Promise<MaintenanceLog[]> {
  const rows = await prisma.maintenanceLog.findMany({
    orderBy: { scheduledDate: "desc" },
    include: {
      balloon: { select: { registration: true } },
      vehicle: { select: { registration: true } },
    },
  });

  return rows.map((m) => ({
    id: m.id,
    assetType: m.assetType === "BALLOON" ? "Balloon" : "Vehicle",
    assetId: m.balloonId ?? m.vehicleId ?? "",
    assetLabel: m.balloon?.registration ?? m.vehicle?.registration ?? "Unknown",
    type: MAINTENANCE_TYPE_LABELS[m.type],
    status: MAINTENANCE_STATUS_LABELS[m.status],
    scheduledDate: iso(m.scheduledDate),
    completedDate: m.completedDate ? iso(m.completedDate) : undefined,
    cost: m.cost ? toNumber(m.cost) : undefined,
    engineer: m.engineer ?? undefined,
    notes: m.notes ?? undefined,
  }));
}

/* ------------------------------------------------------------------ *
 * Compliance
 * ------------------------------------------------------------------ */

/** Derived from the expiry date, so a certificate can never show stale status. */
function complianceStatus(expiry: Date): ComplianceStatus {
  const days = Math.ceil((expiry.getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Expired";
  if (days <= 60) return "Expiring Soon";
  return "Valid";
}

export async function listCompliance(): Promise<(ComplianceRecord & { status: ComplianceStatus })[]> {
  const rows = await prisma.complianceRecord.findMany({ orderBy: { expiryDate: "asc" } });

  return rows.map((c) => ({
    id: c.id,
    kind: COMPLIANCE_KIND_LABELS[c.kind],
    reference: c.reference,
    authority: c.authority,
    relatesTo: c.relatesTo,
    issuedDate: iso(c.issuedDate),
    expiryDate: iso(c.expiryDate),
    notes: c.notes ?? undefined,
    status: complianceStatus(c.expiryDate),
  }));
}

/* ------------------------------------------------------------------ *
 * Reviews
 * ------------------------------------------------------------------ */

export async function listReviews(): Promise<Review[]> {
  const rows = await prisma.review.findMany({ orderBy: { date: "desc" } });

  return rows.map((r) => ({
    id: r.id,
    author: r.author,
    country: r.country ?? undefined,
    rating: r.rating,
    title: r.title,
    body: r.body,
    source: r.source,
    date: iso(r.date),
    flightRef: r.flightRef ?? undefined,
  }));
}

/* ------------------------------------------------------------------ *
 * Summaries
 * ------------------------------------------------------------------ */

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  net: number;
  outstanding: number;
}

/**
 * Sums only LKR rows. Bookings taken on the website are quoted in dollars, and
 * adding those to rupee figures without a rate would produce a number that is
 * simply wrong. Website revenue is reported separately on the bookings page.
 */
export async function financeSummary(): Promise<FinanceSummary> {
  const [income, expense, openBookings] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME", currency: "LKR" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE", currency: "LKR" },
    }),
    prisma.booking.findMany({
      where: { currency: "LKR", status: { notIn: ["CANCELLED", "REFUNDED"] } },
      select: { totalAmount: true, paidAmount: true },
    }),
  ]);

  const totalIncome = toNumber(income._sum.amount);
  const totalExpense = toNumber(expense._sum.amount);
  const outstanding = openBookings.reduce(
    (sum, b) => sum + Math.max(0, toNumber(b.totalAmount) - toNumber(b.paidAmount)),
    0,
  );

  return { totalIncome, totalExpense, net: totalIncome - totalExpense, outstanding };
}

export interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  passengersFlown: number;
  airworthyBalloons: number;
  totalBalloons: number;
  activePilots: number;
  finance: FinanceSummary;
  averageRating: number;
  activeVouchers: number;
  newWebEnquiries: number;
  unhandledMessages: number;
}

export async function dashboardStats(): Promise<DashboardStats> {
  const [
    totalBookings,
    upcomingBookings,
    flown,
    airworthyBalloons,
    totalBalloons,
    activePilots,
    ratings,
    activeVouchers,
    newWebEnquiries,
    unhandledMessages,
    finance,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({
      where: { status: { in: ["ENQUIRY", "PENDING_PAYMENT", "CONFIRMED", "WEATHER_HOLD"] } },
    }),
    prisma.booking.aggregate({ _sum: { adults: true, children: true }, where: { status: "FLOWN" } }),
    prisma.balloon.count({ where: { status: "AIRWORTHY" } }),
    prisma.balloon.count(),
    prisma.crewMember.count({
      where: { status: "ACTIVE", role: { in: ["COMMERCIAL_PILOT", "CO_PILOT"] } },
    }),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.voucher.count({ where: { status: "ACTIVE" } }),
    prisma.booking.count({ where: { source: "ONLINE", status: "ENQUIRY" } }),
    prisma.contactMessage.count({ where: { handled: false } }),
    financeSummary(),
  ]);

  return {
    totalBookings,
    upcomingBookings,
    passengersFlown: (flown._sum.adults ?? 0) + (flown._sum.children ?? 0),
    airworthyBalloons,
    totalBalloons,
    activePilots,
    finance,
    averageRating: ratings._avg.rating ?? 0,
    activeVouchers,
    newWebEnquiries,
    unhandledMessages,
  };
}

/* ------------------------------------------------------------------ *
 * Website contact messages
 * ------------------------------------------------------------------ */

export async function listContactMessages(limit = 50) {
  const rows = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    message: m.message,
    handled: m.handled,
    createdAt: m.createdAt.toISOString(),
  }));
}
