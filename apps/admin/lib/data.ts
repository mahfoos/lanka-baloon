/**
 * In-memory dummy dataset for the Sri Lanka Balloon ERP.
 *
 * Everything the UI shows is seeded here. Swap these arrays for real database
 * queries later — the accessor functions below are the only surface the rest of
 * the app depends on. The season modelled is Nov 2025 → May 2026 (the operator
 * flies November to May); "today" in the demo is mid-2026 off-season.
 */
import type {
  Balloon, Booking, ComplianceRecord, CrewMember, Customer, Flight,
  MaintenanceLog, Review, Transaction, Vehicle, Voucher,
} from "@/types";

/* ------------------------------------------------------------------ *
 * Fleet — Balloons
 * ------------------------------------------------------------------ */

export const BALLOONS: Balloon[] = [
  {
    id: "bal-1", registration: "4R-B01", name: "Kandalama Dawn",
    manufacturer: "Ultramagic", model: "N-355", envelopeVolumeM3: 10050,
    basketCapacity: 8, yearBuilt: 2021, totalFlightHours: 612, status: "Airworthy",
    airworthinessExpiry: "2026-11-30", lastInspection: "2026-05-18", hasSafetyBelts: true,
  },
  {
    id: "bal-2", registration: "4R-B02", name: "Sigiriya Spirit",
    manufacturer: "Ultramagic", model: "N-300", envelopeVolumeM3: 8500,
    basketCapacity: 6, yearBuilt: 2022, totalFlightHours: 438, status: "Airworthy",
    airworthinessExpiry: "2027-01-15", lastInspection: "2026-05-20", hasSafetyBelts: true,
  },
  {
    id: "bal-3", registration: "4R-B03", name: "Dambulla Sky",
    manufacturer: "Lindstrand", model: "LBL 317A", envelopeVolumeM3: 8970,
    basketCapacity: 7, yearBuilt: 2020, totalFlightHours: 845, status: "In Maintenance",
    airworthinessExpiry: "2026-08-31", lastInspection: "2026-06-10", hasSafetyBelts: true,
  },
  {
    id: "bal-4", registration: "4R-B04", name: "Paradise Voyager",
    manufacturer: "Lindstrand", model: "LBL 360A", envelopeVolumeM3: 10190,
    basketCapacity: 8, yearBuilt: 2023, totalFlightHours: 286, status: "Airworthy",
    airworthinessExpiry: "2027-03-22", lastInspection: "2026-05-15", hasSafetyBelts: true,
  },
];

/* ------------------------------------------------------------------ *
 * Crew — Pilots & ground crew
 * ------------------------------------------------------------------ */

export const CREW: CrewMember[] = [
  {
    id: "crew-1", empId: "CREW-001", name: "Capt. David Hughes", role: "Commercial Pilot",
    status: "Active", licenseNo: "CAASL-CBPL-014", licenseExpiry: "2027-02-28",
    validationExpiry: "2026-12-31", yearsExperience: 24, totalFlightHours: 4120,
    phone: "+94 77 123 4501", email: "david@srilankaballoon.com", joinDate: "2017-10-01",
  },
  {
    id: "crew-2", empId: "CREW-002", name: "Capt. Andris Bērziņš", role: "Commercial Pilot",
    status: "Active", licenseNo: "CAASL-CBPL-022", licenseExpiry: "2026-11-15",
    validationExpiry: "2026-11-15", yearsExperience: 18, totalFlightHours: 3050,
    phone: "+94 77 123 4502", email: "andris@srilankaballoon.com", joinDate: "2018-11-05",
  },
  {
    id: "crew-3", empId: "CREW-003", name: "Capt. Maria Gonzalez", role: "Commercial Pilot",
    status: "Off Season", licenseNo: "CAASL-CBPL-031", licenseExpiry: "2027-05-30",
    validationExpiry: "2027-01-20", yearsExperience: 15, totalFlightHours: 2480,
    phone: "+94 77 123 4503", email: "maria@srilankaballoon.com", joinDate: "2019-10-12",
  },
  {
    id: "crew-4", empId: "CREW-004", name: "Nuwan Perera", role: "Ground Crew Lead",
    status: "Active", yearsExperience: 9, phone: "+94 71 555 7801",
    email: "nuwan@srilankaballoon.com", joinDate: "2017-09-15",
  },
  {
    id: "crew-5", empId: "CREW-005", name: "Kasun Jayawardena", role: "Ground Crew",
    status: "Active", yearsExperience: 6, phone: "+94 71 555 7802", joinDate: "2019-10-20",
  },
  {
    id: "crew-6", empId: "CREW-006", name: "Tharindu Silva", role: "Chase Driver",
    status: "Active", yearsExperience: 7, phone: "+94 71 555 7803", joinDate: "2018-11-01",
  },
  {
    id: "crew-7", empId: "CREW-007", name: "Dilshan Rathnayake", role: "Retrieve Crew",
    status: "On Leave", yearsExperience: 4, phone: "+94 71 555 7804", joinDate: "2021-10-10",
  },
  {
    id: "crew-8", empId: "CREW-008", name: "Ishara Bandara", role: "Ground Crew",
    status: "Active", yearsExperience: 3, phone: "+94 71 555 7805", joinDate: "2022-11-02",
  },
];

