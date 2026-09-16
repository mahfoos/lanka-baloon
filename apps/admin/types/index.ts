/* ===================================================================
 * Shared domain types for the Lanka Ballooning (Pvt) Ltd ERP.
 * "Sri Lanka Balloon" — Hot Air Balloon rides over Dambulla–Kandalama.
 *
 * For now every module is backed by in-memory dummy data (see lib/*).
 * The shapes below are the single source of truth the UI renders from.
 * =================================================================== */

/* ------------------------------------------------------------------ *
 * Bookings / Reservations
 * ------------------------------------------------------------------ */

export const PACKAGES = [
  "Shared Flight",
  "Private Flight",
  "Marriage Proposal",
  "Birthday Celebration",
  "Wedding Anniversary",
  "Gift Voucher",
] as const;
export type PackageType = (typeof PACKAGES)[number];

export const BOOKING_STATUSES = [
  "Enquiry",
  "Pending Payment",
  "Confirmed",
  "Flown",
  "Cancelled",
  "Weather Hold",
  "Refunded",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_SOURCES = [
  "Website",
  "Phone",
  "Email",
  "Walk-in",
  "Travel Agent",
  "Hotel Concierge",
] as const;
export type BookingSource = (typeof BOOKING_SOURCES)[number];

export interface Booking {
  id: string;
  ref: string;            // e.g. SLB-2026-0042
  customerId: string;
  customerName: string;
  packageType: PackageType;
  flightDate: string;     // ISO date (preferred)
  flightId?: string;      // assigned flight, once scheduled
  adults: number;
  children: number;
  pricePerHead: number;   // LKR
  totalAmount: number;    // LKR
  paidAmount: number;     // LKR
  status: BookingStatus;
  source: BookingSource;
  specialOccasion?: string;
  hotel?: string;         // pick-up hotel
  notes?: string;
  createdAt: string;
}

/* ------------------------------------------------------------------ *
 * Flights / Operations schedule
 * ------------------------------------------------------------------ */

export const FLIGHT_STATUSES = [
  "Scheduled",
  "Boarding",
  "In Flight",
  "Completed",
  "Cancelled - Weather",
  "Postponed",
] as const;
export type FlightStatus = (typeof FLIGHT_STATUSES)[number];

export interface Flight {
  id: string;
  code: string;           // SLB-FL-260612-A
  date: string;           // ISO date
  launchTime: string;     // HH:mm (early morning)
  launchSite: string;     // e.g. Kandalama
  balloonId: string;
  balloonReg: string;
  pilotId: string;
  pilotName: string;
  capacity: number;
  booked: number;
  status: FlightStatus;
  windSpeedKts?: number;
  windDirection?: string;
  durationMins?: number;
  notes?: string;
}

/* ------------------------------------------------------------------ *
 * Fleet — Balloons
 * ------------------------------------------------------------------ */

export const BALLOON_MANUFACTURERS = ["Ultramagic", "Lindstrand"] as const;
export type BalloonManufacturer = (typeof BALLOON_MANUFACTURERS)[number];

export const BALLOON_STATUSES = [
  "Airworthy",
  "In Maintenance",
  "Grounded",
  "Retired",
] as const;
export type BalloonStatus = (typeof BALLOON_STATUSES)[number];

export interface Balloon {
  id: string;
  registration: string;   // 4R-Bxx Sri Lankan civil registration
  name: string;
  manufacturer: BalloonManufacturer;
  model: string;
  envelopeVolumeM3: number;
  basketCapacity: number;
  yearBuilt: number;
  totalFlightHours: number;
  status: BalloonStatus;
  airworthinessExpiry: string;   // ISO date
  lastInspection: string;        // ISO date
  hasSafetyBelts: boolean;
}

/* ------------------------------------------------------------------ *
 * Crew — Pilots & Ground crew
 * ------------------------------------------------------------------ */

export const CREW_ROLES = [
  "Commercial Pilot",
  "Co-Pilot",
  "Ground Crew Lead",
  "Ground Crew",
  "Chase Driver",
  "Retrieve Crew",
] as const;
export type CrewRole = (typeof CREW_ROLES)[number];

export const CREW_STATUSES = ["Active", "On Leave", "Off Season", "Inactive"] as const;
export type CrewStatus = (typeof CREW_STATUSES)[number];

export interface CrewMember {
  id: string;
  empId: string;          // CREW-001
  name: string;
  role: CrewRole;
  status: CrewStatus;
  licenseNo?: string;     // CAASL commercial balloon pilot licence
  licenseExpiry?: string; // ISO date
  validationExpiry?: string;
  yearsExperience: number;
  totalFlightHours?: number;
  phone?: string;
  email?: string;
  joinDate: string;
}

/* ------------------------------------------------------------------ *
 * Customers / CRM
 * ------------------------------------------------------------------ */

export const CUSTOMER_TYPES = ["Tourist", "Local", "Corporate", "Travel Agent"] as const;
export type CustomerType = (typeof CUSTOMER_TYPES)[number];

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  country: string;
  email?: string;
  phone?: string;
  totalBookings: number;
  totalSpent: number;     // LKR
  firstSeen: string;      // ISO date
  notes?: string;
}

