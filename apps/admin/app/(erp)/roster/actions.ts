"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { monthBounds } from "@/lib/roster";

/**
 * Save a whole month of the roster in one go.
 *
 * The grid posts a checkbox per crew member per day, named `d:<crewId>:<day>`.
 * Unchecked boxes are simply absent from the form, which is why the month is
 * cleared and rewritten rather than patched: it is the only way an unticked box
 * can mean "did not work" instead of "not mentioned".
 */
export async function saveRoster(formData: FormData) {
  const user = getSession();
  if (!can(user, "canManageCrew")) return;

  const year = Number(formData.get("year"));
  const month = Number(formData.get("month"));
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return;

  const { start, end, daysInMonth } = monthBounds(year, month);

  const marks: { crewId: string; date: Date }[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("d:") || value !== "on") continue;
    const [, crewId, dayRaw] = key.split(":");
    const day = Number(dayRaw);
    if (!crewId || !Number.isInteger(day) || day < 1 || day > daysInMonth) continue;
    marks.push({ crewId, date: new Date(Date.UTC(year, month - 1, day)) });
  }

  // One transaction: a half-written roster is worse than an unchanged one.
  await prisma.$transaction([
    prisma.crewRosterEntry.deleteMany({ where: { date: { gte: start, lt: end } } }),
    ...(marks.length
      ? [prisma.crewRosterEntry.createMany({
          data: marks.map((m) => ({ crewId: m.crewId, date: m.date, worked: true })),
          skipDuplicates: true,
        })]
      : []),
  ]);

  revalidatePath("/roster");
}