/* ------------------------------------------------------------------ *
 * Vehicles — ground transport
 * ------------------------------------------------------------------ */

export const VEHICLES: Vehicle[] = [
  {
    id: "veh-1", registration: "WP CAB-1234", type: "Passenger Van", makeModel: "Toyota Hiace 2023",
    seats: 12, hasAirConditioning: true, status: "Available",
    revenueLicenseExpiry: "2027-03-31", insuranceExpiry: "2026-12-15", lastServiceOdo: 48200,
  },
  {
    id: "veh-2", registration: "WP CAB-5678", type: "Passenger Van", makeModel: "Toyota Hiace 2022",
    seats: 12, hasAirConditioning: true, status: "Available",
    revenueLicenseExpiry: "2026-09-30", insuranceExpiry: "2026-11-20", lastServiceOdo: 61500,
  },
  {
    id: "veh-3", registration: "NC CAA-9012", type: "Chase 4x4", makeModel: "Mitsubishi L200 2021",
    seats: 5, hasAirConditioning: true, status: "On Trip",
    revenueLicenseExpiry: "2026-08-31", insuranceExpiry: "2027-01-10", lastServiceOdo: 88900,
  },
  {
    id: "veh-4", registration: "NC CAA-3456", type: "Recovery Truck", makeModel: "Isuzu ELF 2020",
    seats: 3, hasAirConditioning: false, status: "Servicing",
    revenueLicenseExpiry: "2026-07-31", insuranceExpiry: "2026-10-05", lastServiceOdo: 102400,
  },
  {
    id: "veh-5", registration: "WP CAR-7788", type: "Car", makeModel: "Toyota Premio 2022",
    seats: 4, hasAirConditioning: true, status: "Available",
    revenueLicenseExpiry: "2027-02-28", insuranceExpiry: "2026-12-30", lastServiceOdo: 35100,
  },
];

/* ------------------------------------------------------------------ *
 * Customers
 * ------------------------------------------------------------------ */

export const CUSTOMERS: Customer[] = [
  { id: "cus-1", name: "Damla Yilmaz", type: "Tourist", country: "Turkey", email: "damla.y@example.com", phone: "+90 532 111 2233", totalBookings: 1, totalSpent: 110000, firstSeen: "2025-11-25" },
  { id: "cus-2", name: "Gabriella Kovács", type: "Tourist", country: "Hungary", email: "gabriella.k@example.com", phone: "+36 30 222 3344", totalBookings: 2, totalSpent: 240000, firstSeen: "2025-12-02" },
  { id: "cus-3", name: "Helen Mitchell", type: "Tourist", country: "United Kingdom", email: "helen.m@example.com", phone: "+44 7700 900123", totalBookings: 1, totalSpent: 130000, firstSeen: "2026-04-10" },
  { id: "cus-4", name: "Marcus Weber", type: "Tourist", country: "Germany", email: "marcus.w@example.com", phone: "+49 151 2233 4455", totalBookings: 1, totalSpent: 220000, firstSeen: "2026-01-14" },
  { id: "cus-5", name: "Aiko Tanaka", type: "Tourist", country: "Japan", email: "aiko.t@example.com", phone: "+81 90 1234 5678", totalBookings: 1, totalSpent: 130000, firstSeen: "2026-02-08" },
  { id: "cus-6", name: "Priya & Arjun Nair", type: "Tourist", country: "India", email: "priya.nair@example.com", phone: "+91 98765 43210", totalBookings: 1, totalSpent: 260000, firstSeen: "2026-01-28" },
  { id: "cus-7", name: "Ceylon Roots Travel", type: "Travel Agent", country: "Sri Lanka", email: "bookings@ceylonroots.example", phone: "+94 11 234 5678", totalBookings: 4, totalSpent: 520000, firstSeen: "2025-11-10" },
  { id: "cus-8", name: "Heritance Kandalama", type: "Corporate", country: "Sri Lanka", email: "concierge@heritance.example", phone: "+94 66 555 0000", totalBookings: 3, totalSpent: 390000, firstSeen: "2025-11-18" },
  { id: "cus-9", name: "Dimuthu Ranasinghe", type: "Local", country: "Sri Lanka", email: "dimuthu.r@example.com", phone: "+94 76 888 9900", totalBookings: 1, totalSpent: 130000, firstSeen: "2026-02-20" },
  { id: "cus-10", name: "Sophie Laurent", type: "Tourist", country: "France", email: "sophie.l@example.com", phone: "+33 6 12 34 56 78", totalBookings: 1, totalSpent: 130000, firstSeen: "2026-03-05" },
  { id: "cus-11", name: "Brightway Logistics", type: "Corporate", country: "Sri Lanka", email: "events@brightway.example", phone: "+94 11 777 8899", totalBookings: 1, totalSpent: 480000, firstSeen: "2026-03-18" },
  { id: "cus-12", name: "Liam O'Connor", type: "Tourist", country: "Ireland", email: "liam.o@example.com", phone: "+353 85 123 4567", totalBookings: 1, totalSpent: 130000, firstSeen: "2026-04-22" },
];

