import Link from "next/link";
import { company } from "@/lib/content";

export function ContactStrip() {
  const ways = [
    { title: "Call", body: "Talk to our reservations team.", link: company.phone, href: company.phoneHref },
    { title: "WhatsApp", body: "Replies within a few hours. Viber and WeChat work too.", link: "Message us", href: company.whatsapp },
    { title: "Email", body: "Send us any question about your flight.", link: company.email, href: `mailto:${company.email}` },
  ];
  return (
    <section className="bg-dawn-soft">
      <div className="container-x py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl text-3xl sm:text-4xl">Questions before you book? We're a message away.</h2>
          <Link href="/book" className="btn-primary self-start md:self-auto">Book a flight</Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {ways.map((w) => (
            <div key={w.title} className="border-t-2 border-ink pt-4">
              <h3 className="font-sans text-lg font-semibold">{w.title}</h3>
              <p className="mt-1 text-ink-soft">{w.body}</p>
              <a href={w.href} className="mt-3 inline-block font-semibold text-flame underline underline-offset-4">{w.link}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
