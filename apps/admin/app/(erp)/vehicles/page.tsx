import { getSession, can } from "@/lib/auth";
import { listVehicles } from "@/lib/data";
import { formatDate, daysUntil, VEHICLE_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default function VehiclesPage() {
  const user = getSession()!;
  if (!can(user, "canViewVehicles")) {
    return <AccessRestricted message="Ground transport is visible to operations roles." />;
  }
  const manage = can(user, "canManageVehicles");
  const vehicles = listVehicles();

  const available = vehicles.filter((v) => v.status === "Available").length;
  const seats = vehicles.reduce((s, v) => s + v.seats, 0);
  const acCount = vehicles.filter((v) => v.hasAirConditioning).length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Ground Transport"
        subtitle="Brand-new, A/C, DMT-compliant vehicles for hotel pick-up, chase and recovery."
        action={manage ? <button className="btn-primary" disabled>+ Add Vehicle</button> : undefined}
      />

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Fleet Size" value={vehicles.length} hint={`${available} available now`} tone="brand" />
          <StatCard label="Total Seats" value={seats} hint="passenger capacity" />
          <StatCard label="Air-Conditioned" value={`${acCount}/${vehicles.length}`} hint="guest comfort" />
          <StatCard label="DMT Compliant" value="100%" hint="revenue licences current" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>Registration</Th>
              <Th>Type</Th>
              <Th>Make / Model</Th>
              <Th className="text-center">Seats</Th>
              <Th>Revenue Licence</Th>
              <Th>Insurance</Th>
              <Th>Status</Th>
            </>
          }
        >
          {vehicles.length === 0 ? (
            <EmptyRow colSpan={7} label="No vehicles." />
          ) : vehicles.map((v) => {
            const rlDays = daysUntil(v.revenueLicenseExpiry);
            const insDays = daysUntil(v.insuranceExpiry);
            return (
              <Tr key={v.id}>
                <Td className="font-mono text-xs text-brand-700">{v.registration}</Td>
                <Td className="text-ink/70">{v.type}</Td>
                <Td className="text-ink/70">{v.makeModel}{v.hasAirConditioning && <span className="ml-1.5 text-[10px] font-semibold text-brand-600">A/C</span>}</Td>
                <Td className="text-center text-ink/70">{v.seats}</Td>
                <Td className={rlDays < 60 ? "font-semibold text-amber-600" : "text-ink/70"}>{formatDate(v.revenueLicenseExpiry)}</Td>
                <Td className={insDays < 60 ? "font-semibold text-amber-600" : "text-ink/70"}>{formatDate(v.insuranceExpiry)}</Td>
                <Td><Badge label={v.status} className={VEHICLE_STATUS_COLORS[v.status]} /></Td>
              </Tr>
            );
          })}
        </TableCard>
      </div>
    </div>
  );
}
