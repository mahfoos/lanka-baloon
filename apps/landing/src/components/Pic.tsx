import Image, { type ImageProps } from "next/image";
import { image, type ImageKey } from "@/lib/images";

type Props = Omit<ImageProps, "src" | "alt"> & { name: ImageKey; alt: string };

/** next/image wrapper that takes a key from the image manifest and supplies the
 *  intrinsic size and blur placeholder, so photos fade up instead of popping in. */
export function Pic({ name, alt, ...rest }: Props) {
  const { src, width, height, blurDataURL } = image(name);
  return (
    <Image
      src={src}
      alt={alt}
      {...(rest.fill ? {} : { width, height })}
      {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
      unoptimized={src.endsWith(".gif")}
      {...rest}
    />
  );
}
