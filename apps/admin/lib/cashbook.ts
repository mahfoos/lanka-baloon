/**
 * The Daily Accounting Report: income and expense for one day, in each currency
 * the office handles, with yesterday's closing cash carried in.
 *
 * The carried balance is summed from every entry before the day rather than
 * stored. A stored running total is the thing that silently goes wrong: correct
 * a line from last week and every figure after it is quietly stale.
 *
 * OPENING rows seed the starting cash, so the first day of using this doesn't
 * have to begin at zero.
 */
import { prisma, toNumber, type Currency, type CashbookKind } from "@lanka-baloon/db";

export const CASHBOOK_CURRENCIES: Currency[] = ["LKR", "USD", "EUR", "TRY"];

export interface CashbookLine {
  id: string;
  kind: CashbookKind;
  description: string;
  people: number | null;
  currency: Currency;
  amount: number;
  reference: string | null;
}

export interface CashbookDay {
  date: string;
  income: CashbookLine[];
  expense: CashbookLine[];
  /** Per currency, for the day only. */
  incomeTotals: Record<string, number>;
  expenseTotals: Record<string, number>;
  dayNet: Record<string, number>;
  /** Everything up to, but not including, this day. */
  broughtForward: Record<string, number>;
  /** broughtForward + dayNet: the cash that should be in the box tonight. */
  closing: Record<string, number>;
  incomePax: number;
}

const emptyTotals = (): Record<string, number> =>
  Object.fromEntries(CASHBOOK_CURRENCIES.map((c) => [c, 0]));

export async function getCashbookDay(date: string): Promise<CashbookDay> {
  const day = new Date(`${date}T00:00:00.000Z`);

  const [entries, prior] = await Promise.all([
    prisma.cashbookEntry.findMany({ where: { date: day }, orderBy: { createdAt: "asc" } }),
    // Everything before today, grouped, so the carry-forward is one query
    // rather than a walk through history.
    prisma.cashbookEntry.groupBy({
      by: ["kind", "currency"],
      where: { date: { lt: day } },
      _sum: { amount: true },
    }),
  ]);

  const toLine = (e: (typeof entries)[number]): CashbookLine => ({
    id: e.id,
    kind: e.kind,
    description: e.description,
    people: e.people,
    currency: e.currency,
    amount: toNumber(e.amount),
    reference: e.reference,
  });

  const income = entries.filter((e) => e.kind !== "EXPENSE").map(toLine);
  const expense = entries.filter((e) => e.kind === "EXPENSE").map(toLine);

  const incomeTotals = emptyTotals();
  const expenseTotals = emptyTotals();
  for (const l of income) incomeTotals[l.currency] += l.amount;
  for (const l of expense) expenseTotals[l.currency] += l.amount;

  const broughtForward = emptyTotals();
  for (const p of prior) {
    const amount = toNumber(p._sum.amount);
    broughtForward[p.currency] += p.kind === "EXPENSE" ? -amount : amount;
  }

  const dayNet = emptyTotals();
  const closing = emptyTotals();
  for (const c of CASHBOOK_CURRENCIES) {
    dayNet[c] = incomeTotals[c] - expenseTotals[c];
    closing[c] = broughtForward[c] + dayNet[c];
  }

  return {
    date,
    income,
    expense,
    incomeTotals,
    expenseTotals,
    dayNet,
    broughtForward,
    closing,
    incomePax: income.reduce((sum, l) => sum + (l.people ?? 0), 0),
  };
}

/** Recent days that have any entry, for quick navigation. */
export async function cashbookDates(limit = 30): Promise<string[]> {
  const rows = await prisma.cashbookEntry.groupBy({
    by: ["date"],
    orderBy: { date: "desc" },
    take: limit,
  });
  return rows.map((r) => r.date.toISOString().slice(0, 10));
}
