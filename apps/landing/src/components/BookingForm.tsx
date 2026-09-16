"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { createBooking } from "@/app/book/actions";
import { calculateTotal, priceBreakdown } from "@/lib/pricing";
import { extras } from "@/lib/content";
import type { FormState } from "@/lib/validation";
// Imported directly rather than through <Pic>: this is a client component, and the
// shared image data would add ~17 kB to this route's bundle for one logo.
import bankLogo from "../../public/images/commercialBank.png";

type Props = {
  countries: string[];
  defaultType: "standard" | "private";
  defaultGift: boolean;
};

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

export function BookingForm({ countries, defaultType, defaultGift }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(createBooking, { ok: false });
  const [flightType, setFlightType] = useState(defaultType);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [giftVoucher, setGiftVoucher] = useState(defaultGift);
  const [birthdayCake, setBirthdayCake] = useState(false);

  const priceInput = { flightType, adults, children, giftVoucher, birthdayCake };
  const lines = priceBreakdown(priceInput);
  const total = calculateTotal(priceInput);
  const err = (k: string) => state.errors?.[k]?.[0];

  // The submit button sits in the sticky summary, so a rejected field can be far off
  // screen. Take the guest to the first problem instead of leaving them to hunt.
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!state.errors) return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    firstInvalid?.scrollIntoView({ block: "center", behavior: "smooth" });
    firstInvalid?.focus({ preventScroll: true });
  }, [state]);

  if (state.ok) {
    return (
      <div role="status" className="rounded-3xl bg-ink p-8 text-white sm:p-12">
        <h2 className="text-4xl">Reservation received</h2>
        <p className="mt-4 text-lg text-white/85">
          Your reference is <strong className="text-dawn">{state.reference}</strong>. We'll check availability and email you payment instructions within a few hours.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="space-y-10">
        <fieldset>
          <legend className="font-display text-2xl">Your flight</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {([
              ["standard", "Standard flight", "Shared balloon, 1 hour"],
              ["private", "Private flight", "Whole balloon, 1–16 guests, 1.5 hours"],
            ] as const).map(([value, title, sub]) => (
              <label key={value} className="flex cursor-pointer gap-3 rounded-2xl border border-line p-4 has-[:checked]:border-ink has-[:checked]:bg-mist">
                <input type="radio" name="flightType" value={value} checked={flightType === value} onChange={() => setFlightType(value)} className="mt-1 accent-flame" />
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="text-sm text-ink-soft">{sub}</span>
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="flightDate" className="label">Flight date</label>
              <input id="flightDate" name="flightDate" type="date" min={tomorrow()} className="field" required aria-invalid={!!err("flightDate")} />
              {err("flightDate") && <p className="error">{err("flightDate")}</p>}
            </div>
            <div>
              <label htmlFor="adults" className="label">Adults</label>
              <select id="adults" name="adults" className="field" value={adults} onChange={(e) => setAdults(+e.target.value)}>
                {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="children" className="label">Children (6–12)</label>
              <select id="children" name="children" className="field" value={children} onChange={(e) => setChildren(+e.target.value)}>
                {[0, 1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
              </select>
              {err("children") && <p className="error">{err("children")}</p>}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="hotel" className="label">Hotel for pick-up</label>
            <input id="hotel" name="hotel" className="field" placeholder="Hotel name and town" required aria-invalid={!!err("hotel")} />
            <p className="mt-1 text-sm text-ink-soft">We pick up in Dambulla, Kandalama, Sigiriya and Habarana.</p>
            {err("hotel") && <p className="error">{err("hotel")}</p>}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl">Your details</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="label">Full name</label>
              <input id="fullName" name="fullName" className="field" autoComplete="name" required aria-invalid={!!err("fullName")} />
              {err("fullName") && <p className="error">{err("fullName")}</p>}
            </div>
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" name="email" type="email" className="field" autoComplete="email" required aria-invalid={!!err("email")} />
              {err("email") && <p className="error">{err("email")}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="label">Phone or WhatsApp</label>
              <input id="phone" name="phone" type="tel" className="field" autoComplete="tel" required aria-invalid={!!err("phone")} />
              {err("phone") && <p className="error">{err("phone")}</p>}
            </div>
            <div>
              <label htmlFor="country" className="label">Billing country</label>
              <select id="country" name="country" className="field" defaultValue="" required aria-invalid={!!err("country")}>
                <option value="" disabled>Choose a country</option>
                {countries.map((c) => <option key={c}>{c}</option>)}
              </select>
              {err("country") && <p className="error">{err("country")}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl">Extras and requests</legend>
          <div className="mt-5 flex flex-wrap gap-3">
            {extras.map((x) => {
              const checked = x.id === "gift_voucher" ? giftVoucher : birthdayCake;
              const set = x.id === "gift_voucher" ? setGiftVoucher : setBirthdayCake;
              return (
                <label key={x.id} className="flex cursor-pointer items-center gap-3 rounded-full border border-line px-5 py-3 has-[:checked]:border-ink has-[:checked]:bg-mist">
                  <input type="checkbox" name={x.id === "gift_voucher" ? "giftVoucher" : "birthdayCake"} checked={checked} onChange={(e) => set(e.target.checked)} className="accent-flame" />
                  {x.label} (+${x.price})
                </label>
              );
            })}
          </div>
          <div className="mt-5">
            <label htmlFor="requests" className="label">Requests (optional)</label>
            <textarea id="requests" name="requests" rows={4} className="field" placeholder="A proposal banner, dietary needs, a different drop-off…" />
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-3xl bg-ink p-7 text-white">
          <h2 className="font-sans text-sm font-semibold text-white/70">Estimated total</h2>

          <dl className="mt-4 space-y-2 border-b border-white/15 pb-4 text-sm">
            {lines.map((line) => (
              <div key={line.label} className="flex justify-between gap-4">
                <dt className="text-white/70">{line.label}</dt>
                <dd>${line.amount.toLocaleString("en-US")}</dd>
              </div>
            ))}
          </dl>
          {flightType === "private" && (
            <p className="mt-3 text-xs text-white/60">A private balloon is one flat price, however many of you fly.</p>
          )}

          <p className="mt-4 font-display text-5xl">${total.toLocaleString("en-US")}</p>
          <p className="mt-2 text-sm text-white/70">All taxes and fees included. You don&rsquo;t pay now — we confirm availability first and email a secure payment link.</p>
          {state.message && <p role="alert" className="mt-4 rounded-lg bg-flame/20 p-3 text-sm">{state.message}</p>}
          <button className="btn-primary mt-6 w-full" disabled={pending}>
            {pending ? "Sending reservation…" : "Send reservation"}
          </button>
          <p className="mt-4 text-xs text-white/60">Full refund if weather cancels your flight, or if you cancel 48+ hours before.</p>
        </div>

        <div className="mt-5 rounded-2xl border border-line p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Card payments secured by</p>
          <Image src={bankLogo} alt="Commercial Bank of Ceylon" sizes="220px" className="mt-3 h-auto w-full max-w-[220px]" />
        </div>
      </aside>
    </form>
  );
}
