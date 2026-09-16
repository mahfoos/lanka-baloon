import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Pic } from "@/components/Pic";
import { Reveal } from "@/components/Reveal";
import { YouTube } from "@/components/YouTube";
import { ContactStrip } from "@/components/ContactStrip";
import { caseStudies, corporateUses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Corporate Ballooning",
  description: "Brand events, team flights, film shoots and customer prizes with a hot air balloon in Sri Lanka. Dialog, Unilever and Huawei have all flown with us.",
  alternates: { canonical: "/corporate" },
};

export default function CorporatePage() {
  return (
    <>
      <PageHero title="Corporate ballooning" intro="A hot air balloon gets your brand seen — and gives your team or customers a morning they won't forget." image="corpDialog1" />

      <section className="container-x grid gap-12 py-20 sm:py-28 md:grid-cols-[1fr_1fr]">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl">What we can do for you</h2>
          <Link href="/contact" className="btn-primary mt-8">Ask for a quote</Link>
        </Reveal>
        <ul className="divide-y divide-line border-y border-line text-xl">
          {corporateUses.map((u, i) => (
            <Reveal key={u} as="li" delay={i * 70} className="py-4">{u}</Reveal>
          ))}
        </ul>
      </section>

      <section className="bg-mist">
        <div className="container-x py-20 sm:py-28">
          <Reveal as="h2" className="text-4xl sm:text-5xl">Who we&rsquo;ve flown with</Reveal>
          <div className="mt-14 space-y-20">
            {caseStudies.map((c, i) => (
              <Reveal key={c.brand} as="article" className="group grid gap-8 md:grid-cols-2 md:items-center">
                <div className={i % 2 ? "md:order-2" : ""}>
                  {c.video ? (
                    <YouTube id={c.video} title={c.brand} />
                  ) : c.image ? (
                    <div className="relative aspect-video overflow-hidden rounded-2xl">
                      <Pic name={c.image} alt={c.brand} fill sizes="(min-width: 768px) 50vw, 100vw" className="photo-zoom object-cover" />
                    </div>
                  ) : null}
                </div>
                <div>
                  <h3 className="text-3xl">{c.brand}</h3>
                  <p className="mt-3 max-w-md text-lg text-ink-soft">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal as="h3" className="mt-24 text-2xl">In the Sunday Times Travel Magazine</Reveal>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {(["corpSundayTimes2", "corpSundayTimes3", "corpSundayTimes4"] as const).map((k, i) => (
              <Reveal key={k} delay={i * 90} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-white">
                <Pic name={k} alt={`Magazine page ${i + 1}`} fill sizes="33vw" className="photo-zoom object-cover" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
