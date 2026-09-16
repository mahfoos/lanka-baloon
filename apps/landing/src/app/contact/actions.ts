"use server";

import { contactSchema, type FormState } from "@/lib/validation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  if (parsed.data.website) return { ok: true, message: "Thanks, we’ll reply soon." }; // bot

  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Messages aren’t connected yet. Please email or WhatsApp us instead." };
  }

  const supabase = await createClient();
  const { name, email, message } = parsed.data;
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });
  if (error) return { ok: false, message: "Your message didn’t send. Please try again or WhatsApp us." };

  return { ok: true, message: "Message sent. We usually reply within a few hours." };
}
