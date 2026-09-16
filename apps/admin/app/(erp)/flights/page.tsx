import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listFlights } from "@/lib/data";
import { formatDate, FLIGHT_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveFlight, deleteFlight } from "../actions";

export const dynamic = "force-dynamic";

export default async function FlightsPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewFlights")) {
    return <AccessRestricted message="The flight schedule is visible to operations, reservations and pilot roles." />;
  }
  const manage = can(user, "canManageFlights");
  const flights = await listFlights();

  const scheduled = flights.filter((f) => f.status === "Scheduled").length;
  const completed = flights.filter((f) => f.status === "Completed").length;
  const totalPax = flights.reduce((s, f) => s + f.booked, 0);
  const avgLoad = flights.length
    ? Math.round((flights.reduce((s, f) => s + f.booked / f.capacity, 0) / flights.length) * 100)
    : 0;

  const editing =
    manage && searchParams.edit
      ? await prisma.flight.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  // Related records for the assignment dropdowns.
  const [balloonRows, pilotRows] = await Promise.all([
    prisma.balloon.findMany({ where: { status: { not: "RETIRED" } }, orderBy: { registration: "asc" } }),
    prisma.crewMember.findMany({ where: { role: { in: ["COMMERCIAL_PILOT", "CO_PILOT"] } }, orderBy: { name: "asc" } }),
  ]);
  const balloonOptions = balloonRows.map((b) => ({ value: b.id, label: `${b.registration} · ${b.name}` }));
  const pilotOptions = pilotRows.map((p) => ({ value: p.id, label: p.name }));

  const FIELDS: FieldSpec[] = [
  { name: "code", label: "Flight code", type: "text", required: true, placeholder: "SLB-FL-260612-A" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "launchTime", label: "Launch time", type: "text", required: true, placeholder: "05:30" },
  { name: "launchSite", label: "Launch site", type: "text", required: true, placeholder: "Kandalama" },
  { name: "balloonId", label: "Balloon", type: "select", options: balloonOptions },
  { name: "pilotId", label: "Pilot", type: "select", options: pilotOptions },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "status", label: "Status", type: "select", options: [
    { value: "SCHEDULED", label: "Scheduled" }, { value: "BOARDING", label: "Boarding" },
    { value: "IN_FLIGHT", label: "In Flight" }, { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED_WEATHER", label: "Cancelled - Weather" }, { value: "POSTPONED", label: "Postponed" }] },
  { name: "windSpeedKts", label: "Wind (kts)", type: "number" },
  { name: "windDirection", label: "Wind direction", type: "text" },
  { name: "durationMins", label: "Duration (mins)", type: "number" },
  { name: "notes", label: "Notes", type: "textarea" },
];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Flight Schedule"
        subtitle="Early-morning launches over Dambulla, Kandalama and Sigiriya."
        action={manage && !showForm ? <Link href="/flights?new=1" className="btn-primary">+ Schedule Flight</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveFlight}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/flights"
            title={editing ? `Edit ${editing.code}` : "Schedule Flight"}
            submitLabel={editing ? "Save changes" : "Save"}
            values={editing ?? { status: "SCHEDULED" }}
          />
        </div>
      )}

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Scheduled" value={scheduled} hint="upcoming launches" tone="brand" />
          <StatCard label="Completed" value={completed} hint="this season" />
          <StatCard label="Passengers" value={totalPax} hint="across all flights" />
          <StatCard label="Avg. Load Factor" value={`${avgLoad}%`} hint="seats filled" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>Flight</Th>
              <Th>Date / Time</Th>
              <Th>Launch Site</Th>
              <Th>Balloon</Th>
              <Th>Pilot</Th>
              <Th className="text-center">Load</Th>
              <Th>Wind</Th>
              <Th>Status</Th>
              {manage && <Th />}
            </>
          }
        >
          {flights.length === 0 ? (
            <EmptyRow colSpan={manage ? 9 : 8} label="No flights." />
          ) : flights.map((f) => (
            <Tr key={f.id}>
              <Td className="font-mono text-xs text-brand-700">{f.code}</Td>
              <Td className="text-ink/70">{formatDate(f.date)}<span className="text-ink/40"> · {f.launchTime}</span></Td>
              <Td className="text-ink/70">{f.launchSite}</Td>
              <Td className="font-mono text-xs text-ink/70">{f.balloonReg}</Td>
              <Td className="text-ink/70">{f.pilotName}</Td>
              <Td className="text-center">
                <span className="text-ink/70">{f.booked}/{f.capacity}</span>
              </Td>
              <Td className="text-ink/60">{f.windSpeedKts != null ? `${f.windSpeedKts} kts ${f.windDirection ?? ""}` : "—"}</Td>
              <Td><Badge label={f.status} className={FLIGHT_STATUS_COLORS[f.status]} /></Td>
              {manage && (
                <Td>
                  <RowActions editHref={`/flights?edit=${f.id}`} deleteAction={deleteFlight} id={f.id} label={String(f.code)} />
                </Td>
              )}
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
