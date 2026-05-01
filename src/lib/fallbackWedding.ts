import type { WeddingContent } from "@/types/wedding";

export const fallbackWedding: WeddingContent = {
  themeMode: "dark",
  coupleName: "Amelia & Laurent",
  eyebrow: "A summer wedding in Provence",
  dateLabel: "14 June 2027",
  heroTitle: "A quiet celebration beneath the European sun",
  heroSubtitle:
    "Join us for a weekend of dinner, music and vows among olive trees, old stone and the people we love most.",
  heroImage: {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=2200&q=85",
    alt: "Elegant European wedding table at sunset",
  },
  storyTitle: "Two cities, one promise",
  storyBody:
    "We met between London rain and Paris trains, then built a life around slow dinners, long walks and the kind of laughter that makes a room feel lighter. This wedding is our way to gather everyone who shaped that story.",
  portraits: [
    {
      src: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=1400&q=85",
      alt: "Bride portrait in soft daylight",
    },
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
      alt: "Couple walking after the ceremony",
    },
  ],
  venueName: "Chateau de Lumiere",
  venueLocation: "Provence, France",
  venueDescription:
    "A restored countryside estate surrounded by vineyards, lavender paths and warm stone terraces for the ceremony and dinner.",
  venueImage: {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1800&q=85",
    alt: "Historic European estate for a wedding venue",
  },
  schedule: [
    {
      time: "16:30",
      title: "Garden ceremony",
      details: "Outdoor vows by the olive grove. Please arrive 20 minutes early.",
    },
    {
      time: "18:00",
      title: "Aperitif",
      details: "Champagne, local wines and small plates on the terrace.",
    },
    {
      time: "20:00",
      title: "Dinner and dancing",
      details: "Seasonal dinner followed by music in the courtyard.",
    },
  ],
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1400&q=85",
      alt: "Wedding bouquet with neutral flowers",
    },
    {
      src: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=1400&q=85",
      alt: "European dinner table with candles",
    },
    {
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=85",
      alt: "Wedding guests celebrating outdoors",
    },
    {
      src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1400&q=85",
      alt: "Wedding rings and stationery",
    },
  ],
  travelNotes: [
    {
      title: "Nearest airport",
      description: "Marseille Provence Airport is 55 minutes from the venue by car.",
    },
    {
      title: "Stay",
      description: "A small room block is reserved in Aix-en-Provence and nearby guest houses.",
    },
    {
      title: "Dress code",
      description: "European garden formal. Lightweight linen and muted tones are welcome.",
    },
  ],
  rsvpDeadline: "Please reply by 1 April 2027.",
  registryNote:
    "Your presence is the gift. If you would like to contribute, we will share a private honeymoon fund link with confirmed guests.",
};
