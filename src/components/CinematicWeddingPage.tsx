"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { InvitationOpeningScene } from "@/components/InvitationOpeningScene";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { RSVPForm } from "@/components/RSVPForm";
import { WeddingWebGLScene } from "@/components/WeddingWebGLScene";
import type { WeddingContent } from "@/types/wedding";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function CinematicWeddingPage({ wedding }: { wedding: WeddingContent }) {
  const root = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const themeClass =
    wedding.themeMode === "light" ? "wedding-theme-light" : "wedding-theme-dark";

  const startMusic = useCallback(() => {
    const music = musicRef.current;

    if (!music || musicStarted) {
      return;
    }

    music.volume = 0.55;
    void music
      .play()
      .then(() => {
        setMusicStarted(true);
        setMusicPlaying(true);
      })
      .catch(() => {
        // Browsers can still block playback if the gesture is interrupted.
      });
  }, [musicStarted]);

  const toggleMusic = useCallback(() => {
    const music = musicRef.current;

    if (!music) {
      return;
    }

    music.volume = 0.55;

    if (music.paused) {
      void music
        .play()
        .then(() => {
          setMusicStarted(true);
          setMusicPlaying(true);
        })
        .catch(() => {
          setMusicPlaying(false);
        });
      return;
    }

    music.pause();
    setMusicPlaying(false);
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((item) => {
        gsap.from(item, {
          y: 56,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".scene").forEach((scene) => {
        gsap.fromTo(
          scene,
          { opacity: 0.88 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: scene,
              start: "top center",
              end: "bottom center",
              scrub: true,
            },
          },
        );
      });

      const desktop = window.matchMedia("(min-width: 1024px)");
      const chapterTriggers: ScrollTrigger[] = [];
      const chapters = gsap.utils.toArray<HTMLElement>("[data-webgl-chapter]");
      const maxChapter = Math.max(chapters.length - 1, 1);

      const emitChapterProgress = (
        trigger: ScrollTrigger,
        chapter: HTMLElement,
      ) => {
        const index = Number(chapter.dataset.webglChapter || 0);
        const progress = (index + trigger.progress) / maxChapter;
        const velocity = Math.min(Math.abs(trigger.getVelocity()) / 2600, 1);

        window.dispatchEvent(
          new CustomEvent("wedding:webgl-progress", {
            detail: { progress, velocity },
          }),
        );
      };

      chapters.forEach((chapter) => {
        const shouldPin = desktop.matches && chapter.classList.contains("pin-chapter");
        chapterTriggers.push(
          ScrollTrigger.create({
            trigger: chapter,
            start: shouldPin ? "top top" : "top center",
            end: shouldPin ? "+=70%" : "bottom center",
            pin: shouldPin,
            pinSpacing: shouldPin,
            anticipatePin: shouldPin ? 1 : 0,
            onEnter: (trigger) => emitChapterProgress(trigger, chapter),
            onEnterBack: (trigger) => emitChapterProgress(trigger, chapter),
            onUpdate: (trigger) => emitChapterProgress(trigger, chapter),
          }),
        );
      });

      return () => {
        chapterTriggers.forEach((trigger) => trigger.kill());
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={`invitation-site relative overflow-hidden bg-background text-foreground ${themeClass}`}
    >
      <audio ref={musicRef} loop preload="auto" src="/music/music.mp3" />
      <button
        aria-label={musicPlaying ? "Pause background music" : "Play background music"}
        aria-pressed={musicPlaying}
        className={`music-disc-control ${musicPlaying ? "music-disc-playing" : ""}`}
        onClick={toggleMusic}
        type="button"
      >
        <span className="music-disc" aria-hidden="true" />
        <span className="sr-only">
          {musicPlaying ? "Pause background music" : "Play background music"}
        </span>
      </button>
      <SmoothScrollProvider />
      <WeddingWebGLScene
        images={getSceneImages(wedding)}
        themeMode={wedding.themeMode}
      />
      <InvitationOpeningScene onOpen={startMusic} wedding={wedding} />
      <Story wedding={wedding} />
      <Venue wedding={wedding} />
      <Schedule wedding={wedding} />
      <Gallery wedding={wedding} />
      <Travel wedding={wedding} />
      <section
        id="rsvp"
        className="scene invitation-page-section relative z-10 px-5 py-16 md:px-10 lg:px-16"
      >
        <div className="invitation-sheet mx-auto max-w-5xl p-4 md:p-6">
          <RSVPForm deadline={wedding.rsvpDeadline} />
        </div>
      </section>
      <Footer wedding={wedding} />
    </div>
  );
}

function Story({ wedding }: { wedding: WeddingContent }) {
  return (
    <section
      id="story"
      className="scene pin-chapter invitation-page-section relative z-10 flex min-h-screen items-center px-5 py-16 md:px-10 lg:px-16"
      data-webgl-chapter="1"
    >
      <div className="invitation-sheet mx-auto grid max-w-7xl gap-12 p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="reveal text-xs uppercase tracking-[0.45em] text-clay">
            Our story
          </p>
          <h2 className="reveal mt-5 font-serif text-5xl leading-none text-ink md:text-7xl">
            {wedding.storyTitle}
          </h2>
          <p className="reveal mt-8 max-w-xl text-lg leading-9 text-ink/70">
            {wedding.storyBody}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {wedding.portraits.slice(0, 2).map((image, index) => (
            <div
              key={image.src}
              className={`reveal invitation-photo relative h-[30rem] overflow-hidden rounded-[12rem] border border-ink/10 bg-white/45 ${
                index === 1 ? "md:mt-24" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Venue({ wedding }: { wedding: WeddingContent }) {
  return (
    <section
      id="details"
      className="scene pin-chapter invitation-page-section relative z-10 flex min-h-screen items-center px-5 py-16 md:px-10 lg:px-16"
      data-webgl-chapter="2"
    >
      <div className="invitation-sheet mx-auto grid max-w-7xl gap-8 p-6 md:p-10 lg:grid-cols-[0.72fr_1fr] lg:items-end">
        <div className="reveal invitation-photo relative h-[32rem] overflow-hidden rounded-[2rem] border border-ink/10 bg-white/45">
          <Image
            src={wedding.venueImage.src}
            alt={wedding.venueImage.alt}
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>
        <div className="reveal">
          <p className="text-xs uppercase tracking-[0.45em] text-clay">
            Venue
          </p>
          <h2 className="mt-4 font-serif text-5xl text-ink md:text-7xl">
            {wedding.venueName}
          </h2>
          <p className="mt-4 text-lg text-clay">
            {wedding.venueLocation}
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ink/70">
            {wedding.venueDescription}
          </p>
        </div>
      </div>
    </section>
  );
}

function Schedule({ wedding }: { wedding: WeddingContent }) {
  return (
    <section
      className="scene pin-chapter invitation-page-section relative z-10 flex min-h-screen items-center px-5 py-16 md:px-10 lg:px-16"
      data-webgl-chapter="3"
    >
      <div className="invitation-sheet mx-auto max-w-6xl p-6 md:p-10">
        <p className="reveal text-xs uppercase tracking-[0.45em] text-clay">
          Wedding day
        </p>
        <h2 className="reveal mt-5 font-serif text-5xl text-ink md:text-7xl">
          The rhythm of the evening
        </h2>
        <div className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
          {wedding.schedule.map((event) => (
            <div
              key={`${event.time}-${event.title}`}
              className="reveal grid gap-5 py-8 md:grid-cols-[0.25fr_0.75fr]"
            >
              <p className="font-serif text-4xl text-gold">{event.time}</p>
              <div>
                <h3 className="text-2xl text-ink">{event.title}</h3>
                <p className="mt-3 max-w-2xl leading-7 text-ink/70">
                  {event.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ wedding }: { wedding: WeddingContent }) {
  return (
    <section
      id="gallery"
      className="scene invitation-page-section relative z-10 px-5 py-16 md:px-10 lg:px-16"
      data-webgl-chapter="4"
    >
      <div className="invitation-sheet mx-auto max-w-7xl p-6 md:p-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="reveal text-xs uppercase tracking-[0.45em] text-clay">
              Gallery
            </p>
            <h2 className="reveal mt-5 font-serif text-5xl text-ink md:text-7xl">
              Light, texture and vows
            </h2>
          </div>
          <p className="reveal max-w-md leading-7 text-ink/70">
            Replace every image from the admin dashboard to turn this into a bespoke
            wedding story without touching code.
          </p>
        </div>
        <div className="grid auto-rows-[18rem] gap-4 md:grid-cols-4">
          {wedding.gallery.map((image, index) => (
            <div
              key={image.src}
              className={`reveal invitation-photo relative overflow-hidden rounded-[1.5rem] ${
                index === 0 || index === 3 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 25vw, 100vw"
                className="object-cover transition duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Travel({ wedding }: { wedding: WeddingContent }) {
  return (
    <section className="scene invitation-page-section relative z-10 px-5 py-16 md:px-10 lg:px-16">
      <div className="invitation-sheet mx-auto max-w-7xl p-6 text-ink md:p-10">
        <p className="reveal text-xs uppercase tracking-[0.45em] text-clay">
          Travel
        </p>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <h2 className="reveal mt-5 font-serif text-5xl leading-none md:text-7xl">
            Everything guests need before arriving
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {wedding.travelNotes.map((note) => (
              <article
                key={note.title}
                className="reveal rounded-[1.5rem] border border-ink/10 bg-white/45 p-6"
              >
                <h3 className="font-serif text-3xl">{note.title}</h3>
                <p className="mt-4 text-sm leading-7 text-ink/70">
                  {note.description}
                </p>
              </article>
            ))}
          </div>
        </div>
        <p className="reveal mt-16 max-w-2xl border-t border-ink/15 pt-8 text-lg leading-8 text-ink/75">
          {wedding.registryNote}
        </p>
      </div>
    </section>
  );
}

function Footer({ wedding }: { wedding: WeddingContent }) {
  return (
    <footer className="relative z-10 px-5 py-12 text-center md:px-10 lg:px-16">
      <div className="invitation-sheet mx-auto max-w-4xl p-8">
        <p className="font-serif text-4xl text-ink">{wedding.coupleName}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.35em] text-clay">
          {wedding.dateLabel} · {wedding.venueLocation}
        </p>
      </div>
    </footer>
  );
}

function getSceneImages(wedding: WeddingContent) {
  return [
    wedding.heroImage,
    wedding.venueImage,
    ...wedding.portraits,
    ...wedding.gallery,
  ].slice(0, 5);
}
