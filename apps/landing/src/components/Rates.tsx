import Link from "next/link";
import { rates } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Rates({ showButtons = true }: { showButtons?: boolean }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {rates.map((r, i) => {
        const featured = r.id === "adult";
        return (
          <Reveal
            key={r.id}
            as="article"
            delay={i * 90}
            className={`flex flex-col rounded-card p-7 transition-shadow duration-300 hover:shadow-xl ${featured ? "bg-ink text-white" : "border border-line bg-white"}`}
          >
            <h3 className="font-sans text-base font-semibold">{r.name}</h3>
            <p className="mt-4 font-display text-5xl">${r.price.toLocaleString("en-US")}</p>
            <p className={`mt-1 text-sm ${featured ? "text-white/70" : "text-ink-soft"}`}>{r.unit}, all taxes and fees included</p>
            <ul className={`mt-6 space-y-2.5 text-[15px] ${featured ? "text-white/85" : "text-ink-soft"}`}>
              {r.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg className={`mt-1 shrink-0 ${featured ? "text-dawn" : "text-flame"}`} width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M2 7.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            {showButtons && (
              <Link
                href={`/book?type=${r.id === "private" ? "private" : "standard"}`}
                className={`mt-8 ${featured ? "btn-primary" : "btn border border-ink hover:bg-mist"}`}
              >
                Book {r.id === "private" ? "a private balloon" : "this flight"}
              </Link>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}
