import { getSession, can } from "@/lib/auth";
import { listCustomers } from "@/lib/data";
import { formatCurrency, formatDate } from "@/types";
import {
  PageHeader, StatCard, StatGrid, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

export const dynamic = "force-dynamic";

const TYPE_COLORS: Record<string, string> = {
  Tourist: "bg-sky-50 text-sky-700",
  Local: "bg-green-50 text-green-700",
  Corporate: "bg-purple-50 text-purple-700",
  "Travel Agent": "bg-accent-100 text-accent-600",
};

export default async function CustomersPage() {
  const user = getSession()!;
  if (!can(user, "canViewCustomers")) {
    return <AccessRestricted message="Customer records are visible to reservations, operations and finance roles." />;
  }
  const manage = can(user, "canManageCustomers");
  const customers = await listCustomers();

  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0);
  const repeat = customers.filter((c) => c.totalBookings > 1).length;
  const countries = new Set(customers.map((c) => c.country)).size;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Customers"
        subtitle="Guests, travel agents and hotel partners across the world."
        action={manage ? <button className="btn-primary" disabled>+ Add Customer</button> : undefined}
      />

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
            </>
          }
        >
          {customers.length === 0 ? (
            <EmptyRow colSpan={7} label="No customers." />
          ) : customers.map((c) => (
            <Tr key={c.id}>
              <Td className="font-semibold text-brand-950">{c.name}</Td>
              <Td><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[c.type] ?? "chip"}`}>{c.type}</span></Td>
              <Td className="text-ink/70">{c.country}</Td>
              <Td className="text-xs text-ink/55">{[c.email, c.phone].filter(Boolean).join(" · ") || "—"}</Td>
              <Td className="text-center text-ink/70">{c.totalBookings}</Td>
              <Td className="text-right font-semibold text-brand-950">{formatCurrency(c.totalSpent)}</Td>
              <Td className="text-ink/60">{formatDate(c.firstSeen)}</Td>
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
