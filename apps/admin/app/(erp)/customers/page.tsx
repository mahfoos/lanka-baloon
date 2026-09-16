import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listCustomers } from "@/lib/data";
import { formatCurrency, formatDate } from "@/types";
import {
  PageHeader, StatCard, StatGrid, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveCustomer, deleteCustomer } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "type", label: "Type", type: "select", options: [
    { value: "TOURIST", label: "Tourist" }, { value: "LOCAL", label: "Local" },
    { value: "CORPORATE", label: "Corporate" }, { value: "TRAVEL_AGENT", label: "Travel Agent" }] },
  { name: "country", label: "Country", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "notes", label: "Notes", type: "textarea" },
];

const TYPE_COLORS: Record<string, string> = {
  Tourist: "bg-sky-50 text-sky-700",
  Local: "bg-green-50 text-green-700",
  Corporate: "bg-purple-50 text-purple-700",
  "Travel Agent": "bg-accent-100 text-accent-600",
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewCustomers")) {
    return <AccessRestricted message="Customer records are visible to reservations, operations and finance roles." />;
  }
  const manage = can(user, "canManageCustomers");
  const customers = await listCustomers();

  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const repeat = customers.filter((c) => c.totalBookings > 1).length;
  const countries = new Set(customers.map((c) => c.country)).size;

  const editing =
    manage && searchParams.edit
      ? await prisma.customer.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Customers"
        subtitle="Guests, travel agents and hotel partners across the world."
        action={manage && !showForm ? <Link href="/customers?new=1" className="btn-primary">+ Add Customer</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveCustomer}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/customers"
            title={editing ? `Edit ${editing.name}` : "Add Customer"}
            submitLabel={editing ? "Save changes" : "Add"}
            values={editing ?? { type: "TOURIST" }}
          />
        </div>
      )}

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Customers" value={customers.length} hint={`${repeat} repeat guests`} tone="brand" />
          <StatCard label="Lifetime Value" value={formatCurrency(totalSpent)} hint="all customers" />
          <StatCard label="Countries" value={countries} hint="reach" />
          <StatCard label="Agents & Hotels" value={customers.filter((c) => c.type === "Travel Agent" || c.type === "Corporate").length} hint="trade partners" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Country</Th>
              <Th>Contact</Th>
              <Th className="text-center">Bookings</Th>
              <Th className="text-right">Spent</Th>
              <Th>First Seen</Th>
              {manage && <Th />}
            </>
          }
        >
          {customers.length === 0 ? (
            <EmptyRow colSpan={manage ? 8 : 7} label="No customers." />
          ) : customers.map((c) => (
            <Tr key={c.id}>
              <Td className="font-semibold text-brand-950">{c.name}</Td>
              <Td><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[c.type] ?? "chip"}`}>{c.type}</span></Td>
              <Td className="text-ink/70">{c.country}</Td>
              <Td className="text-xs text-ink/55">{[c.email, c.phone].filter(Boolean).join(" · ") || "—"}</Td>
              <Td className="text-center text-ink/70">{c.totalBookings}</Td>
              <Td className="text-right font-semibold text-brand-950">{formatCurrency(c.totalSpent)}</Td>
              <Td className="text-ink/60">{formatDate(c.firstSeen)}</Td>
              {manage && (
                <Td>
                  <RowActions editHref={`/customers?edit=${c.id}`} deleteAction={deleteCustomer} id={c.id} label={String(c.name)} />
                </Td>
              )}
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
