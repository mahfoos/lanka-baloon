/**
 * The monthly passenger grid: months down the side, days of the month across.
 *
 * Unlike the other three sheets this one is not entered by hand. Every figure in
 * it already exists in the bookings, so it is computed rather than typed, and
 * cannot disagree with the reservations it summarises.
 */
import { prisma } from "@lanka-baloon/db";

export interface PaxMonthRow {
  year: number;
  month: number;
  label: string;
  /** 1-based by day of month; index 0 is unused. */
  days: number[];
  total: number;
}

export interface PaxReport {
  /** A season runs November to May, which is when they fly. */
  seasonStart: number;
  rows: PaxMonthRow[];
  grandTotal: number;
  busiestDay: { date: string; pax: number } | null;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const daysIn = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).getUTCDate();

/**
 * @param seasonStart calendar year the November belongs to; the season runs to
 *   the following May, matching how the office lays the sheet out.
 */
export async function getPaxReport(seasonStart: number): Promise<PaxReport> {
  const from = new Date(Date.UTC(seasonStart, 10, 1)); // 1 November
  const to = new Date(Date.UTC(seasonStart + 1, 5, 1)); // 1 June

  const bookings = await prisma.booking.groupBy({
    by: ["flightDate"],
    where: { flightDate: { gte: from, lt: to }, status: { notIn: ["CANCELLED", "REFUNDED"] } },
    _sum: { adults: true, children: true },
  });

  const byDate = new Map<string, number>();
  for (const b of bookings) {
    byDate.set(
      b.flightDate.toISOString().slice(0, 10),
      (b._sum.adults ?? 0) + (b._sum.children ?? 0),
    );
  }

  // November to May inclusive, in the order the sheet lists them.
  const months: { year: number; month: number }[] = [
    { year: seasonStart, month: 11 },
    { year: seasonStart, month: 12 },
    { year: seasonStart + 1, month: 1 },
    { year: seasonStart + 1, month: 2 },
    { year: seasonStart + 1, month: 3 },
    { year: seasonStart + 1, month: 4 },
    { year: seasonStart + 1, month: 5 },
  ];

  let grandTotal = 0;
  let busiestDay: { date: string; pax: number } | null = null;

  const rows: PaxMonthRow[] = months.map(({ year, month }) => {
    const count = daysIn(year, month);
    const days = Array<number>(32).fill(0);
    let total = 0;
    for (let d = 1; d <= count; d++) {
      const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const pax = byDate.get(key) ?? 0;
      days[d] = pax;
      total += pax;
      if (pax > 0 && (!busiestDay || pax > busiestDay.pax)) busiestDay = { date: key, pax };
    }
    grandTotal += total;
    return { year, month, label: `${MONTH_NAMES[month - 1]} ${year}`, days, total };
  });

  return { seasonStart, rows, grandTotal, busiestDay };
}

/** Seasons that have any booking, newest first, for the season picker. */
export async function availableSeasons(): Promise<number[]> {
  const range = await prisma.booking.aggregate({
    _min: { flightDate: true },
    _max: { flightDate: true },
  });
  const min = range._min.flightDate;
  const max = range._max.flightDate;

  const thisSeason = (d: Date) => (d.getUTCMonth() >= 10 ? d.getUTCFullYear() : d.getUTCFullYear() - 1);
  const now = new Date();
  const current = thisSeason(now);
  if (!min || !max) return [current];

  const seasons: number[] = [];
  for (let s = thisSeason(max); s >= thisSeason(min); s--) seasons.push(s);
  if (!seasons.includes(current)) seasons.unshift(current);
  return seasons;
}
