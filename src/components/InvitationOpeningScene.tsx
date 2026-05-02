"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { WeddingContent } from "@/types/wedding";

const envelopeClosed = "/download%20(1).png";
const envelopeOpen = "/download%20(2).png";
const heartCard = "/download.png";
const waxSeal = "/e42534f7316b3a35bea6b2a404398d64.png";

export function InvitationOpeningScene({
  onOpen,
  wedding,
}: {
  onOpen?: () => void;
  wedding: WeddingContent;
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(media.matches);

    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);

    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  const opened = isOpened || reduceMotion;
  const openInvitation = () => {
    setIsOpened(true);
    onOpen?.();
  };

  return (
    <section
      className="pin-chapter canva-invitation-opening relative z-10 flex min-h-screen items-center justify-center overflow-hidden px-5 py-24 md:px-10 lg:px-16"
      data-webgl-chapter="0"
      id="top"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.62),transparent_34%),linear-gradient(180deg,#f4eee8,#ede4dc_88%)]" />
      <div className="invitation-vine" aria-hidden="true" />

      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-6 text-xs uppercase tracking-[0.32em] text-[#3e432f]/80 md:px-10 lg:px-16">
        <a href="#top" className="font-semibold text-[#3e432f]">
          {wedding.coupleName}
        </a>
        <nav className="hidden gap-8 md:flex">
          <a href="#story">Story</a>
          <a href="#details">Details</a>
          <a href="#gallery">Gallery</a>
          <a href="#rsvp">RSVP</a>
        </nav>
      </header>

      <div
        className={`invitation-perspective relative z-10 w-full max-w-6xl ${
          opened ? "invitation-open" : ""
        }`}
      >
        <div className="mx-auto flex min-h-[42rem] max-w-4xl flex-col items-center justify-center">
          <div className="canva-envelope-frame invitation-envelope-stage relative">
            <div className="canva-envelope-open absolute z-10 overflow-hidden">
              <Image
                alt=""
                className="canva-envelope-open-image"
                height={1349}
                priority
                sizes="(min-width: 768px) 18rem, 38vw"
                src={envelopeOpen}
                width={2400}
              />
            </div>

            <article className="canva-heart-card invitation-letter absolute left-1/2 z-20 -translate-x-1/2 text-center text-[#34362a]">
              <Image
                alt=""
                className="canva-heart-image"
                height={756}
                priority
                sizes="(min-width: 768px) 36rem, 88vw"
                src={heartCard}
                width={800}
              />
              <div className="canva-heart-copy relative z-10 mx-auto px-5">
                <h1 className="font-serif text-4xl italic leading-none md:text-6xl">
                  Kindly Respond
                </h1>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] md:text-sm">
                  BY JANUARY 14TH, 2027
                </p>
              </div>
            </article>

            <button
              aria-expanded={opened}
              aria-label={opened ? "Invitation opened" : "Open RSVP invitation"}
              className="canva-envelope-button invitation-envelope absolute inset-0 z-30 text-[#313527]"
              onClick={openInvitation}
              type="button"
            >
              <span className="canva-envelope-front absolute left-1/2 z-30 -translate-x-1/2 overflow-hidden">
                <Image
                  alt=""
                  className="canva-envelope-front-image"
                  height={1349}
                  priority
                  sizes="(min-width: 768px) 43rem, 92vw"
                  src={envelopeClosed}
                  width={2400}
                />
              </span>
              <span className="canva-wax-seal absolute left-1/2 z-40 -translate-x-1/2">
                <Image
                  alt=""
                  className="canva-wax-seal-image"
                  height={800}
                  priority
                  sizes="7rem"
                  src={waxSeal}
                  width={776}
                />
              </span>
              <span className="canva-rsvp-cta absolute left-1/2 z-40 w-full -translate-x-1/2 text-center">
                <span className="canva-rsvp-button inline-flex border border-[#34362a]/70 px-12 py-3 text-base uppercase tracking-[0.18em] text-[#34362a] transition hover:bg-[#34362a] hover:text-[#f4eee8] md:px-16 md:text-xl">
                  RSVP
                </span>
              </span>
            </button>
          </div>
          <p className="mt-8 text-center text-xs uppercase tracking-[0.35em] text-[#5d6247]/75">
            {opened ? "Scroll to read the invitation" : "Tap RSVP to begin"}
          </p>
        </div>
      </div>
    </section>
  );
}
