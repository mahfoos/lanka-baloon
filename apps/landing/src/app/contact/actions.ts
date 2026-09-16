"use server";

import { prisma } from "@lanka-baloon/db";
import { contactSchema, type FormState } from "@/lib/validation";

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  if (parsed.data.website) return { ok: true, message: "Thanks, we’ll reply soon." }; // bot

  const { name, email, message } = parsed.data;

  try {
    await prisma.contactMessage.create({ data: { name, email, message } });
  } catch (error) {
    console.error("contact message insert failed", error);
    return { ok: false, message: "Your message didn’t send. Please try again or WhatsApp us." };
  }

  return { ok: true, message: "Message sent. We usually reply within a few hours." };
}
