/**
 * The monthly crew roster: the grid of crew against days of the month, marked
 * worked or not.
 *
 * Stored as one row per person per day rather than a wide table, so adding a
 * crew member or a day is data, never a schema change. A month is then a query.
 */
import { prisma, CREW_ROLE_LABELS, CREW_STATUS_LABELS } from "@lanka-baloon/db";

export interface RosterRow {
  crewId: string;
  name: string;
  role: string;
  status: string;
  /** Indexed by day of month, 1-based. `days[3]` is the 3rd. */
  days: boolean[];
  total: number;
}

export interface Roster {
  year: number;
  month: number;
  monthLabel: string;
  daysInMonth: number;
  rows: RosterRow[];
  /** Headcount per day, for the column totals along the bottom. */
  dailyTotals: number[];
}

export function monthBounds(year: number, month: number) {
  // UTC throughout: a date column has no timezone, and building these locally
  // would shift the whole month by a day for anyone east of Greenwich.
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { start, end, daysInMonth };
}

export async function getRoster(year: number, month: number): Promise<Roster> {
  const { start, end, daysInMonth } = monthBounds(year, month);

  const [crew, entries] = await Promise.all([
    // Off-season and inactive crew are hidden: the roster is for who is around.
    prisma.crewMember.findMany({
      where: { status: { in: ["ACTIVE", "ON_LEAVE"] } },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    }),
    prisma.crewRosterEntry.findMany({
      where: { date: { gte: start, lt: end }, worked: true },
      select: { crewId: true, date: true },
    }),
  ]);

  const marked = new Map<string, Set<number>>();
  for (const e of entries) {
    const day = e.date.getUTCDate();
    if (!marked.has(e.crewId)) marked.set(e.crewId, new Set());
    marked.get(e.crewId)!.add(day);
  }

  const dailyTotals = Array<number>(daysInMonth + 1).fill(0);

  const rows: RosterRow[] = crew.map((c) => {
    const set = marked.get(c.id) ?? new Set<number>();
    const days = Array<boolean>(daysInMonth + 1).fill(false);
    let total = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const worked = set.has(d);
      days[d] = worked;
      if (worked) {
        total++;
        dailyTotals[d]++;
      }
    }
    return {
      crewId: c.id,
      name: c.name,
      role: CREW_ROLE_LABELS[c.role],
      status: CREW_STATUS_LABELS[c.status],
      days,
      total,
    };
  });

  return {
    year,
    month,
    monthLabel: new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
    daysInMonth,
    rows,
    dailyTotals,
  };
}
