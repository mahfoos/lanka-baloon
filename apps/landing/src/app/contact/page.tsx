import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Pic } from "@/components/Pic";
import { Reveal } from "@/components/Reveal";
import { company, gettingHere, pickupAreas } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Lanka Ballooning in Dambulla: +94 77 472 7700, WhatsApp or fly@srilankaballoon.com. Pick-up from hotels in Dambulla, Kandalama, Sigiriya and Habarana.",
  alternates: { canonical: "/contact" },
};

const info = [
  { title: "Pick-up time", body: "We'll tell you your pick-up time the day before your flight. Feel free to contact us to re-confirm." },
  { title: "Hotels", body: `We pick up from any hotel in ${pickupAreas.join(", ")}. Haven't booked yet? We can help. Staying further away? Ask us about transfers.` },
  { title: "Weather", body: "We'll let you know about flying conditions. If your day isn't flyable, we'll find you another date." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact us" intro="Our base is on Kandalama Road, just outside Dambulla." image="contactMap" />

      <section className="container-x grid gap-14 py-20 sm:py-28 lg:grid-cols-2">
        <Reveal>
          <address className="not-italic">
            <h2 className="text-3xl">{company.legal}</h2>
            <p className="mt-3 text-lg text-ink-soft">{company.address.join(", ")}</p>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-lg">
              <dt className="text-ink-soft">Hotline</dt>
              <dd><a href={company.phoneHref} className="underline">{company.phone}</a></dd>
              <dt className="text-ink-soft">WhatsApp</dt>
              <dd><a href={company.whatsapp} className="underline">{company.phone}</a></dd>
              <dt className="text-ink-soft">Fax</dt>
              <dd>{company.fax}</dd>
              <dt className="text-ink-soft">Email</dt>
              <dd><a href={`mailto:${company.email}`} className="underline">{company.email}</a></dd>
            </dl>
          </address>
          <div className="mt-10 space-y-6">
            {info.map((i) => (
              <div key={i.title}>
                <h3 className="text-xl">{i.title}</h3>
                <p className="mt-1 text-ink-soft">{i.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className="rounded-3xl bg-mist p-7 sm:p-10">
          <h2 className="text-3xl">Send us a message</h2>
          <div className="mt-6"><ContactForm /></div>
        </Reveal>
      </section>

      <section className="container-x pb-20">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line sm:aspect-[21/9]">
          <iframe title="Map to Lanka Ballooning" src={company.mapEmbed} className="absolute inset-0 h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>

      <section className="bg-mist">
        <div className="container-x grid gap-12 py-20 sm:py-28 md:grid-cols-2 md:items-center">
          <Reveal>
            <h2 className="text-4xl">Getting to Dambulla</h2>
            <p className="mt-4 text-lg text-ink-soft">
              We only pick up in {pickupAreas.join(", ")}. Coming from elsewhere? Tell us your route and we'll check options with our drivers — or hire a car with a driver, the easiest way around Sri Lanka.
            </p>
            <dl className="mt-8 space-y-5">
              {gettingHere.map((g) => (
                <div key={g.from}>
                  <dt className="font-display text-xl">From {g.from}</dt>
                  <dd className="mt-1 text-ink-soft">{g.options}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={120} className="group relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Pic name="faqSigiriya" alt="Balloon near Sigiriya" fill sizes="(min-width: 768px) 50vw, 100vw" className="photo-zoom object-cover" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
