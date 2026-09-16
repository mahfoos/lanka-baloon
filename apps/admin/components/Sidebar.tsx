"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ROLE_LABELS, type Permissions } from "@/lib/roles";
import { useUser } from "@/components/UserProvider";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  perm: keyof Permissions | null;
}

interface Section {
  label: string | null;
  items: NavItem[];
}

const SECTIONS: Section[] = [
  {
    label: null,
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10", perm: null },
    ],
  },
  {
    label: "RESERVATIONS",
    items: [
      { href: "/bookings", label: "Bookings", icon: "M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z", perm: "canViewBookings" },
      { href: "/manifest", label: "Flight Manifest", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", perm: "canViewBookings" },
      { href: "/messages", label: "Website Messages", icon: "M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zm0 1l8 6 8-6", perm: "canViewBookings" },
      { href: "/customers", label: "Customers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", perm: "canViewCustomers" },
      { href: "/vouchers", label: "Gift Vouchers", icon: "M20 12v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7M2 8h20v4H2zM12 8v12M12 8L9.5 4.5a2 2 0 113 0L12 8zm0 0l2.5-3.5a2 2 0 10-3 0L12 8z", perm: "canViewVouchers" },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { href: "/flights", label: "Flight Schedule", icon: "M12 2.5c-2 3-3 5.5-3 8a3 3 0 006 0c0-2.5-1-5-3-8zM9 18.5h6M10 21h4M9 15.5a6 6 0 01-3-5.2", perm: "canViewFlights" },
      { href: "/fleet", label: "Balloon Fleet", icon: "M12 2C8 2 5 5.5 5 10c0 3.5 2.5 6 5 6.5V18h4v-1.5c2.5-.5 5-3 5-6.5 0-4.5-3-8-7-8zM10 18h4v2h-4z", perm: "canViewFleet" },
      { href: "/crew", label: "Crew & Pilots", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", perm: "canViewCrew" },
      { href: "/roster", label: "Crew Roster", icon: "M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1zm4 10h2m4 0h2", perm: "canViewCrew" },
      { href: "/vehicles", label: "Ground Transport", icon: "M3 13l2-5a2 2 0 011.9-1.4h10.2A2 2 0 0119 8l2 5M5 13h14v4a1 1 0 01-1 1h-1a2 2 0 01-4 0H9a2 2 0 01-4 0H4a1 1 0 01-1-1v-4z", perm: "canViewVehicles" },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { href: "/cashbook", label: "Daily Cash Book", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 9v-1m0 1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", perm: "canViewFinance" },
      { href: "/finance", label: "Finance", icon: "M3 10h18M7 15h2m4 0h4M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z", perm: "canViewFinance" },
    ],
  },
  {
    label: "SAFETY & COMPLIANCE",
    items: [
      { href: "/maintenance", label: "Maintenance", icon: "M14.7 6.3a4 4 0 01-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 015.4-5.4l-2.5 2.5-2.1-.4-.4-2.1 2.5-2.5z", perm: "canViewMaintenance" },
      { href: "/compliance", label: "Compliance", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", perm: "canViewCompliance" },
    ],
  },
  {
    label: "ENGAGEMENT",
    items: [
      { href: "/reports", label: "Passenger Report", icon: "M3 3v18h18M7 15l3-4 3 3 5-7", perm: "canViewBookings" },
      { href: "/reviews", label: "Reviews", icon: "M11 5.1l1.9 3.8 4.2.6-3 3 .7 4.2L11 14.7 7.2 16.7l.7-4.2-3-3 4.2-.6L11 5.1z", perm: "canViewReviews" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { href: "/users", label: "Users & Access", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z", perm: "canManageUsers" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, permissions } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function renderItem(item: NavItem, close: () => void) {
    if (item.perm && !permissions[item.perm]) return null;
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={close}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
          active ? "bg-brand-700 text-white" : "text-brand-100/75 hover:bg-brand-800 hover:text-white"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d={item.icon} />
        </svg>
        <span className="truncate">{item.label}</span>
      </Link>
    );
  }

  function renderNav(close: () => void) {
    return (
      <nav className="flex flex-col gap-0.5 px-2">
        {SECTIONS.map((section, si) => {
          const visible = section.items.filter((item) => !item.perm || permissions[item.perm]);
          if (visible.length === 0) return null;
          return (
            <div key={si} className={si > 0 ? "mt-4" : ""}>
              {section.label && (
                <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-100/35">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">{section.items.map((item) => renderItem(item, close))}</div>
            </div>
          );
        })}
      </nav>
    );
  }

  const brand = (
    <Link href="/dashboard" className="flex items-center gap-3 px-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white">
        <Image src="/logo.png" alt="Sri Lanka Balloon" width={44} height={44} className="h-10 w-10 object-contain" />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-bold text-white">Sri Lanka Balloon</p>
        <p className="text-[10px] text-brand-100/50">Lanka Ballooning (Pvt) Ltd</p>
      </div>
    </Link>
  );

  const userCard = (
    <div className="mx-2 mt-4 rounded-xl bg-white/5 p-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-500 text-sm font-bold text-white">
          {user.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-400">
            {ROLE_LABELS[user.role]}
          </p>
        </div>
      </div>
      <button
        onClick={logout}
        disabled={loggingOut}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 py-2 text-xs font-semibold text-brand-100/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
        {loggingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto bg-brand-950 py-5 lg:flex">
        <div className="mb-6">{brand}</div>
        {renderNav(() => {})}
        <div className="mt-auto">{userCard}</div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-brand-950 px-4 lg:hidden">
        <span className="text-sm font-bold text-white">Sri Lanka Balloon</span>
        <button aria-label="Menu" onClick={() => setMobileOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-lg text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-x-0 top-14 z-40 max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-brand-950 pb-4 pt-2 lg:hidden">
          {renderNav(() => setMobileOpen(false))}
          {userCard}
        </div>
      )}
      <div className="h-14 lg:hidden" aria-hidden />
    </>
  );
}
