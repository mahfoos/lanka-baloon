"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal snap rail with arrow controls.
 *
 * Children are rendered untouched, so the caller can stay a server component and
 * keep the photos out of the client bundle. The rail scrolls natively; the arrows
 * are an addition for mouse users, not the only way to move.
 */
export function ScrollRail({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  const scrollBy = (direction: 1 | -1) =>
    ref.current?.scrollBy({ left: direction * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="relative [overflow-x:clip]">
      {/* The track bleeds to the right edge of the window so the row reads as
          continuing off-screen, while the controls below stay on the container grid. */}
      <div
        ref={ref}
        onScroll={sync}
        tabIndex={0}
        role="group"
        aria-label={label}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 pr-5 [margin-right:calc(50%-50vw)] [scrollbar-width:thin] sm:pr-8"
      >
        {children}
      </div>

      <div className="mt-2 flex justify-end gap-2">
        {([-1, 1] as const).map((direction) => (
          <button
            key={direction}
            type="button"
            onClick={() => scrollBy(direction)}
            disabled={direction === -1 ? atStart : atEnd}
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition hover:-translate-y-0.5 hover:border-ink disabled:pointer-events-none disabled:opacity-30"
          >
            <span className="sr-only">{direction === -1 ? "Previous photos" : "Next photos"}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d={direction === -1 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