/* ------------------------------------------------------------------ *
 * Bookings
 * ------------------------------------------------------------------ */

export const BOOKINGS: Booking[] = [
  { id: "bk-1", ref: "SLB-2025-0118", customerId: "cus-1", customerName: "Damla Yilmaz", packageType: "Shared Flight", flightDate: "2025-11-26", flightId: "fl-1", adults: 1, children: 0, pricePerHead: 110000, totalAmount: 110000, paidAmount: 110000, status: "Flown", source: "Website", hotel: "Amaya Lake", createdAt: "2025-11-20T08:12:00Z" },
  { id: "bk-2", ref: "SLB-2025-0124", customerId: "cus-2", customerName: "Gabriella Kovács", packageType: "Private Flight", flightDate: "2025-12-04", flightId: "fl-2", adults: 2, children: 0, pricePerHead: 120000, totalAmount: 240000, paidAmount: 240000, status: "Flown", source: "Website", specialOccasion: "Honeymoon", hotel: "Heritance Kandalama", createdAt: "2025-11-28T10:05:00Z" },
  { id: "bk-3", ref: "SLB-2026-0007", customerId: "cus-4", customerName: "Marcus Weber", packageType: "Marriage Proposal", flightDate: "2026-01-16", flightId: "fl-4", adults: 2, children: 0, pricePerHead: 110000, totalAmount: 220000, paidAmount: 220000, status: "Flown", source: "Email", specialOccasion: "Marriage proposal — banner + champagne", hotel: "Jetwing Lake", createdAt: "2026-01-02T14:40:00Z" },
  { id: "bk-4", ref: "SLB-2026-0011", customerId: "cus-6", customerName: "Priya & Arjun Nair", packageType: "Wedding Anniversary", flightDate: "2026-01-29", flightId: "fl-5", adults: 2, children: 0, pricePerHead: 130000, totalAmount: 260000, paidAmount: 260000, status: "Flown", source: "Travel Agent", specialOccasion: "5th anniversary", hotel: "Aliya Resort", createdAt: "2026-01-15T09:20:00Z" },
  { id: "bk-5", ref: "SLB-2026-0019", customerId: "cus-5", customerName: "Aiko Tanaka", packageType: "Shared Flight", flightDate: "2026-02-09", flightId: "fl-6", adults: 1, children: 0, pricePerHead: 130000, totalAmount: 130000, paidAmount: 130000, status: "Flown", source: "Hotel Concierge", hotel: "Heritance Kandalama", createdAt: "2026-01-30T11:00:00Z" },
  { id: "bk-6", ref: "SLB-2026-0023", customerId: "cus-9", customerName: "Dimuthu Ranasinghe", packageType: "Birthday Celebration", flightDate: "2026-02-21", flightId: "fl-7", adults: 1, children: 0, pricePerHead: 130000, totalAmount: 130000, paidAmount: 130000, status: "Flown", source: "Phone", specialOccasion: "30th birthday", hotel: "Self drive", createdAt: "2026-02-10T16:30:00Z" },
  { id: "bk-7", ref: "SLB-2026-0031", customerId: "cus-10", customerName: "Sophie Laurent", packageType: "Shared Flight", flightDate: "2026-03-06", flightId: "fl-8", adults: 1, children: 0, pricePerHead: 130000, totalAmount: 130000, paidAmount: 130000, status: "Flown", source: "Website", hotel: "Sigiriya Village", createdAt: "2026-02-24T07:45:00Z" },
  { id: "bk-8", ref: "SLB-2026-0036", customerId: "cus-11", customerName: "Brightway Logistics", packageType: "Private Flight", flightDate: "2026-03-19", flightId: "fl-9", adults: 4, children: 0, pricePerHead: 120000, totalAmount: 480000, paidAmount: 480000, status: "Flown", source: "Email", specialOccasion: "Corporate incentive", hotel: "Water Garden Sigiriya", createdAt: "2026-03-02T13:10:00Z" },
  { id: "bk-9", ref: "SLB-2026-0040", customerId: "cus-3", customerName: "Helen Mitchell", packageType: "Shared Flight", flightDate: "2026-04-12", flightId: "fl-10", adults: 1, children: 0, pricePerHead: 130000, totalAmount: 130000, paidAmount: 130000, status: "Flown", source: "Website", hotel: "Pelwehera Village", createdAt: "2026-04-01T09:00:00Z" },
  { id: "bk-10", ref: "SLB-2026-0044", customerId: "cus-12", customerName: "Liam O'Connor", packageType: "Shared Flight", flightDate: "2026-04-23", flightId: "fl-11", adults: 1, children: 0, pricePerHead: 130000, totalAmount: 130000, paidAmount: 130000, status: "Flown", source: "Travel Agent", hotel: "Thilanka Resort", createdAt: "2026-04-12T15:25:00Z" },
  { id: "bk-11", ref: "SLB-2026-0051", customerId: "cus-7", customerName: "Ceylon Roots Travel", packageType: "Shared Flight", flightDate: "2026-05-02", flightId: "fl-12", adults: 4, children: 0, pricePerHead: 125000, totalAmount: 500000, paidAmount: 250000, status: "Confirmed", source: "Travel Agent", hotel: "Various", notes: "Group of 4 — balance on arrival", createdAt: "2026-04-20T10:30:00Z" },
  { id: "bk-12", ref: "SLB-2026-0058", customerId: "cus-8", customerName: "Heritance Kandalama", packageType: "Private Flight", flightDate: "2026-11-22", adults: 2, children: 0, pricePerHead: 130000, totalAmount: 260000, paidAmount: 0, status: "Enquiry", source: "Hotel Concierge", notes: "Next season opener — awaiting dates", createdAt: "2026-06-15T12:00:00Z" },
  { id: "bk-13", ref: "SLB-2026-0059", customerId: "cus-2", customerName: "Gabriella Kovács", packageType: "Gift Voucher", flightDate: "2026-12-10", adults: 2, children: 0, pricePerHead: 130000, totalAmount: 260000, paidAmount: 260000, status: "Confirmed", source: "Website", specialOccasion: "Christmas gift", notes: "Voucher GIFT-7K3M9", createdAt: "2026-06-18T09:15:00Z" },
  { id: "bk-14", ref: "SLB-2026-0061", customerId: "cus-9", customerName: "Dimuthu Ranasinghe", packageType: "Shared Flight", flightDate: "2026-11-28", adults: 2, children: 1, pricePerHead: 130000, totalAmount: 390000, paidAmount: 100000, status: "Pending Payment", source: "Phone", notes: "Family flight — deposit paid", createdAt: "2026-06-20T18:40:00Z" },
  { id: "bk-15", ref: "SLB-2026-0048", customerId: "cus-1", customerName: "Damla Yilmaz", packageType: "Shared Flight", flightDate: "2026-04-28", adults: 1, children: 0, pricePerHead: 130000, totalAmount: 130000, paidAmount: 0, status: "Cancelled", source: "Website", notes: "Cancelled — weather, full refund issued", createdAt: "2026-04-18T08:00:00Z" },
];

