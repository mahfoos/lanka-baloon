import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listCompliance } from "@/lib/data";
import { formatDate, daysUntil, complianceStatusFor, COMPLIANCE_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveCompliance, deleteCompliance } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "kind", label: "Certificate", type: "select", required: true, options: [
    { value: "AIR_OPERATOR_CERTIFICATE", label: "Air Operator Certificate" },
    { value: "AIRCRAFT_REGISTRATION", label: "Aircraft Registration" },
    { value: "AIRWORTHINESS_CERTIFICATE", label: "Airworthiness Certificate" },
    { value: "PILOT_LICENCE", label: "Pilot Licence" },
    { value: "VALIDATION_CERTIFICATE", label: "Validation Certificate" },
    { value: "INSURANCE_POLICY", label: "Insurance Policy" },
    { value: "VEHICLE_REVENUE_LICENCE", label: "Vehicle Revenue Licence" }] },
  { name: "reference", label: "Reference / number", type: "text", required: true },
  { name: "authority", label: "Authority", type: "text", required: true, placeholder: "CAASL" },
  { name: "relatesTo", label: "Relates to", type: "text", required: true, hint: "Balloon registration, pilot name, or Company." },
  { name: "issuedDate", label: "Issued", type: "date" },
  { name: "expiryDate", label: "Expires", type: "date", required: true },
  { name: "notes", label: "Notes", type: "textarea" },
];

export default async function CompliancePage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewCompliance")) {
    return <AccessRestricted message="Compliance records are visible to operations and pilot roles." />;
  }
  const manage = can(user, "canManageCompliance");
  const records = await listCompliance();

  const withStatus = records.map((r) => ({ ...r, status: complianceStatusFor(r.expiryDate) }));
  const valid = withStatus.filter((r) => r.status === "Valid").length;
  const expiring = withStatus.filter((r) => r.status === "Expiring Soon").length;
  const expired = withStatus.filter((r) => r.status === "Expired").length;

  const editing =
    manage && searchParams.edit
      ? await prisma.complianceRecord.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Compliance"
        subtitle="CAASL certificates, pilot licences, insurance and vehicle revenue licences."
        action={manage && !showForm ? <Link href="/compliance?new=1" className="btn-primary">+ Add Record</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveCompliance}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/compliance"
            title={editing ? `Edit ${editing.reference}` : "Add Record"}
            submitLabel={editing ? "Save changes" : "Add"}
            values={editing ?? {}}
          />
        </div>
      )}

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Total Records" value={records.length} hint="certificates tracked" tone="brand" />
          <StatCard label="Valid" value={valid} hint="in good standing" tone="positive" />
          <StatCard label="Expiring Soon" value={expiring} hint="within 60 days" tone="accent" />
          <StatCard label="Expired" value={expired} hint="action required" tone={expired > 0 ? "negative" : "positive"} />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>Certificate</Th>
              <Th>Reference</Th>
              <Th>Authority</Th>
              <Th>Relates To</Th>
              <Th>Expiry</Th>
              <Th>Status</Th>
              {manage && <Th />}
            </>
          }
        >
          {withStatus.length === 0 ? (
            <EmptyRow colSpan={manage ? 7 : 6} label="No compliance records." />
          ) : withStatus.map((r) => {
            const d = daysUntil(r.expiryDate);
            return (
              <Tr key={r.id}>
                <Td>
                  <p className="font-semibold text-brand-950">{r.kind}</p>
                  {r.notes && <p className="text-xs text-ink/45">{r.notes}</p>}
                </Td>
                <Td className="font-mono text-xs text-ink/70">{r.reference}</Td>
                <Td className="text-ink/70">{r.authority}</Td>
                <Td className="text-ink/70">{r.relatesTo}</Td>
                <Td className={d < 60 ? "font-semibold text-amber-600" : "text-ink/60"}>
                  {formatDate(r.expiryDate)}
                  <span className="block text-[11px] text-ink/40">{d < 0 ? `${Math.abs(d)}d ago` : `in ${d}d`}</span>
                </Td>
                <Td><Badge label={r.status} className={COMPLIANCE_STATUS_COLORS[r.status]} /></Td>
                {manage && (
                  <Td>
                    <RowActions editHref={`/compliance?edit=${r.id}`} deleteAction={deleteCompliance} id={r.id} label={String(r.reference)} />
                  </Td>
                )}
              </Tr>
            );
          })}
        </TableCard>
      </div>
    </div>
  );
}
