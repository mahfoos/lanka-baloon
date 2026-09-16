import { getSession, can } from "@/lib/auth";
import { listCrew } from "@/lib/data";
import { formatDate, CREW_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default function CrewPage() {
  const user = getSession()!;
  if (!can(user, "canViewCrew")) {
    return <AccessRestricted message="The crew roster is visible to operations and pilot roles." />;
  }
  const manage = can(user, "canManageCrew");
  const crew = listCrew();

  const pilots = crew.filter((c) => c.role.includes("Pilot"));
  const active = crew.filter((c) => c.status === "Active").length;
  const totalPilotHours = pilots.reduce((s, c) => s + (c.totalFlightHours ?? 0), 0);
  const avgExp = pilots.length ? Math.round(pilots.reduce((s, c) => s + c.yearsExperience, 0) / pilots.length) : 0;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Crew & Pilots"
        subtitle="Commercial balloon pilots and ground crew — many with 20+ years' experience."
        action={manage ? <button className="btn-primary" disabled>+ Add Crew</button> : undefined}
      />

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
            </>
          }
        >
          {crew.length === 0 ? (
            <EmptyRow colSpan={7} label="No crew." />
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
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
