"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/agencyMotion";
import { BookButton } from "./BookButton";

const STEPS = [
  {
    title: "They tap your ad.",
    body: "It opens a page we built to do one thing: get the request. The form asks permission to text them.",
  },
  {
    title: "We text them right away.",
    body: "While the phone is still in their hand, they hear back from your business, by name.",
  },
  {
    title: "We ask what you would ask.",
    body: "Homeowner? What kind of job? How soon? Tire-kickers get filtered out before they cost you a drive.",
  },
  {
    title: "The estimate lands on your calendar.",
    body: "They pick a time. You show up and sell the job. That is the only part you do.",
  },
];

const THREAD: { from: "us" | "them"; text: string }[] = [
  { from: "us", text: "Hi Maria, it's Dan's Kitchens. Got your request. Full remodel, or cabinets and counters only?" },
  { from: "them", text: "Full remodel. Kitchen's about 12x14" },
  { from: "us", text: "Perfect. Do you own the home, and are you hoping to start in the next 3 months?" },
  { from: "them", text: "Yes and yes" },
  { from: "us", text: "Dan can come measure Thu 4:30 or Sat 10:00. Which works?" },
  { from: "them", text: "Thursday 👍" },
];

const FACTS = [
  ["Your ad account", "Ads run in your own account and you pay Meta directly. We never hold your ad budget."],
  ["Permission first", "Every lead ticks a box agreeing to texts before we send one."],
  ["Pay per booking", "You pay for each estimate we book. Once that costs more than a flat fee would, we switch you to a monthly retainer."],
];

