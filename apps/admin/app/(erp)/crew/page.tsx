import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listCrew } from "@/lib/data";
import { formatDate, CREW_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveCrew, deleteCrew } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "empId", label: "Employee ID", type: "text", required: true, placeholder: "CREW-001" },
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role", type: "select", required: true, options: [
    { value: "COMMERCIAL_PILOT", label: "Commercial Pilot" }, { value: "CO_PILOT", label: "Co-Pilot" },
    { value: "GROUND_CREW_LEAD", label: "Ground Crew Lead" }, { value: "GROUND_CREW", label: "Ground Crew" },
    { value: "CHASE_DRIVER", label: "Chase Driver" }, { value: "RETRIEVE_CREW", label: "Retrieve Crew" }] },
  { name: "status", label: "Status", type: "select", options: [
    { value: "ACTIVE", label: "Active" }, { value: "ON_LEAVE", label: "On Leave" },
    { value: "OFF_SEASON", label: "Off Season" }, { value: "INACTIVE", label: "Inactive" }] },
  { name: "licenseNo", label: "Licence number", type: "text" },
  { name: "licenseExpiry", label: "Licence expiry", type: "date" },
  { name: "validationExpiry", label: "CAASL validation expiry", type: "date" },
  { name: "yearsExperience", label: "Years experience", type: "number" },
  { name: "totalFlightHours", label: "Total flight hours", type: "money" },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "email", label: "Email", type: "email" },
  { name: "joinDate", label: "Joined", type: "date" },
];

export default async function CrewPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewCrew")) {
    return <AccessRestricted message="The crew roster is visible to operations and pilot roles." />;
  }
  const manage = can(user, "canManageCrew");
  const crew = await listCrew();

  const pilots = crew.filter((c) => c.role.includes("Pilot"));
  const active = crew.filter((c) => c.status === "Active").length;
  const totalPilotHours = pilots.reduce((s, c) => s + (c.totalFlightHours ?? 0), 0);
  const avgExp = pilots.length ? Math.round(pilots.reduce((s, c) => s + c.yearsExperience, 0) / pilots.length) : 0;

  const editing =
    manage && searchParams.edit
      ? await prisma.crewMember.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Crew & Pilots"
        subtitle="Commercial balloon pilots and ground crew — many with 20+ years' experience."
        action={manage && !showForm ? <Link href="/crew?new=1" className="btn-primary">+ Add Crew</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveCrew}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/crew"
            title={editing ? `Edit ${editing.name}` : "Add Crew"}
            submitLabel={editing ? "Save changes" : "Add"}
            values={editing ?? { status: "ACTIVE" }}
          />
        </div>
      )}

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Total Crew" value={crew.length} hint={`${active} active`} tone="brand" />
          <StatCard label="Commercial Pilots" value={pilots.length} hint="CAASL licensed" />
          <StatCard label="Pilot Flight Hours" value={totalPilotHours.toLocaleString()} hint="combined" />
          <StatCard label="Avg. Pilot Experience" value={`${avgExp} yrs`} hint="in ballooning" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Licence</Th>
              <Th>Licence Expiry</Th>
              <Th className="text-center">Exp.</Th>
              <Th>Status</Th>
              {manage && <Th />}
            </>
          }
        >
          {crew.length === 0 ? (
            <EmptyRow colSpan={manage ? 8 : 7} label="No crew." />
          ) : crew.map((c) => (
            <Tr key={c.id}>
              <Td className="font-mono text-xs text-brand-700">{c.empId}</Td>
              <Td>
                <p className="font-semibold text-brand-950">{c.name}</p>
                {(c.email || c.phone) && <p className="text-xs text-ink/45">{[c.email, c.phone].filter(Boolean).join(" · ")}</p>}
              </Td>
              <Td><span className="chip">{c.role}</span></Td>
              <Td className="font-mono text-xs text-ink/70">{c.licenseNo ?? "—"}</Td>
              <Td className="text-ink/70">{c.licenseExpiry ? formatDate(c.licenseExpiry) : "—"}</Td>
              <Td className="text-center text-ink/70">{c.yearsExperience}y</Td>
              <Td><Badge label={c.status} className={CREW_STATUS_COLORS[c.status]} /></Td>
              {manage && (
                <Td>
                  <RowActions editHref={`/crew?edit=${c.id}`} deleteAction={deleteCrew} id={c.id} label={String(c.name)} />
                </Td>
              )}
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
