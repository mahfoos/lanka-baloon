import { getSession, can } from "@/lib/auth";
import { listMaintenance } from "@/lib/data";
import { formatCurrency, formatDate, MAINTENANCE_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const user = getSession()!;
  if (!can(user, "canViewMaintenance")) {
    return <AccessRestricted message="Maintenance logs are visible to operations and pilot roles." />;
  }
  const manage = can(user, "canManageMaintenance");
  const logs = await listMaintenance();

  const open = logs.filter((m) => m.status !== "Completed").length;
  const overdue = logs.filter((m) => m.status === "Overdue").length;
  const ytdCost = logs.filter((m) => m.completedDate).reduce((s, m) => s + (m.cost ?? 0), 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Maintenance"
        subtitle="Balloon and vehicle servicing, inspections and airworthiness work."
        action={manage ? <button className="btn-primary" disabled>+ Log Job</button> : undefined}
      />

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Open Jobs" value={open} hint="scheduled or in progress" tone="brand" />
          <StatCard label="Overdue" value={overdue} hint="need attention" tone={overdue > 0 ? "negative" : "positive"} />
          <StatCard label="Completed" value={logs.filter((m) => m.status === "Completed").length} hint="this season" />
          <StatCard label="Spend (completed)" value={formatCurrency(ytdCost)} hint="maintenance cost" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>Asset</Th>
              <Th>Type</Th>
              <Th>Scheduled</Th>
              <Th>Completed</Th>
              <Th>Engineer</Th>
              <Th className="text-right">Cost</Th>
              <Th>Status</Th>
            </>
          }
        >
          {logs.length === 0 ? (
            <EmptyRow colSpan={7} label="No maintenance logs." />
          ) : logs.map((m) => (
            <Tr key={m.id}>
              <Td>
                <p className="font-semibold text-brand-950">{m.assetLabel}</p>
                <p className="text-xs text-ink/45">{m.assetType}</p>
              </Td>
              <Td className="text-ink/70">{m.type}{m.notes && <p className="text-[11px] text-ink/40">{m.notes}</p>}</Td>
              <Td className="text-ink/60">{formatDate(m.scheduledDate)}</Td>
              <Td className="text-ink/60">{m.completedDate ? formatDate(m.completedDate) : "—"}</Td>
              <Td className="text-ink/70">{m.engineer ?? "—"}</Td>
              <Td className="text-right font-semibold text-brand-950">{m.cost ? formatCurrency(m.cost) : "—"}</Td>
              <Td><Badge label={m.status} className={MAINTENANCE_STATUS_COLORS[m.status]} /></Td>
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
