import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Pic } from "@/components/Pic";
import { Reveal } from "@/components/Reveal";
import { ContactStrip } from "@/components/ContactStrip";
import { faqs, faqTopics } from "@/lib/content";

export const metadata: Metadata = {
  title: "Balloon Ride FAQ",
  description: "How balloons fly, how high and how long we fly, who can fly, what to wear, and what happens if the weather cancels your Sri Lanka balloon ride.",
  alternates: { canonical: "/faq" },
};

const slug = (topic: string) => topic.toLowerCase().replace(/[^a-z]+/g, "-");

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function FaqPage() {
  return (
    <>
      <PageHero title="Questions, answered" intro="Everything guests usually ask before their first flight." image="faqLakeView" />

      <section className="container-x section grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-3xl">Parts of a balloon</h2>
          <div className="relative mt-6 aspect-square overflow-hidden rounded-card border border-line bg-white">
            <Pic name="faqParts" alt="Diagram: envelope, burner and basket of a hot air balloon" fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-contain" />
          </div>
          <nav aria-label="FAQ topics" className="mt-8 hidden lg:block">
            <ul className="space-y-2">
              {faqTopics.map((topic) => (
                <li key={topic}>
                  <a href={`#${slug(topic)}`} className="text-ink-soft underline-offset-4 transition hover:text-flame hover:underline">
                    {topic}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="space-y-14">
          {faqTopics.map((topic) => (
            <section key={topic} id={slug(topic)} className="scroll-mt-28">
              <Reveal as="h2" className="font-sans text-sm font-semibold uppercase tracking-widest text-lake">
                {topic}
              </Reveal>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {faqs
                  .filter((f) => f.topic === topic)
                  .map((f) => (
                    <details key={f.q} className="group">
                      <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 transition-colors hover:text-flame">
                        <h3 className="font-display text-2xl">{f.q}</h3>
                        <span aria-hidden className="mt-1 shrink-0 text-flame transition-transform duration-300 group-open:rotate-45">+</span>
                      </summary>
                      <div className="grid gap-5 pb-6 sm:grid-cols-[1fr_200px]">
                        <p className="text-lg text-ink-soft">{f.a}</p>
                        {f.image && (
                          <div className="relative aspect-[4/3] overflow-hidden rounded-media">
                            <Pic name={f.image} alt="" fill sizes="(min-width: 640px) 200px, 100vw" className="object-cover" />
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <ContactStrip />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
