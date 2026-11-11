"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/agencyMotion";
import { BookButton } from "./BookButton";

const MIN_LEADS = 10_000;
const DOTS = 200; // each dot stands for 50 leads
const format = (n: number) => Math.round(n).toLocaleString("en-US");

const TERMS = [
  ["$0.20", "per lead"],
  ["10,000+", "new leads every month, minimum plan"],
  ["$2,000", "a month to start (10,000 × $0.20)"],
];

/**
 * Pinned scene for the cold lead generation offer: a month's minimum order
 * fills in dot by dot while the counter runs up to 10,000.
 */
export function LeadsScene() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const counter = root.current!.querySelector<HTMLElement>("[data-count]")!;
        const count = { v: 0 };
        counter.textContent = "0";

        gsap
          .timeline({ scrollTrigger: { trigger: "[data-pin]", start: "top top", end: "+=240%", pin: true, scrub: 0.5 } })
          .to(count, { v: MIN_LEADS, duration: 2, ease: "power1.inOut", onUpdate: () => (counter.textContent = format(count.v)) }, 0)
          .fromTo(
            "[data-dot]",
            { opacity: 0.14, scale: 0.6 },
            { opacity: 1, scale: 1, backgroundColor: "#f2440f", duration: 0.08, ease: "none", stagger: { each: 2 / DOTS } },
            0,
          )
          .from("[data-plus]", { autoAlpha: 0, scale: 0, duration: 0.2, ease: "back.out(3)" }, 2)
          .from("[data-term]", { autoAlpha: 0, y: 30, duration: 0.4, stagger: 0.18, ease: "power3.out" }, 2.05)
          .to({}, { duration: 0.6 });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} id="leads" className="bg-paper">
      <section className="rounded-t-[2.5rem] bg-ink text-paper">
        <div data-pin className="flex h-svh flex-col overflow-hidden px-6 pb-24 pt-24 motion-reduce:h-auto md:px-10 md:pb-10">
          <p className="alabel text-accent">Offer 02 · Cold lead generation · for teams doing cold outreach</p>

          <div className="mx-auto grid w-full max-w-6xl flex-1 content-center gap-x-16 gap-y-7 md:grid-cols-[1.1fr_1fr] md:items-center">
            <div>
              <h2 className="max-w-[15ch] text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.06] tracking-[-0.035em]">
                Never run out of <em className="font-serif tracking-[-0.01em] text-accent">people to contact.</em>
              </h2>
              <p className="mt-5 text-[clamp(3.6rem,min(13vw,19svh),10rem)] font-medium leading-[0.9] tracking-[-0.06em] tabular-nums">
                <span data-count>{format(MIN_LEADS)}</span>
                <span data-plus className="inline-block text-accent">
                  +
                </span>
              </p>
              <p className="alabel mt-3 opacity-70">new leads delivered every month</p>
            </div>

            <div>
              <div aria-hidden className="grid grid-cols-[repeat(25,minmax(0,1fr))] gap-[4px] md:grid-cols-[repeat(20,minmax(0,1fr))] md:gap-2">
                {Array.from({ length: DOTS }, (_, i) => (
                  <span data-dot key={i} className="aspect-square rounded-full bg-paper" />
                ))}
              </div>
              <p className="alabel mt-3 text-[9px] opacity-70">1 dot = 50 leads</p>

              <dl className="mt-6 space-y-3 border-t border-paper/15 pt-5 md:mt-8">
                {TERMS.map(([value, label]) => (
                  <div data-term key={label} className="flex items-baseline gap-4">
                    <dt className="w-[4.4em] shrink-0 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] italic leading-none text-accent">{value}</dt>
                    <dd className="text-[15px] text-paper/70">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 pb-28 sm:flex-row sm:items-center sm:gap-6 md:px-10">
          <BookButton label="Book a call about leads" />
          <p className="text-[15px] text-paper/60">Tell us who you sell to. We build the list around that.</p>
        </div>
      </section>
    </div>
  );
}