/* ------------------------------------------------------------------ *
 * Flights — operations schedule
 * ------------------------------------------------------------------ */

export const FLIGHTS: Flight[] = [
  { id: "fl-1", code: "SLB-FL-251126-A", date: "2025-11-26", launchTime: "05:45", launchSite: "Kandalama", balloonId: "bal-1", balloonReg: "4R-B01", pilotId: "crew-1", pilotName: "Capt. David Hughes", capacity: 8, booked: 6, status: "Completed", windSpeedKts: 5, windDirection: "NE", durationMins: 62 },
  { id: "fl-2", code: "SLB-FL-251204-A", date: "2025-12-04", launchTime: "05:50", launchSite: "Dambulla", balloonId: "bal-2", balloonReg: "4R-B02", pilotId: "crew-2", pilotName: "Capt. Andris Bērziņš", capacity: 6, booked: 2, status: "Completed", windSpeedKts: 4, windDirection: "E", durationMins: 58 },
  { id: "fl-4", code: "SLB-FL-260116-A", date: "2026-01-16", launchTime: "05:40", launchSite: "Kandalama", balloonId: "bal-4", balloonReg: "4R-B04", pilotId: "crew-1", pilotName: "Capt. David Hughes", capacity: 8, booked: 2, status: "Completed", windSpeedKts: 6, windDirection: "NE", durationMins: 65 },
  { id: "fl-5", code: "SLB-FL-260129-A", date: "2026-01-29", launchTime: "05:45", launchSite: "Sigiriya", balloonId: "bal-1", balloonReg: "4R-B01", pilotId: "crew-3", pilotName: "Capt. Maria Gonzalez", capacity: 8, booked: 2, status: "Completed", windSpeedKts: 3, windDirection: "SE", durationMins: 70 },
  { id: "fl-6", code: "SLB-FL-260209-A", date: "2026-02-09", launchTime: "05:50", launchSite: "Kandalama", balloonId: "bal-2", balloonReg: "4R-B02", pilotId: "crew-2", pilotName: "Capt. Andris Bērziņš", capacity: 6, booked: 5, status: "Completed", windSpeedKts: 5, windDirection: "NE", durationMins: 60 },
  { id: "fl-7", code: "SLB-FL-260221-A", date: "2026-02-21", launchTime: "05:40", launchSite: "Dambulla", balloonId: "bal-4", balloonReg: "4R-B04", pilotId: "crew-1", pilotName: "Capt. David Hughes", capacity: 8, booked: 4, status: "Completed", windSpeedKts: 7, windDirection: "E", durationMins: 55 },
  { id: "fl-8", code: "SLB-FL-260306-A", date: "2026-03-06", launchTime: "05:45", launchSite: "Kandalama", balloonId: "bal-1", balloonReg: "4R-B01", pilotId: "crew-3", pilotName: "Capt. Maria Gonzalez", capacity: 8, booked: 6, status: "Completed", windSpeedKts: 4, windDirection: "NE", durationMins: 64 },
  { id: "fl-9", code: "SLB-FL-260319-A", date: "2026-03-19", launchTime: "05:50", launchSite: "Sigiriya", balloonId: "bal-4", balloonReg: "4R-B04", pilotId: "crew-1", pilotName: "Capt. David Hughes", capacity: 8, booked: 4, status: "Completed", windSpeedKts: 5, windDirection: "SE", durationMins: 68 },
  { id: "fl-10", code: "SLB-FL-260412-A", date: "2026-04-12", launchTime: "05:55", launchSite: "Kandalama", balloonId: "bal-2", balloonReg: "4R-B02", pilotId: "crew-2", pilotName: "Capt. Andris Bērziņš", capacity: 6, booked: 5, status: "Completed", windSpeedKts: 6, windDirection: "NE", durationMins: 59 },
  { id: "fl-11", code: "SLB-FL-260423-A", date: "2026-04-23", launchTime: "05:55", launchSite: "Dambulla", balloonId: "bal-1", balloonReg: "4R-B01", pilotId: "crew-1", pilotName: "Capt. David Hughes", capacity: 8, booked: 7, status: "Completed", windSpeedKts: 5, windDirection: "E", durationMins: 66 },
  { id: "fl-12", code: "SLB-FL-260502-A", date: "2026-05-02", launchTime: "06:00", launchSite: "Kandalama", balloonId: "bal-4", balloonReg: "4R-B04", pilotId: "crew-3", pilotName: "Capt. Maria Gonzalez", capacity: 8, booked: 4, status: "Scheduled", windSpeedKts: 4, windDirection: "NE" },
  { id: "fl-13", code: "SLB-FL-261122-A", date: "2026-11-22", launchTime: "05:45", launchSite: "Kandalama", balloonId: "bal-1", balloonReg: "4R-B01", pilotId: "crew-1", pilotName: "Capt. David Hughes", capacity: 8, booked: 2, status: "Scheduled", notes: "Season opener" },
];

