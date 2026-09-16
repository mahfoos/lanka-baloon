/**
 * Messages sent through the contact form on srilankaballoon.com.
 *
 * Bookings from the website are not here; they land in the Bookings module
 * alongside every other reservation, tagged with source "Website".
 */
import { getSession, can } from "@/lib/auth";
import { listContactMessages } from "@/lib/data";
import { formatDateTime } from "@/types";
import { PageHeader, StatCard, StatGrid, Badge, AccessRestricted } from "@/components/ui";
import { markMessageHandled } from "./actions";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = getSession()!;
  if (!can(user, "canViewBookings")) {
    return <AccessRestricted message="Website messages are visible to reservations, operations and finance roles." />;
  }
  const manage = can(user, "canManageBookings");
  const messages = await listContactMessages();
  const open = messages.filter((m) => !m.handled).length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Website Messages"
        subtitle="Enquiries sent through the contact form on srilankaballoon.com."
      />

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Unanswered" value={open} hint="need a reply" tone={open > 0 ? "negative" : "positive"} />
          <StatCard label="Total" value={messages.length} hint="most recent 50" tone="brand" />
        </StatGrid>
      </div>

      <ul className="mt-6 space-y-3">
        {messages.length === 0 && (
          <li className="rounded-2xl bg-white p-8 text-center text-sm text-ink/40 shadow-card">
            No messages yet. Anything sent through the website contact form appears here.
          </li>
        )}
        {messages.map((m) => (
          <li key={m.id} className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-brand-950">
                  {m.name}{" "}
                  <a href={`mailto:${m.email}`} className="break-all text-sm font-normal text-brand-700 hover:underline">
                    {m.email}
                  </a>
                </p>
                <p className="text-xs text-ink/40">{formatDateTime(m.createdAt)}</p>
              </div>
              {manage ? (
                <form action={markMessageHandled}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="handled" value={String(!m.handled)} />
                  <button
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      m.handled
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-accent-100 text-accent-600 hover:bg-accent-200"
                    }`}
                  >
                    {m.handled ? "Handled" : "Mark handled"}
                  </button>
                </form>
              ) : (
                <Badge
                  label={m.handled ? "Handled" : "Open"}
                  className={m.handled ? "bg-green-50 text-green-700" : "bg-accent-100 text-accent-600"}
                />
              )}
            </div>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/70">{m.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
