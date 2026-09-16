"use server";

import { revalidatePath } from "next/cache";
import { getSession, can } from "@/lib/auth";
import {
  websiteDb,
  isWebsiteDbConfigured,
  WEB_BOOKING_STATUSES,
  type WebBookingStatus,
} from "@/lib/website-db";

/**
 * Move a website reservation along its workflow.
 *
 * The service-role key bypasses Row Level Security, so the permission check
 * here is the only thing standing between a signed-in viewer and someone else's
 * booking — it must stay.
 */
export async function updateWebBookingStatus(formData: FormData) {
  const user = getSession();
  if (!can(user, "canManageBookings")) return;
  if (!isWebsiteDbConfigured()) return;

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !WEB_BOOKING_STATUSES.includes(status as WebBookingStatus)) return;

  const { error } = await websiteDb().from("bookings").update({ status }).eq("id", id);
  if (error) console.error("website booking status update failed", error);

  revalidatePath("/web-bookings");
}

/** Tick a contact message off once someone has replied to it. */
export async function markMessageHandled(formData: FormData) {
  const user = getSession();
  if (!can(user, "canManageBookings")) return;
  if (!isWebsiteDbConfigured()) return;

  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "true";
  if (!id) return;

  const { error } = await websiteDb().from("contact_messages").update({ handled }).eq("id", id);
  if (error) console.error("website message update failed", error);

  revalidatePath("/web-bookings");
}