/* ------------------------------------------------------------------ *
 * Gift vouchers
 * ------------------------------------------------------------------ */

export const VOUCHERS: Voucher[] = [
  { id: "vc-1", code: "GIFT-7K3M9", packageType: "Private Flight", purchaserName: "Gabriella Kovács", recipientName: "Anna Kovács", amount: 260000, issuedDate: "2026-06-18", expiryDate: "2027-06-18", status: "Active", redeemedBookingRef: "SLB-2026-0059" },
  { id: "vc-2", code: "GIFT-2P8L4", packageType: "Shared Flight", purchaserName: "Marcus Weber", recipientName: "Lena Weber", amount: 130000, issuedDate: "2026-05-30", expiryDate: "2027-05-30", status: "Active" },
  { id: "vc-3", code: "GIFT-9X1Q7", packageType: "Birthday Celebration", purchaserName: "Helen Mitchell", recipientName: "Tom Mitchell", amount: 130000, issuedDate: "2025-12-20", expiryDate: "2026-12-20", status: "Active" },
  { id: "vc-4", code: "GIFT-5R6T2", packageType: "Shared Flight", purchaserName: "Ceylon Roots Travel", amount: 125000, issuedDate: "2025-11-15", expiryDate: "2026-11-15", status: "Redeemed", redeemedBookingRef: "SLB-2026-0051" },
  { id: "vc-5", code: "GIFT-3H8N5", packageType: "Wedding Anniversary", purchaserName: "Priya Nair", recipientName: "Arjun Nair", amount: 260000, issuedDate: "2025-12-25", expiryDate: "2026-12-25", status: "Active" },
  { id: "vc-6", code: "GIFT-1D4F8", packageType: "Shared Flight", purchaserName: "Sophie Laurent", amount: 130000, issuedDate: "2024-11-10", expiryDate: "2025-11-10", status: "Expired" },
  { id: "vc-7", code: "GIFT-6B2C9", packageType: "Private Flight", purchaserName: "Brightway Logistics", amount: 240000, issuedDate: "2026-04-01", expiryDate: "2027-04-01", status: "Active" },
  { id: "vc-8", code: "GIFT-8M5K1", packageType: "Marriage Proposal", purchaserName: "Liam O'Connor", recipientName: "Niamh Byrne", amount: 220000, issuedDate: "2026-03-12", expiryDate: "2027-03-12", status: "Cancelled" },
];

/* ------------------------------------------------------------------ *
 * Finance — transactions
 * ------------------------------------------------------------------ */

