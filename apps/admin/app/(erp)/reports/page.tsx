/**
 * The monthly passenger grid, replacing the Flight Reservations sheet.
 *
 * The only one of the four that isn't typed in: every figure is summed from the
 * bookings, so it cannot drift from the reservations it reports on.
 */
import Link from "next/link";
import { getSession, can } from "@/lib/auth";
import { getPaxReport, availableSeasons } from "@/lib/reports";
import { formatDate } from "@/types";
import { PageHeader, StatCard, StatGrid, AccessRestricted } from "@/components/ui";

export const dynamic = "force-dynamic";

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default async function ReportsPage({ searchParams }: { searchParams: { season?: string } }) {
  const user = getSession()!;
  if (!can(user, "canViewBookings")) {
    return <AccessRestricted message="Reports are visible to reservations, operations and finance roles." />;
  }

  const seasons = await availableSeasons();
  const season = Number(searchParams.season) || seasons[0];
  const report = await getPaxReport(season);

  const flyingDays = report.rows.reduce(
    (sum, r) => sum + r.days.filter((p) => p > 0).length,
    0,
  );
  const busiest = report.busiestDay;

  // Shade by how busy a day was, relative to the busiest in the season.
  const shade = (pax: number) => {
    if (pax === 0) return "text-ink/20";
    if (!busiest || busiest.pax === 0) return "text-brand-950";
    const ratio = pax / busiest.pax;
    if (ratio > 0.75) return "bg-brand-700 text-white font-bold";
    if (ratio > 0.5) return "bg-brand-100 text-brand-900 font-semibold";
    if (ratio > 0.25) return "bg-brand-50 text-brand-800";
    return "text-ink/70";
  };

  return (
    <div className="mx-auto max-w-[110rem]">
      <PageHeader
        title="Passenger Report"
        subtitle={`Passengers per day, season ${season} to ${season + 1}. Flying runs November to May.`}
        action={
          <div className="flex flex-wrap gap-1.5">
            {seasons.map((s) => (
              <Link
                key={s}
                href={`/reports?season=${s}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  s === season ? "border-brand-600 bg-brand-600 text-white" : "border-brand-900/15 bg-white text-ink/60 hover:border-brand-400"
                }`}
              >
                {s}/{String(s + 1).slice(2)}
              </Link>
            ))}
          </div>
        }
      />

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Passengers" value={report.grandTotal} hint="whole season" tone="brand" />
          <StatCard label="Flying days" value={flyingDays} hint="days with anyone booked" />
          <StatCard label="Busiest day" value={busiest ? busiest.pax : 0} hint={busiest ? formatDate(busiest.date) : "no bookings yet"} tone="accent" />
          <StatCard
            label="Average per flying day"
            value={flyingDays ? Math.round(report.grandTotal / flyingDays) : 0}
            hint="excludes days with none"
          />
        </StatGrid>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-brand-900/8 text-xs font-semibold text-ink/40">
                <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left">Month</th>
                {DAYS.map((d) => <th key={d} className="w-9 px-0 py-3 text-center">{d}</th>)}
                <th className="px-4 py-3 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((r) => (
                <tr key={r.label} className="border-t border-brand-900/5">
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-white px-4 py-2 font-semibold text-brand-950">
                    {r.label}
                  </td>
                  {DAYS.map((d) => (
                    <td key={d} className={`px-0 py-2 text-center text-xs tabular-nums ${shade(r.days[d] ?? 0)}`}>
                      {r.days[d] ? r.days[d] : "·"}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-center font-black text-brand-950">{r.total || "—"}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-brand-900/10 bg-brand-50/40">
                <td className="sticky left-0 z-10 bg-brand-50 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink/50">
                  Season total
                </td>
                <td colSpan={31} />
                <td className="px-4 py-2.5 text-center font-black text-brand-950">{report.grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-ink/45">
        Counted from confirmed and pending bookings by flight date; cancelled and refunded are excluded.
        Short months simply have no cells for the missing days.
      </p>
    </div>
  );
}
