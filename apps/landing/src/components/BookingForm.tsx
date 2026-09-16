"use client";

import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { createBooking } from "@/app/book/actions";
import { calculateTotal, priceBreakdown } from "@/lib/pricing";
import { extras } from "@/lib/content";
import type { FormState } from "@/lib/validation";
// Imported directly rather than through <Pic>: this is a client component, and the
// shared image data would add ~17 kB to this route’s bundle for one logo.
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

  /**
   * Wires a control to its error message. `aria-invalid` alone announces only
   * "invalid"; `aria-describedby` is what reads out *why*. Both are omitted when
   * the field is fine, so the scroll-to-first-error query below can rely on
   * `[aria-invalid="true"]` matching exactly the fields that failed.
   */
  const invalid = (name: string) => ({
    "aria-invalid": err(name) ? true : undefined,
    "aria-describedby": err(name) ? `${name}-error` : undefined,
  });

  // The submit button sits in the summary, so a rejected field can be far off
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
      <div role="status" className="rounded-card bg-ink p-8 text-white sm:p-12">
        <h2 className="text-4xl">Reservation received</h2>
        <p className="mt-4 text-lg text-white/85">
          Your reference is <strong className="text-dawn">{state.reference}</strong>. We’ll check availability and email you payment instructions within a few hours.
        </p>
      </div>
    );
  }

  const submitLabel = pending ? "Sending reservation…" : "Send reservation";

  return (
    <form ref={formRef} action={action} noValidate className="grid gap-10 pb-28 lg:grid-cols-[1fr_320px] lg:pb-0">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="space-y-10">
        <fieldset>
          <legend className="font-display text-2xl">Your flight</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {([
              ["standard", "Standard flight", "Shared balloon, 1 hour"],
              ["private", "Private flight", "Whole balloon, 1 to 16 guests, 1.5 hours"],
            ] as const).map(([value, title, sub]) => (
              <label key={value} className="flex cursor-pointer gap-3 rounded-media border border-line p-4 has-[:checked]:border-ink has-[:checked]:bg-mist">
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
              <input id="flightDate" name="flightDate" type="date" min={tomorrow()} className="field" required {...invalid("flightDate")} />
              {err("flightDate") && <p id="flightDate-error" className="error">{err("flightDate")}</p>}
            </div>
            <div>
              <label htmlFor="adults" className="label">Adults</label>
              <select id="adults" name="adults" className="field" value={adults} onChange={(e) => setAdults(+e.target.value)}>
                {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              {/* The "up to 16 guests" rule is reported against `children`, so this
                  control has to carry the invalid state or the scroll-to-error above
                  skips straight past the only field that failed. */}
              <label htmlFor="children" className="label">Children (6 to 12)</label>
              <select id="children" name="children" className="field" value={children} onChange={(e) => setChildren(+e.target.value)} {...invalid("children")}>
                {[0, 1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
              </select>
              {err("children") && <p id="children-error" className="error">{err("children")}</p>}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="hotel" className="label">Hotel for pick-up</label>
            <input id="hotel" name="hotel" className="field" placeholder="Hotel name and town" required {...invalid("hotel")} aria-describedby={err("hotel") ? "hotel-error hotel-hint" : "hotel-hint"} />
            <p id="hotel-hint" className="mt-1 text-sm text-ink-soft">We pick up in Dambulla, Kandalama, Sigiriya and Habarana.</p>
            {err("hotel") && <p id="hotel-error" className="error">{err("hotel")}</p>}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-2xl">Your details</legend>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="label">Full name</label>
              <input id="fullName" name="fullName" className="field" autoComplete="name" required {...invalid("fullName")} />
              {err("fullName") && <p id="fullName-error" className="error">{err("fullName")}</p>}
            </div>
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input id="email" name="email" type="email" inputMode="email" className="field" autoComplete="email" required {...invalid("email")} />
              {err("email") && <p id="email-error" className="error">{err("email")}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="label">Phone or WhatsApp</label>
              <input id="phone" name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" required {...invalid("phone")} />
              {err("phone") && <p id="phone-error" className="error">{err("phone")}</p>}
            </div>
            <div>
              <label htmlFor="country" className="label">Billing country</label>
              <select id="country" name="country" className="field" defaultValue="" required {...invalid("country")}>
                <option value="" disabled>Choose a country</option>
                {countries.map((c) => <option key={c}>{c}</option>)}
              </select>
              {err("country") && <p id="country-error" className="error">{err("country")}</p>}
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
                <label key={x.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-line px-5 py-3 has-[:checked]:border-ink has-[:checked]:bg-mist">
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
        <div className="rounded-card bg-ink p-7 text-white">
          <p className="font-sans text-sm font-semibold text-white/70">Estimated total</p>

          <dl className="mt-4 space-y-2 border-b border-white/15 pb-4 text-sm">
            {lines.map((line) => (
              <div key={line.label} className="flex justify-between gap-4">
                <dt className="text-white/70">{line.label}</dt>
                <dd>${line.amount.toLocaleString("en-US")}</dd>
              </div>
            ))}
          </dl>
          {flightType === "private" && (
            <p className="mt-3 text-sm text-white/60">A private balloon is one flat price, however many of you fly.</p>
          )}

          <p className="mt-4 font-display text-5xl">${total.toLocaleString("en-US")}</p>
          <p className="mt-2 text-sm text-white/70">All taxes and fees included. You don’t pay now. We confirm availability first, then email a secure payment link.</p>
          {state.message && <p role="alert" className="mt-4 rounded-lg bg-flame/20 p-3 text-sm">{state.message}</p>}
          {/* Below lg the sticky bar at the foot of the screen carries the submit,
              so only one of the two is ever visible. */}
          <button className="btn-primary mt-6 hidden w-full lg:inline-flex" disabled={pending}>{submitLabel}</button>
          <p className="mt-4 text-sm text-white/60">Full refund if weather cancels your flight, or if you cancel 48+ hours before.</p>
        </div>

        <div className="mt-5 rounded-media border border-line p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Card payments secured by</p>
          <Image src={bankLogo} alt="Commercial Bank of Ceylon" sizes="220px" className="mt-3 h-auto w-full max-w-[220px]" />
        </div>
      </aside>

      {/* On a phone the summary sits below three full fieldsets, so guests were
          changing guest counts and extras with no visible price. This keeps the
          running total and the submit in view the whole way down. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden">
        <div className="container-x flex items-center gap-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink-soft">Estimated total</p>
            <p className="font-display text-2xl leading-tight">${total.toLocaleString("en-US")}</p>
          </div>
          <button className="btn-primary shrink-0" disabled={pending}>{submitLabel}</button>
        </div>
      </div>
    </form>
  );
}
