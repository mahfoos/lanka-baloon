"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Element to render. Use a semantic tag so reveals don't add stray divs. */
  as?: ElementType;
  /** Stagger, in ms, for items revealed together. */
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts its children into view once, when they scroll near the viewport.
 *
 * The hidden state lives in CSS under `.js`, which an inline script in the layout
 * sets before first paint — so visitors without JavaScript see everything, and
 * there is no flash of hidden content for everyone else.
 */
export function Reveal({ children, as: Tag = "div", delay = 0, className }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("shown");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("shown");
        observer.disconnect();
      },
      // Trigger a little before the element is fully on screen.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
