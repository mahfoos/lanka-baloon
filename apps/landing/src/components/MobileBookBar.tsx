"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company } from "@/lib/content";

/**
 * Small-screen action bar. On a phone the header's "Book a flight" button is hidden
 * behind the menu toggle, so once you scroll past the hero there is no visible way to
 * book. This keeps booking and WhatsApp one tap away.
 */
export function MobileBookBar() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Redundant on the pages that already are the call to action.
  if (pathname === "/book") return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur transition-transform duration-300 lg:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
      // Hidden off-screen, so keep it out of the tab order until it slides up.
      inert={!shown}
    >
      <div className="container-x flex items-center gap-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">From $250 per adult</p>
          <p className="truncate text-xs text-ink-soft">All taxes included</p>
        </div>
        <a
          href={company.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-lake"
        >
          <span className="sr-only">Ask a question on WhatsApp</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.17c-.24.68-1.4 1.3-1.95 1.34-.5.04-.98.22-3.3-.69-2.77-1.09-4.55-3.92-4.69-4.1-.14-.19-1.12-1.49-1.12-2.84s.71-2.02.96-2.29c.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.06.62.48.24.57.8 1.96.87 2.1.07.14.12.31.02.5-.1.19-.15.31-.29.47-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.29 1.41.28.14.45.12.61-.07.17-.19.71-.83.9-1.11.19-.28.37-.24.62-.14.25.09 1.64.77 1.92.91.28.14.47.21.54.33.07.11.07.64-.17 1.32z" />
          </svg>
        </a>
        <Link href="/book" className="btn-primary shrink-0 px-5 py-2.5">Book a flight</Link>
      </div>
    </div>
  );
}
