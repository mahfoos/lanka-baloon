import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listReviews } from "@/lib/data";
import { formatDate } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Stars, AccessRestricted,
} from "@/components/ui";

import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveReview, deleteReview } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "author", label: "Author", type: "text", required: true },
  { name: "country", label: "Country", type: "text" },
  { name: "rating", label: "Rating (1-5)", type: "number" },
  { name: "title", label: "Title", type: "text", required: true, span: 2 },
  { name: "source", label: "Source", type: "text", placeholder: "TripAdvisor" },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "flightRef", label: "Flight reference", type: "text" },
  { name: "body", label: "Review", type: "textarea", required: true },
];

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewReviews")) {
    return <AccessRestricted message="Reviews are visible to most operational roles." />;
  }
  const manage = can(user, "canManageReviews");
  const reviews = await listReviews();

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1);
  const fiveStar = reviews.filter((r) => r.rating === 5).length;
  const sources = new Set(reviews.map((r) => r.source)).size;

  const editing =
    manage && searchParams.edit
      ? await prisma.review.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Reviews"
        subtitle="What guests say about flying with Sri Lanka Balloon."
        action={manage && !showForm ? <Link href="/reviews?new=1" className="btn-primary">+ Add Review</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveReview}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/reviews"
            title={editing ? `Edit review by ${editing.author}` : "Add Review"}
            submitLabel={editing ? "Save changes" : "Save"}
            values={editing ?? { rating: 5, source: "TripAdvisor" }}
          />
        </div>
      )}

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Average Rating" value={`${avg.toFixed(1)} ★`} hint={`${reviews.length} reviews`} tone="accent" />
          <StatCard label="5-Star Reviews" value={fiveStar} hint={`of ${reviews.length}`} tone="brand" />
          <StatCard label="Sources" value={sources} hint="TripAdvisor, Google…" />
          <StatCard label="Recommend Rate" value="100%" hint="would fly again" tone="positive" />
        </StatGrid>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {reviews.map((r) => (
          <figure key={r.id} className="rounded-2xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <Stars rating={r.rating} />
              <span className="text-xs text-ink/40">{formatDate(r.date)}</span>
            </div>
            <figcaption className="mt-3 font-display text-lg font-bold text-brand-950">{r.title}</figcaption>
            <blockquote className="mt-1.5 text-sm leading-relaxed text-ink/65">“{r.body}”</blockquote>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">
                {r.author}{r.country ? ` · ${r.country}` : ""}
              </p>
              <div className="flex items-center gap-2">
                {r.flightRef && <span className="font-mono text-[11px] text-brand-600">{r.flightRef}</span>}
                <span className="chip">{r.source}</span>
              </div>
            </div>
            {manage && (
              <div className="mt-4 border-t border-brand-900/5 pt-3">
                <RowActions editHref={`/reviews?edit=${r.id}`} deleteAction={deleteReview} id={r.id} label={r.title} />
              </div>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
