"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/agencyMotion";

const VANITY = ["Impressions", "Reach", "Clicks", "CTR", "Engagement", "Leads"];

/**
 * Pinned scene: the numbers most marketing reports are made of get crossed
 * out one by one, leaving the only one a contractor can bank.
 */
export function MetricsScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-metric]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-pin]", start: "top top", end: "+=260%", pin: true, scrub: 0.5 },
        });

        tl.from(rows, { yPercent: 60, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" });
        rows.forEach((row) => {
          tl.fromTo(row.querySelector("[data-strike]"), { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "power2.inOut" }, ">-0.05")
            .to(row.querySelector("[data-word]"), { opacity: 0.22, duration: 0.3 }, "<0.1");
        });
        tl.to("[data-list]", { scale: 0.86, autoAlpha: 0, filter: "blur(10px)", duration: 0.6, ease: "power2.in" }, "+=0.15")
          .fromTo(
            "[data-answer]",
            { autoAlpha: 0, scale: 0.55, yPercent: 20 },
            { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.9, ease: "power3.out" },
            "-=0.25",
          )
          .from("[data-answer-sub]", { autoAlpha: 0, y: 20, duration: 0.4 }, "-=0.3")
          .to({}, { duration: 0.7 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="rounded-t-[2.5rem] bg-ink text-paper">
      <div data-pin className="relative flex h-svh flex-col justify-center overflow-hidden px-6 pb-16 motion-reduce:h-auto motion-reduce:gap-16 motion-reduce:py-28 md:px-10 md:pb-0">
        <p className="alabel absolute left-6 top-24 text-accent md:left-10">What most marketing reports show you</p>

        <ul data-list className="mx-auto w-full max-w-6xl text-[clamp(2rem,min(7.4vw,10svh),5.6rem)] font-medium leading-[1.08] tracking-[-0.045em]">
          {VANITY.map((word) => (
            <li key={word} data-metric>
              <span className="relative inline-block">
                <span data-word>{word}</span>
                <span data-strike aria-hidden className="absolute -inset-x-2 top-[54%] h-[0.07em] origin-left bg-accent motion-reduce:hidden" />
              </span>
            </li>
          ))}
        </ul>

        <div data-answer className="inset-0 flex flex-col items-center justify-center px-6 text-center motion-reduce:static absolute">
          <p className="alabel mb-5 opacity-70">What we report</p>
          <p className="font-serif text-[clamp(3.2rem,12vw,11rem)] italic leading-[0.9] tracking-[-0.03em] text-accent">
            Booked
            <br />
            estimates.
          </p>
          <p data-answer-sub className="mt-7 max-w-[34ch] text-lg leading-relaxed text-paper/65">
            It is the number we get paid on, so it is the only one we chase.
          </p>
        </div>
      </div>
    </section>
  );
}
