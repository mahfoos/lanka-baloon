import { extras, rates } from "./content";

export type PriceInput = {
  flightType: "standard" | "private";
  adults: number;
  children: number;
  giftVoucher: boolean;
  birthdayCake: boolean;
};

const price = (id: string) => rates.find((r) => r.id === id)!.price;
const extra = (id: string) => extras.find((e) => e.id === id)!.price;

export type PriceLine = { label: string; amount: number };

/** The total, itemised, so the booking form can show guests how it adds up. */
export function priceBreakdown(i: PriceInput): PriceLine[] {
  const lines: PriceLine[] = [];

  if (i.flightType === "private") {
    lines.push({ label: "Private balloon, up to 16 guests", amount: price("private") });
  } else {
    lines.push({ label: `${i.adults} × adult`, amount: i.adults * price("adult") });
    if (i.children > 0) lines.push({ label: `${i.children} × child`, amount: i.children * price("child") });
  }

  if (i.giftVoucher) lines.push({ label: "Gift voucher", amount: extra("gift_voucher") });
  if (i.birthdayCake) lines.push({ label: "Birthday cake", amount: extra("birthday_cake") });

  return lines;
}

/** Single source of truth for totals, used by the form preview AND the server action. */
export function calculateTotal(i: PriceInput): number {
  return priceBreakdown(i).reduce((sum, line) => sum + line.amount, 0);
}
