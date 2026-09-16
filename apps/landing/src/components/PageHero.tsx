import type { ImageKey } from "@/lib/images";
import { Pic } from "./Pic";

/** Where to anchor the crop when the photo and the hero box disagree. */
type Focus = "center" | "top" | "bottom";

const focusClass: Record<Focus, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
};

/**
 * The cover band at the top of an inner page.
 *
 * Height is the whole game here. `object-cover` fills the box and throws away
 * whatever doesn't fit, so a short, very wide hero crops a landscape photo down
 * to a letterbox slice: at the old 52svh a 1440px-wide screen showed 64% of the
 * flights banner and 43% of the FAQ photo. Taller brings the box ratio back
 * towards the photos' own, so more of each picture survives.
 *
 * The scrim is three stops rather than a single wash: dark at the bottom where
 * the title sits, nearly clear through the middle so the photograph reads, and a
 * separate band at the top so the white header stays legible against a bright
 * sky. A flat gradient dark enough for both ends would grey out the picture.
 */
export function PageHero({
  title,
  intro,
  image,
  focus = "center",
}: {
  title: string;
  intro?: string;
  image: ImageKey;
  focus?: Focus;
}) {
  return (
    <section className="relative isolate flex min-h-[24rem] items-end overflow-hidden pt-24 text-white sm:min-h-[56svh] lg:min-h-[64svh]">
      <Pic name={image} alt="" fill priority sizes="100vw" className={`kenburns -z-10 object-cover ${focusClass[focus]}`} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-ink/55 to-transparent" />
      <div className="container-x pb-12 sm:pb-16">
        <h1 className="rise text-4xl leading-[1.05] sm:text-6xl">{title}</h1>
        {intro && <p className="rise rise-delay prose-width mt-4 text-lg text-white/90">{intro}</p>}
      </div>
    </section>
  );
}
