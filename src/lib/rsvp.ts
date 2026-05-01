import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  attending: z.enum(["yes", "no"]),
  guests: z.number().int().min(0).max(4),
  note: z.string().trim().max(500).optional(),
  consent: z.boolean().refine(Boolean, "Consent is required for RSVP storage."),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
