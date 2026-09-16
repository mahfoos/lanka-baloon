import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { ContactStrip } from "@/components/ContactStrip";
import { countries } from "@/lib/countries";

export const metadata: Metadata = {
  title: "Book a Balloon Ride",
  description: "Reserve your Sri Lanka hot air balloon flight. We confirm availability within a few hours and send a secure payment link.",
  alternates: { canonical: "/book" },
};

export default async function BookPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <>
      <section className="bg-mist pt-32 pb-12">
        <div className="container-x">
          <h1 className="text-5xl sm:text-6xl">Book your flight</h1>
          <p className="prose-width mt-4 text-lg text-ink-soft">
            Send a reservation and we'll check availability, then email you within a few hours.
          </p>
        </div>
      </section>
      <section className="container-x py-14 sm:py-20">
        <BookingForm
          countries={countries}
          defaultType={sp.type === "private" ? "private" : "standard"}
          defaultGift={sp.gift === "1"}
        />
      </section>
      <ContactStrip />
    </>
  );
}
