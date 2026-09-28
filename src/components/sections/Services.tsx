'use client'

import { useRef } from 'react'
import { services, site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { gsap } from '@/lib/motion/gsap'
import { DUR, EASE, MQ, STAGGER } from '@/lib/motion/tokens'
import { useIsoLayoutEffect } from '@/lib/motion/useIsoLayoutEffect'

/**
 * [02 // SERVICES] Services as orbits. Desktop: the section pins and the track
 * scrolls horizontally (scrubbed); each card swings in off its orbit path
 * (scale + rotate + lift) and its icon draws itself. A gold orbit line and a
 * progress bar track the journey. Mobile / reduced motion: a plain grid.
 */
export function Services() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)

  useIsoLayoutEffect(() => {
    const el = section.current
    const tr = track.current
    if (!el || !tr) return
    const mm = gsap.matchMedia()

    mm.add(MQ.desktop, () => {
      el.classList.add('is-h')
      const distance = () => Math.max(0, tr.scrollWidth - window.innerWidth)
      const cards = gsap.utils.toArray<HTMLElement>('.svc-card', tr)

      const h = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1)
            if (counter.current) counter.current.textContent = `0${i}`
          },
        },
      })

      gsap.fromTo('[data-svc-progress]', { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: 0.8, invalidateOnRefresh: true },
      })
      gsap.fromTo('[data-svc-orbit]', { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: 0.8, invalidateOnRefresh: true },
      })

      cards.forEach((card, i) => {
        gsap
          .timeline({
            scrollTrigger: { trigger: card, containerAnimation: h, start: 'left 105%', end: 'left 50%', scrub: true },
          })
          .fromTo(card, { scale: 0.8, yPercent: 16, rotate: i % 2 ? -6 : 6, opacity: 0.3 }, { scale: 1, yPercent: 0, rotate: 0, opacity: 1, ease: 'none' })
          .fromTo(card.querySelectorAll('.svc-stroke'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', stagger: 0.05 }, 0.2)
      })

      return () => el.classList.remove('is-h')
    })

    mm.add(MQ.mobile, () => {
      gsap.utils.toArray<HTMLElement>('.svc-card', tr).forEach((card) => {
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: 'top 85%', once: true } })
          .from(card, { y: 40, opacity: 0, duration: DUR.md, ease: EASE.out })
          .fromTo(card.querySelectorAll('.svc-stroke'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: DUR.lg, ease: EASE.out, stagger: STAGGER.items }, 0.1)
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="services" aria-labelledby="services-title" className="relative overflow-hidden py-24 md:flex md:min-h-[100svh] md:flex-col md:justify-center md:py-28">
      <div ref={track} className="svc-track relative px-[var(--gutter)]">
        {/* Orbit line (desktop horizontal mode only) */}
        <svg
          className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-[70%] w-full -translate-y-1/2 [.is-h_&]:block"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 150 C 250 20, 500 20, 750 110 S 1000 160, 1000 60" fill="none" stroke="rgba(244,239,230,0.08)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path
            data-svc-orbit
            d="M0 150 C 250 20, 500 20, 750 110 S 1000 160, 1000 60"
            fill="none"
            stroke="#D6B36A"
            strokeWidth="1.25"
            pathLength={1}
            strokeDasharray="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="svc-intro relative flex flex-col justify-between gap-10 pb-6 md:col-span-2 md:pr-10">
          <div>
            <SectionLabel>[02 // SERVICES]</SectionLabel>
            <h2 id="services-title" className="display t-2 mt-6 max-w-[14ch]">
              Everything orbits one goal: <span className="serif-accent text-accent">the booked job.</span>
            </h2>
            <p className="t-lead mt-6 max-w-md text-muted">
              Four services, one studio. Start with a website, add AI intake when you are ready, keep it sharp with a care plan.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/services" variant="ghost" size="sm">
              All services
            </Button>
            <a href={site.phoneHref} className="label text-fg hover:text-accent">
              {site.phoneDisplay}
            </a>
          </div>
        </div>

        {services.map((s) => (
          <article
            key={s.slug}
            className="svc-card relative flex min-h-[26rem] flex-col rounded-[var(--radius)] border border-line bg-panel/85 p-7 backdrop-blur-sm md:p-9 [.is-h_&]:h-[min(36rem,68svh)]"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[0.72rem] tracking-[0.16em] text-dim">ORBIT {s.id}</span>
              <ServiceIcon slug={s.slug} className="h-12 w-12 text-accent" />
            </div>
            <h3 className="display t-3 mt-auto pt-10">{s.title}</h3>
            <p className="mt-3 text-[1.05rem] text-fg">{s.short}</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{s.copy}</p>
            <ul className="mt-6 grid grid-cols-1 gap-2 border-t border-line pt-5 text-[0.88rem] text-muted sm:grid-cols-2">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
            <TransitionLink href={`/services#${s.slug}`} className="label mt-6 inline-flex items-center gap-2 text-fg hover:text-accent">
              Explore <span aria-hidden="true">→</span>
              <span className="sr-only">{s.title}</span>
            </TransitionLink>
          </article>
        ))}
      </div>

      {/* Progress HUD (desktop horizontal mode only) */}
      <div className="container-x mt-10 hidden items-center gap-6 [.is-h_&]:flex">
        <span className="label text-accent">
          <span ref={counter}>01</span> <span className="text-dim">/ 0{services.length}</span>
        </span>
        <span className="relative h-px flex-1 bg-line">
          <span data-svc-progress className="absolute inset-0 origin-left bg-accent" />
        </span>
        <span className="label text-dim">Scroll</span>
      </div>
    </section>
  )
}
