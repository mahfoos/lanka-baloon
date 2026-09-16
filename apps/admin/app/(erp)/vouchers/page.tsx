import Link from "next/link";
import { prisma } from "@lanka-baloon/db";
import { getSession, can } from "@/lib/auth";
import { listVouchers } from "@/lib/data";
import { formatCurrency, formatDate, VOUCHER_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

import { RecordForm, RowActions, type FieldSpec } from "@/components/RecordForm";
import { saveVoucher, deleteVoucher } from "../actions";

export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "purchaserName", label: "Purchaser", type: "text", required: true },
  { name: "recipientName", label: "Recipient", type: "text" },
  { name: "code", label: "Code", type: "text", hint: "Left blank, one is generated." },
  { name: "packageType", label: "Package", type: "select", options: [
    { value: "GIFT_VOUCHER", label: "Gift Voucher" }, { value: "SHARED_FLIGHT", label: "Shared Flight" },
    { value: "PRIVATE_FLIGHT", label: "Private Flight" }] },
  { name: "currency", label: "Currency", type: "select", options: [
    { value: "LKR", label: "LKR" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "TRY", label: "TRY" }] },
  { name: "amount", label: "Amount", type: "money" },
  { name: "issuedDate", label: "Issued", type: "date" },
  { name: "expiryDate", label: "Expires", type: "date", required: true, hint: "Vouchers run one year." },
  { name: "status", label: "Status", type: "select", options: [
    { value: "ACTIVE", label: "Active" }, { value: "REDEEMED", label: "Redeemed" },
    { value: "EXPIRED", label: "Expired" }, { value: "CANCELLED", label: "Cancelled" }] },
];

export default async function VouchersPage({
  searchParams,
}: {
  searchParams: { new?: string; edit?: string };
}) {
  const user = getSession()!;
  if (!can(user, "canViewVouchers")) {
    return <AccessRestricted message="Gift vouchers are visible to reservations and finance roles." />;
  }
  const manage = can(user, "canManageVouchers");
  const vouchers = await listVouchers();

  const active = vouchers.filter((v) => v.status === "Active");
  const activeValue = active.reduce((s, v) => s + v.amount, 0);
  const redeemed = vouchers.filter((v) => v.status === "Redeemed").length;

  const editing =
    manage && searchParams.edit
      ? await prisma.voucher.findUnique({ where: { id: searchParams.edit } })
      : null;
  const showForm = manage && (searchParams.new === "1" || editing !== null);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Gift Vouchers"
        subtitle="The ideal gift — valid for one year from the date of issue."
        action={manage && !showForm ? <Link href="/vouchers?new=1" className="btn-primary">+ Issue Voucher</Link> : undefined}
      />

      {showForm && (
        <div className="mt-6">
          <RecordForm
            action={saveVoucher}
            fields={FIELDS}
            id={editing?.id}
            cancelHref="/vouchers"
            title={editing ? `Edit ${editing.code}` : "Issue Voucher"}
            submitLabel={editing ? "Save changes" : "Add"}
            values={editing ?? { status: "ACTIVE", currency: "LKR", packageType: "GIFT_VOUCHER" }}
          />
        </div>
      )}

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Active Vouchers" value={active.length} hint="redeemable" tone="brand" />
          <StatCard label="Outstanding Value" value={formatCurrency(activeValue)} hint="liability on the books" tone="negative" />
          <StatCard label="Redeemed" value={redeemed} hint="converted to flights" tone="positive" />
          <StatCard label="Total Issued" value={vouchers.length} hint="all time" tone="accent" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>Code</Th>
              <Th>Package</Th>
              <Th>Purchaser → Recipient</Th>
              <Th className="text-right">Value</Th>
              <Th>Issued</Th>
              <Th>Expires</Th>
              <Th>Status</Th>
              {manage && <Th />}
            </>
          }
        >
          {vouchers.length === 0 ? (
            <EmptyRow colSpan={manage ? 8 : 7} label="No vouchers." />
          ) : vouchers.map((v) => (
            <Tr key={v.id}>
              <Td className="font-mono text-xs font-semibold text-brand-700">{v.code}</Td>
              <Td className="text-ink/70">{v.packageType}</Td>
              <Td className="text-ink/70">
                {v.purchaserName}
                {v.recipientName && <span className="text-ink/40"> → {v.recipientName}</span>}
                {v.redeemedBookingRef && <p className="text-[11px] font-mono text-green-600">{v.redeemedBookingRef}</p>}
              </Td>
              <Td className="text-right font-semibold text-brand-950">{formatCurrency(v.amount)}</Td>
              <Td className="text-ink/60">{formatDate(v.issuedDate)}</Td>
              <Td className="text-ink/60">{formatDate(v.expiryDate)}</Td>
              <Td><Badge label={v.status} className={VOUCHER_STATUS_COLORS[v.status]} /></Td>
              {manage && (
                <Td>
                  <RowActions editHref={`/vouchers?edit=${v.id}`} deleteAction={deleteVoucher} id={v.id} label={String(v.code)} />
                </Td>
              )}
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
