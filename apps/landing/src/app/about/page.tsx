import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Pic } from "@/components/Pic";
import { Reveal } from "@/components/Reveal";
import { ContactStrip } from "@/components/ContactStrip";
import { certifications, fleet, team } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Lanka Ballooning",
  description: "Lanka Ballooning (Pvt) Ltd: a CAASL-licensed Uluer Group company flying four balloons over Dambulla since 2016. Meet our pilots, team and fleet.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="About us" intro="Lanka Ballooning (Pvt) Ltd has flown over Dambulla since 2016, backed by the Uluer Group's two decades in ballooning." image="teamPhoto" />

      <section className="container-x grid gap-12 py-20 sm:py-28 md:grid-cols-2 md:items-center">
        <Reveal className="prose-width space-y-4 text-lg leading-relaxed text-ink-soft">
          <p>
            <strong className="text-ink">Lanka Ballooning (Pvt) Ltd</strong> is a fully licensed operator approved by the Civil Aviation Authority of Sri Lanka (CAASL).
          </p>
          <p>
            We're an investment of the <a className="text-flame underline" href="http://uluergroup.com">Uluer Group</a>, founded in 2016 after years of research and ballooning experience in several countries. Managing Director Mahmut Sami Uluer is also Honorary Consul of Sri Lanka to Cappadocia, Türkiye.
          </p>
          <p>
            We own and fly four balloons in our own livery, with room for 56 passengers at once. The Uluer Group also founded two of Türkiye's largest balloon companies and Nyssa Balloon Safaris in the Serengeti.
          </p>
        </Reveal>
        <Reveal delay={120} className="group relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Pic name="aboutUluer" alt="Uluer Group balloons" fill sizes="(min-width: 768px) 50vw, 100vw" className="photo-zoom object-cover" />
        </Reveal>
      </section>

      <section className="bg-mist">
        <div className="container-x py-20 sm:py-28">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl">Meet the team</h2>
            <p className="prose-width mt-4 text-lg text-ink-soft">
              International pilots with commercial licences validated and tested every year by CAASL, and a local team that looks after you from booking to landing.
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.name} as="li" delay={(i % 3) * 90} className="group">
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
                  <Pic name={m.image} alt={m.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="photo-zoom object-cover" />
                </div>
                <h3 className="mt-5 text-2xl">{m.name}</h3>
                <p className="text-sm font-semibold text-lake">{m.role}</p>
                <p className="mt-2 text-ink-soft">{m.bio}</p>
                {m.instagram && (
                  <a href={m.instagram} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-medium underline">
                    Instagram
                  </a>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x py-20 sm:py-28">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl">Our fleet</h2>
          <p className="prose-width mt-4 text-lg text-ink-soft">
            VIP baskets from Lindstrand (UK) and Ultramagic (Spain), with the latest design and safety features.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fleet.map((b, i) => (
            <Reveal key={b.reg} as="article" delay={i * 90} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                <Pic name={b.image} alt={`Balloon ${b.reg}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="photo-zoom object-cover" />
              </div>
              <h3 className="mt-4 text-2xl">{b.reg}</h3>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[15px]">
                <dt className="text-ink-soft">Capacity</dt><dd>{b.capacity}</dd>
                <dt className="text-ink-soft">Made by</dt><dd>{b.maker}, {b.origin}</dd>
              </dl>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-x grid gap-12 py-20 sm:py-28 md:grid-cols-2 md:items-center">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl">Pick-up vehicles</h2>
            <p className="mt-4 text-lg text-white/80">
              Bought new, air-conditioned, fully compliant with the Department of Motor Traffic, and driven by friendly staff.
            </p>
          </Reveal>
          <Reveal delay={120} className="group relative aspect-[16/10] overflow-hidden rounded-3xl">
            <Pic name="vehicles" alt="Lanka Ballooning vehicles" fill sizes="(min-width: 768px) 50vw, 100vw" className="photo-zoom object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 sm:py-28">
        <Reveal as="h2" className="text-4xl sm:text-5xl">Our licences</Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {certifications.map((c, i) => (
            <Reveal key={c.title} as="article" delay={i * 90}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line bg-mist">
                <Pic name={c.image} alt={c.title} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-contain p-4" />
              </div>
              <h3 className="mt-5 text-2xl">{c.title}</h3>
              <p className="mt-2 text-ink-soft">{c.body}</p>
            </Reveal>
          ))}
        </div>
        <div className="relative mx-auto mt-16 aspect-[3/1] max-w-3xl">
          <Pic name="relatedOrgs" alt="Organisations we work with" fill sizes="768px" className="object-contain" />
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
