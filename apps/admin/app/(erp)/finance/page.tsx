import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listTransactions, financeSummary } from "@/lib/data";
import { formatCurrency, formatDate } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveTransaction, deleteTransaction } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "date", label: "Date", type: "date", required: true },
  { name: "type", label: "Type", type: "select", required: true, options: [
    { value: "INCOME", label: "Income" }, { value: "EXPENSE", label: "Expense" }] },
  { name: "category", label: "Category", type: "text", required: true, hint: "Package name for income; Fuel, Salaries, Maintenance… for expense." },
  { name: "currency", label: "Currency", type: "select", options: [{ value: "LKR", label: "LKR" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "TRY", label: "TRY" }] },
  { name: "amount", label: "Amount", type: "money", required: true },
  { name: "method", label: "Method", type: "select", options: [
    { value: "CARD", label: "Card" }, { value: "BANK_TRANSFER", label: "Bank Transfer" }, { value: "CASH", label: "Cash" },
    { value: "ONLINE_GATEWAY", label: "Online Gateway" }, { value: "AGENT_CREDIT", label: "Agent Credit" }] },
  { name: "reference", label: "Reference", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
];

export default async function FinancePage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewFinance")) {
    return <AccessRestricted message="Finance is restricted to administrator and accountant roles." />;
  }
  const manage = can(user, "canManageFinance");
  const txns = await listTransactions();
  const summary = await financeSummary();

  // Expense breakdown by category
  const byCategory = new Map<string, number>();
  for (const t of txns) {
    if (t.type === "expense") byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
  }
  const expenseRows = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);
  const maxExpense = expenseRows[0]?.[1] ?? 1;

  const editing =
    manage && searchParams.edit
      ? await prisma.transaction.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Finance"
        subtitle="Revenue, expenses and the season's net position. Totals count LKR rows only."
        action={manage && !showForm ? <Link href="/finance?new=1" className="btn-primary">+ Add Transaction</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveTransaction}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/finance"
            title={editing ? `Edit ${editing.category}` : "Add Transaction"}
            submitLabel={editing ? "Save changes" : "Save"}
            values={editing ?? { type: "EXPENSE", currency: "LKR", method: "BANK_TRANSFER" }}
          />
        </div>
      )}

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Total Income" value={formatCurrency(summary.totalIncome)} hint="flight & voucher revenue" tone="brand" />
          <StatCard label="Total Expense" value={formatCurrency(summary.totalExpense)} hint="operating costs" />
          <StatCard label="Net Position" value={formatCurrency(summary.net)} hint="income − expense" tone={summary.net >= 0 ? "positive" : "negative"} />
          <StatCard label="Outstanding" value={formatCurrency(summary.outstanding)} hint="unpaid booking balances" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Transactions */}
        <TableCard
          head={
            <>
              <Th>Date</Th>
              <Th>Category</Th>
              <Th>Method</Th>
              <Th>Reference</Th>
              <Th className="text-right">Amount</Th>
              {manage && <Th />}
            </>
          }
        >
          {txns.length === 0 ? (
            <EmptyRow colSpan={manage ? 6 : 5} label="No transactions." />
          ) : txns.map((t) => (
            <Tr key={t.id}>
              <Td className="text-ink/60">{formatDate(t.date)}</Td>
              <Td>
                <span className="font-semibold text-brand-950">{t.category}</span>
                {t.description && <p className="text-xs text-ink/45">{t.description}</p>}
              </Td>
              <Td className="text-ink/60">{t.method}</Td>
              <Td className="font-mono text-xs text-ink/55">{t.reference ?? "—"}</Td>
              <Td className="text-right">
                <span className={`font-semibold ${t.type === "income" ? "text-green-700" : "text-red-600"}`}>
                  {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                </span>
              </Td>
              {manage && (
                <Td>
                  <RowActions editHref={`/finance?edit=${t.id}`} deleteAction={deleteTransaction} id={t.id} label={String(t.category)} />
                </Td>
              )}
            </Tr>
          ))}
        </TableCard>

        {/* Expense breakdown */}
        <section className="h-fit rounded-2xl bg-white p-6 shadow-card">
          <h2 className="font-bold text-brand-950">Expenses by Category</h2>
          <div className="mt-4 space-y-3">
            {expenseRows.map(([cat, amt]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-brand-950">{cat}</span>
                  <span className="text-ink/55">{formatCurrency(amt)}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-brand-100">
                  <div className="h-full rounded-full bg-accent-500" style={{ width: `${Math.round((amt / maxExpense) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-brand-900/8 pt-4">
            <span className="text-sm font-semibold text-ink/60">Income transactions</span>
            <Badge label={`${txns.filter((t) => t.type === "income").length}`} className="bg-green-50 text-green-700" />
          </div>
        </section>
      </div>
    </div>
  );
}
