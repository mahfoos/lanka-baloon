import { z } from "zod";

const todayISO = () => new Date().toISOString().slice(0, 10);

export const bookingSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name"),
    email: z.string().trim().email("Enter a valid email address"),
    phone: z.string().trim().min(7, "Enter a phone or WhatsApp number"),
    country: z.string().trim().min(2, "Choose your billing country"),
    flightDate: z.string().refine((d) => d > todayISO(), "Choose a date from tomorrow onwards"),
    hotel: z.string().trim().min(2, "Tell us where you're staying so we can plan pick-up"),
    flightType: z.enum(["standard", "private"]),
    adults: z.coerce.number().int().min(1, "At least 1 adult").max(16),
    children: z.coerce.number().int().min(0).max(5),
    giftVoucher: z.boolean(),
    birthdayCake: z.boolean(),
    requests: z.string().trim().max(1000).optional(),
    website: z.string().max(0).optional(), // honeypot — bots fill this in
  })
  .refine((v) => v.adults + v.children <= 16, {
    message: "A balloon carries up to 16 guests",
    path: ["children"],
  });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(10, "Write a little more so we can help"),
  website: z.string().max(0).optional(),
});

export type FormState = {
  ok: boolean;
  message?: string;
  reference?: string;
  errors?: Record<string, string[] | undefined>;
};
