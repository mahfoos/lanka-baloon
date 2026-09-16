import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listBalloons } from "@/lib/data";
import { formatDate, daysUntil, BALLOON_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, AccessRestricted,
} from "@/components/ui";
import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveBalloon, deleteBalloon } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "registration", label: "Registration", type: "text", required: true, placeholder: "4R-SLB" },
  { name: "name", label: "Name", type: "text", required: true, placeholder: "Sigiriya" },
  { name: "manufacturer", label: "Manufacturer", type: "select", required: true, options: [
    { value: "ULTRAMAGIC", label: "Ultramagic" }, { value: "LINDSTRAND", label: "Lindstrand" }] },
  { name: "model", label: "Model", type: "text", required: true, placeholder: "N-425" },
  { name: "basketCapacity", label: "Basket capacity", type: "number", placeholder: "16" },
  { name: "envelopeVolumeM3", label: "Envelope volume (m³)", type: "number", placeholder: "12000" },
  { name: "yearBuilt", label: "Year built", type: "number", placeholder: "2019" },
  { name: "totalFlightHours", label: "Total flight hours", type: "money" },
  { name: "status", label: "Status", type: "select", options: [
    { value: "AIRWORTHY", label: "Airworthy" }, { value: "IN_MAINTENANCE", label: "In Maintenance" },
    { value: "GROUNDED", label: "Grounded" }, { value: "RETIRED", label: "Retired" }] },
  { name: "airworthinessExpiry", label: "Airworthiness expiry", type: "date" },
  { name: "lastInspection", label: "Last inspection", type: "date" },
  { name: "hasSafetyBelts", label: "Safety belts fitted", type: "checkbox" },
];

export default async function FleetPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewFleet")) {
    return <AccessRestricted message="The balloon fleet is visible to operations and pilot roles." />;
  }
  const manage = can(user, "canManageFleet");
  const balloons = await listBalloons();

  const editing =
    manage && searchParams.edit
      ? await prisma.balloon.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  const airworthy = balloons.filter((b) => b.status === "Airworthy").length;
  const totalHours = balloons.reduce((s, b) => s + b.totalFlightHours, 0);
  const totalCapacity = balloons.reduce((s, b) => s + b.basketCapacity, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Balloon Fleet"
        subtitle="Ultramagic (Spain) & Lindstrand (UK) balloons — all with safety belts and EASA design."
        action={manage && !showForm ? <Link href="/fleet?new=1" className="btn-primary">+ Add Balloon</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveBalloon}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/fleet"
            title={editing ? `Edit ${editing.registration}` : "Add a balloon"}
            submitLabel={editing ? "Save changes" : "Add balloon"}
            values={editing ?? { status: "AIRWORTHY", hasSafetyBelts: true }}
          />
        </div>
      )}

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Airworthy" value={`${airworthy}/${balloons.length}`} hint="ready to fly" tone="brand" />
          <StatCard label="Total Flight Hours" value={totalHours.toLocaleString()} hint="fleet lifetime" />
          <StatCard label="Combined Capacity" value={`${totalCapacity} pax`} hint="across all baskets" />
          <StatCard label="Safety Belts" value="All baskets" hint="only operator in Sri Lanka" tone="accent" />
        </StatGrid>
      </div>

      {balloons.length === 0 && !showForm && (
        <p className="mt-6 rounded-2xl bg-white p-8 text-center text-sm text-ink/45 shadow-card">
          No balloons on file yet.{manage && " Use “Add Balloon” to enter the first one."}
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {balloons.map((b) => {
          const awDays = daysUntil(b.airworthinessExpiry);
          return (
            <div key={b.id} className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-brand-600">{b.registration}</p>
                  <p className="mt-0.5 font-display text-lg font-bold text-brand-950">{b.name}</p>
                  <p className="text-xs text-ink/55">{b.manufacturer} {b.model} · {b.yearBuilt}</p>
                </div>
                <Badge label={b.status} className={BALLOON_STATUS_COLORS[b.status]} />
              </div>
              {manage && (
                <div className="mt-3">
                  <RowActions editHref={`/fleet?edit=${b.id}`} deleteAction={deleteBalloon} id={b.id} label={b.registration} />
                </div>
              )}

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-paper p-3">
                  <p className="text-lg font-black text-brand-950">{b.basketCapacity}</p>
                  <p className="text-[10px] font-semibold uppercase text-ink/45">Capacity</p>
                </div>
                <div className="rounded-xl bg-paper p-3">
                  <p className="text-lg font-black text-brand-950">{b.totalFlightHours}</p>
                  <p className="text-[10px] font-semibold uppercase text-ink/45">Hours</p>
                </div>
                <div className="rounded-xl bg-paper p-3">
                  <p className="text-lg font-black text-brand-950">{(b.envelopeVolumeM3 / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] font-semibold uppercase text-ink/45">m³ envelope</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-ink/50">Last inspection: <span className="font-semibold text-ink/70">{formatDate(b.lastInspection)}</span></span>
                <span className={awDays < 60 ? "font-semibold text-amber-600" : "text-ink/50"}>
                  Airworthiness: {formatDate(b.airworthinessExpiry)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
