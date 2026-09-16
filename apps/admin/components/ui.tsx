/**
 * Small presentational toolkit shared across the ERP module pages.
 * Server-component friendly (no client hooks).
 */
import Link from "next/link";

/* ------------------------------------------------------------------ *
 * Page header
 * ------------------------------------------------------------------ */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-brand-950">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Stat card
 * ------------------------------------------------------------------ */

export function StatCard({
  label,
  value,
  hint,
  href,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: "default" | "brand" | "accent" | "positive" | "negative";
}) {
  const toneCls =
    tone === "brand"
      ? "bg-brand-800 text-white"
      : tone === "accent"
      ? "bg-accent-500 text-white"
      : "bg-white";
  const labelCls = tone === "brand" || tone === "accent" ? "text-white/60" : "text-ink/45";
  const valueCls =
    tone === "positive"
      ? "text-green-700"
      : tone === "negative"
      ? "text-red-600"
      : tone === "brand" || tone === "accent"
      ? "text-white"
      : "text-brand-950";
  const hintCls = tone === "brand" || tone === "accent" ? "text-white/50" : "text-ink/40";

  const inner = (
    <div className={`rounded-2xl p-6 shadow-card transition ${toneCls} ${href ? "hover:shadow-lg" : ""}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider ${labelCls}`}>{label}</p>
      <p className={`mt-2 text-2xl font-black ${valueCls}`}>{value}</p>
      {hint && <p className={`mt-1 text-xs ${hintCls}`}>{hint}</p>}
    </div>
  );

  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

/* ------------------------------------------------------------------ *
 * Status badge
 * ------------------------------------------------------------------ */

export function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Table shell + cells
 * ------------------------------------------------------------------ */

export function TableCard({
  head,
  children,
}: {
  head: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-brand-900/8">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-ink/40">
              {head}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`px-5 py-3 ${className}`}>{children}</th>;
}

export function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 ${className}`}>{children}</td>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="border-t border-brand-900/5 hover:bg-brand-50/30">{children}</tr>;
}

export function EmptyRow({ colSpan, label = "No records." }: { colSpan: number; label?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-sm text-ink/40">
        {label}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ *
 * Star rating
 * ------------------------------------------------------------------ */

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-accent-500" aria-label={`${rating} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Access-restricted placeholder
 * ------------------------------------------------------------------ */

export function AccessRestricted({ message }: { message: string }) {
  return (
    <div className="py-20 text-center">
      <p className="text-xl font-bold text-brand-950">Access restricted</p>
      <p className="mt-2 text-sm text-ink/55">{message}</p>
    </div>
  );
}
