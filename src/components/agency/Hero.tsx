"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/agencyMotion";
import { BookButton, BookNote } from "./BookButton";

const THEMES = {
  dark: { section: "bg-ink text-paper", ring: ["border-paper/20", "border-paper/15", "border-paper/10"], dot: "bg-paper", flood: "bg-paper" },
  light: { section: "bg-paper text-ink", ring: ["border-ink/15", "border-ink/10", "border-ink/[0.06]"], dot: "bg-ink", flood: "bg-ink" },
} as const;

type HeroProps = {
  theme: keyof typeof THEMES;
  label: string;
  /** Plain lines of the statement, followed by the accented last line. */
  lines: string[];
  accent: string;
};

const PLANET_R = 22; // resting radius in px (matches the size-11 dot)

/**
 * One small statement, one button. The orbit lives in whatever space is left
 * under the copy, so the planet can never sit on top of the button. Scrolling
 * makes the planet swallow the screen, which hands off to the next section.
 */
export function Hero({ theme, label, lines, accent }: HeroProps) {
  const t = THEMES[theme];
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current!;
        const portal = section.querySelector<HTMLElement>("[data-portal]")!;
        const anchor = section.querySelector<HTMLElement>("[data-anchor]")!;

        // Planet centre, measured from the section's top-left corner.
        const centre = () => {
          const s = section.getBoundingClientRect();
          const a = anchor.getBoundingClientRect();
          return { x: a.left - s.left + a.width / 2, y: a.top - s.top + a.height / 2, w: s.width, h: s.height };
        };
        const state = { r: PLANET_R };
        const draw = () => {
          const c = centre();
          portal.style.clipPath = `circle(${state.r}px at ${c.x}px ${c.y}px)`;
        };
        const cover = () => {
          const c = centre();
          return Math.hypot(Math.max(c.x, c.w - c.x), Math.max(c.y, c.h - c.y)) + 8;
        };

        // Intro: lines rise out of their masks, then the orbit draws in.
        gsap.set("[data-intro]", { visibility: "visible" });
        gsap
          .timeline({ defaults: { ease: "power4.out" }, delay: document.documentElement.classList.contains("is-preloading") ? 1.1 : 0 })
          .from("[data-line] > span", { yPercent: 115, duration: 1.2, stagger: 0.09 }, 0.15)
          .from("[data-fade]", { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.08 }, 0.75)
          .from("[data-ring]", { scale: 0.6, autoAlpha: 0, duration: 1.6, stagger: 0.12 }, 0.3)
          .from("[data-planet]", { scale: 0, duration: 1, ease: "back.out(2)" }, 0.6);

        // Scroll: the planet grows until it covers the whole screen.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=110%",
              pin: true,
              scrub: 0.4,
              invalidateOnRefresh: true,
              onLeaveBack: () => (portal.style.clipPath = "circle(0px at 50% 50%)"),
            },
          })
          .to("[data-copy]", { autoAlpha: 0, y: -60, duration: 0.35, ease: "power1.in" }, 0)
          .to("[data-rings]", { scale: 2.4, autoAlpha: 0, duration: 0.6, ease: "power1.in" }, 0)
          .fromTo(state, { r: PLANET_R }, { r: cover, duration: 1, ease: "power2.in", onUpdate: draw }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className={`relative flex h-svh flex-col overflow-hidden ${t.section}`}>
      {/* Copy */}
      <div data-copy className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-[clamp(4.75rem,17svh,11rem)] text-center">
        <p data-intro data-fade className="alabel mb-[clamp(0.75rem,3svh,1.75rem)] opacity-70">
          {label}
        </p>
        <h1 data-intro className="max-w-[17ch] text-[clamp(2.1rem,min(5vw,8.6svh),4.25rem)] font-medium leading-[1.04] tracking-[-0.035em]">
          {lines.map((line) => (
            <span key={line} data-line className="block overflow-hidden pb-[0.08em]">
              <span className="block">{line}</span>
            </span>
          ))}
          <span data-line className="block overflow-hidden pb-[0.14em]">
            <span className="block font-serif text-[1.12em] italic tracking-[-0.02em] text-accent">{accent}</span>
          </span>
        </h1>
        <div data-intro data-fade className="mt-[clamp(1rem,4svh,2.25rem)] flex flex-col items-center gap-4">
          <BookButton variant={theme === "dark" ? "accent" : "ink"} />
          <BookNote />
        </div>
      </div>

      {/* Orbit system, centred in the space left under the copy */}
      <div data-anchor aria-hidden className="pointer-events-none relative min-h-28 flex-1">
        <div data-rings className="absolute left-1/2 top-1/2 size-0">
          <div data-ring className={`absolute -left-[19vmin] -top-[19vmin] size-[38vmin] animate-orbit rounded-full border ${t.ring[0]}`}>
            <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
          </div>
          <div data-ring className={`absolute -left-[36vmin] -top-[36vmin] size-[72vmin] animate-orbit-slow rounded-full border ${t.ring[1]}`}>
            <span className={`absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${t.dot}`} />
          </div>
          <div data-ring className={`absolute -left-[60vmin] -top-[60vmin] size-[120vmin] rounded-full border ${t.ring[2]}`} />
        </div>
        <span data-planet className={`absolute left-1/2 top-1/2 -ml-[22px] -mt-[22px] block size-11 rounded-full ${t.dot}`} />
      </div>

      <p data-intro data-fade className="alabel relative z-10 pb-24 text-center opacity-70 md:pb-7">
        Scroll
      </p>

      {/* Grows out of the planet on scroll until it covers the screen. */}
      <div
        aria-hidden
        data-portal
        className={`pointer-events-none absolute inset-0 z-20 ${t.flood}`}
        style={{ clipPath: "circle(0px at 50% 50%)" }}
      />
    </section>
  );
}
