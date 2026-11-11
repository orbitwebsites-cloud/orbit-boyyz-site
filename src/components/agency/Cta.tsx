"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/agencyMotion";
import { site as SITE } from "@/content/siteInfo";
import { BookButton, BookNote } from "./BookButton";

const HEADLINE = ["Let’s", "get", "you"];

/** Closing section: the headline rises letter by letter, then one button. */
export function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 55%" } })
          .from("[data-char]", { yPercent: 120, duration: 1.1, ease: "power4.out", stagger: 0.03 })
          .from("[data-after]", { autoAlpha: 0, y: 24, duration: 0.8, ease: "power3.out", stagger: 0.1 }, "-=0.6");

        gsap.to("[data-orbit]", {
          rotate: 120,
          scale: 1.25,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="book" className="relative overflow-hidden rounded-t-[2.5rem] bg-ink px-6 pb-28 pt-28 text-paper md:px-10 md:pb-36 md:pt-44">
      <div aria-hidden data-orbit className="pointer-events-none absolute left-1/2 top-[38%] size-[130vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper/10">
        <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
        <h2 className="text-[clamp(3rem,11.5vw,10.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
          <span className="sr-only">Let’s get you booked.</span>
          <span aria-hidden className="block overflow-hidden pb-[0.06em]">
            {HEADLINE.map((word) => (
              <span key={word} className="mr-[0.2em] inline-block last:mr-0">
                {[...word].map((c, i) => (
                  <span data-char key={i} className="inline-block">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </span>
          <span aria-hidden className="block overflow-hidden pb-[0.16em] font-serif italic tracking-[-0.03em] text-accent">
            {[..."booked."].map((c, i) => (
              <span data-char key={i} className="inline-block">
                {c}
              </span>
            ))}
          </span>
        </h2>

        <p data-after className="mt-8 max-w-[44ch] text-lg leading-relaxed text-paper/65">
          A free 30-minute call with the people who do the work. You leave with a clear scope, a timeline and a quote.
        </p>
        <div data-after className="mt-9 flex flex-col items-center gap-4">
          <BookButton className="h-16 px-9 text-[1.0625rem]" />
          <BookNote />
        </div>
        <p data-after className="mt-8 text-[15px] text-paper/60">
          Rather talk now?{" "}
          <a href={SITE.phoneHref} className="text-paper underline decoration-1 underline-offset-4">
            Call {SITE.phoneDisplay}
          </a>
        </p>
      </div>
    </section>
  );
}
