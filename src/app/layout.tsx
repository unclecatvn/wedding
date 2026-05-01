import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Amelia & Laurent | European Wedding",
  description:
    "A cinematic wedding experience with RSVP, travel details, gallery and editable content powered by Supabase.",
  metadataBase: new URL("https://wedding.example.com"),
  openGraph: {
    title: "Amelia & Laurent | European Wedding",
    description:
      "Join us for an intimate European wedding celebration.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-stone-950 text-stone-50"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
