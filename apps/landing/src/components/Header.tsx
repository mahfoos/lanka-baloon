"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { Pic } from "./Pic";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the panel covers the screen: Escape closes it, the page behind stops
  // scrolling, and focus moves into the menu so a keyboard or screen-reader user
  // isn’t left on a toggle with the list read out somewhere behind them.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const logoSize = scrolled ? "h-10" : "h-12";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        overHero ? "bg-transparent text-white" : "bg-white/95 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur"
      }`}
    >
      <div className={`container-x flex items-center justify-between gap-6 py-3 transition-[height] duration-300 ${scrolled ? "h-16" : "h-18"}`}>
        {/* Both marks render and cross-fade. Swapping the `src` instead would leave
            the incoming file unloaded, so the logo blinks out on the first scroll. */}
        <Link href="/" className="relative flex shrink-0 items-center" aria-label="Sri Lanka Balloon home">
          <Pic
            name="logoSmall"
            alt="Sri Lanka Balloon"
            priority
            className={`w-auto transition-[height,opacity] duration-300 ${logoSize} ${overHero ? "opacity-0" : "opacity-100"}`}
          />
          <Pic
            name="logoWhite"
            alt=""
            aria-hidden
            priority
            className={`absolute left-0 top-1/2 w-auto -translate-y-1/2 transition-[height,opacity] duration-300 ${logoSize} ${overHero ? "opacity-100" : "opacity-0"}`}
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="text-[15px] font-medium underline-offset-8 hover:underline aria-[current=page]:underline"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/book" className="btn-primary">Book a flight</Link>
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          ref={panelRef}
          id="mobile-nav"
          aria-label="Mobile"
          // Capped and scrollable: six items plus the button can outrun a short
          // phone in landscape, and the body behind is locked.
          className="max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-line bg-white lg:hidden"
        >
          <ul className="container-x flex flex-col py-4">
            {nav.map((item, i) => (
              <li key={item.href} className="rise" style={{ animationDelay: `${i * 45}ms`, animationDuration: ".5s" }}>
                <Link href={item.href} className="block py-3 text-lg font-medium">{item.label}</Link>
              </li>
            ))}
            <li className="pt-3">
              <Link href="/book" className="btn-primary w-full">Book a flight</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
