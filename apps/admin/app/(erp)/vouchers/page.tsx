import { getSession, can } from "@/lib/auth";
import { listVouchers } from "@/lib/data";
import { formatCurrency, formatDate, VOUCHER_STATUS_COLORS } from "@/types";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, EmptyRow, AccessRestricted,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default function VouchersPage() {
  const user = getSession()!;
  if (!can(user, "canViewVouchers")) {
    return <AccessRestricted message="Gift vouchers are visible to reservations and finance roles." />;
  }
  const manage = can(user, "canManageVouchers");
  const vouchers = listVouchers();

  const active = vouchers.filter((v) => v.status === "Active");
  const activeValue = active.reduce((s, v) => s + v.amount, 0);
  const redeemed = vouchers.filter((v) => v.status === "Redeemed").length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Gift Vouchers"
        subtitle="The ideal gift — valid for one year from the date of issue."
        action={manage ? <button className="btn-primary" disabled>+ Issue Voucher</button> : undefined}
      />

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
            </>
          }
        >
          {vouchers.length === 0 ? (
            <EmptyRow colSpan={7} label="No vouchers." />
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
            </Tr>
          ))}
        </TableCard>
      </div>
    </div>
  );
}
