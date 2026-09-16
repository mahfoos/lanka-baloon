"use server";

/**
 * Master data: the lists the booking form picks from.
 *
 * Kept behind `canManageCustomers` rather than a permission of its own. Whoever
 * maintains the customer records is the same front-desk role that adds a new
 * agent or hotel, and one more flag in the matrix for the same people would be
 * noise.
 */
import { revalidatePath } from "next/cache";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { text, bool } from "@/lib/form";

const allowed = () => can(getSession(), "canManageCustomers");
const done = () => revalidatePath("/master-data");

export async function saveAgent(fd: FormData) {
  if (!allowed()) return;

  const id = text(fd, "id");
  const name = text(fd, "name");
  if (!name) return;

  const data = {
    name,
    contactName: text(fd, "contactName"),
    email: text(fd, "email"),
    phone: text(fd, "phone"),
    country: text(fd, "country"),
    vatRegistered: bool(fd, "vatRegistered"),
    vatNumber: text(fd, "vatNumber"),
    notes: text(fd, "notes"),
    active: bool(fd, "active"),
  };

  if (id) await prisma.agent.update({ where: { id }, data });
  else await prisma.agent.create({ data });
  done();
}

export async function deleteAgent(fd: FormData) {
  if (!allowed()) return;
  const id = text(fd, "id");
  // Bookings keep the agency name as text, so removing an agent here only takes
  // it off the pick-list; nothing already booked changes.
  if (id) await prisma.agent.delete({ where: { id } });
  done();
}

export async function saveCity(fd: FormData) {
  if (!allowed()) return;

  const id = text(fd, "id");
  const name = text(fd, "name");
  if (!name) return;

  const data = { name, pickupArea: bool(fd, "pickupArea") };

  if (id) await prisma.city.update({ where: { id }, data });
  else await prisma.city.create({ data });
  done();
}

export async function deleteCity(fd: FormData) {
  if (!allowed()) return;
  const id = text(fd, "id");
  if (id) await prisma.city.delete({ where: { id } });
  done();
}

export async function saveHotel(fd: FormData) {
  if (!allowed()) return;

  const id = text(fd, "id");
  const name = text(fd, "name");
  if (!name) return;

  const data = {
    name,
    cityId: text(fd, "cityId"),
    pickupTime: text(fd, "pickupTime"),
    phone: text(fd, "phone"),
    notes: text(fd, "notes"),
    active: bool(fd, "active"),
  };

  if (id) await prisma.hotel.update({ where: { id }, data });
  else await prisma.hotel.create({ data });
  done();
}

export async function deleteHotel(fd: FormData) {
  if (!allowed()) return;
  const id = text(fd, "id");
  if (id) await prisma.hotel.delete({ where: { id } });
  done();
}
