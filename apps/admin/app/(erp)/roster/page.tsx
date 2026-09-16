/**
 * The monthly crew roster, replacing the CREW FLIGHT spreadsheet: crew down the
 * side, days across, ticked where someone worked.
 */
import Link from "next/link";
import { getSession, can } from "@/lib/auth";
import { getRoster } from "@/lib/roster";
import { PageHeader, StatCard, StatGrid, AccessRestricted } from "@/components/ui";
import { saveRoster } from "./actions";

export const dynamic = "force-dynamic";

export default async function RosterPage({
  searchParams,
}: {
  searchParams: { year?: string; month?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewCrew")) {
    return <AccessRestricted message="The crew roster is visible to operations and crew management roles." />;
  }
  const manage = can(user, "canManageCrew");

  const now = new Date();
  const year = Number(searchParams.year) || now.getUTCFullYear();
  const month = Number(searchParams.month) || now.getUTCMonth() + 1;
  const roster = await getRoster(year, month);

  const shift = (delta: number) => {
    const d = new Date(Date.UTC(year, month - 1 + delta, 1));
    return `/roster?year=${d.getUTCFullYear()}&month=${d.getUTCMonth() + 1}`;
  };

  const days = Array.from({ length: roster.daysInMonth }, (_, i) => i + 1);
  const manDays = roster.rows.reduce((sum, r) => sum + r.total, 0);

  return (
    <div className="mx-auto max-w-[110rem]">
      <PageHeader
        title="Crew Roster"
        subtitle={`Who worked each morning in ${roster.monthLabel}.`}
        action={
          <div className="flex items-center gap-2">
            <Link href={shift(-1)} className="btn-ghost">← Previous</Link>
            <Link href={shift(1)} className="btn-ghost">Next →</Link>
          </div>
        }
      />

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Crew listed" value={roster.rows.length} hint="active and on leave" tone="brand" />
          <StatCard label="Man-days" value={manDays} hint={`across ${roster.daysInMonth} days`} />
          <StatCard label="Busiest day" value={Math.max(0, ...roster.dailyTotals)} hint="most crew on one morning" tone="accent" />
          <StatCard label="Days worked" value={roster.dailyTotals.filter((t) => t > 0).length} hint="mornings with any crew" />
        </StatGrid>
      </div>

      {roster.rows.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-card">
          <p className="font-bold text-brand-950">No crew on file</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
            The roster lists anyone active or on leave in Crew &amp; Pilots. Add crew there first and they will appear here.
          </p>
        </div>
      ) : (
        <form action={saveRoster} className="mt-6">
          <input type="hidden" name="year" value={year} />
          <input type="hidden" name="month" value={month} />

          <div className="overflow-hidden rounded-2xl bg-white shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-brand-900/8 text-xs font-semibold text-ink/40">
                    {/* The name column stays put while the month scrolls sideways. */}
                    <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left">Crew</th>
                    {days.map((d) => (
                      <th key={d} className="w-9 px-0 py-3 text-center font-semibold">{d}</th>
                    ))}
                    <th className="px-3 py-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.rows.map((r) => (
                    <tr key={r.crewId} className="border-t border-brand-900/5 hover:bg-brand-50/30">
                      <td className="sticky left-0 z-10 bg-white px-4 py-2">
                        <p className="whitespace-nowrap font-semibold text-brand-950">{r.name}</p>
                        <p className="text-[11px] text-ink/45">{r.role}</p>
                      </td>
                      {days.map((d) => (
                        <td key={d} className="px-0 py-2 text-center">
                          <input
                            type="checkbox"
                            name={`d:${r.crewId}:${d}`}
                            defaultChecked={r.days[d]}
                            disabled={!manage}
                            aria-label={`${r.name} worked on day ${d}`}
                            className="size-4 accent-brand-700 disabled:opacity-50"
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2 text-center font-bold text-brand-950">{r.total}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-brand-900/10 bg-brand-50/40">
                    <td className="sticky left-0 z-10 bg-brand-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink/50">
                      Crew that day
                    </td>
                    {days.map((d) => (
                      <td key={d} className="px-0 py-2 text-center text-xs font-bold text-brand-800">
                        {roster.dailyTotals[d] || ""}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center font-black text-brand-950">{manDays}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {manage && (
            <div className="mt-4 flex items-center gap-4">
              <button className="btn-primary">Save {roster.monthLabel}</button>
              <p className="text-xs text-ink/45">
                Saving replaces the whole month, so unticking a box removes that day.
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
