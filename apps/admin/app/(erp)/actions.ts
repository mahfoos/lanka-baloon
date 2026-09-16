"use server";

/**
 * Create, update and delete for every ERP module.
 *
 * All in one file on purpose: eleven modules with the same shape of operation,
 * so keeping them together is what stops them drifting apart. Each action does
 * the same four things in the same order — check the permission, parse, reject
 * if a required field is missing, write and revalidate.
 *
 * `id` present means update, absent means create.
 *
 * An empty box clears the column: the helpers return null, not undefined, so a
 * blank field writes NULL rather than being skipped. That is right for these
 * forms because each one posts every field it owns, so blank genuinely means
 * "the user cleared it". It does mean a partial POST would blank what it omits,
 * which is why nothing here is designed to be called with a subset of fields.
 */
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import type { Permissions } from "@/lib/roles";
import { text, int, decimal, date, bool, enumValue } from "@/lib/form";

/** Every action starts here: no permission, no write, no exception thrown. */
function allowed(permission: keyof Permissions): boolean {
  return can(getSession(), permission);
}

const done = (path: string) => revalidatePath(path);

/* ------------------------------------------------------------------ *
 * Fleet
 * ------------------------------------------------------------------ */

const MANUFACTURERS = ["ULTRAMAGIC", "LINDSTRAND"] as const;
const BALLOON_STATUSES = ["AIRWORTHY", "IN_MAINTENANCE", "GROUNDED", "RETIRED"] as const;

export async function saveBalloon(fd: FormData) {
  if (!allowed("canManageFleet")) return;

  const id = text(fd, "id");
  const registration = text(fd, "registration");
  const name = text(fd, "name");
  const manufacturer = enumValue(fd, "manufacturer", MANUFACTURERS);
  const model = text(fd, "model");
  if (!registration || !name || !manufacturer || !model) return;

  const data = {
    registration,
    name,
    manufacturer,
    model,
    envelopeVolumeM3: int(fd, "envelopeVolumeM3", 0)!,
    basketCapacity: int(fd, "basketCapacity", 0)!,
    yearBuilt: int(fd, "yearBuilt"),
    totalFlightHours: decimal(fd, "totalFlightHours", 0)!,
    status: enumValue(fd, "status", BALLOON_STATUSES) ?? "AIRWORTHY",
    airworthinessExpiry: date(fd, "airworthinessExpiry"),
    lastInspection: date(fd, "lastInspection"),
    hasSafetyBelts: bool(fd, "hasSafetyBelts"),
  };

  if (id) await prisma.balloon.update({ where: { id }, data });
  else await prisma.balloon.create({ data });
  done("/fleet");
}

export async function deleteBalloon(fd: FormData) {
  if (!allowed("canManageFleet")) return;
  const id = text(fd, "id");
  if (id) await prisma.balloon.delete({ where: { id } });
  done("/fleet");
}

/* ------------------------------------------------------------------ *
 * Crew
 * ------------------------------------------------------------------ */

const CREW_ROLES = ["COMMERCIAL_PILOT", "CO_PILOT", "GROUND_CREW_LEAD", "GROUND_CREW", "CHASE_DRIVER", "RETRIEVE_CREW"] as const;
const CREW_STATUSES = ["ACTIVE", "ON_LEAVE", "OFF_SEASON", "INACTIVE"] as const;

export async function saveCrew(fd: FormData) {
  if (!allowed("canManageCrew")) return;

  const id = text(fd, "id");
  const empId = text(fd, "empId");
  const name = text(fd, "name");
  const role = enumValue(fd, "role", CREW_ROLES);
  if (!empId || !name || !role) return;

  const data = {
    empId,
    name,
    role,
    status: enumValue(fd, "status", CREW_STATUSES) ?? "ACTIVE",
    licenseNo: text(fd, "licenseNo"),
    licenseExpiry: date(fd, "licenseExpiry"),
    validationExpiry: date(fd, "validationExpiry"),
    yearsExperience: int(fd, "yearsExperience", 0)!,
    totalFlightHours: decimal(fd, "totalFlightHours"),
    phone: text(fd, "phone"),
    email: text(fd, "email"),
    joinDate: date(fd, "joinDate"),
  };

  if (id) await prisma.crewMember.update({ where: { id }, data });
  else await prisma.crewMember.create({ data });
  done("/crew");
}

export async function deleteCrew(fd: FormData) {
  if (!allowed("canManageCrew")) return;
  const id = text(fd, "id");
  if (id) await prisma.crewMember.delete({ where: { id } });
  done("/crew");
}

/* ------------------------------------------------------------------ *
 * Ground transport
 * ------------------------------------------------------------------ */

const VEHICLE_TYPES = ["PASSENGER_VAN", "CHASE_4X4", "RECOVERY_TRUCK", "CAR"] as const;
const VEHICLE_STATUSES = ["AVAILABLE", "ON_TRIP", "SERVICING", "OFF_ROAD"] as const;

