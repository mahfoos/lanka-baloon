"use client";

import Image from "next/image";
import { useState } from "react";

/** Loads the YouTube player only when clicked, which keeps the page fast. */
export function YouTube({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  const [thumb, setThumb] = useState<"maxresdefault" | "hqdefault">("maxresdefault");
  return (
    <div className="relative aspect-video overflow-hidden rounded-media bg-ink">
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0">
          <Image
            src={`https://i.ytimg.com/vi/${id}/${thumb}.jpg`}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            // Not every video has a maxres still; fall back rather than show a blank frame.
            onError={() => setThumb("hqdefault")}
            className="object-cover opacity-85 transition group-hover:opacity-100"
          />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-flame text-white shadow-lg">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
          </span>
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}
