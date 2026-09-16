import Link from "next/link";
import { getSession, can } from "@/lib/auth";
import {
  dashboardStats, listBookings, listFlights, listCompliance, listMaintenance, listReviews,
} from "@/lib/data";
import {
  formatCurrency, formatCompactCurrency, formatDate, daysUntil, complianceStatusFor,
  BOOKING_STATUS_COLORS, FLIGHT_STATUS_COLORS, COMPLIANCE_STATUS_COLORS,
} from "@/types";
import { Badge, StatCard, StatGrid, Stars } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = getSession()!;
  const stats = await dashboardStats();

  const bookings = await listBookings();
  const flights = await listFlights();
  const compliance = await listCompliance();
  const maintenance = await listMaintenance();
  const reviews = await listReviews();

  const upcomingFlights = flights
    .filter((f) => f.status === "Scheduled")
    .sort((a, b) => a.date.localeCompare(b.date));
  const recentBookings = bookings.slice(0, 6);
  const expiringCompliance = compliance.filter((c) => complianceStatusFor(c.expiryDate) !== "Valid");
  const openMaintenance = maintenance.filter((m) => m.status !== "Completed");

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-brand-950">Operations Dashboard</h1>
          <p className="mt-1 text-sm text-ink/55">
            Welcome back, {user.name.split(" ")[0]} — Lanka Ballooning operational overview
          </p>
        </div>
        {can(user, "canManageBookings") && (
          <Link href="/bookings" className="btn-primary">+ New Booking</Link>
        )}
      </div>

      {/* KPIs */}
      <div className="mt-8">
        <StatGrid>
          <StatCard label="Upcoming Bookings" value={stats.upcomingBookings} hint={`${stats.totalBookings} total · view all →`} href="/bookings" tone="brand" />
          <StatCard label="Passengers Flown" value={stats.passengersFlown.toLocaleString()} hint="this season" />
          {can(user, "canViewFinance") ? (
            <StatCard label="Net Position" value={formatCompactCurrency(stats.finance.net)} hint={`${formatCompactCurrency(stats.finance.totalIncome)} income`} tone={stats.finance.net >= 0 ? "positive" : "negative"} />
          ) : (
            <StatCard label="Airworthy Balloons" value={`${stats.airworthyBalloons}/${stats.totalBalloons}`} hint="fleet ready" />
          )}
          <StatCard label="Guest Rating" value={`${stats.averageRating.toFixed(1)} ★`} hint={`${reviews.length} reviews`} href="/reviews" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Upcoming flights */}
          <section className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-brand-950">Upcoming Flights</h2>
              <Link href="/flights" className="text-sm font-semibold text-brand-700 hover:text-accent-500">View schedule →</Link>
            </div>
            <div className="mt-4 space-y-2">
              {upcomingFlights.length === 0 ? (
                <p className="text-sm text-ink/40">No scheduled flights — off season.</p>
              ) : upcomingFlights.map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-brand-50/50">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-sm text-brand-950">{f.launchSite} · {formatDate(f.date)} · {f.launchTime}</p>
                    <p className="text-xs text-ink/45 font-mono">{f.balloonReg} · {f.pilotName}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-ink/50">{f.booked}/{f.capacity} pax</span>
                    <Badge label={f.status} className={FLIGHT_STATUS_COLORS[f.status]} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent bookings */}
          <section className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-brand-950">Recent Bookings</h2>
              <Link href="/bookings" className="text-sm font-semibold text-brand-700 hover:text-accent-500">View all →</Link>
            </div>
            <div className="mt-4 space-y-2">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-brand-50/50">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-sm text-brand-950">{b.customerName}</p>
                    <p className="text-xs text-ink/45 font-mono">{b.ref} · {b.packageType} · {formatDate(b.flightDate)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden text-xs font-semibold text-ink/60 sm:block">{formatCurrency(b.totalAmount)}</span>
                    <Badge label={b.status} className={BOOKING_STATUS_COLORS[b.status]} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Compliance alerts */}
          {can(user, "canViewCompliance") && (
            <section className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-brand-950">Compliance Alerts</h2>
                <Link href="/compliance" className="text-sm font-semibold text-brand-700 hover:text-accent-500">View →</Link>
              </div>
              <div className="mt-4 space-y-2">
                {expiringCompliance.length === 0 ? (
                  <p className="text-sm text-ink/40">All certificates valid.</p>
                ) : expiringCompliance.map((c) => {
                  const status = complianceStatusFor(c.expiryDate);
                  return (
                    <div key={c.id} className="rounded-lg bg-paper px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs font-semibold text-brand-950">{c.kind}</p>
                        <Badge label={status} className={COMPLIANCE_STATUS_COLORS[status]} />
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-ink/50">{c.relatesTo} · {daysUntil(c.expiryDate)}d</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Maintenance */}
          {can(user, "canViewMaintenance") && (
            <section className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-brand-950">Open Maintenance</h2>
                <Link href="/maintenance" className="text-sm font-semibold text-brand-700 hover:text-accent-500">View →</Link>
              </div>
              {openMaintenance.length === 0 ? (
                <p className="mt-4 text-sm text-ink/40">Nothing open.</p>
              ) : (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-amber-50 p-4">
                  <span className="text-2xl font-black text-amber-700">{openMaintenance.length}</span>
                  <div>
                    <p className="text-sm font-bold text-amber-800">Jobs open</p>
                    <p className="text-xs text-amber-600">{openMaintenance.filter((m) => m.status === "Overdue").length} overdue</p>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Latest review */}
          <section className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="font-bold text-brand-950">Latest Review</h2>
            {reviews[0] && (
              <div className="mt-3">
                <Stars rating={reviews[0].rating} />
                <p className="mt-2 font-semibold text-sm text-brand-950">{reviews[0].title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/55 line-clamp-4">“{reviews[0].body}”</p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-ink/40">{reviews[0].author} · {reviews[0].source}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