/** Pinned scene: scroll scrubs one lead from ad tap to booked estimate. */
export function BookedScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: "(min-width: 768px)" }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        const dim = ctx.conditions.desktop ? 0.3 : 0;
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const bubbles = gsap.utils.toArray<HTMLElement>("[data-bubble]");
        const bubbleIn = { autoAlpha: 0, y: 26, scale: 0.94, duration: 0.5, ease: "back.out(1.6)" };

        gsap.set(steps.slice(1), { autoAlpha: dim });
        gsap.set("[data-bar]", { scaleY: 0.25 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: "[data-pin]", start: "top top", end: "+=420%", pin: true, scrub: 0.5, invalidateOnRefresh: true },
        });

        // The thread is taller than a small phone screen, so it scrolls up just
        // enough to keep the newest message (and later the booked card) in view.
        const thread = root.current!.querySelector<HTMLElement>("[data-thread]")!;
        const card = root.current!.querySelector<HTMLElement>("[data-booked]")!;
        const shiftFor = (el: HTMLElement, extra = 0) => () =>
          -Math.max(0, el.offsetTop + el.offsetHeight + 12 + extra - thread.parentElement!.clientHeight);
        const follow = { duration: 0.4, ease: "power2.inOut" };
        const goTo = (i: number) => {
          tl.addLabel(`step${i}`)
            .to(steps[i - 1], { autoAlpha: dim, duration: 0.3 }, `step${i}`)
            .to(steps[i], { autoAlpha: 1, duration: 0.3 }, `step${i}`)
            .to("[data-bar]", { scaleY: (i + 1) / STEPS.length, duration: 0.3 }, `step${i}`);
        };

        // 1. The lead form fills itself in and gets sent.
        tl.from("[data-phone]", { yPercent: 12, autoAlpha: 0, duration: 0.5 })
          .from("[data-field]", { clipPath: "inset(0 100% 0 0)", duration: 0.5, stagger: 0.45, ease: "none" })
          .from("[data-check]", { scale: 0, duration: 0.25, ease: "back.out(3)" })
          .to("[data-send]", { scale: 0.94, duration: 0.12 })
          .to("[data-send]", { scale: 1, duration: 0.12 });

        // 2. First text goes out.
        goTo(1);
        tl.to("[data-ad]", { yPercent: -102, duration: 0.7, ease: "power3.inOut" }, "step1")
          .from(bubbles[0], bubbleIn)
          .from(bubbles[1], bubbleIn, "+=0.15");

        // 3. Qualifying.
        goTo(2);
        tl.to(thread, { y: shiftFor(bubbles[3], 30), ...follow }, "step2")
          .from(bubbles[2], bubbleIn, "step2+=0.2")
          .from(bubbles[3], bubbleIn, "+=0.15")
          .from("[data-chip]", { autoAlpha: 0, scale: 0.7, duration: 0.35, stagger: 0.12, ease: "back.out(2)" });

        // 4. Booked.
        goTo(3);
        tl.to(thread, { y: shiftFor(bubbles[5]), ...follow }, "step3")
          .from(bubbles[4], bubbleIn, "step3+=0.2")
          .from(bubbles[5], bubbleIn, "+=0.15")
          .to(thread, { y: shiftFor(bubbles[5], card.offsetHeight + 12), duration: 0.6, ease: "power3.inOut" }, "+=0.1")
          .from("[data-booked]", { yPercent: 130, duration: 0.6, ease: "power3.out" }, "<")
          .from("[data-booked-tick]", { scale: 0, rotate: -90, duration: 0.4, ease: "back.out(2.5)" }, "-=0.2")
          .to({}, { duration: 0.9 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="estimates" className="bg-ink text-paper">
      <div data-pin className="relative flex h-svh flex-col overflow-hidden px-6 pb-20 pt-24 motion-reduce:h-auto md:px-10 md:pb-10">
        <p className="alabel text-accent">Offer 01 · Ads management · one lead, start to finish</p>

        <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-6 md:grid-cols-2 md:gap-16">
          {/* Steps */}
          <div className="flex gap-6">
            <div aria-hidden className="relative hidden w-px bg-paper/15 md:block">
              <span data-bar className="absolute inset-0 origin-top bg-accent" />
            </div>
            <ol className="relative h-[8.5rem] flex-1 motion-reduce:h-auto motion-reduce:space-y-6 md:h-auto md:space-y-9">
              {STEPS.map((s, i) => (
                <li key={s.title} data-step className="absolute inset-0 motion-reduce:static md:static">
                  <span className="alabel opacity-70">0{i + 1}</span>
                  <h3 className="mt-1.5 text-[clamp(1.35rem,2.4vw,2.1rem)] font-medium leading-tight tracking-[-0.03em]">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-paper/60">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Phone */}
          <div className="flex justify-center">
            <div
              data-phone
              className="relative aspect-[9/18.5] h-[min(600px,56svh)] rounded-[2.6rem] bg-[#1c1c1c] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_40px_120px_-20px_rgba(255,79,24,0.25)] md:h-[min(620px,72svh)]"
            >
              <div className="relative h-full overflow-hidden rounded-[2.1rem] bg-paper text-[12.5px] leading-snug text-ink">
                {/* Messages */}
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex items-center gap-2.5 border-b border-ink/10 px-4 pb-2.5 pt-4">
                    <span className="grid size-8 place-items-center rounded-full bg-ink text-[11px] font-medium text-paper">DK</span>
                    <div>
                      <p className="text-[13px] font-medium">Dan&apos;s Kitchens</p>
                      <p className="text-[10.5px] text-ink/60">Text message · example</p>
                    </div>
                  </div>
                  <div className="relative flex-1 overflow-hidden motion-reduce:overflow-visible">
                  <div data-thread className="absolute inset-x-0 top-0 flex flex-col gap-1.5 p-3 motion-reduce:static">
                    {THREAD.map((m, i) => (
                      <div key={i} className="contents">
                        <p
                          data-bubble
                          className={
                            m.from === "us"
                              ? "max-w-[82%] self-start rounded-2xl rounded-bl-md bg-ink/[0.07] px-3 py-2"
                              : "max-w-[82%] self-end rounded-2xl rounded-br-md bg-ink px-3 py-2 text-paper"
                          }
                        >
                          {m.text}
                        </p>
                        {i === 3 && (
                          <div className="flex flex-wrap justify-center gap-1 py-1">
                            {["Homeowner", "Full remodel", "3 months"].map((c) => (
                              <span data-chip key={c} className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-[#b4310a]">
                                ✓ {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  </div>
                </div>

                {/* Booked card */}
                <div data-booked className="absolute inset-x-2 bottom-2 rounded-[1.6rem] bg-accent p-4 motion-reduce:static motion-reduce:m-2">
                  <div className="flex items-center justify-between">
                    <p className="alabel">Estimate booked</p>
                    <span data-booked-tick className="grid size-6 place-items-center rounded-full bg-ink text-[11px] text-accent">✓</span>
                  </div>
                  <p className="mt-2 text-[22px] font-medium leading-none tracking-[-0.03em]">Thu · 4:30 PM</p>
                  <p className="mt-1.5 text-[11.5px] text-ink/70">Maria R. · Kitchen, full remodel · Princeton</p>
                </div>

                {/* Ad + lead form (slides away) */}
                <div data-ad className="absolute inset-0 flex flex-col bg-white motion-reduce:hidden">
                  <div className="flex items-center gap-2 px-4 pb-2 pt-4">
                    <span className="grid size-7 place-items-center rounded-full bg-ink text-[10px] text-paper">DK</span>
                    <div>
                      <p className="text-[12px] font-medium">Dan&apos;s Kitchens</p>
                      <p className="text-[10px] text-ink/60">Sponsored</p>
                    </div>
                  </div>
                  <div className="relative mx-3 flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-[#2b2a27] to-[#5b4a3a]">
                    <div className="absolute inset-x-5 bottom-0 h-[38%] rounded-t-md bg-[#d9c7ae]" />
                    <div className="absolute inset-x-3 bottom-[38%] h-2 rounded-sm bg-[#f3ece0]" />
                    <div className="absolute left-5 top-4 h-[26%] w-[34%] rounded-md bg-[#d9c7ae]/80" />
                    <div className="absolute right-5 top-4 h-[26%] w-[34%] rounded-md bg-[#d9c7ae]/80" />
                    <p className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium">Kitchen remodels · Princeton</p>
                  </div>
                  <div className="space-y-1.5 p-3">
                    <p className="text-[14px] font-medium tracking-tight">Get a free kitchen estimate</p>
                    <div className="rounded-lg border border-ink/15 px-3 py-2">
                      <span data-field className="block">Maria Rossi</span>
                    </div>
                    <div className="rounded-lg border border-ink/15 px-3 py-2">
                      <span data-field className="block">(609) 555-0142</span>
                    </div>
                    <p className="flex items-center gap-1.5 py-0.5 text-[10px] text-ink/60">
                      <span className="grid size-3.5 place-items-center rounded-[4px] border border-ink/30">
                        <span data-check className="block size-2 rounded-[2px] bg-accent" />
                      </span>
                      OK to text me about my estimate
                    </p>
                    <div data-send className="rounded-lg bg-ink py-2.5 text-center text-[12.5px] font-medium text-paper">
                      Request my estimate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The terms, plainly */}
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-10 md:px-10 md:pt-24">
        <div className="grid gap-10 border-t border-paper/15 pt-10 md:grid-cols-3">
          {FACTS.map(([title, body]) => (
            <div key={title} data-reveal>
              <h4 className="text-lg font-medium tracking-tight">{title}</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-paper/60">{body}</p>
            </div>
          ))}
        </div>
        <div data-reveal className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <BookButton label="Book a call about your ads" />
          <p className="text-[15px] text-paper/60">Kitchens, baths, basements, windows. Central New Jersey.</p>
        </div>
      </div>
    </section>
  );
}
