"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/agencyMotion";

const PROJECTS = [
  { src: "/work/agency-bella.jpg", name: "Bella Design Landscapes", kind: "Concept · Landscaping", url: "bella-design-landscapes.vercel.app" },
  { src: "/work/agency-weichert.jpg", name: "Weichert Princeton Pages", kind: "Concept · Real estate", url: "weichert-princeton-pages.vercel.app" },
  { src: "/work/agency-realestate.jpg", name: "Real Estate Website", kind: "Concept · Property services", url: "real-estate1-tau.vercel.app" },
];

/** Pinned scene: vertical scroll drives the gallery sideways. */
export function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        // Each screenshot drifts inside its frame as the card crosses the screen.
        gsap.utils.toArray<HTMLElement>("[data-shot]").forEach((shot) => {
          gsap.fromTo(
            shot,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: shot.parentElement, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="flex h-svh flex-col justify-center overflow-hidden bg-paper text-ink motion-reduce:h-auto motion-reduce:overflow-x-auto motion-reduce:py-20">
      <div data-track className="flex w-max items-center gap-[4vw] px-6 md:px-10">
        <div className="w-[78vw] shrink-0 md:w-[34vw]">
          <p className="alabel text-accent">Selected work</p>
          <h2 className="mt-3 text-[clamp(2.2rem,5vw,4.5rem)] font-medium leading-[1] tracking-[-0.04em]">
            Real sites.
            <br />
            <em className="font-serif tracking-[-0.02em]">Live right now.</em>
          </h2>
          <p className="mt-5 max-w-[32ch] text-[15px] leading-relaxed text-ink/60">
            Concept sites we designed for local businesses. All three are live.
          </p>
        </div>

        {PROJECTS.map((p, i) => (
          <figure key={p.name} className="w-[70vw] shrink-0 md:w-[56vw]">
            <div className="relative aspect-[39/56] overflow-hidden rounded-2xl bg-ink/5 shadow-[0_0_0_1px_rgba(14,14,14,0.08)] md:aspect-[16/10]">
              <Image
                data-shot
                src={p.src}
                alt={`Homepage of ${p.name}`}
                width={1440}
                height={900}
                sizes="60vw"
                className="hidden h-full w-[112%] max-w-none -translate-x-[5%] object-cover object-top md:block"
              />
              <Image
                data-shot
                src={p.src.replace(".jpg", "-m.jpg")}
                alt={`Homepage of ${p.name} on a phone`}
                width={780}
                height={1120}
                sizes="80vw"
                className="h-full w-[112%] max-w-none -translate-x-[5%] object-cover object-top md:hidden"
              />
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-xl font-medium tracking-tight md:text-2xl">
                <span className="alabel mr-3 align-middle opacity-70">0{i + 1}</span>
                {p.name}
              </span>
              <span className="alabel hidden opacity-70 sm:block">{p.kind}</span>
            </figcaption>
          </figure>
        ))}
        <div aria-hidden className="w-[2vw] shrink-0" />
      </div>
    </section>
  );
}
