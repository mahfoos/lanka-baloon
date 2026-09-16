import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listMaintenance } from "@/lib/data";
import { formatCurrency, formatDate, MAINTENANCE_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveMaintenance, deleteMaintenance } from "../actions";

export const dynamic = "force-dynamic";

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewMaintenance")) {
    return <AccessRestricted message="Maintenance logs are visible to operations and pilot roles." />;
  }
  const manage = can(user, "canManageMaintenance");
  const logs = await listMaintenance();

  const open = logs.filter((m) => m.status !== "Completed").length;
  const overdue = logs.filter((m) => m.status === "Overdue").length;
  const ytdCost = logs.filter((m) => m.completedDate).reduce((s, m) => s + (m.cost ?? 0), 0);

  const editing =
    manage && searchParams.edit
      ? await prisma.maintenanceLog.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  const [mBalloons, mVehicles] = await Promise.all([
    prisma.balloon.findMany({ orderBy: { registration: "asc" } }),
    prisma.vehicle.findMany({ orderBy: { registration: "asc" } }),
  ]);
  const assetOptions = [
    ...mBalloons.map((b) => ({ value: b.id, label: `Balloon · ${b.registration}` })),
    ...mVehicles.map((v) => ({ value: v.id, label: `Vehicle · ${v.registration}` })),
  ];

  const FIELDS: FieldSpec[] = [
  { name: "assetType", label: "Asset type", type: "select", required: true, options: [
    { value: "BALLOON", label: "Balloon" }, { value: "VEHICLE", label: "Vehicle" }] },
  { name: "assetId", label: "Asset", type: "select", options: assetOptions, hint: "Balloons and vehicles both listed; pick the one matching the type above." },
  { name: "type", label: "Job", type: "select", required: true, options: [
    { value: "ANNUAL_INSPECTION", label: "Annual Inspection" }, { value: "ENVELOPE_REPAIR", label: "Envelope Repair" },
    { value: "BURNER_SERVICE", label: "Burner Service" }, { value: "BASKET_SERVICE", label: "Basket Service" },
    { value: "VEHICLE_SERVICE", label: "Vehicle Service" }, { value: "FUEL_SYSTEM_CHECK", label: "Fuel System Check" },
    { value: "OTHER", label: "Other" }] },
  { name: "status", label: "Status", type: "select", options: [
    { value: "SCHEDULED", label: "Scheduled" }, { value: "IN_PROGRESS", label: "In Progress" },
    { value: "COMPLETED", label: "Completed" }, { value: "OVERDUE", label: "Overdue" }] },
  { name: "scheduledDate", label: "Scheduled", type: "date", required: true },
  { name: "completedDate", label: "Completed", type: "date" },
  { name: "currency", label: "Currency", type: "select", options: [{ value: "LKR", label: "LKR" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "TRY", label: "TRY" }] },
  { name: "cost", label: "Cost", type: "money" },
  { name: "engineer", label: "Engineer", type: "text" },
  { name: "notes", label: "Notes", type: "textarea" },
];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Maintenance"
        subtitle="Balloon and vehicle servicing, inspections and airworthiness work."
        action={manage && !showForm ? <Link href="/maintenance?new=1" className="btn-primary">+ Log Job</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveMaintenance}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/maintenance"
            title={editing ? `Edit ${editing.type}` : "Log Job"}
            submitLabel={editing ? "Save changes" : "Save"}
            values={editing ?? { status: "SCHEDULED", assetType: "BALLOON", currency: "LKR" }}
          />
        </div>
      )}

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
              {manage && <Th />}
            </>
          }
        >
          {logs.length === 0 ? (
            <EmptyRow colSpan={manage ? 8 : 7} label="No maintenance logs." />
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
              {manage && (
                <Td>
                  <RowActions editHref={`/maintenance?edit=${m.id}`} deleteAction={deleteMaintenance} id={m.id} label={String(m.type)} />
                </Td>
              )}
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
