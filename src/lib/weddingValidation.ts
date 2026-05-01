import { z } from "zod";

const weddingImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const weddingEventSchema = z.object({
  time: z.string().min(1),
  title: z.string().min(1),
  details: z.string().min(1),
});

const travelNoteSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const weddingContentSchema = z.object({
  themeMode: z.enum(["dark", "light"]).default("dark"),
  coupleName: z.string().min(1),
  eyebrow: z.string().min(1),
  dateLabel: z.string().min(1),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroImage: weddingImageSchema,
  storyTitle: z.string().min(1),
  storyBody: z.string().min(1),
  portraits: z.array(weddingImageSchema).min(1),
  venueName: z.string().min(1),
  venueLocation: z.string().min(1),
  venueDescription: z.string().min(1),
  venueImage: weddingImageSchema,
  schedule: z.array(weddingEventSchema).min(1),
  gallery: z.array(weddingImageSchema).min(1),
  travelNotes: z.array(travelNoteSchema).min(1),
  rsvpDeadline: z.string().min(1),
  registryNote: z.string().min(1),
});
