"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/agencyMotion";

const SCORES = [
  ["95+", 95, "Performance"],
  ["100", 100, "Accessibility"],
  ["100", 100, "Best practices"],
  ["100", 100, "SEO"],
] as const;

/**
 * The same small contractor homepage drawn twice: as a grey wireframe and as
 * the finished design. The scene wipes from one to the other.
 */
function MiniSite({ wire = false }: { wire?: boolean }) {
  const box = "rounded-md bg-ink/10";
  return (
    <div className={`absolute inset-0 flex flex-col ${wire ? "bg-[#e9e7e2]" : "bg-[#fbfaf7]"} p-[4%] text-[#14231c]`}>
      <div className="flex items-center justify-between">
        {wire ? <span className={`${box} h-[1.1em] w-[18%]`} /> : <span className="text-[1.05em] font-semibold tracking-tight">Dan&apos;s Kitchens</span>}
        <div className="flex items-center gap-[1.2em]">
          {["Kitchens", "Our work", "Reviews"].map((l) =>
            wire ? <span key={l} className={`${box} hidden h-[0.7em] w-[4em] sm:block`} /> : <span key={l} className="hidden text-[0.72em] opacity-70 sm:block">{l}</span>,
          )}
          {wire ? (
            <span className={`${box} h-[2.2em] w-[7.5em] rounded-full`} />
          ) : (
            <span className="rounded-full bg-[#14231c] px-[1.1em] py-[0.6em] text-[0.72em] font-medium text-white">(609) 555-0142</span>
          )}
        </div>
      </div>

      <div className="mt-[4%] grid flex-1 grid-cols-[1.15fr_1fr] gap-[4%]">
        <div className="flex flex-col justify-center">
          {wire ? (
            <>
              <span className={`${box} h-[1.9em] w-[92%]`} />
              <span className={`${box} mt-[0.6em] h-[1.9em] w-[70%]`} />
              <span className={`${box} mt-[1.4em] h-[0.7em] w-[80%]`} />
              <span className={`${box} mt-[0.5em] h-[0.7em] w-[62%]`} />
              <div className="mt-[1.6em] flex gap-[0.7em]">
                <span className={`${box} h-[2.6em] w-[10em] rounded-full`} />
                <span className={`${box} h-[2.6em] w-[7em] rounded-full`} />
              </div>
            </>
          ) : (
            <>
              <p className="text-[2.05em] font-semibold leading-[1.02] tracking-[-0.035em]">
                Kitchen remodels in Princeton, done on schedule.
              </p>
              <p className="mt-[0.9em] max-w-[30ch] text-[0.8em] leading-snug opacity-65">
                Free in-home estimate. Family-run since 2009. Licensed and insured in New Jersey.
              </p>
              <div className="mt-[1.3em] flex gap-[0.7em] text-[0.76em] font-medium">
                <span className="rounded-full bg-[#e8552a] px-[1.3em] py-[0.8em] text-white">Get a free estimate</span>
                <span className="rounded-full px-[1.3em] py-[0.8em] shadow-[inset_0_0_0_1px_#14231c]">Call now</span>
              </div>
            </>
          )}
        </div>
        <div className={`relative overflow-hidden rounded-[0.9em] ${wire ? "bg-ink/10" : "bg-gradient-to-br from-[#1f3a2e] to-[#3d5a47]"}`}>
          {!wire && (
            <>
              <div className="absolute inset-x-[8%] bottom-0 h-[40%] rounded-t-[0.4em] bg-[#e7dcc8]" />
              <div className="absolute inset-x-[4%] bottom-[40%] h-[3.5%] rounded-sm bg-[#faf5ea]" />
              <div className="absolute left-[8%] top-[10%] h-[26%] w-[36%] rounded-[0.4em] bg-[#e7dcc8]/85" />
              <div className="absolute right-[8%] top-[10%] h-[26%] w-[36%] rounded-[0.4em] bg-[#e7dcc8]/85" />
              <span className="absolute bottom-[6%] left-[6%] rounded-full bg-white px-[0.9em] py-[0.4em] text-[0.62em] font-medium">★ 4.9 · 212 reviews</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-[4%] grid grid-cols-3 gap-[2.5%]">
        {["Full remodels", "Cabinets & counters", "Design help"].map((t) =>
          wire ? (
            <span key={t} className={`${box} h-[3.2em]`} />
          ) : (
            <span key={t} className="flex h-[3.2em] items-center rounded-[0.7em] bg-white px-[1em] text-[0.74em] font-medium shadow-[0_1px_0_rgba(20,35,28,0.08)]">
              {t}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

/** Pinned scene: a wireframe becomes a finished site while day 1 ticks to day 7. */
export function WebsiteScene({ label, lead, em }: { label: string; lead: string; em: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const day = root.current!.querySelector<HTMLElement>("[data-day]")!;
        const scores = gsap.utils.toArray<HTMLElement>("[data-score]");
        const count = { day: 1 };
        day.textContent = "1";

        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-pin]", start: "top top", end: "+=260%", pin: true, scrub: 0.5 },
        });

        tl.from("[data-browser]", { scale: 0.82, yPercent: 14, rotateX: 14, duration: 0.6, ease: "power2.out" })
          .fromTo("[data-finished]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 2, ease: "none" }, "wipe")
          .fromTo("[data-scan]", { left: "0%" }, { left: "100%", duration: 2, ease: "none" }, "wipe")
          .to(count, { day: 7, duration: 2, ease: "none", onUpdate: () => (day.textContent = String(Math.round(count.day))) }, "wipe")
          .to("[data-scan]", { autoAlpha: 0, duration: 0.15 })
          .from("[data-scorecell]", { autoAlpha: 0, y: 24, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "<");

        scores.forEach((el, i) => {
          const target = Number(el.dataset.score);
          const final = el.textContent;
          const n = { v: 0 };
          tl.to(
            n,
            {
              v: target,
              duration: 0.6,
              ease: "power1.out",
              onUpdate: () => (el.textContent = n.v >= target ? final : String(Math.round(n.v))),
            },
            `<+${i === 0 ? 0 : 0.1}`,
          );
        });
        tl.to({}, { duration: 0.5 });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} id="websites" className="bg-ink">
      <section className="rounded-t-[2.5rem] bg-paper text-ink">
        <div data-pin className="flex h-svh flex-col overflow-hidden px-6 pb-20 pt-24 motion-reduce:h-auto md:px-10 md:pb-8">
          <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-6">
            <div>
              <p className="alabel text-accent">{label}</p>
              <h2 className="mt-3 max-w-[22ch] text-[clamp(1.7rem,3.6vw,3.1rem)] font-medium leading-[1.05] tracking-[-0.035em]">
                {lead} <em className="font-serif tracking-[-0.01em]">{em}</em>
              </h2>
            </div>
            <p className="shrink-0 text-right">
              <span className="alabel block opacity-70">7-day build</span>
              <span className="mt-1 block text-[clamp(1.7rem,3.6vw,3.1rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
                Day <span data-day>7</span>
                <span className="opacity-30">/7</span>
              </span>
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 items-center justify-center py-5 [container-type:size] [perspective:1400px]">
            <div
              data-browser
              className="flex aspect-[16/10.4] w-[min(100cqw,calc(100cqh*1.538),860px)] flex-col [container-type:inline-size] overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(14,14,14,0.1),0_50px_100px_-30px_rgba(14,14,14,0.35)]"
            >
              <div className="flex items-center gap-1.5 border-b border-ink/10 px-3.5 py-2.5">
                <i className="size-2 rounded-full bg-ink/15" />
                <i className="size-2 rounded-full bg-ink/15" />
                <i className="size-2 rounded-full bg-ink/15" />
                <span className="mx-auto rounded-full bg-ink/5 px-4 py-0.5 text-[10.5px] text-ink/60">danskitchens.com · example</span>
              </div>
              <div className="relative flex-1 text-[1.75cqw]">
                <MiniSite wire />
                <div data-finished className="absolute inset-0">
                  <MiniSite />
                </div>
                <span data-scan aria-hidden className="absolute inset-y-0 left-full w-px bg-accent shadow-[0_0_24px_4px_rgba(255,79,24,0.55)] motion-reduce:hidden" />
              </div>
            </div>
          </div>

          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-3 gap-y-4 border-t sm:grid-cols-4 border-ink/10 pt-4">
            {SCORES.map(([label, target, name]) => (
              <div data-scorecell key={name}>
                <p data-score={target} className="text-[clamp(1.3rem,2.6vw,2.2rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
                  {label}
                </p>
                <p className="alabel mt-1.5 text-[9px] opacity-70 sm:text-[11px]">{name}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-2 w-full max-w-6xl text-[11px] text-ink/60">Google Lighthouse (mobile) targets for every build.</p>
        </div>
      </section>
    </div>
  );
}
