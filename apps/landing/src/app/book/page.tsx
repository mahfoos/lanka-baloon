import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { PageHero } from "@/components/PageHero";
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
      <PageHero
        title="Book your flight"
        intro="Send a reservation and we’ll check availability, then email you within a few hours. Nothing is charged today."
        image="boarding"
      />

      <section className="container-x section">
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
