"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/agencyMotion";

export type ManifestoParagraph = { text: string; accent?: string[] };

/** Words light up one by one as the reader scrolls through them. */
export function Manifesto({ paragraphs, theme }: { paragraphs: ManifestoParagraph[]; theme: "dark" | "light" }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-w]",
          { opacity: 0.13 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: root.current, start: "top 62%", end: "bottom 78%", scrub: 0.3 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={`px-6 pb-[22svh] pt-[16svh] md:px-10 ${theme === "dark" ? "bg-ink text-paper" : "bg-paper text-ink"}`}>
      <div className="mx-auto max-w-5xl space-y-[1.1em] text-[clamp(1.7rem,4.3vw,3.6rem)] font-medium leading-[1.12] tracking-[-0.03em]">
        {paragraphs.map((p) => (
          <p key={p.text}>
            {p.text.split(" ").map((word, i) => (
              <span key={i}>
                <span
                  data-w
                  className={p.accent?.includes(word) ? "font-serif italic tracking-[-0.01em] text-accent" : undefined}
                >
                  {word}
                </span>{" "}
              </span>
            ))}
          </p>
        ))}
      </div>
    </section>
  );
}
