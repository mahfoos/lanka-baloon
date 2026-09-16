"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendMessage } from "@/app/contact/actions";
import type { FormState } from "@/lib/validation";

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendMessage, { ok: false });
  const formRef = useRef<HTMLFormElement>(null);

  const err = (k: string) => state.errors?.[k]?.[0];

  // `noValidate` turns off the browser’s own prompts, so this form has to say what
  // went wrong itself: the state on the control, the message tied to it by id, and
  // focus moved to the first field that failed.
  const invalid = (name: string) => ({
    "aria-invalid": err(name) ? true : undefined,
    "aria-describedby": err(name) ? `c-${name}-error` : undefined,
  });

  useEffect(() => {
    if (!state.errors) return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    firstInvalid?.scrollIntoView({ block: "center", behavior: "smooth" });
    firstInvalid?.focus({ preventScroll: true });
  }, [state]);

  if (state.ok) return <p role="status" className="rounded-media bg-mist p-6 text-lg">{state.message}</p>;

  return (
    <form ref={formRef} action={action} className="space-y-5" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label htmlFor="c-name" className="label">Name</label>
        <input id="c-name" name="name" className="field" autoComplete="name" required {...invalid("name")} />
        {err("name") && <p id="c-name-error" className="error">{err("name")}</p>}
      </div>
      <div>
        <label htmlFor="c-email" className="label">Email</label>
        <input id="c-email" name="email" type="email" inputMode="email" className="field" autoComplete="email" required {...invalid("email")} />
        {err("email") && <p id="c-email-error" className="error">{err("email")}</p>}
      </div>
      <div>
        <label htmlFor="c-message" className="label">Message</label>
        <textarea id="c-message" name="message" rows={5} className="field" required {...invalid("message")} />
        {err("message") && <p id="c-message-error" className="error">{err("message")}</p>}
      </div>
      {state.message && <p role="alert" className="error">{state.message}</p>}
      <button className="btn-primary" disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
