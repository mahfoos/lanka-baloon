/**
 * Master data: agents, cities and hotels.
 *
 * These are the pick-lists the booking form offers. Bookings store what was
 * picked as text, so editing an entry here changes what future bookings can
 * choose without rewriting what past ones recorded.
 */
import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { countries } from "@/lib/countries";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";
import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveAgent, deleteAgent, saveCity, deleteCity, saveHotel, deleteHotel } from "./actions";

export const dynamic = "force-dynamic";

type Tab = "agents" | "hotels" | "cities";
const TABS: { id: Tab; label: string }[] = [
  { id: "agents", label: "Agents" },
  { id: "hotels", label: "Hotels" },
  { id: "cities", label: "Cities" },
];

export default async function MasterDataPage({
  searchParams,
}: {
  searchParams: { tab?: string; new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewCustomers")) {
    return <AccessRestricted message="Master data is visible to reservations and administrator roles." />;
  }
  const manage = can(user, "canManageCustomers");
  const tab: Tab = TABS.some((t) => t.id === searchParams.tab) ? (searchParams.tab as Tab) : "agents";

  const [agents, cities, hotels] = await Promise.all([
    prisma.agent.findMany({ orderBy: { name: "asc" } }),
    prisma.city.findMany({ orderBy: { name: "asc" } }),
    prisma.hotel.findMany({ orderBy: { name: "asc" }, include: { city: { select: { name: true } } } }),
  ]);

  const editId = manage ? searchParams.edit : undefined;
  const editingAgent = tab === "agents" && editId ? agents.find((a) => a.id === editId) : undefined;
  const editingCity = tab === "cities" && editId ? cities.find((c) => c.id === editId) : undefined;
  const editingHotel = tab === "hotels" && editId ? hotels.find((h) => h.id === editId) : undefined;
  const editing = editingAgent ?? editingCity ?? editingHotel;
  const showForm = manage && (searchParams.new === "1" || editing !== undefined);

  const cityOptions = cities.map((c) => ({ value: c.id, label: c.name }));

  const AGENT_FIELDS: FieldSpec[] = [
    { name: "name", label: "Agency name", type: "text", required: true, placeholder: "Travel agency name" },
    { name: "contactName", label: "Contact person", type: "text" },
    { name: "email", label: "Email", type: "email", placeholder: "ops@agency.com" },
    { name: "phone", label: "Phone", type: "tel", placeholder: "+94 7X XXX XXXX" },
    { name: "country", label: "Country", type: "select", options: countries.map((c) => ({ value: c, label: c })) },
    { name: "vatRegistered", label: "VAT registered", type: "checkbox" },
    { name: "vatNumber", label: "VAT number", type: "text", hint: "Needed when VAT registered is ticked." },
    { name: "active", label: "Active", type: "checkbox" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  const CITY_FIELDS: FieldSpec[] = [
    { name: "name", label: "City / town", type: "text", required: true, placeholder: "Dambulla" },
    { name: "pickupArea", label: "We collect from here", type: "checkbox" },
  ];

  const HOTEL_FIELDS: FieldSpec[] = [
    { name: "name", label: "Hotel name", type: "text", required: true, placeholder: "Hotel Sigiriya" },
    { name: "cityId", label: "City", type: "select", options: cityOptions, hint: cityOptions.length ? undefined : "Add a city first." },
    { name: "pickupTime", label: "Usual pick-up time", type: "time", hint: "Offered as the default when booking this hotel." },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "active", label: "Active", type: "checkbox" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  const form = {
    agents: { fields: AGENT_FIELDS, action: saveAgent, title: "agent", defaults: { active: true } },
    cities: { fields: CITY_FIELDS, action: saveCity, title: "city", defaults: { pickupArea: true } },
    hotels: { fields: HOTEL_FIELDS, action: saveHotel, title: "hotel", defaults: { active: true } },
  }[tab];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Master Data"
        subtitle="The agents, hotels and cities the booking form picks from."
        action={
          manage && !showForm ? (
            <Link href={`/master-data?tab=${tab}&new=1`} className="btn-primary">+ Add {form.title}</Link>
          ) : undefined
        }
      />

      <div className="mt-6 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/master-data?tab=${t.id}`}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t.id ? "bg-brand-700 text-white" : "bg-white text-ink/60 hover:text-brand-950"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <StatGrid>
          <StatCard label="Agents" value={agents.length} hint={`${agents.filter((a) => a.active).length} active`} tone="brand" />
          <StatCard label="Hotels" value={hotels.length} hint={`${hotels.filter((h) => h.active).length} active`} />
          <StatCard label="Cities" value={cities.length} hint={`${cities.filter((c) => c.pickupArea).length} pick-up areas`} tone="accent" />
          <StatCard label="VAT-registered agents" value={agents.filter((a) => a.vatRegistered).length} hint="need a VAT invoice" />
        </StatGrid>
      </div>

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={form.action}
            fields={form.fields}
            id={editing?.id}
            cancelHref={`/master-data?tab=${tab}`}
            title={editing ? `Edit ${editing.name}` : `Add ${form.title}`}
            submitLabel={editing ? "Save changes" : "Save"}
            values={editing ?? form.defaults}
          />
        </div>
      )}

      <div className="mt-6">
        {tab === "agents" && (
          <TableCard
            head={<><Th>Agency</Th><Th>Contact</Th><Th>Country</Th><Th>VAT</Th><Th /></>}
          >
            {agents.length === 0 ? (
              <EmptyRow colSpan={5} label="No agents yet. Add the agencies you take bookings from." />
            ) : agents.map((a) => (
              <Tr key={a.id}>
                <Td>
                  <p className="font-semibold text-brand-950">{a.name}</p>
                  {!a.active && <Badge label="Inactive" className="bg-gray-100 text-gray-500" />}
                </Td>
                <Td className="text-ink/70">
                  {a.contactName && <p>{a.contactName}</p>}
                  {a.email && <a href={`mailto:${a.email}`} className="block break-all text-xs text-brand-700 hover:underline">{a.email}</a>}
                  {a.phone && <p className="text-xs">{a.phone}</p>}
                </Td>
                <Td className="text-ink/70">{a.country ?? "—"}</Td>
                <Td>
                  {a.vatRegistered
                    ? <span className="text-xs font-semibold text-brand-800">{a.vatNumber ?? "Registered, no number"}</span>
                    : <span className="text-xs text-ink/40">Not registered</span>}
                </Td>
                <Td>{manage && <RowActions editHref={`/master-data?tab=agents&edit=${a.id}`} deleteAction={deleteAgent} id={a.id} label={a.name} />}</Td>
              </Tr>
            ))}
          </TableCard>
        )}

        {tab === "hotels" && (
          <TableCard head={<><Th>Hotel</Th><Th>City</Th><Th>Usual pick-up</Th><Th>Phone</Th><Th /></>}>
            {hotels.length === 0 ? (
              <EmptyRow colSpan={5} label="No hotels yet. Add the hotels you collect from." />
            ) : hotels.map((h) => (
              <Tr key={h.id}>
                <Td>
                  <p className="font-semibold text-brand-950">{h.name}</p>
                  {!h.active && <Badge label="Inactive" className="bg-gray-100 text-gray-500" />}
                </Td>
                <Td className="text-ink/70">{h.city?.name ?? "—"}</Td>
                <Td className="whitespace-nowrap text-ink/70">{h.pickupTime ?? "—"}</Td>
                <Td className="text-ink/70">{h.phone ?? "—"}</Td>
                <Td>{manage && <RowActions editHref={`/master-data?tab=hotels&edit=${h.id}`} deleteAction={deleteHotel} id={h.id} label={h.name} />}</Td>
              </Tr>
            ))}
          </TableCard>
        )}

        {tab === "cities" && (
          <TableCard head={<><Th>City / town</Th><Th>Pick-up area</Th><Th>Hotels</Th><Th /></>}>
            {cities.length === 0 ? (
              <EmptyRow colSpan={4} label="No cities yet. Add the towns you collect from." />
            ) : cities.map((c) => (
              <Tr key={c.id}>
                <Td className="font-semibold text-brand-950">{c.name}</Td>
                <Td>
                  {c.pickupArea
                    ? <Badge label="Yes" className="bg-green-50 text-green-700" />
                    : <Badge label="No" className="bg-gray-100 text-gray-500" />}
                </Td>
                <Td className="text-ink/70">{hotels.filter((h) => h.cityId === c.id).length}</Td>
                <Td>{manage && <RowActions editHref={`/master-data?tab=cities&edit=${c.id}`} deleteAction={deleteCity} id={c.id} label={c.name} />}</Td>
              </Tr>
            ))}
          </TableCard>
        )}
      </div>
    </div>
  );
}
