'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, SplitText } from './gsap'
import { DUR, EASE, MQ, STAGGER } from './tokens'
import { scramble } from './scramble'
import { useIsoLayoutEffect } from './useIsoLayoutEffect'

/**
 * One motion manager per route (mounted by app/template.tsx, so it re-runs on
 * every navigation). Server components opt in with data attributes:
 *
 *   data-reveal   → block fades up once when it enters (expo.out, 800ms, batched)
 *   data-split    → heading lines rise out of a mask once (SplitText, expo.out, 1200ms)
 *   data-clip     → media wipes open with a clip-path once (expo.out, 1200ms)
 *
 * Everything is visible by default; initial states are only applied by JS and
 * only when motion is allowed, so content is never hidden without JS.
 */
export function RouteMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const mm = gsap.matchMedia()

    // Reduced motion: nothing moves, but blocks and headings still dissolve in
    // (opacity only), so the page doesn't feel dead.
    mm.add(MQ.reduce, () => {
      const vh = window.innerHeight
      const targets = gsap.utils
        .toArray<HTMLElement>('[data-reveal], [data-split]', root)
        .filter((el) => el.getBoundingClientRect().top > vh * 0.9)
      gsap.set(targets, { autoAlpha: 0 })
      ScrollTrigger.batch(targets, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, duration: DUR.md, ease: 'none', stagger: STAGGER.items, overwrite: true }),
      })
    })

    mm.add(MQ.motion, () => {
      const vh = window.innerHeight
      const below = (el: Element) => el.getBoundingClientRect().top > vh * 0.9

      // Section labels decode like a terminal readout as they enter --------
      // IntersectionObserver, not ScrollTrigger: ~60 labels would each force a
      // layout measurement at startup (≈500ms of blocking time on mobile).
      const undo: Array<() => void> = []
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            io.unobserve(e.target)
            undo.push(scramble(e.target as HTMLElement))
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      )
      root.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => io.observe(el))
      undo.push(() => io.disconnect())

      // Block reveals ----------------------------------------------------
      const blocks = gsap.utils.toArray<HTMLElement>('[data-reveal]', root).filter(below)
      gsap.set(blocks, { autoAlpha: 0, y: 28 })
      ScrollTrigger.batch(blocks, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: DUR.md,
            ease: EASE.out,
            stagger: STAGGER.items,
            overwrite: true,
          }),
      })

      // Split headings ---------------------------------------------------
      const splits: SplitText[] = []
      gsap.utils.toArray<HTMLElement>('[data-split]', root).forEach((el) => {
        if (!below(el)) return
        splits.push(
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: DUR.lg,
                ease: EASE.out,
                stagger: STAGGER.lines,
                scrollTrigger: { trigger: el, start: 'top 86%', once: true },
              }),
          }),
        )
      })

      // Clip reveals -----------------------------------------------------
      gsap.utils.toArray<HTMLElement>('[data-clip]', root).forEach((el) => {
        if (!below(el)) return
        gsap.fromTo(
          el,
          { clipPath: 'inset(18% 8% 18% 8% round 28px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            duration: DUR.lg,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          },
        )
      })

      return () => {
        splits.forEach((s) => s.revert())
        undo.forEach((u) => u())
      }
    })

    // Section-level triggers (pins) were created by child effects first; make
    // sure every start/end is measured against the final layout.
    const refresh = () => ScrollTrigger.refresh()
    const raf = requestAnimationFrame(refresh)
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh).catch(() => {})

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
