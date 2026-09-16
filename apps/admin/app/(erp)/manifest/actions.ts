"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";

/**
 * Update one row of the daily manifest.
 *
 * Every field is optional: the office fills this in over the course of a
 * morning, so a partial save has to be normal rather than an error.
 */
export async function updateManifestRow(formData: FormData) {
  const user = getSession();
  if (!can(user, "canManageBookings")) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const text = (key: string) => {
    const v = formData.get(key);
    if (v === null) return undefined;
    const s = String(v).trim();
    return s === "" ? null : s;
  };

  const money = (key: string) => {
    const v = formData.get(key);
    if (v === null || String(v).trim() === "") return undefined;
    const n = Number(String(v).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };

  const pax = formData.get("actualPax");
  const actualPax =
    pax === null || String(pax).trim() === "" ? null : Math.max(0, Math.trunc(Number(pax) || 0));

  await prisma.booking.update({
    where: { id },
    data: {
      hotel: text("hotel"),
      city: text("city"),
      phone: text("contact"),
      pickupTime: text("pickupTime"),
      guideName: text("guideName"),
      driverPickup: text("driverPickup"),
      driverDropoff: text("driverDropoff"),
      notes: text("note"),
      advancePaid: money("advancePaid"),
      flightTimeCash: money("flightTimeCash"),
      actualPax,
    },
  });

  revalidatePath("/manifest");
}

/** Attach a guest to a flight, which is what gives the row its pilot and balloon. */
export async function assignFlight(formData: FormData) {
  const user = getSession();
  if (!can(user, "canManageFlights")) return;

  const id = String(formData.get("id") ?? "");
  const flightId = String(formData.get("flightId") ?? "");
  if (!id) return;

  await prisma.booking.update({
    where: { id },
    data: { flightId: flightId || null },
  });

  revalidatePath("/manifest");
}