export const TRANSACTIONS: Transaction[] = [
  // Income (booking revenue)
  { id: "tx-1", date: "2025-11-26", type: "income", category: "Shared Flight", amount: 110000, method: "Online Gateway", reference: "SLB-2025-0118" },
  { id: "tx-2", date: "2025-12-04", type: "income", category: "Private Flight", amount: 240000, method: "Card", reference: "SLB-2025-0124" },
  { id: "tx-3", date: "2026-01-16", type: "income", category: "Marriage Proposal", amount: 220000, method: "Bank Transfer", reference: "SLB-2026-0007" },
  { id: "tx-4", date: "2026-01-29", type: "income", category: "Wedding Anniversary", amount: 260000, method: "Agent Credit", reference: "SLB-2026-0011" },
  { id: "tx-5", date: "2026-02-09", type: "income", category: "Shared Flight", amount: 130000, method: "Card", reference: "SLB-2026-0019" },
  { id: "tx-6", date: "2026-02-21", type: "income", category: "Birthday Celebration", amount: 130000, method: "Cash", reference: "SLB-2026-0023" },
  { id: "tx-7", date: "2026-03-06", type: "income", category: "Shared Flight", amount: 130000, method: "Online Gateway", reference: "SLB-2026-0031" },
  { id: "tx-8", date: "2026-03-19", type: "income", category: "Private Flight", amount: 480000, method: "Bank Transfer", reference: "SLB-2026-0036" },
  { id: "tx-9", date: "2026-04-12", type: "income", category: "Shared Flight", amount: 130000, method: "Online Gateway", reference: "SLB-2026-0040" },
  { id: "tx-10", date: "2026-04-23", type: "income", category: "Shared Flight", amount: 130000, method: "Agent Credit", reference: "SLB-2026-0044" },
  { id: "tx-11", date: "2026-04-20", type: "income", category: "Shared Flight", amount: 250000, method: "Agent Credit", reference: "SLB-2026-0051", description: "Group deposit (50%)" },
  // Expenses
  { id: "tx-12", date: "2025-11-05", type: "expense", category: "Insurance", amount: 1850000, method: "Bank Transfer", description: "Annual hull & passenger liability premium" },
  { id: "tx-13", date: "2025-11-30", type: "expense", category: "Fuel (LPG)", amount: 320000, method: "Cash", description: "November LPG refills" },
  { id: "tx-14", date: "2025-12-31", type: "expense", category: "Salaries", amount: 1450000, method: "Bank Transfer", description: "December payroll — pilots & crew" },
  { id: "tx-15", date: "2026-01-15", type: "expense", category: "Maintenance", amount: 680000, method: "Bank Transfer", description: "4R-B03 annual inspection" },
  { id: "tx-16", date: "2026-01-31", type: "expense", category: "Salaries", amount: 1450000, method: "Bank Transfer", description: "January payroll" },
  { id: "tx-17", date: "2026-02-10", type: "expense", category: "Fuel (LPG)", amount: 410000, method: "Cash", description: "Peak season LPG" },
  { id: "tx-18", date: "2026-02-20", type: "expense", category: "Marketing", amount: 250000, method: "Card", description: "Digital ads — Q1" },
  { id: "tx-19", date: "2026-03-01", type: "expense", category: "CAASL Fees", amount: 175000, method: "Bank Transfer", description: "Annual operator & registration fees" },
  { id: "tx-20", date: "2026-03-15", type: "expense", category: "Vehicle / Transport", amount: 230000, method: "Cash", description: "Van service + fuel" },
  { id: "tx-21", date: "2026-03-31", type: "expense", category: "Salaries", amount: 1500000, method: "Bank Transfer", description: "March payroll" },
  { id: "tx-22", date: "2026-04-12", type: "expense", category: "Catering", amount: 145000, method: "Cash", description: "Launch-site breakfasts" },
  { id: "tx-23", date: "2026-04-28", type: "expense", category: "Maintenance", amount: 95000, method: "Card", description: "Burner service — 4R-B02" },
  { id: "tx-24", date: "2026-04-25", type: "expense", category: "Fuel (LPG)", amount: 360000, method: "Cash", description: "April LPG" },
];

/* ------------------------------------------------------------------ *
 * Maintenance logs
 * ------------------------------------------------------------------ */

