"use server";

import { randomBytes } from "node:crypto";
import { bookingSchema, type FormState } from "@/lib/validation";
import { calculateTotal } from "@/lib/pricing";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

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

  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Online booking isn’t connected yet. Please email fly@srilankaballoon.com or WhatsApp +94 77 472 7700." };
  }

  // Price is always recalculated on the server.
  const total = calculateTotal(d);
  const reference = "SLB-" + randomBytes(3).toString("hex").toUpperCase();

  const supabase = await createClient();
  const { error } = await supabase.from("bookings").insert({
    reference,
    full_name: d.fullName,
    email: d.email,
    phone: d.phone,
    country: d.country,
    flight_date: d.flightDate,
    hotel: d.hotel,
    flight_type: d.flightType,
    adults: d.adults,
    children: d.children,
    gift_voucher: d.giftVoucher,
    birthday_cake: d.birthdayCake,
    requests: d.requests || null,
    total_usd: total,
  });

  if (error) {
    console.error("booking insert failed", error);
    return { ok: false, message: "We couldn’t send your reservation. Please try again, or WhatsApp us." };
  }

  // TODO: send confirmation emails (e.g. Resend) to the guest and fly@srilankaballoon.com.
  return { ok: true, reference };
}
