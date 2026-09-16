import data from "./image-data.json";

export type ImageKey = keyof typeof data;

type ImageData = { src: string; width: number; height: number; blurDataURL?: string };

/** Local path, intrinsic size and blur placeholder for a photo.
 *  Files live in /public/images; regenerate this data with `npm run images:data`. */
export function image(key: ImageKey): ImageData {
  return data[key] as ImageData;
}

/** Just the path, for metadata (Open Graph, icons), which resolves it against metadataBase. */
export function img(key: ImageKey): string {
  return image(key).src;
}
