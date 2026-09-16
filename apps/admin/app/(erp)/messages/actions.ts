"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";

/** Tick a website contact message off once someone has replied to it. */
export async function markMessageHandled(formData: FormData) {
  const user = getSession();
  if (!can(user, "canManageBookings")) return;

  const id = String(formData.get("id") ?? "");
  const handled = formData.get("handled") === "true";
  if (!id) return;

  await prisma.contactMessage.update({ where: { id }, data: { handled } });
  revalidatePath("/messages");
}
