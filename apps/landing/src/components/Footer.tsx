import Link from "next/link";
import { company, nav } from "@/lib/content";
import { Pic } from "./Pic";

export function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Pic name="logoWhite" alt="Sri Lanka Balloon" className="h-14 w-auto" />
          <p className="mt-5 max-w-sm">
            {company.legal} — licensed by the Civil Aviation Authority of Sri Lanka. Flying season: {company.season}.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {company.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-dawn">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-sans text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-dawn">{n.label}</Link></li>
            ))}
            <li><Link href="/book" className="hover:text-dawn">Book a flight</Link></li>
          </ul>
        </nav>

        <address className="not-italic">
          <h2 className="font-sans text-sm font-semibold text-white">Get in touch</h2>
          <p className="mt-4">{company.address.join(", ")}</p>
          <p className="mt-3"><a href={company.phoneHref} className="hover:text-dawn">{company.phone}</a></p>
          <p><a href={company.whatsapp} className="hover:text-dawn">WhatsApp us</a></p>
          <p><a href={`mailto:${company.email}`} className="hover:text-dawn">{company.email}</a></p>
        </address>
      </div>
      <div className="border-t border-white/10">
        {/* Extra room on small screens so the sticky book bar never covers this. */}
        <div className="container-x flex flex-col gap-2 py-6 pb-24 text-sm text-white/60 sm:flex-row sm:justify-between lg:pb-6">
          <p>© 2016–{new Date().getFullYear()} {company.legal}. All rights reserved.</p>
          <p>
            An <a href="http://uluergroup.com" className="underline hover:text-dawn">Uluer Group</a> company
          </p>
        </div>
      </div>
    </footer>
  );
}
