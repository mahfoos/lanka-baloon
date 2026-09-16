"use server";

import { randomBytes } from "node:crypto";
import { prisma } from "@lanka-baloon/db";
import { bookingSchema, type FormState } from "@/lib/validation";
import { calculateTotal } from "@/lib/pricing";

/** SLB-2026-A1B2C3: year first so the office can sort a season at a glance. */
function newReference(): string {
  return `SLB-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function createBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = Object.fromEntries(formData);
  const parsed = bookingSchema.safeParse({
    ...raw,
    giftVoucher: formData.get("giftVoucher") === "on",
    birthdayCake: formData.get("birthdayCake") === "on",
  });
  if (!parsed.success) {
    return { ok: false, message: "Check the highlighted fields.", errors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;
  if (d.website) return { ok: true, reference: "SLB-000000" }; // honeypot hit

  // The price is always recalculated here. Anything posted from the browser is
  // a suggestion, never the amount we record.
  const total = calculateTotal(d);
  const reference = newReference();

  try {
    await prisma.booking.create({
      data: {
        ref: reference,
        customerName: d.fullName,
        email: d.email,
        phone: d.phone,
        country: d.country,
        packageType: d.flightType === "private" ? "PRIVATE_FLIGHT" : "SHARED_FLIGHT",
        flightDate: new Date(d.flightDate),
        adults: d.adults,
        children: d.children,
        // The website quotes in dollars; the ERP records the unit alongside the
        // figure so nothing has to guess later.
        currency: "USD",
        totalAmount: total,
        paidAmount: 0,
        // No payment gateway yet: every website booking lands as an enquiry for
        // the office to confirm and collect against.
        status: "ENQUIRY",
        source: "WEBSITE",
        giftVoucher: d.giftVoucher,
        birthdayCake: d.birthdayCake,
        hotel: d.hotel,
        notes: d.requests || null,
      },
    });
  } catch (error) {
    console.error("booking insert failed", error);
    return { ok: false, message: "We couldn’t send your reservation. Please try again, or WhatsApp us." };
  }

  // TODO: send confirmation emails (e.g. Resend) to the guest and fly@srilankaballoon.com.
  return { ok: true, reference };
}
