import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listVehicles } from "@/lib/data";
import { formatDate, daysUntil, VEHICLE_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveVehicle, deleteVehicle } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "registration", label: "Registration", type: "text", required: true, placeholder: "WP CAB-1234" },
  { name: "type", label: "Type", type: "select", required: true, options: [
    { value: "PASSENGER_VAN", label: "Passenger Van" }, { value: "CHASE_4X4", label: "Chase 4x4" },
    { value: "RECOVERY_TRUCK", label: "Recovery Truck" }, { value: "CAR", label: "Car" }] },
  { name: "makeModel", label: "Make and model", type: "text", required: true },
  { name: "seats", label: "Seats", type: "number" },
  { name: "status", label: "Status", type: "select", options: [
    { value: "AVAILABLE", label: "Available" }, { value: "ON_TRIP", label: "On Trip" },
    { value: "SERVICING", label: "Servicing" }, { value: "OFF_ROAD", label: "Off Road" }] },
  { name: "revenueLicenseExpiry", label: "Revenue licence expiry", type: "date" },
  { name: "insuranceExpiry", label: "Insurance expiry", type: "date" },
  { name: "lastServiceOdo", label: "Odometer at last service", type: "number" },
  { name: "hasAirConditioning", label: "Air conditioned", type: "checkbox" },
  { name: "notes", label: "Notes", type: "textarea" },
];

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewVehicles")) {
    return <AccessRestricted message="Ground transport is visible to operations roles." />;
  }
  const manage = can(user, "canManageVehicles");
  const vehicles = await listVehicles();

  const available = vehicles.filter((v) => v.status === "Available").length;
  const seats = vehicles.reduce((s, v) => s + v.seats, 0);
  const acCount = vehicles.filter((v) => v.hasAirConditioning).length;

  const editing =
    manage && searchParams.edit
      ? await prisma.vehicle.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Ground Transport"
        subtitle="Brand-new, A/C, DMT-compliant vehicles for hotel pick-up, chase and recovery."
        action={manage && !showForm ? <Link href="/vehicles?new=1" className="btn-primary">+ Add Vehicle</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveVehicle}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/vehicles"
            title={editing ? `Edit ${editing.registration}` : "Add Vehicle"}
            submitLabel={editing ? "Save changes" : "Add"}
            values={editing ?? { status: "AVAILABLE", hasAirConditioning: true }}
          />
        </div>
      )}

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
              {manage && <Th />}
            </>
          }
        >
          {vehicles.length === 0 ? (
            <EmptyRow colSpan={manage ? 8 : 7} label="No vehicles." />
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
                {manage && (
                  <Td>
                    <RowActions editHref={`/vehicles?edit=${v.id}`} deleteAction={deleteVehicle} id={v.id} label={String(v.registration)} />
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
