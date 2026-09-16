import { gallery } from "@/lib/content";
import { image } from "@/lib/images";
import { Pic } from "./Pic";
import { ScrollRail } from "./ScrollRail";

/** Photo rail. Each frame keeps its own proportions so the row reads as a
 *  contact sheet rather than a grid of identical crops. */
export function Gallery() {
  return (
    <ScrollRail label="Photo gallery">
      {gallery.map(({ image: name, alt }) => {
        const { width, height } = image(name);
        return (
          <figure
            key={name}
            style={{ aspectRatio: `${width} / ${height}` }}
            className="group relative h-64 shrink-0 snap-start overflow-hidden rounded-media bg-mist sm:h-80 lg:h-[26rem]"
          >
            <Pic name={name} alt={alt} fill sizes="(min-width: 1024px) 840px, 520px" className="photo-zoom object-cover" />
          </figure>
        );
      })}
    </ScrollRail>
  );
}
