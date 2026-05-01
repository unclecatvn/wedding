export type WeddingImage = {
  src: string;
  alt: string;
};

export type WeddingEvent = {
  time: string;
  title: string;
  details: string;
};

export type TravelNote = {
  title: string;
  description: string;
};

export type WeddingThemeMode = "dark" | "light";

export type WeddingContent = {
  themeMode: WeddingThemeMode;
  coupleName: string;
  eyebrow: string;
  dateLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: WeddingImage;
  storyTitle: string;
  storyBody: string;
  portraits: WeddingImage[];
  venueName: string;
  venueLocation: string;
  venueDescription: string;
  venueImage: WeddingImage;
  schedule: WeddingEvent[];
  gallery: WeddingImage[];
  travelNotes: TravelNote[];
  rsvpDeadline: string;
  registryNote: string;
};

export type RsvpInput = {
  name: string;
  email: string;
  attending: "yes" | "no";
  guests: number;
  note?: string;
  consent: boolean;
};
