import type { ImageKey } from "@/lib/images";
import { Pic } from "./Pic";

export function PageHero({ title, intro, image }: { title: string; intro?: string; image: ImageKey }) {
  return (
    <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden pt-24 text-white">
      <Pic name={image} alt="" fill priority sizes="100vw" className="kenburns -z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/20" />
      <div className="container-x pb-12 sm:pb-16">
        <h1 className="rise text-4xl leading-[1.05] sm:text-6xl">{title}</h1>
        {intro && <p className="rise rise-delay prose-width mt-4 text-lg text-white/90">{intro}</p>}
      </div>
    </section>
  );
}