export async function saveVehicle(fd: FormData) {
  if (!allowed("canManageVehicles")) return;

  const id = text(fd, "id");
  const registration = text(fd, "registration");
  const type = enumValue(fd, "type", VEHICLE_TYPES);
  const makeModel = text(fd, "makeModel");
  if (!registration || !type || !makeModel) return;

  const data = {
    registration,
    type,
    makeModel,
    seats: int(fd, "seats", 0)!,
    hasAirConditioning: bool(fd, "hasAirConditioning"),
    status: enumValue(fd, "status", VEHICLE_STATUSES) ?? "AVAILABLE",
    revenueLicenseExpiry: date(fd, "revenueLicenseExpiry"),
    insuranceExpiry: date(fd, "insuranceExpiry"),
    lastServiceOdo: int(fd, "lastServiceOdo", 0)!,
    notes: text(fd, "notes"),
  };

  if (id) await prisma.vehicle.update({ where: { id }, data });
  else await prisma.vehicle.create({ data });
  done("/vehicles");
}

export async function deleteVehicle(fd: FormData) {
  if (!allowed("canManageVehicles")) return;
  const id = text(fd, "id");
  if (id) await prisma.vehicle.delete({ where: { id } });
  done("/vehicles");
}

/* ------------------------------------------------------------------ *
 * Customers
 * ------------------------------------------------------------------ */

const CUSTOMER_TYPES = ["TOURIST", "LOCAL", "CORPORATE", "TRAVEL_AGENT"] as const;

export async function saveCustomer(fd: FormData) {
  if (!allowed("canManageCustomers")) return;

  const id = text(fd, "id");
  const name = text(fd, "name");
  if (!name) return;

  const data = {
    name,
    type: enumValue(fd, "type", CUSTOMER_TYPES) ?? "TOURIST",
    country: text(fd, "country"),
    email: text(fd, "email"),
    phone: text(fd, "phone"),
    notes: text(fd, "notes"),
  };

  if (id) await prisma.customer.update({ where: { id }, data });
  else await prisma.customer.create({ data });
  done("/customers");
}

export async function deleteCustomer(fd: FormData) {
  if (!allowed("canManageCustomers")) return;
  const id = text(fd, "id");
  // Bookings survive: the relation is SetNull, and a booking without its CRM
  // record still has the guest's name on it.
  if (id) await prisma.customer.delete({ where: { id } });
  done("/customers");
}

/* ------------------------------------------------------------------ *
 * Bookings
 * ------------------------------------------------------------------ */

const PACKAGES = ["SHARED_FLIGHT", "PRIVATE_FLIGHT", "MARRIAGE_PROPOSAL", "BIRTHDAY_CELEBRATION", "WEDDING_ANNIVERSARY", "GIFT_VOUCHER"] as const;
const BOOKING_STATUSES = ["ENQUIRY", "PENDING_PAYMENT", "CONFIRMED", "FLOWN", "CANCELLED", "WEATHER_HOLD", "REFUNDED"] as const;
const BOOKING_SOURCES = ["WEBSITE", "PHONE", "EMAIL", "WALK_IN", "TRAVEL_AGENT", "HOTEL_CONCIERGE", "GUIDE"] as const;
const CURRENCIES = ["LKR", "USD", "EUR", "TRY"] as const;