export const MAINTENANCE: MaintenanceLog[] = [
  { id: "mt-1", assetType: "Balloon", assetId: "bal-3", assetLabel: "4R-B03 · Dambulla Sky", type: "Annual Inspection", status: "In Progress", scheduledDate: "2026-06-10", cost: 680000, engineer: "Ultramagic SL Service", notes: "Envelope porosity test + AD compliance" },
  { id: "mt-2", assetType: "Balloon", assetId: "bal-2", assetLabel: "4R-B02 · Sigiriya Spirit", type: "Burner Service", status: "Completed", scheduledDate: "2026-04-28", completedDate: "2026-04-29", cost: 95000, engineer: "In-house" },
  { id: "mt-3", assetType: "Balloon", assetId: "bal-1", assetLabel: "4R-B01 · Kandalama Dawn", type: "Envelope Repair", status: "Completed", scheduledDate: "2026-03-02", completedDate: "2026-03-04", cost: 120000, engineer: "In-house", notes: "Minor panel patch" },
  { id: "mt-4", assetType: "Vehicle", assetId: "veh-4", assetLabel: "NC CAA-3456 · Recovery Truck", type: "Vehicle Service", status: "In Progress", scheduledDate: "2026-06-22", engineer: "Isuzu Lanka", notes: "Brakes + 100k service" },
  { id: "mt-5", assetType: "Vehicle", assetId: "veh-2", assetLabel: "WP CAB-5678 · Hiace", type: "Vehicle Service", status: "Completed", scheduledDate: "2026-03-15", completedDate: "2026-03-15", cost: 85000, engineer: "Toyota Lanka" },
  { id: "mt-6", assetType: "Balloon", assetId: "bal-4", assetLabel: "4R-B04 · Paradise Voyager", type: "Annual Inspection", status: "Scheduled", scheduledDate: "2026-09-15", engineer: "Lindstrand Service", notes: "Pre-season airworthiness renewal" },
  { id: "mt-7", assetType: "Balloon", assetId: "bal-1", assetLabel: "4R-B01 · Kandalama Dawn", type: "Annual Inspection", status: "Scheduled", scheduledDate: "2026-10-20", engineer: "Ultramagic SL Service" },
  { id: "mt-8", assetType: "Vehicle", assetId: "veh-3", assetLabel: "NC CAA-9012 · Chase 4x4", type: "Vehicle Service", status: "Overdue", scheduledDate: "2026-05-30", engineer: "Mitsubishi Service", notes: "Awaiting parts" },
];

/* ------------------------------------------------------------------ *
 * Compliance / certifications
 * ------------------------------------------------------------------ */

export const COMPLIANCE: ComplianceRecord[] = [
  { id: "cp-1", kind: "Air Operator Certificate", reference: "CAASL-AOC-HAB-007", authority: "CAASL", relatesTo: "Lanka Ballooning (Pvt) Ltd", issuedDate: "2024-10-01", expiryDate: "2027-09-30", notes: "Hot Air Balloon commercial operations" },
  { id: "cp-2", kind: "Aircraft Registration", reference: "4R-B01", authority: "CAASL", relatesTo: "4R-B01 · Kandalama Dawn", issuedDate: "2021-09-15", expiryDate: "2031-09-15" },
  { id: "cp-3", kind: "Airworthiness Certificate", reference: "AWC-4RB01-26", authority: "CAASL", relatesTo: "4R-B01 · Kandalama Dawn", issuedDate: "2025-11-30", expiryDate: "2026-11-30" },
  { id: "cp-4", kind: "Airworthiness Certificate", reference: "AWC-4RB03-26", authority: "CAASL", relatesTo: "4R-B03 · Dambulla Sky", issuedDate: "2025-08-31", expiryDate: "2026-08-31", notes: "Renewal in progress with annual inspection" },
  { id: "cp-5", kind: "Pilot Licence", reference: "CAASL-CBPL-014", authority: "CAASL", relatesTo: "Capt. David Hughes", issuedDate: "2022-02-28", expiryDate: "2027-02-28" },
  { id: "cp-6", kind: "Validation Certificate", reference: "VAL-CBPL-022", authority: "CAASL", relatesTo: "Capt. Andris Bērziņš", issuedDate: "2025-11-15", expiryDate: "2026-11-15", notes: "Foreign licence validation" },
  { id: "cp-7", kind: "Insurance Policy", reference: "AVN-2026-SLB-118", authority: "Ceylinco Aviation", relatesTo: "Fleet — hull & passenger liability", issuedDate: "2025-11-05", expiryDate: "2026-11-05" },
  { id: "cp-8", kind: "Vehicle Revenue Licence", reference: "RL-CAB-1234", authority: "Dept. of Motor Traffic", relatesTo: "WP CAB-1234 · Hiace", issuedDate: "2026-04-01", expiryDate: "2027-03-31" },
  { id: "cp-9", kind: "Vehicle Revenue Licence", reference: "RL-CAA-3456", authority: "Dept. of Motor Traffic", relatesTo: "NC CAA-3456 · Recovery Truck", issuedDate: "2025-08-01", expiryDate: "2026-07-31", notes: "Renewal due soon" },
  { id: "cp-10", kind: "Validation Certificate", reference: "VAL-CBPL-031", authority: "CAASL", relatesTo: "Capt. Maria Gonzalez", issuedDate: "2026-01-20", expiryDate: "2027-01-20" },
];

/* ------------------------------------------------------------------ *
 * Reviews / testimonials
 * ------------------------------------------------------------------ */

