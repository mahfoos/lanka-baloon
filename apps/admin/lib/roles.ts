/**
 * Role + permission definitions for the Sri Lanka Balloon ERP.
 * No server-only imports — safe to use from client components.
 */

export type Role = "admin" | "ops" | "reservations" | "accountant" | "pilot" | "viewer";
export const ROLES: Role[] = ["admin", "ops", "reservations", "accountant", "pilot", "viewer"];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  ops: "Operations Manager",
  reservations: "Reservations",
  accountant: "Accountant",
  pilot: "Pilot",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Full access — bookings, flights, fleet, crew, finance, compliance and admin.",
  ops: "Flight operations — schedule, fleet, crew, maintenance and compliance.",
  reservations: "Front desk — bookings, customers, gift vouchers and the schedule.",
  accountant: "Finance — revenue, expenses, vouchers and booking payments.",
  pilot: "Read-only flight schedule, fleet airworthiness and crew roster.",
  viewer: "Read-only access to the operational dashboards.",
};

export interface SessionUser {
  username: string;
  name: string;
  role: Role;
}

export interface Permissions {
  canManageUsers: boolean;
  canViewBookings: boolean;
  canManageBookings: boolean;
  canViewFlights: boolean;
  canManageFlights: boolean;
  canViewFleet: boolean;
  canManageFleet: boolean;
  canViewCrew: boolean;
  canManageCrew: boolean;
  canViewCustomers: boolean;
  canManageCustomers: boolean;
  canViewVehicles: boolean;
  canManageVehicles: boolean;
  canViewVouchers: boolean;
  canManageVouchers: boolean;
  canViewFinance: boolean;
  canManageFinance: boolean;
  canViewMaintenance: boolean;
  canManageMaintenance: boolean;
  canViewCompliance: boolean;
  canManageCompliance: boolean;
  canViewReviews: boolean;
  canManageReviews: boolean;
}

const ALL_TRUE: Permissions = {
  canManageUsers: true,
  canViewBookings: true, canManageBookings: true,
  canViewFlights: true, canManageFlights: true,
  canViewFleet: true, canManageFleet: true,
  canViewCrew: true, canManageCrew: true,
  canViewCustomers: true, canManageCustomers: true,
  canViewVehicles: true, canManageVehicles: true,
  canViewVouchers: true, canManageVouchers: true,
  canViewFinance: true, canManageFinance: true,
  canViewMaintenance: true, canManageMaintenance: true,
  canViewCompliance: true, canManageCompliance: true,
  canViewReviews: true, canManageReviews: true,
};

const ALL_FALSE: Permissions = Object.fromEntries(
  Object.keys(ALL_TRUE).map((k) => [k, false]),
) as unknown as Permissions;

export function permissionsFor(role: Role): Permissions {
  switch (role) {
    case "admin":
      return { ...ALL_TRUE };

    case "ops":
      return {
        ...ALL_FALSE,
        canViewBookings: true,
        canViewFlights: true, canManageFlights: true,
        canViewFleet: true, canManageFleet: true,
        canViewCrew: true, canManageCrew: true,
        canViewCustomers: true,
        canViewVehicles: true, canManageVehicles: true,
        canViewMaintenance: true, canManageMaintenance: true,
        canViewCompliance: true, canManageCompliance: true,
        canViewReviews: true,
      };

    case "reservations":
      return {
        ...ALL_FALSE,
        canViewBookings: true, canManageBookings: true,
        canViewFlights: true,
        canViewCustomers: true, canManageCustomers: true,
        canViewVouchers: true, canManageVouchers: true,
        canViewReviews: true,
      };

    case "accountant":
      return {
        ...ALL_FALSE,
        canViewBookings: true,
        canViewFinance: true, canManageFinance: true,
        canViewVouchers: true,
        canViewCustomers: true,
      };

    case "pilot":
      return {
        ...ALL_FALSE,
        canViewFlights: true,
        canViewFleet: true,
        canViewCrew: true,
        canViewMaintenance: true,
        canViewCompliance: true,
      };

    case "viewer":
    default:
      return {
        ...ALL_FALSE,
        canViewBookings: true,
        canViewFlights: true,
        canViewFleet: true,
        canViewReviews: true,
      };
  }
}
