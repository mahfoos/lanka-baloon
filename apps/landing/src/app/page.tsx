import Link from "next/link";
import { Pic } from "@/components/Pic";
import { Counter } from "@/components/Counter";
import { FlightTimeline } from "@/components/FlightTimeline";
import { Gallery } from "@/components/Gallery";
import { Rates } from "@/components/Rates";
import { Reveal } from "@/components/Reveal";
import { YouTube } from "@/components/YouTube";
import { ContactStrip } from "@/components/ContactStrip";
import { certifications, company, giftVoucher, occasions, stats, testimonials, videos, whyUs } from "@/lib/content";

const assurances = ["CAASL licensed & fully insured", "All taxes included", "Free cancellation if we cancel"];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden text-white">
        <Pic
          name="kandalamaLake"
          alt="Sri Lanka Balloon flying low over Kandalama Lake at sunrise"
          fill
          priority
          sizes="100vw"
          className="kenburns -z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />

        <div className="container-x pb-14 pt-32 sm:pb-20">
          <h1 className="rise text-[clamp(3.2rem,11vw,8.5rem)] leading-[0.92]">
            Once in<br />a lifetime.
          </h1>

          <div className="rise rise-delay mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
            <p className="max-w-xl text-lg text-white/90 sm:text-xl">
              Sunrise hot air balloon flights over Dambulla, Kandalama and Sigiriya — with Sri Lanka&rsquo;s longest-running, CAASL-licensed operator.
            </p>
            <div className="flex flex-col gap-4 md:items-end">
              <div className="flex flex-wrap gap-3">
                <Link href="/book" className="btn-primary">Book a flight</Link>
                <Link href="/flights" className="btn-ghost">See the morning</Link>
              </div>
              <p className="text-sm text-white/75">From $250 per adult, all taxes included. Flying {company.season}.</p>
            </div>
          </div>

          <ul className="rise rise-delay-2 mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/20 pt-5 text-sm text-white/80">
            {assurances.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg className="shrink-0 text-dawn" width="15" height="15" viewBox="0 0 14 14" aria-hidden>
                  <path d="M2 7.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="#intro"
          aria-label="Skip to the first section"
          className="bob absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/80 transition hover:text-white lg:block"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M12 4v15M6 13l6 6 6-6" />
          </svg>
        </a>
      </section>

      {/* Intro */}
      <section id="intro" className="container-x grid gap-12 py-20 sm:py-28 md:grid-cols-2 md:items-center">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl">The calmest skies on the island</h2>
          <div className="prose-width mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              The climate around Dambulla and Kandalama is exceptionally calm and predictable — ideal for ballooning. We fly in the early morning, when the air is most stable, and cover anywhere from one to ten miles depending on the wind.
            </p>
            <p>
              One moment you&rsquo;re drifting at tree-top height over the lake; the next you&rsquo;re thousands of feet up with the whole region below you.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120} className="group relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Pic name="heritanceKandalama" alt="Balloon above Heritance Kandalama" fill sizes="(min-width: 768px) 50vw, 100vw" className="photo-zoom object-cover" />
        </Reveal>
      </section>

      {/* Why us */}
      <section className="bg-mist">
        <div className="container-x grid gap-12 py-20 sm:py-28 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="text-4xl sm:text-5xl">Why fly with us</h2>
              <p className="prose-width mt-5 text-lg text-ink-soft">
                We invest in the best balloons from Ultramagic (Spain) and Lindstrand (UK), and in pilots with thousands of flight hours.
              </p>
            </Reveal>
            <Reveal delay={120} className="group relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl">
              <Pic name="tourPackage" alt="Sri Lanka Balloon tour" fill sizes="(min-width: 1024px) 40vw, 100vw" className="photo-zoom object-cover" />
            </Reveal>
          </div>
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {whyUs.map((w, i) => (
              <Reveal key={w.title} delay={i * 70}>
                <dt className="font-display text-2xl">{w.title}</dt>
                <dd className="mt-2 text-ink-soft">{w.body}</dd>
              </Reveal>
            ))}
            <Reveal delay={whyUs.length * 70} className="sm:col-span-2">
              <dt className="font-display text-2xl">Only here</dt>
              <dd className="mt-2 text-ink-soft">
                We were the first in Sri Lanka to serve breakfast at the launch field and to present personalised flight certificates. Our vehicles are bought new, air-conditioned and fully compliant with the Department of Motor Traffic.
              </dd>
            </Reveal>
          </dl>
        </div>
      </section>

      {/* The morning */}
      <section className="container-x py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl">Your balloon morning</h2>
            <p className="mt-5 text-lg text-ink-soft">About three hours from hotel pick-up to drop-off.</p>
            <Link href="/flights" className="mt-8 inline-block font-semibold text-flame underline underline-offset-4">
              Full flight details
            </Link>
          </Reveal>
          <FlightTimeline />
        </div>
      </section>

      {/* Gallery */}
      <section className="container-x py-20 sm:py-28">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl">A morning in pictures</h2>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">From the crew unrolling the envelope in the dark to champagne on the grass.</p>
        </Reveal>
        <div className="mt-10">
          <Gallery />
        </div>
      </section>

      {/* Occasions */}
      <section className="bg-ink text-white">
        <div className="container-x grid gap-12 py-20 sm:py-28 md:grid-cols-2 md:items-center">
          <Reveal className="group relative aspect-square overflow-hidden rounded-[2rem]">
            <Pic name="specialOccasions" alt="Couple celebrating in a balloon basket" fill sizes="(min-width: 768px) 50vw, 100vw" className="photo-zoom object-cover" />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="text-4xl sm:text-5xl">Make it an occasion</h2>
            <div className="mt-8 divide-y divide-white/15 border-y border-white/15">
              {occasions.map((o, i) => (
                <details key={o.title} className="group py-5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between font-display text-2xl">
                    {o.title}
                    <span aria-hidden className="text-dawn transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-lg text-white/80">{o.body}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Rates */}
      <section className="container-x py-20 sm:py-28">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl">Prices</h2>
          <p className="mt-4 text-lg text-ink-soft">If the weather cancels your flight, you pay nothing.</p>
        </Reveal>
        <div className="mt-10"><Rates /></div>
      </section>

      {/* Gift voucher */}
      <section className="container-x pb-20 sm:pb-28">
        <Reveal className="group grid overflow-hidden rounded-[2rem] bg-dawn-soft md:grid-cols-2">
          <div className="relative min-h-72 overflow-hidden">
            <Pic name="giftVoucher" alt="Sri Lanka Balloon gift voucher" fill sizes="(min-width: 768px) 50vw, 100vw" className="photo-zoom object-cover" />
          </div>
          <div className="p-8 sm:p-12">
            <h2 className="text-4xl">Give a flight</h2>
            <p className="mt-4 text-lg text-ink-soft">{giftVoucher.body}</p>
            <Link href="/book?gift=1" className="btn-primary mt-8">Book a gift voucher</Link>
          </div>
        </Reveal>
      </section>

      {/* Certifications + stats */}
      <section className="bg-mist">
        <div className="container-x py-20 sm:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <Reveal>
              <h2 className="text-4xl sm:text-5xl">Licensed, insured and audited</h2>
              <p className="mt-5 text-lg text-ink-soft">
                {company.legal} is approved by the Civil Aviation Authority of Sri Lanka, under the Ministry of Transport and Civil Aviation.
              </p>
            </Reveal>
            <Reveal delay={120} className="group relative aspect-[16/9] overflow-hidden rounded-3xl">
              <Pic name="uluerGroup" alt="Uluer Group ballooning" fill sizes="(min-width: 768px) 50vw, 100vw" className="photo-zoom object-cover" />
            </Reveal>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {certifications.map((c, i) => (
              <Reveal key={c.title} delay={i * 90} className="border-t-2 border-ink pt-5">
                <h3 className="text-2xl">{c.title}</h3>
                <p className="mt-2 text-ink-soft">{c.body}</p>
              </Reveal>
            ))}
          </div>
          <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-line pt-10 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="flex flex-col-reverse">
                <dt className="mt-1 text-ink-soft">{s.label}</dt>
                <dd className="font-display text-5xl text-lake">
                  {s.count === false ? s.to : <Counter to={s.to} suffix={s.suffix} />}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Reviews */}
      <section className="container-x py-20 sm:py-28">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="text-4xl sm:text-5xl">What guests say</h2>
          <a href={company.tripadvisor} target="_blank" rel="noopener noreferrer" className="font-semibold text-flame underline underline-offset-4">
            Read all reviews on Tripadvisor
          </a>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} as="figure" delay={i * 90} className="rounded-3xl border border-line p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
              <p aria-label="Rated 5 out of 5" className="text-dawn">★★★★★</p>
              <blockquote className="mt-3">
                <p className="font-display text-2xl">{t.title}</p>
                <p className="mt-2 text-ink-soft">{t.body}</p>
              </blockquote>
              <figcaption className="mt-4 text-sm text-ink-soft">{t.name}, {t.date}</figcaption>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="container-x pb-20 sm:pb-28">
        <Reveal>
          <h2 className="text-4xl sm:text-5xl">Watch a flight</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((id, i) => (
            <Reveal key={id} delay={(i % 3) * 90}>
              <YouTube id={id} title={`Sri Lanka Balloon video ${i + 1}`} />
            </Reveal>
          ))}
        </div>
      </section>

      <ContactStrip />
    </>
  );
}
