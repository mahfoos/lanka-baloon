"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const DEMO_ACCOUNTS = [
  { username: "admin", label: "Administrator" },
  { username: "ops", label: "Operations Manager" },
  { username: "desk", label: "Reservations" },
  { username: "accounts", label: "Accountant" },
  { username: "pilot", label: "Pilot" },
  { username: "viewer", label: "Viewer" },
];

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/dashboard";

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("balloon123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Sign in failed. Please try again.");
      setBusy(false);
      return;
    }
    router.replace(from === "/" ? "/dashboard" : from);
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="lg:hidden mb-8 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-white shadow-card">
          <Image src="/logo.png" alt="Sri Lanka Balloon" width={48} height={48} className="h-11 w-11 object-contain" />
        </span>
        <div>
          <p className="font-black text-brand-950">Sri Lanka Balloon</p>
          <p className="text-xs text-ink/55">Operations ERP</p>
        </div>
      </div>

      <h1 className="font-display text-2xl font-black text-brand-950">Operator sign in</h1>
      <p className="mt-1 text-sm text-ink/55">Access the Lanka Ballooning operations platform.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-brand-950">Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className="input-field mt-1.5" placeholder="username" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-brand-950">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="input-field mt-1.5" placeholder="••••••••" />
        </label>

        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

        <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? "Signing in…" : "Sign in"}</button>
      </form>

      <div className="mt-6 rounded-xl border border-brand-900/10 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">Demo accounts</p>
        <p className="mt-1 text-xs text-ink/55">Password for all: <span className="font-mono font-semibold text-brand-700">balloon123</span></p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.username}
              type="button"
              onClick={() => { setUsername(a.username); setPassword("balloon123"); setError(""); }}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${username === a.username ? "border-brand-600 bg-brand-600 text-white" : "border-brand-900/15 bg-paper text-ink/60 hover:border-brand-400"}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-ink/40">Internal use only · Lanka Ballooning (Pvt) Ltd</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 px-12 text-center text-white lg:flex">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/5" />
        <div className="relative grid h-40 w-40 place-items-center overflow-hidden rounded-full bg-white shadow-2xl">
          <Image src="/logo.png" alt="Sri Lanka Balloon" width={160} height={160} priority className="h-32 w-32 object-contain" />
        </div>
        <h1 className="relative mt-8 font-display text-4xl font-black leading-tight">Sri Lanka Balloon</h1>
        <p className="relative mt-4 max-w-xs text-sm leading-relaxed text-white/75">
          Operations ERP — bookings, flights, fleet, crew, finance and compliance in one place.
        </p>
        <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent-200">
          Lanka Ballooning (Pvt) Ltd
        </p>
      </div>

      {/* Right form */}
      <div className="flex w-full items-center justify-center bg-paper px-6 py-12 lg:w-1/2">
        <Suspense fallback={<p className="text-sm text-ink/45">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
