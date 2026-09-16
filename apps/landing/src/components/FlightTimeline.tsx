import { flightDay } from "@/lib/content";
import { Pic } from "./Pic";
import { Reveal } from "./Reveal";

/** The morning as a timeline. The rail shifts from pre-dawn indigo to sunrise amber,
 *  so the colour itself tells you where you are in the morning. */
export function FlightTimeline({ withImages = false }: { withImages?: boolean }) {
  return (
    <ol className="relative ml-2 border-l-0">
      <span
        aria-hidden
        className="absolute left-[7px] top-2 bottom-2 w-[3px] rounded-full"
        style={{ background: "linear-gradient(to bottom, var(--color-ink) 0%, var(--color-dawn) 60%, var(--color-flame) 100%)" }}
      />
      {flightDay.map((step, i) => (
        <Reveal
          key={step.title}
          as="li"
          delay={i * 80}
          className="relative grid gap-5 pb-12 pl-10 last:pb-0 md:grid-cols-[1fr_1.1fr] md:gap-10"
        >
          <span aria-hidden className="absolute left-0 top-1.5 h-[17px] w-[17px] rounded-full border-[3px] border-white bg-ink shadow-[0_0_0_1px_var(--color-line)]"
            style={{ background: i < 3 ? "var(--color-ink)" : "var(--color-dawn)" }} />
          <div>
            <p className="text-sm font-semibold text-lake">{step.when}</p>
            <h3 className="mt-1 text-2xl">{step.title}</h3>
            <p className="mt-2 max-w-md text-ink-soft">{step.body}</p>
          </div>
          {withImages && i !== flightDay.length - 1 && (
            <div className="group relative aspect-[16/10] overflow-hidden rounded-media">
              <Pic name={step.image} alt={step.title} fill sizes="(min-width: 768px) 45vw, 100vw" className="photo-zoom object-cover" />
            </div>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
