"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { Pic } from "./Pic";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        overHero ? "bg-transparent text-white" : "bg-white/95 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur"
      }`}
    >
      <div className={`container-x flex items-center justify-between gap-6 py-3 transition-[height] duration-300 ${scrolled ? "h-16" : "h-18"}`}>
        <Link href="/" className="flex shrink-0 items-center" aria-label="Sri Lanka Balloon home">
          {/* logoSmall is the largest version of the dark mark we have (150px wide). */}
          <Pic
            name={overHero ? "logoWhite" : "logoSmall"}
            alt="Sri Lanka Balloon"
            priority
            className={`w-auto transition-[height] duration-300 ${scrolled ? "h-10" : "h-12"}`}
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
          <Link href="/book" className="btn-primary py-2.5">Book a flight</Link>
        </nav>

        <button
          type="button"
          className="rounded-full p-2 lg:hidden"
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
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-white lg:hidden">
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