export async function saveBooking(fd: FormData) {
  if (!allowed("canManageBookings")) return;

  const id = text(fd, "id");
  const customerName = text(fd, "customerName");
  const flightDate = date(fd, "flightDate");
  if (!customerName || !flightDate) return;

  const data = {
    customerName,
    flightDate,
    email: text(fd, "email"),
    phone: text(fd, "phone"),
    country: text(fd, "country"),
    packageType: enumValue(fd, "packageType", PACKAGES) ?? "SHARED_FLIGHT",
    adults: int(fd, "adults", 1)!,
    children: int(fd, "children", 0)!,
    currency: enumValue(fd, "currency", CURRENCIES) ?? "LKR",
    pricePerHead: decimal(fd, "pricePerHead", 0)!,
    totalAmount: decimal(fd, "totalAmount", 0)!,
    paidAmount: decimal(fd, "paidAmount", 0)!,
    status: enumValue(fd, "status", BOOKING_STATUSES) ?? "ENQUIRY",
    source: enumValue(fd, "source", BOOKING_SOURCES) ?? "PHONE",
    hotel: text(fd, "hotel"),
    city: text(fd, "city"),
    pickupTime: text(fd, "pickupTime"),
    guideName: text(fd, "guideName"),
    notes: text(fd, "notes"),
  };

  if (id) {
    await prisma.booking.update({ where: { id }, data });
  } else {
    // The reference is generated, never typed: it is what the guest quotes back
    // and it has to be unique.
    const ref = text(fd, "ref") ?? `SLB-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    await prisma.booking.create({ data: { ...data, ref } });
  }
  done("/bookings");
}

export async function deleteBooking(fd: FormData) {
  if (!allowed("canManageBookings")) return;
  const id = text(fd, "id");
  if (id) await prisma.booking.delete({ where: { id } });
  done("/bookings");
}

/* ------------------------------------------------------------------ *
 * Flights
 * ------------------------------------------------------------------ */

const FLIGHT_STATUSES = ["SCHEDULED", "BOARDING", "IN_FLIGHT", "COMPLETED", "CANCELLED_WEATHER", "POSTPONED"] as const;

export async function saveFlight(fd: FormData) {
  if (!allowed("canManageFlights")) return;

  const id = text(fd, "id");
  const code = text(fd, "code");
  const flightDate = date(fd, "date");
  const launchTime = text(fd, "launchTime");
  const launchSite = text(fd, "launchSite");
  if (!code || !flightDate || !launchTime || !launchSite) return;

  const data = {
    code,
    date: flightDate,
    launchTime,
    launchSite,
    balloonId: text(fd, "balloonId"),
    pilotId: text(fd, "pilotId"),
    capacity: int(fd, "capacity", 0)!,
    status: enumValue(fd, "status", FLIGHT_STATUSES) ?? "SCHEDULED",
    windSpeedKts: int(fd, "windSpeedKts"),
    windDirection: text(fd, "windDirection"),
    durationMins: int(fd, "durationMins"),
    notes: text(fd, "notes"),
  };

  if (id) await prisma.flight.update({ where: { id }, data });
  else await prisma.flight.create({ data });
  done("/flights");
}

export async function deleteFlight(fd: FormData) {
  if (!allowed("canManageFlights")) return;
  const id = text(fd, "id");
  if (id) await prisma.flight.delete({ where: { id } });
  done("/flights");
}

/* ------------------------------------------------------------------ *
 * Vouchers
 * ------------------------------------------------------------------ */

const VOUCHER_STATUSES = ["ACTIVE", "REDEEMED", "EXPIRED", "CANCELLED"] as const;

export async function saveVoucher(fd: FormData) {
  if (!allowed("canManageVouchers")) return;

  const id = text(fd, "id");
  const purchaserName = text(fd, "purchaserName");
  const expiryDate = date(fd, "expiryDate");
  if (!purchaserName || !expiryDate) return;

  const data = {
    purchaserName,
    expiryDate,
    packageType: enumValue(fd, "packageType", PACKAGES) ?? "GIFT_VOUCHER",
    recipientName: text(fd, "recipientName"),
    currency: enumValue(fd, "currency", CURRENCIES) ?? "LKR",
    amount: decimal(fd, "amount", 0)!,
    issuedDate: date(fd, "issuedDate") ?? new Date(),
    status: enumValue(fd, "status", VOUCHER_STATUSES) ?? "ACTIVE",
  };

  if (id) {
    await prisma.voucher.update({ where: { id }, data });
  } else {
    const code = text(fd, "code") ?? `GIFT-${randomBytes(3).toString("hex").toUpperCase()}`;
    await prisma.voucher.create({ data: { ...data, code } });
  }
  done("/vouchers");
}

export async function deleteVoucher(fd: FormData) {
  if (!allowed("canManageVouchers")) return;
  const id = text(fd, "id");
  if (id) await prisma.voucher.delete({ where: { id } });
  done("/vouchers");
}

/* ------------------------------------------------------------------ *
 * Finance
 * ------------------------------------------------------------------ */

const TRANSACTION_TYPES = ["INCOME", "EXPENSE"] as const;
const PAYMENT_METHODS = ["CARD", "BANK_TRANSFER", "CASH", "ONLINE_GATEWAY", "AGENT_CREDIT"] as const;

export async function saveTransaction(fd: FormData) {
  if (!allowed("canManageFinance")) return;

  const id = text(fd, "id");
  const txDate = date(fd, "date");
  const type = enumValue(fd, "type", TRANSACTION_TYPES);
  const category = text(fd, "category");
  const amount = decimal(fd, "amount");
  if (!txDate || !type || !category || amount === null || amount <= 0) return;

  const data = {
    date: txDate,
    type,
    category,
    amount,
    currency: enumValue(fd, "currency", CURRENCIES) ?? "LKR",
    method: enumValue(fd, "method", PAYMENT_METHODS) ?? "BANK_TRANSFER",
    reference: text(fd, "reference"),
    description: text(fd, "description"),
  };

  if (id) await prisma.transaction.update({ where: { id }, data });
  else await prisma.transaction.create({ data });
  done("/finance");
}

export async function deleteTransaction(fd: FormData) {
  if (!allowed("canManageFinance")) return;
  const id = text(fd, "id");
  if (id) await prisma.transaction.delete({ where: { id } });
  done("/finance");
}

/* ------------------------------------------------------------------ *
 * Maintenance
 * ------------------------------------------------------------------ */

const ASSET_TYPES = ["BALLOON", "VEHICLE"] as const;
const MAINTENANCE_TYPES = ["ANNUAL_INSPECTION", "ENVELOPE_REPAIR", "BURNER_SERVICE", "BASKET_SERVICE", "VEHICLE_SERVICE", "FUEL_SYSTEM_CHECK", "OTHER"] as const;
const MAINTENANCE_STATUSES = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "OVERDUE"] as const;

export async function saveMaintenance(fd: FormData) {
  if (!allowed("canManageMaintenance")) return;

  const id = text(fd, "id");
  const assetType = enumValue(fd, "assetType", ASSET_TYPES);
  const type = enumValue(fd, "type", MAINTENANCE_TYPES);
  const scheduledDate = date(fd, "scheduledDate");
  if (!assetType || !type || !scheduledDate) return;

  // The asset select posts one field; which column it lands in depends on the
  // asset type, and the other is cleared so a log can't point at both.
  const assetId = text(fd, "assetId");
  const data = {
    assetType,
    type,
    scheduledDate,
    balloonId: assetType === "BALLOON" ? assetId : null,
    vehicleId: assetType === "VEHICLE" ? assetId : null,
    status: enumValue(fd, "status", MAINTENANCE_STATUSES) ?? "SCHEDULED",
    completedDate: date(fd, "completedDate"),
    currency: enumValue(fd, "currency", CURRENCIES) ?? "LKR",
    cost: decimal(fd, "cost"),
    engineer: text(fd, "engineer"),
    notes: text(fd, "notes"),
  };

  if (id) await prisma.maintenanceLog.update({ where: { id }, data });
  else await prisma.maintenanceLog.create({ data });
  done("/maintenance");
}

export async function deleteMaintenance(fd: FormData) {
  if (!allowed("canManageMaintenance")) return;
  const id = text(fd, "id");
  if (id) await prisma.maintenanceLog.delete({ where: { id } });
  done("/maintenance");
}

/* ------------------------------------------------------------------ *
 * Compliance
 * ------------------------------------------------------------------ */

const COMPLIANCE_KINDS = ["AIR_OPERATOR_CERTIFICATE", "AIRCRAFT_REGISTRATION", "AIRWORTHINESS_CERTIFICATE", "PILOT_LICENCE", "VALIDATION_CERTIFICATE", "INSURANCE_POLICY", "VEHICLE_REVENUE_LICENCE"] as const;

export async function saveCompliance(fd: FormData) {
  if (!allowed("canManageCompliance")) return;

  const id = text(fd, "id");
  const kind = enumValue(fd, "kind", COMPLIANCE_KINDS);
  const reference = text(fd, "reference");
  const authority = text(fd, "authority");
  const relatesTo = text(fd, "relatesTo");
  const expiryDate = date(fd, "expiryDate");
  if (!kind || !reference || !authority || !relatesTo || !expiryDate) return;

  const data = {
    kind,
    reference,
    authority,
    relatesTo,
    expiryDate,
    issuedDate: date(fd, "issuedDate"),
    notes: text(fd, "notes"),
  };

  if (id) await prisma.complianceRecord.update({ where: { id }, data });
  else await prisma.complianceRecord.create({ data });
  done("/compliance");
}

export async function deleteCompliance(fd: FormData) {
  if (!allowed("canManageCompliance")) return;
  const id = text(fd, "id");
  if (id) await prisma.complianceRecord.delete({ where: { id } });
  done("/compliance");
}

/* ------------------------------------------------------------------ *
 * Reviews
 * ------------------------------------------------------------------ */

export async function saveReview(fd: FormData) {
  if (!allowed("canManageReviews")) return;

  const id = text(fd, "id");
  const author = text(fd, "author");
  const title = text(fd, "title");
  const body = text(fd, "body");
  const reviewDate = date(fd, "date");
  if (!author || !title || !body || !reviewDate) return;

  const rating = int(fd, "rating", 5)!;
  const data = {
    author,
    title,
    body,
    date: reviewDate,
    rating: Math.min(5, Math.max(1, rating)),
    country: text(fd, "country"),
    source: text(fd, "source") ?? "TripAdvisor",
    flightRef: text(fd, "flightRef"),
  };

  if (id) await prisma.review.update({ where: { id }, data });
  else await prisma.review.create({ data });
  done("/reviews");
}

export async function deleteReview(fd: FormData) {
  if (!allowed("canManageReviews")) return;
  const id = text(fd, "id");
  if (id) await prisma.review.delete({ where: { id } });
  done("/reviews");
}