export const REVIEWS: Review[] = [
  { id: "rv-1", author: "Damla Y", country: "Turkey", rating: 5, title: "Beautiful Sri Lanka", body: "Sri Lanka is an amazing country to fly above that paradise island. Lanka Ballooning company services fully professional. Thanks to all team.", source: "TripAdvisor", date: "2023-11-27", flightRef: "SLB-2025-0118" },
  { id: "rv-2", author: "Gabriella K", country: "Hungary", rating: 5, title: "A must-do in Sri Lanka", body: "Absolutely incredible experience. The scenery against the colours of sunrise is a must-see. Stunning is the only word for it! The balloon ride itself was so calming.", source: "TripAdvisor", date: "2024-04-04", flightRef: "SLB-2025-0124" },
  { id: "rv-3", author: "Lanka B", country: "Sri Lanka", rating: 5, title: "Unique Experience", body: "Hot Air Balloon rides have been a must for me but in Sri Lanka it's different. The area is pretty cool — hills, lakes, jungles, fishermen, temples and all. Special thanks to the team.", source: "TripAdvisor", date: "2023-11-26" },
  { id: "rv-4", author: "171HelenM", country: "United Kingdom", rating: 5, title: "Stunning!", body: "Wonderful experience from start to finish. Great communication whilst booking, pick up from our hotel as expected and a safe and beautiful flight. Our pilot was knowledgable and answered all our questions.", source: "TripAdvisor", date: "2024-04-14", flightRef: "SLB-2026-0040" },
  { id: "rv-5", author: "Marcus W", country: "Germany", rating: 5, title: "She said yes!", body: "Booked the marriage proposal package — the banner and champagne at 500 feet were perfect. The crew handled everything flawlessly. Unforgettable.", source: "Google", date: "2026-01-17", flightRef: "SLB-2026-0007" },
  { id: "rv-6", author: "Aiko T", country: "Japan", rating: 4, title: "Calm and scenic", body: "Beautiful sunrise flight over Kandalama lake. Longer flight time than I expected. Friendly ground crew and a lovely breakfast at the launch site.", source: "Google", date: "2026-02-10", flightRef: "SLB-2026-0019" },
];

/* ================================================================== *
 * Accessors — the only surface the rest of the app depends on.
 * Returned copies are sorted for stable, sensible display ordering.
 * ================================================================== */

export function listBalloons(): Balloon[] {
  return [...BALLOONS].sort((a, b) => a.registration.localeCompare(b.registration));
}
export function listCrew(): CrewMember[] {
  return [...CREW].sort((a, b) => a.empId.localeCompare(b.empId));
}
export function listVehicles(): Vehicle[] {
  return [...VEHICLES].sort((a, b) => a.registration.localeCompare(b.registration));
}
export function listCustomers(): Customer[] {
  return [...CUSTOMERS].sort((a, b) => b.totalSpent - a.totalSpent);
}
export function listBookings(): Booking[] {
  return [...BOOKINGS].sort((a, b) => b.flightDate.localeCompare(a.flightDate));
}
export function listFlights(): Flight[] {
  return [...FLIGHTS].sort((a, b) => b.date.localeCompare(a.date));
}
export function listVouchers(): Voucher[] {
  return [...VOUCHERS].sort((a, b) => b.issuedDate.localeCompare(a.issuedDate));
}
export function listTransactions(): Transaction[] {
  return [...TRANSACTIONS].sort((a, b) => b.date.localeCompare(a.date));
}
export function listMaintenance(): MaintenanceLog[] {
  return [...MAINTENANCE].sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate));
}
export function listCompliance(): ComplianceRecord[] {
  return [...COMPLIANCE].sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));
}
export function listReviews(): Review[] {
  return [...REVIEWS].sort((a, b) => b.date.localeCompare(a.date));
}

/* ------------------------------------------------------------------ *
 * Roll-up summaries used by the dashboard
 * ------------------------------------------------------------------ */

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  net: number;
  outstanding: number;
}

export function financeSummary(): FinanceSummary {
  const totalIncome = TRANSACTIONS.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = TRANSACTIONS.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const outstanding = BOOKINGS
    .filter((b) => b.status !== "Cancelled" && b.status !== "Refunded")
    .reduce((s, b) => s + Math.max(0, b.totalAmount - b.paidAmount), 0);
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
}

export function dashboardStats(): DashboardStats {
  const passengersFlown = BOOKINGS
    .filter((b) => b.status === "Flown")
    .reduce((s, b) => s + b.adults + b.children, 0);
  const upcomingBookings = BOOKINGS.filter((b) =>
    ["Enquiry", "Pending Payment", "Confirmed", "Weather Hold"].includes(b.status),
  ).length;
  const averageRating = REVIEWS.reduce((s, r) => s + r.rating, 0) / (REVIEWS.length || 1);

  return {
    totalBookings: BOOKINGS.length,
    upcomingBookings,
    passengersFlown,
    airworthyBalloons: BALLOONS.filter((b) => b.status === "Airworthy").length,
    totalBalloons: BALLOONS.length,
    activePilots: CREW.filter((c) => c.role.includes("Pilot") && c.status === "Active").length,
    finance: financeSummary(),
    averageRating,
    activeVouchers: VOUCHERS.filter((v) => v.status === "Active").length,
  };
}
