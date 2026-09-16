/**
 * The daily flight manifest, replacing the Before/After Flight Reservations
 * spreadsheets. One editable row per guest expected at the field.
 */
import Link from "next/link";
import { getSession, can } from "@/lib/auth";
import { getManifest, flyingDates, flightsOn, type ManifestVariant } from "@/lib/manifest";
import { formatDate } from "@/types";
import { PageHeader, StatCard, StatGrid, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted } from "@/components/ui";
import { updateManifestRow, assignFlight } from "./actions";

export const dynamic = "force-dynamic";

const money = (totals: Record<string, number>) => {
  const parts = Object.entries(totals).filter(([, v]) => v > 0);
  if (parts.length === 0) return "—";
  return parts.map(([c, v]) => `${c} ${v.toLocaleString("en-US")}`).join(" · ");
};

export default async function ManifestPage({
  searchParams,
}: {
  searchParams: { date?: string; list?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewBookings")) {
    return <AccessRestricted message="The flight manifest is visible to reservations and operations roles." />;
  }
  const manage = can(user, "canManageBookings");

  const dates = await flyingDates();
  // Default to the next day anyone is booked on, else today.
  const date = searchParams.date ?? dates[0]?.date ?? new Date().toISOString().slice(0, 10);
  const variant: ManifestVariant = searchParams.list === "after" ? "after" : "before";

  const [manifest, flights] = await Promise.all([getManifest(date, variant), flightsOn(date)]);

  const tab = (v: ManifestVariant, label: string) => (
    <Link
      href={`/manifest?date=${date}&list=${v}`}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
        variant === v ? "bg-brand-700 text-white" : "bg-white text-ink/60 hover:text-brand-950"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mx-auto max-w-[110rem]">
      <PageHeader
        title="Flight Manifest"
        subtitle={`General booking list for ${formatDate(date)}.`}
        action={<div className="flex gap-2">{tab("before", "Before flight")}{tab("after", "After flight")}</div>}
      />

      {/* Day picker. A plain form so it works without client JS. */}
      <form className="mt-6 flex flex-wrap items-end gap-3" action="/manifest">
        <div>
          <label htmlFor="date" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/45">
            Flight date
          </label>
          <input id="date" type="date" name="date" defaultValue={date} className="input-field" />
        </div>
        <input type="hidden" name="list" value={variant} />
        <button className="btn-primary">Show day</button>
        {dates.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {dates.slice(0, 6).map((d) => (
              <Link
                key={d.date}
                href={`/manifest?date=${d.date}&list=${variant}`}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  d.date === date ? "border-brand-600 bg-brand-600 text-white" : "border-brand-900/15 bg-white text-ink/60 hover:border-brand-400"
                }`}
              >
                {formatDate(d.date)} · {d.pax}
              </Link>
            ))}
          </div>
        )}
      </form>

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Total PAX" value={manifest.totalPax} hint={variant === "after" ? "as flown" : "as booked"} tone="brand" />
          <StatCard label="Guests" value={manifest.rows.length} hint="rows on the list" />
          <StatCard label="Advance paid" value={money(manifest.totalAdvance)} hint="before the day" />
          <StatCard label="Cash at field" value={money(manifest.totalAtField)} hint="collected on the morning" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th className="text-center">PAX</Th>
              <Th>Name</Th>
              <Th>Hotel / City</Th>
              <Th>Contact</Th>
              <Th>Pick-up</Th>
              <Th>Booked via</Th>
              <Th>Guide</Th>
              <Th>Pilot / Balloon</Th>
              <Th>Driver in / out</Th>
              <Th className="text-right">Advance</Th>
              <Th className="text-right">At field</Th>
              {manage && <Th />}
            </>
          }
        >
          {manifest.rows.length === 0 ? (
            <EmptyRow colSpan={manage ? 12 : 11} label={`Nobody booked for ${formatDate(date)}.`} />
          ) : (
            manifest.rows.map((r) => (
              <Tr key={r.id}>
                {manage ? (
                  // The whole row is one form, so a single Save writes every
                  // field the office touched while working down the list.
                  <>
                    <Td className="text-center align-top">
                      <form id={`m-${r.id}`} action={updateManifestRow} />
                      <input form={`m-${r.id}`} type="hidden" name="id" value={r.id} />
                      {variant === "after" ? (
                        <input
                          form={`m-${r.id}`}
                          name="actualPax"
                          defaultValue={r.actualPax ?? r.bookedPax}
                          inputMode="numeric"
                          aria-label={`Actual PAX for ${r.name}`}
                          className="w-14 rounded-lg border border-brand-900/15 px-2 py-1 text-center text-sm font-bold"
                        />
                      ) : (
                        <span className="text-lg font-black text-brand-950">{r.bookedPax}</span>
                      )}
                    </Td>
                    <Td className="align-top">
                      <p className="font-semibold text-brand-950">{r.name}</p>
                      <p className="font-mono text-[11px] text-ink/40">{r.ref}</p>
                    </Td>
                    <Td className="align-top">
                      <input form={`m-${r.id}`} name="hotel" defaultValue={r.hotel} placeholder="Hotel" aria-label={`Hotel for ${r.name}`} className="manifest-input" />
                      <input form={`m-${r.id}`} name="city" defaultValue={r.city} placeholder="City" aria-label={`City for ${r.name}`} className="manifest-input mt-1" />
                    </Td>
                    <Td className="align-top">
                      <input form={`m-${r.id}`} name="contact" defaultValue={r.contact} placeholder="Phone" aria-label={`Contact for ${r.name}`} className="manifest-input" />
                    </Td>
                    <Td className="align-top">
                      <input form={`m-${r.id}`} name="pickupTime" defaultValue={r.pickupTime} placeholder="4.45 AM" aria-label={`Pick-up time for ${r.name}`} className="manifest-input w-24" />
                    </Td>
                    <Td className="align-top text-ink/70">{r.channel}</Td>
                    <Td className="align-top">
                      <input form={`m-${r.id}`} name="guideName" defaultValue={r.guide} placeholder="Guide / agency" aria-label={`Guide for ${r.name}`} className="manifest-input" />
                    </Td>
                    <Td className="align-top">
                      {r.pilot || r.balloon ? (
                        <>
                          <p className="text-sm font-semibold text-brand-950">{r.pilot || "No pilot"}</p>
                          <p className="text-xs text-ink/55">{r.balloon || "No balloon"}</p>
                        </>
                      ) : (
                        <form action={assignFlight} className="flex gap-1">
                          <input type="hidden" name="id" value={r.id} />
                          <select name="flightId" aria-label={`Assign flight for ${r.name}`} className="rounded-lg border border-brand-900/15 px-2 py-1 text-xs">
                            <option value="">Unassigned</option>
                            {flights.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                          </select>
                          <button className="rounded-lg bg-brand-700 px-2 text-xs font-semibold text-white">Set</button>
                        </form>
                      )}
                    </Td>
                    <Td className="align-top">
                      <input form={`m-${r.id}`} name="driverPickup" defaultValue={r.driverPickup} placeholder="Driver in" aria-label={`Pick-up driver for ${r.name}`} className="manifest-input" />
                      <input form={`m-${r.id}`} name="driverDropoff" defaultValue={r.driverDropoff} placeholder="Driver out" aria-label={`Drop-off driver for ${r.name}`} className="manifest-input mt-1" />
                    </Td>
                    <Td className="align-top text-right">
                      <input form={`m-${r.id}`} name="advancePaid" defaultValue={r.advancePaid || ""} inputMode="decimal" aria-label={`Advance paid by ${r.name}`} className="manifest-input w-20 text-right" />
                      <p className="mt-0.5 text-[10px] text-ink/40">{r.currency}</p>
                    </Td>
                    <Td className="align-top text-right">
                      <input form={`m-${r.id}`} name="flightTimeCash" defaultValue={r.flightTimeCash || ""} inputMode="decimal" aria-label={`Cash collected from ${r.name}`} className="manifest-input w-20 text-right" />
                    </Td>
                    <Td className="align-top">
                      <button form={`m-${r.id}`} className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-800">
                        Save
                      </button>
                    </Td>
                  </>
                ) : (
                  <>
                    <Td className="text-center text-lg font-black text-brand-950">{r.pax}</Td>
                    <Td><p className="font-semibold text-brand-950">{r.name}</p><p className="font-mono text-[11px] text-ink/40">{r.ref}</p></Td>
                    <Td>{r.hotel}{r.city && <span className="block text-xs text-ink/50">{r.city}</span>}</Td>
                    <Td className="text-ink/70">{r.contact || "—"}</Td>
                    <Td className="whitespace-nowrap">{r.pickupTime || "—"}</Td>
                    <Td className="text-ink/70">{r.channel}</Td>
                    <Td className="text-ink/70">{r.guide || "—"}</Td>
                    <Td>{r.pilot || "—"}<span className="block text-xs text-ink/55">{r.balloon}</span></Td>
                    <Td className="text-ink/70">{r.driverPickup || "—"}<span className="block text-xs">{r.driverDropoff}</span></Td>
                    <Td className="text-right">{r.advancePaid ? `${r.currency} ${r.advancePaid.toLocaleString("en-US")}` : "—"}</Td>
                    <Td className="text-right">{r.flightTimeCash ? r.flightTimeCash.toLocaleString("en-US") : "—"}</Td>
                  </>
                )}
              </Tr>
            ))
          )}
        </TableCard>
      </div>

      {manifest.rows.length > 0 && (
        <p className="mt-4 text-xs text-ink/45">
          {variant === "before"
            ? "Before-flight list: headcount as booked. Switch to the after-flight list once the morning is done to record who actually flew."
            : "After-flight list: edit PAX to what actually flew. Blank rows fall back to the booked figure."}
        </p>
      )}
    </div>
  );
}
