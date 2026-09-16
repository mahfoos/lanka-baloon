/**
 * The Daily Accounting Report: one day's cash, in each currency the office
 * handles, with yesterday's closing balance carried in.
 */
import Link from "next/link";
import { getSession, can } from "@/lib/auth";
import { getCashbookDay, cashbookDates, CASHBOOK_CURRENCIES } from "@/lib/cashbook";
import { formatDate } from "@/types";
import { PageHeader, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted } from "@/components/ui";
import { addCashbookEntry, deleteCashbookEntry } from "./actions";

export const dynamic = "force-dynamic";

const shiftDay = (date: string, delta: number) => {
  const d = new Date(`${date}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
};

const num = (n: number) => (n === 0 ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: 2 }));

export default async function CashbookPage({ searchParams }: { searchParams: { date?: string } }) {
  const user = getSession()!;
  if (!can(user, "canViewFinance")) {
    return <AccessRestricted message="The daily cash book is visible to finance and administrator roles." />;
  }
  const manage = can(user, "canManageFinance");

  const today = new Date().toISOString().slice(0, 10);
  const date = searchParams.date ?? today;
  const [day, recent] = await Promise.all([getCashbookDay(date), cashbookDates(8)]);

  /** One row of the four-currency totals table. */
  const totalsRow = (label: string, values: Record<string, number>, strong = false) => (
    <tr className={strong ? "border-t-2 border-brand-900/10 bg-brand-50/40" : "border-t border-brand-900/5"}>
      <td className={`px-4 py-2.5 text-sm ${strong ? "font-bold text-brand-950" : "text-ink/60"}`}>{label}</td>
      {CASHBOOK_CURRENCIES.map((c) => (
        <td key={c} className={`px-4 py-2.5 text-right text-sm tabular-nums ${strong ? "font-black text-brand-950" : "text-ink/80"}`}>
          {num(values[c] ?? 0)}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Daily Cash Book"
        subtitle={`Income and expense for ${formatDate(date)}.`}
        action={
          <div className="flex items-center gap-2">
            <Link href={`/cashbook?date=${shiftDay(date, -1)}`} className="btn-ghost">← Previous</Link>
            <Link href={`/cashbook?date=${shiftDay(date, 1)}`} className="btn-ghost">Next →</Link>
          </div>
        }
      />

      <form className="mt-6 flex flex-wrap items-end gap-3" action="/cashbook">
        <div>
          <label htmlFor="date" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/45">Day</label>
          <input id="date" type="date" name="date" defaultValue={date} className="input-field" />
        </div>
        <button className="btn-primary">Show day</button>
        <div className="flex flex-wrap gap-1.5">
          {recent.map((d) => (
            <Link
              key={d}
              href={`/cashbook?date=${d}`}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                d === date ? "border-brand-600 bg-brand-600 text-white" : "border-brand-900/15 bg-white text-ink/60 hover:border-brand-400"
              }`}
            >
              {formatDate(d)}
            </Link>
          ))}
        </div>
      </form>

      {/* Balances first: the number everyone actually wants is the closing cash. */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-900/8 text-xs font-semibold uppercase tracking-wider text-ink/40">
                <th className="px-4 py-3 text-left">Balance</th>
                {CASHBOOK_CURRENCIES.map((c) => <th key={c} className="px-4 py-3 text-right">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {totalsRow("Brought forward (yesterday)", day.broughtForward)}
              {totalsRow("Income today", day.incomeTotals)}
              {totalsRow("Expense today", day.expenseTotals)}
              {totalsRow("Closing cash", day.closing, true)}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-2 text-xs text-ink/45">
        Brought-forward is summed from every earlier entry, not stored, so correcting an old line fixes every day after it.
        {day.incomePax > 0 && ` ${day.incomePax} PAX recorded on the income side today.`}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {(["INCOME", "EXPENSE"] as const).map((side) => {
          const lines = side === "INCOME" ? day.income : day.expense;
          return (
            <section key={side}>
              <h2 className="font-display text-xl font-black text-brand-950">
                {side === "INCOME" ? "Income" : "Expense"}
              </h2>
              <div className="mt-3">
                <TableCard
                  head={
                    <>
                      <Th>Description</Th>
                      <Th className="text-center">{side === "INCOME" ? "PAX" : "People"}</Th>
                      <Th className="text-right">Amount</Th>
                      {manage && <Th />}
                    </>
                  }
                >
                  {lines.length === 0 ? (
                    <EmptyRow colSpan={manage ? 4 : 3} label={`No ${side.toLowerCase()} recorded.`} />
                  ) : (
                    lines.map((l) => (
                      <Tr key={l.id}>
                        <Td>
                          {l.kind === "OPENING" && (
                            <span className="mr-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-700">Opening</span>
                          )}
                          {l.description}
                          {l.reference && <span className="block text-xs text-ink/45">{l.reference}</span>}
                        </Td>
                        <Td className="text-center text-ink/70">{l.people ?? "—"}</Td>
                        <Td className="whitespace-nowrap text-right font-semibold tabular-nums text-brand-950">
                          {l.currency} {l.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </Td>
                        {manage && (
                          <Td className="text-right">
                            <form action={deleteCashbookEntry}>
                              <input type="hidden" name="id" value={l.id} />
                              <button className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                            </form>
                          </Td>
                        )}
                      </Tr>
                    ))
                  )}
                </TableCard>
              </div>
            </section>
          );
        })}
      </div>

      {manage && (
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-card">
          <h2 className="font-display text-xl font-black text-brand-950">Add a line</h2>
          <form action={addCashbookEntry} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <input type="hidden" name="date" value={date} />
            <div className="lg:col-span-2">
              <label htmlFor="description" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/45">Description</label>
              <input id="description" name="description" required className="input-field" placeholder="Balloon flight, fuel, crew meals…" />
            </div>
            <div>
              <label htmlFor="kind" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/45">Type</label>
              <select id="kind" name="kind" className="input-field" defaultValue="INCOME">
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
                <option value="OPENING">Opening balance</option>
              </select>
            </div>
            <div>
              <label htmlFor="currency" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/45">Currency</label>
              <select id="currency" name="currency" className="input-field" defaultValue="LKR">
                {CASHBOOK_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/45">Amount</label>
              <input id="amount" name="amount" required inputMode="decimal" className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label htmlFor="people" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/45">PAX / people</label>
              <input id="people" name="people" inputMode="numeric" className="input-field" placeholder="optional" />
            </div>
            <div className="lg:col-span-5">
              <label htmlFor="reference" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/45">Reference (optional)</label>
              <input id="reference" name="reference" className="input-field" placeholder="Booking ref, invoice number…" />
            </div>
            <div className="flex items-end">
              <button className="btn-primary w-full">Add line</button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
