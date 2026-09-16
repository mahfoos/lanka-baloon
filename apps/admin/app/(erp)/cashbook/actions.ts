"use server";

import { revalidatePath } from "next/cache";
import { prisma, type CashbookKind, type Currency } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { CASHBOOK_CURRENCIES } from "@/lib/cashbook";

const KINDS: CashbookKind[] = ["OPENING", "INCOME", "EXPENSE"];

export async function addCashbookEntry(formData: FormData) {
  const user = getSession();
  if (!can(user, "canManageFinance")) return;

  const date = String(formData.get("date") ?? "");
  const kind = String(formData.get("kind") ?? "") as CashbookKind;
  const currency = String(formData.get("currency") ?? "") as Currency;
  const description = String(formData.get("description") ?? "").trim();
  const amount = Number(String(formData.get("amount") ?? "").replace(/[^0-9.-]/g, ""));
  const peopleRaw = String(formData.get("people") ?? "").trim();
  const reference = String(formData.get("reference") ?? "").trim();

  // A line with no description or no amount is a slip of the hand, not an entry.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  if (!KINDS.includes(kind)) return;
  if (!CASHBOOK_CURRENCIES.includes(currency)) return;
  if (!description || !Number.isFinite(amount) || amount <= 0) return;

  await prisma.cashbookEntry.create({
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      kind,
      currency,
      description,
      amount,
      people: peopleRaw === "" ? null : Math.max(0, Math.trunc(Number(peopleRaw) || 0)),
      reference: reference || null,
    },
  });

  revalidatePath("/cashbook");
}

export async function deleteCashbookEntry(formData: FormData) {
  const user = getSession();
  if (!can(user, "canManageFinance")) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.cashbookEntry.delete({ where: { id } });
  revalidatePath("/cashbook");
}
