import { getSession, can } from "@/lib/auth";
import { listFlights } from "@/lib/data";
import { formatDate, FLIGHT_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function FlightsPage() {
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

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Flight Schedule"
        subtitle="Early-morning launches over Dambulla, Kandalama and Sigiriya."
        action={manage ? <button className="btn-primary" disabled>+ Schedule Flight</button> : undefined}
      />

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
            </>
          }
        >
          {flights.length === 0 ? (
            <EmptyRow colSpan={8} label="No flights." />
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
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
