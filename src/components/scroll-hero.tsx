"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ScrollHeroMedia =
  | { type: "image"; src: string; sizes?: string }
  | {
      type: "video";
      sources: { src: string; type: string }[];
      poster?: string;
    };

export type ScrollHeroSection = {
  media: ScrollHeroMedia;
  eyebrow: string;
  title: string;
  body: string;
};

export function ScrollHero({ sections }: { sections: ScrollHeroSection[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number(entry.target.getAttribute("data-index"));
          if (!Number.isNaN(index)) setActiveIndex(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const el of sectionRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex && !prefersReducedMotion) {
        video.play().catch(() => {
          // autoplay pode ser bloqueado pelo navegador; a imagem de poster cobre esse caso
        });
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10">
        {sections.map((section, index) => (
          <div
            key={
              section.media.type === "image"
                ? section.media.src
                : section.media.sources[0].src
            }
            className="absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none"
            style={{ opacity: index === activeIndex ? 1 : 0 }}
            aria-hidden="true"
          >
            {section.media.type === "image" ? (
              <Image
                src={section.media.src}
                alt=""
                fill
                sizes={section.media.sizes ?? "100vw"}
                preload={index === 0}
                className="object-cover"
              />
            ) : (
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="h-full w-full object-cover"
                poster={section.media.poster}
                muted
                loop
                playsInline
                preload={index === 0 ? "auto" : "none"}
              >
                {section.media.sources.map((source) => (
                  <source key={source.src} src={source.src} type={source.type} />
                ))}
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
          </div>
        ))}
      </div>

      {sections.map((section, index) => (
        <section
          key={section.title}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          data-index={index}
          className="flex min-h-screen w-full items-center px-6 py-24 sm:px-12"
        >
          <div className="mx-auto max-w-2xl text-white">
            <p className="text-sm font-semibold tracking-widest uppercase text-white/80">
              {section.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
              {section.title}
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/90">
              {section.body}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
