import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { FlightTimeline } from "@/components/FlightTimeline";
import { Rates } from "@/components/Rates";
import { ContactStrip } from "@/components/ContactStrip";
import { Pic } from "@/components/Pic";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Hot Air Balloon Flights & Prices",
  description: "What happens on a Sri Lanka Balloon flight, what’s included, and prices: $250 per adult, $200 per child, $4,000 for a private balloon.",
  alternates: { canonical: "/flights" },
};

const know = [
  { title: "Weather", body: "Flights depend on good weather and the pilot can cancel at any time. If we cancel, you get a full refund, or you can join the next day’s flight if there’s space." },
  { title: "Timing", body: "Allow 3 hours in total. We can drop you somewhere else within our transfer area if that suits your plans." },
  { title: "What to wear", body: "Comfortable shoes and casual clothes. Sunglasses and a hat help." },
  { title: "Children", body: "We generally fly children aged 6 and up, with a responsible adult. Younger children may fly when conditions are excellent, so ask us first." },
  { title: "Not recommended", body: "Balloon flights aren’t suitable during pregnancy. See the FAQ for other health considerations." },
  { title: "Cancellation", body: "Cancel up to 48 hours before your flight for a full refund. Gift voucher dates can be changed on request." },
];

export default function FlightsPage() {
  return (
    <>
      <PageHero title="Hot air ballooning in Sri Lanka" intro="Pick-up, breakfast, an hour in the sky and a champagne landing. Everything is included." image="flightsBanner" />

      <section className="container-x section">
        <Reveal as="h2" className="mb-12 text-4xl sm:text-5xl">How the morning goes</Reveal>
        <FlightTimeline withImages />
      </section>

      <section className="bg-mist">
        <div className="container-x section">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl">Prices</h2>
            <p className="mt-4 text-lg text-ink-soft">All taxes and fees included. Pay by any major credit card through a secure link, or by bank deposit to our Sri Lankan account.</p>
          </Reveal>
          <div className="mt-10"><Rates /></div>
        </div>
      </section>

      <section className="container-x section grid gap-12 md:grid-cols-2 md:items-center">
        <Reveal className="group relative aspect-[4/3] overflow-hidden rounded-card">
          <Pic name="inFlightCamera" alt="In-flight camera photo of guests" fill sizes="(min-width: 768px) 50vw, 100vw" className="photo-zoom object-cover" />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="text-4xl sm:text-5xl">Optional photo and video package</h2>
          <p className="mt-4 text-lg text-ink-soft">
            Pilots may record your flight with in-flight cameras. After landing you can buy the files directly from them. It’s an independent add-on, and prices vary.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-line">
        <div className="container-x section">
          <Reveal as="h2" className="text-4xl sm:text-5xl">Good to know</Reveal>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {know.map((k, i) => (
              <Reveal key={k.title} delay={(i % 3) * 90}>
                <h3 className="text-2xl">{k.title}</h3>
                <p className="mt-2 text-ink-soft">{k.body}</p>
              </Reveal>
            ))}
          </div>
          <Link href="/faq" className="link-tap mt-10 font-semibold text-flame underline underline-offset-4">Read the full FAQ</Link>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
