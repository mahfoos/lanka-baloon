/**
 * Parsing helpers shared by every module's server actions.
 *
 * Form values arrive as strings and an empty box is not the same thing as a
 * zero or a null, so each helper is explicit about what blank means. Anything
 * that fails to parse returns undefined, which Prisma treats as "leave alone"
 * rather than "set to null" — that is what makes the same action usable for
 * both create and update.
 */

/** Trimmed text, or null when the box was left empty. */
export function text(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

/** Required text. Returns null when missing, so the caller can reject. */
export function required(fd: FormData, key: string): string | null {
  return text(fd, key);
}

export function int(fd: FormData, key: string, fallback: number | null = null): number | null {
  const v = fd.get(key);
  if (v === null || String(v).trim() === "") return fallback;
  const n = Number(String(v).replace(/[^0-9-]/g, ""));
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

/** Money and other decimals. Strips currency symbols and thousands separators. */
export function decimal(fd: FormData, key: string, fallback: number | null = null): number | null {
  const v = fd.get(key);
  if (v === null || String(v).trim() === "") return fallback;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

/**
 * A date column carries no timezone. Parsing "2026-04-23" in local time and
 * storing it would move the date by a day for anyone east of Greenwich, so it
 * is pinned to UTC midnight.
 */
export function date(fd: FormData, key: string): Date | null {
  const v = text(fd, key);
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const d = new Date(`${v}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** An unchecked box is absent from the form entirely, hence the presence test. */
export function bool(fd: FormData, key: string): boolean {
  return fd.get(key) !== null;
}

/** Only accepts values the schema actually allows; anything else is dropped. */
export function enumValue<T extends string>(fd: FormData, key: string, allowed: readonly T[]): T | null {
  const v = text(fd, key);
  return v !== null && (allowed as readonly string[]).includes(v) ? (v as T) : null;
}
