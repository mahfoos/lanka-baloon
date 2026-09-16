/**
 * Read/write access to the public website's Supabase database.
 *
 * The marketing site (`lanka-baloon-landing`) writes reservations and contact
 * messages straight into Supabase; this ERP is where staff work them.
 *
 * The two apps authenticate differently on purpose:
 *   - The website connects as `anon`, and Row Level Security lets it INSERT only —
 *     a visitor can never read someone else's reservation.
 *   - The ERP already has its own session and role model (lib/auth.ts), so it
 *     connects with the service-role key and gates access on ERP permissions
 *     instead of a second Supabase login.
 *
 * The service-role key bypasses RLS entirely, so it must never reach the browser:
 * import from server components and server actions only, never from a
 * "use client" file. It is read from SUPABASE_SERVICE_ROLE_KEY (not
 * NEXT_PUBLIC_*) so Next can't inline it into the client bundle.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function isWebsiteDbConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function websiteDb(): SupabaseClient {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    // No browser here — nothing to persist or refresh.
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/* ------------------------------------------------------------------ *
 * Row shapes — mirror supabase/migrations/0001_init.sql
 * ------------------------------------------------------------------ */

export const WEB_BOOKING_STATUSES = [
  "new",
  "confirmed",
  "paid",
  "flown",
  "cancelled_weather",
  "cancelled_guest",
] as const;

export type WebBookingStatus = (typeof WEB_BOOKING_STATUSES)[number];

export const WEB_BOOKING_STATUS_LABELS: Record<WebBookingStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  paid: "Paid",
  flown: "Flown",
  cancelled_weather: "Cancelled (weather)",
  cancelled_guest: "Cancelled (guest)",
};

export const WEB_BOOKING_STATUS_COLORS: Record<WebBookingStatus, string> = {
  new: "bg-accent-100 text-accent-600",
  confirmed: "bg-brand-50 text-brand-700",
  paid: "bg-green-50 text-green-700",
  flown: "bg-sky-50 text-sky-700",
  cancelled_weather: "bg-amber-50 text-amber-700",
  cancelled_guest: "bg-gray-100 text-gray-500",
};

export interface WebBooking {
  id: string;
  reference: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  flight_date: string;
  hotel: string;
  flight_type: "standard" | "private";
  adults: number;
  children: number;
  gift_voucher: boolean;
  birthday_cake: boolean;
  requests: string | null;
  total_usd: number;
  status: WebBookingStatus;
  admin_notes: string | null;
}

export interface WebMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  handled: boolean;
}

/** Website reservations, soonest flight first. */
export async function listWebBookings(): Promise<{ rows: WebBooking[]; error: string | null }> {
  const { data, error } = await websiteDb()
    .from("bookings")
    .select("*")
    .order("flight_date", { ascending: true })
    .returns<WebBooking[]>();

  if (error) {
    console.error("website bookings query failed", error);
    return { rows: [], error: error.message };
  }
  return { rows: data ?? [], error: null };
}

/** Most recent contact-form messages. */
export async function listWebMessages(limit = 20): Promise<WebMessage[]> {
  const { data, error } = await websiteDb()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<WebMessage[]>();

  if (error) {
    console.error("website messages query failed", error);
    return [];
  }
  return data ?? [];
}

/** USD, because website prices are quoted in dollars (the ERP works in rupees). */
export function formatUsd(n: number): string {
  return "$" + Math.round(n).toLocaleString("en-US");
}
