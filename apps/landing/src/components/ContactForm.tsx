"use client";

import { useActionState } from "react";
import { sendMessage } from "@/app/contact/actions";
import type { FormState } from "@/lib/validation";

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendMessage, { ok: false });

  if (state.ok) return <p role="status" className="rounded-2xl bg-mist p-6 text-lg">{state.message}</p>;

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label htmlFor="c-name" className="label">Name</label>
        <input id="c-name" name="name" className="field" autoComplete="name" required />
        {state.errors?.name && <p className="error">{state.errors.name[0]}</p>}
      </div>
      <div>
        <label htmlFor="c-email" className="label">Email</label>
        <input id="c-email" name="email" type="email" className="field" autoComplete="email" required />
        {state.errors?.email && <p className="error">{state.errors.email[0]}</p>}
      </div>
      <div>
        <label htmlFor="c-message" className="label">Message</label>
        <textarea id="c-message" name="message" rows={5} className="field" required />
        {state.errors?.message && <p className="error">{state.errors.message[0]}</p>}
      </div>
      {state.message && <p role="alert" className="error">{state.message}</p>}
      <button className="btn-primary" disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