/* ------------------------------------------------------------------ *
 * Ground transport — Vehicles
 * ------------------------------------------------------------------ */

export const VEHICLE_TYPES = ["Passenger Van", "Chase 4x4", "Recovery Truck", "Car"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const VEHICLE_STATUSES = ["Available", "On Trip", "Servicing", "Off Road"] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export interface Vehicle {
  id: string;
  registration: string;   // e.g. WP CAB-1234
  type: VehicleType;
  makeModel: string;
  seats: number;
  hasAirConditioning: boolean;
  status: VehicleStatus;
  revenueLicenseExpiry: string;  // ISO date
  insuranceExpiry: string;       // ISO date
  lastServiceOdo: number;
  notes?: string;
}

/* ------------------------------------------------------------------ *
 * Gift vouchers
 * ------------------------------------------------------------------ */

export const VOUCHER_STATUSES = ["Active", "Redeemed", "Expired", "Cancelled"] as const;
export type VoucherStatus = (typeof VOUCHER_STATUSES)[number];

export interface Voucher {
  id: string;
  code: string;           // GIFT-7K3M9
  packageType: PackageType;
  purchaserName: string;
  recipientName?: string;
  amount: number;         // LKR
  issuedDate: string;     // ISO date
  expiryDate: string;     // ISO date (1 year validity)
  status: VoucherStatus;
  redeemedBookingRef?: string;
}

/* ------------------------------------------------------------------ *
 * Finance — Payments & revenue
 * ------------------------------------------------------------------ */

export const PAYMENT_METHODS = ["Card", "Bank Transfer", "Cash", "Online Gateway", "Agent Credit"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const TRANSACTION_TYPES = ["income", "expense"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const EXPENSE_CATEGORIES = [
  "Fuel (LPG)",
  "Salaries",
  "Maintenance",
  "Insurance",
  "Vehicle / Transport",
  "Marketing",
  "CAASL Fees",
  "Catering",
  "Other",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Transaction {
  id: string;
  date: string;           // ISO date
  type: TransactionType;
  category: string;       // PackageType for income, ExpenseCategory for expense
  amount: number;         // LKR
  method: PaymentMethod;
  reference?: string;     // booking ref / invoice no
  description?: string;
}

/* ------------------------------------------------------------------ *
 * Maintenance logs (balloons + vehicles)
 * ------------------------------------------------------------------ */

export const MAINTENANCE_TYPES = [
  "Annual Inspection",
  "Envelope Repair",
  "Burner Service",
  "Basket Service",
  "Vehicle Service",
  "Fuel System Check",
  "Other",
] as const;
export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number];

export const MAINTENANCE_STATUSES = ["Scheduled", "In Progress", "Completed", "Overdue"] as const;
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number];

export interface MaintenanceLog {
  id: string;
  assetType: "Balloon" | "Vehicle";
  assetId: string;
  assetLabel: string;     // registration / name
  type: MaintenanceType;
  status: MaintenanceStatus;
  scheduledDate: string;  // ISO date
  completedDate?: string;
  cost?: number;          // LKR
  engineer?: string;
  notes?: string;
}

/* ------------------------------------------------------------------ *
 * Compliance — CAASL & insurance certifications
 * ------------------------------------------------------------------ */

export const COMPLIANCE_KINDS = [
  "Air Operator Certificate",
  "Aircraft Registration",
  "Airworthiness Certificate",
  "Pilot Licence",
  "Validation Certificate",
  "Insurance Policy",
  "Vehicle Revenue Licence",
] as const;
export type ComplianceKind = (typeof COMPLIANCE_KINDS)[number];

export const COMPLIANCE_STATUSES = ["Valid", "Expiring Soon", "Expired"] as const;
export type ComplianceStatus = (typeof COMPLIANCE_STATUSES)[number];

export interface ComplianceRecord {
  id: string;
  kind: ComplianceKind;
  reference: string;      // certificate / policy number
  authority: string;      // CAASL, Insurer, DMT
  relatesTo: string;      // balloon reg / pilot name / company
  issuedDate: string;     // ISO date
  expiryDate: string;     // ISO date
  notes?: string;
}

/* ------------------------------------------------------------------ *
 * Reviews / testimonials
 * ------------------------------------------------------------------ */

export interface Review {
  id: string;
  author: string;
  country?: string;
  rating: number;         // 1-5
  title: string;
  body: string;
  source: string;         // TripAdvisor, Google, etc.
  date: string;           // ISO date
  flightRef?: string;
}

/* ------------------------------------------------------------------ *
 * Status colour maps (Tailwind classes) — shared across pages
 * ------------------------------------------------------------------ */

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  Enquiry: "bg-slate-100 text-slate-600",
  "Pending Payment": "bg-amber-50 text-amber-700",
  Confirmed: "bg-brand-50 text-brand-700",
  Flown: "bg-green-50 text-green-700",
  Cancelled: "bg-gray-100 text-gray-500",
  "Weather Hold": "bg-sky-50 text-sky-700",
  Refunded: "bg-purple-50 text-purple-700",
};

export const FLIGHT_STATUS_COLORS: Record<FlightStatus, string> = {
  Scheduled: "bg-brand-50 text-brand-700",
  Boarding: "bg-accent-100 text-accent-600",
  "In Flight": "bg-sky-50 text-sky-700",
  Completed: "bg-green-50 text-green-700",
  "Cancelled - Weather": "bg-red-50 text-red-600",
  Postponed: "bg-amber-50 text-amber-700",
};

export const BALLOON_STATUS_COLORS: Record<BalloonStatus, string> = {
  Airworthy: "bg-green-50 text-green-700",
  "In Maintenance": "bg-amber-50 text-amber-700",
  Grounded: "bg-red-50 text-red-600",
  Retired: "bg-gray-100 text-gray-500",
};

export const CREW_STATUS_COLORS: Record<CrewStatus, string> = {
  Active: "bg-green-50 text-green-700",
  "On Leave": "bg-amber-50 text-amber-700",
  "Off Season": "bg-sky-50 text-sky-700",
  Inactive: "bg-gray-100 text-gray-500",
};

export const VEHICLE_STATUS_COLORS: Record<VehicleStatus, string> = {
  Available: "bg-green-50 text-green-700",
  "On Trip": "bg-sky-50 text-sky-700",
  Servicing: "bg-amber-50 text-amber-700",
  "Off Road": "bg-red-50 text-red-600",
};

export const VOUCHER_STATUS_COLORS: Record<VoucherStatus, string> = {
  Active: "bg-green-50 text-green-700",
  Redeemed: "bg-brand-50 text-brand-700",
  Expired: "bg-gray-100 text-gray-500",
  Cancelled: "bg-red-50 text-red-600",
};

export const MAINTENANCE_STATUS_COLORS: Record<MaintenanceStatus, string> = {
  Scheduled: "bg-brand-50 text-brand-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Completed: "bg-green-50 text-green-700",
  Overdue: "bg-red-50 text-red-600",
};

export const COMPLIANCE_STATUS_COLORS: Record<ComplianceStatus, string> = {
  Valid: "bg-green-50 text-green-700",
  "Expiring Soon": "bg-amber-50 text-amber-700",
  Expired: "bg-red-50 text-red-600",
};

export const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [
  "Enquiry",
  "Pending Payment",
  "Confirmed",
  "Weather Hold",
];

/* ------------------------------------------------------------------ *
 * Formatting helpers
 * ------------------------------------------------------------------ */

export function formatCurrency(n: number): string {
  return "Rs. " + Math.round(n).toLocaleString("en-LK");
}

export function formatCompactCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return "Rs. " + (n / 1_000_000).toFixed(1) + "M";
  if (Math.abs(n) >= 1_000) return "Rs. " + (n / 1_000).toFixed(0) + "K";
  return "Rs. " + Math.round(n).toLocaleString("en-LK");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Days from today until the given ISO date (negative = already passed). */
export function daysUntil(iso: string, today = new Date()): number {
  const ms = new Date(iso).getTime() - today.getTime();
  return Math.ceil(ms / 86_400_000);
}

/** Derive a compliance status purely from an expiry date. */
export function complianceStatusFor(expiryDate: string, today = new Date()): ComplianceStatus {
  const d = daysUntil(expiryDate, today);
  if (d < 0) return "Expired";
  if (d <= 60) return "Expiring Soon";
  return "Valid";
}
