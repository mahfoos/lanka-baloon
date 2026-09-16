/**
 * The shared database client.
 *
 * Both apps import from here. Everything in this package is server-only: the
 * connection string is a full Postgres credential, so importing it from a
 * "use client" file would be a serious leak. Next will refuse to bundle it
 * anyway, because `pg` has no browser build, but do not rely on that.
 */
import { PrismaClient } from "../generated/client";

export * from "../generated/client";

// Next's dev server reloads modules on every edit. Without this the process
// accumulates a new pool per reload until Postgres refuses more connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Prisma enums are SCREAMING_CASE because that is the Postgres convention; the
 * UI has always shown title case. These maps are the single translation point,
 * so a label change never means touching a query.
 */
export const PACKAGE_LABELS = {
  SHARED_FLIGHT: "Shared Flight",
  PRIVATE_FLIGHT: "Private Flight",
  MARRIAGE_PROPOSAL: "Marriage Proposal",
  BIRTHDAY_CELEBRATION: "Birthday Celebration",
  WEDDING_ANNIVERSARY: "Wedding Anniversary",
  GIFT_VOUCHER: "Gift Voucher",
} as const;

export const BOOKING_STATUS_LABELS = {
  ENQUIRY: "Enquiry",
  PENDING_PAYMENT: "Pending Payment",
  CONFIRMED: "Confirmed",
  FLOWN: "Flown",
  CANCELLED: "Cancelled",
  WEATHER_HOLD: "Weather Hold",
  REFUNDED: "Refunded",
} as const;

export const BOOKING_SOURCE_LABELS = {
  WEBSITE: "Website",
  PHONE: "Phone",
  EMAIL: "Email",
  WALK_IN: "Walk-in",
  TRAVEL_AGENT: "Travel Agent",
  HOTEL_CONCIERGE: "Hotel Concierge",
} as const;

export const FLIGHT_STATUS_LABELS = {
  SCHEDULED: "Scheduled",
  BOARDING: "Boarding",
  IN_FLIGHT: "In Flight",
  COMPLETED: "Completed",
  CANCELLED_WEATHER: "Cancelled - Weather",
  POSTPONED: "Postponed",
} as const;

export const BALLOON_STATUS_LABELS = {
  AIRWORTHY: "Airworthy",
  IN_MAINTENANCE: "In Maintenance",
  GROUNDED: "Grounded",
  RETIRED: "Retired",
} as const;

export const MANUFACTURER_LABELS = {
  ULTRAMAGIC: "Ultramagic",
  LINDSTRAND: "Lindstrand",
} as const;

export const CREW_ROLE_LABELS = {
  COMMERCIAL_PILOT: "Commercial Pilot",
  CO_PILOT: "Co-Pilot",
  GROUND_CREW_LEAD: "Ground Crew Lead",
  GROUND_CREW: "Ground Crew",
  CHASE_DRIVER: "Chase Driver",
  RETRIEVE_CREW: "Retrieve Crew",
} as const;

export const CREW_STATUS_LABELS = {
  ACTIVE: "Active",
  ON_LEAVE: "On Leave",
  OFF_SEASON: "Off Season",
  INACTIVE: "Inactive",
} as const;

export const CUSTOMER_TYPE_LABELS = {
  TOURIST: "Tourist",
  LOCAL: "Local",
  CORPORATE: "Corporate",
  TRAVEL_AGENT: "Travel Agent",
} as const;

export const VEHICLE_TYPE_LABELS = {
  PASSENGER_VAN: "Passenger Van",
  CHASE_4X4: "Chase 4x4",
  RECOVERY_TRUCK: "Recovery Truck",
  CAR: "Car",
} as const;

export const VEHICLE_STATUS_LABELS = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  SERVICING: "Servicing",
  OFF_ROAD: "Off Road",
} as const;

export const VOUCHER_STATUS_LABELS = {
  ACTIVE: "Active",
  REDEEMED: "Redeemed",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
} as const;

export const PAYMENT_METHOD_LABELS = {
  CARD: "Card",
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
  ONLINE_GATEWAY: "Online Gateway",
  AGENT_CREDIT: "Agent Credit",
} as const;

export const MAINTENANCE_TYPE_LABELS = {
  ANNUAL_INSPECTION: "Annual Inspection",
  ENVELOPE_REPAIR: "Envelope Repair",
  BURNER_SERVICE: "Burner Service",
  BASKET_SERVICE: "Basket Service",
  VEHICLE_SERVICE: "Vehicle Service",
  FUEL_SYSTEM_CHECK: "Fuel System Check",
  OTHER: "Other",
} as const;

export const MAINTENANCE_STATUS_LABELS = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
} as const;

export const COMPLIANCE_KIND_LABELS = {
  AIR_OPERATOR_CERTIFICATE: "Air Operator Certificate",
  AIRCRAFT_REGISTRATION: "Aircraft Registration",
  AIRWORTHINESS_CERTIFICATE: "Airworthiness Certificate",
  PILOT_LICENCE: "Pilot Licence",
  VALIDATION_CERTIFICATE: "Validation Certificate",
  INSURANCE_POLICY: "Insurance Policy",
  VEHICLE_REVENUE_LICENCE: "Vehicle Revenue Licence",
} as const;

/** Prisma returns Decimal objects; the UI wants a plain number. */
export function toNumber(value: { toString(): string } | null | undefined): number {
  return value == null ? 0 : Number(value.toString());
}
