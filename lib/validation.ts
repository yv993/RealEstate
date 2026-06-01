import { z } from "zod";

// Server-side validation schemas. Never trust client input.
export const leadSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().toLowerCase().email("A valid email is required").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === "" || /^[+()\d\s-]{6,40}$/.test(v), "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(2000).default(""),
  property_id: z.coerce.number().int().positive().nullable().optional(),
  // Honeypot — kept permissive so the route can detect a filled value and return a
  // silent success (never tell bots they were caught).
  company: z.string().max(200).optional(),
});

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
  company: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
