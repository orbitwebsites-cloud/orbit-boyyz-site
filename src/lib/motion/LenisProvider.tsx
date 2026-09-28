'use client'

import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { gsap, ScrollTrigger } from './gsap'
import { MQ } from './tokens'

const LenisContext = createContext<RefObject<Lenis | null> | null>(null)

/** Access the single Lenis instance (null under reduced motion). */
export function useLenis() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia(MQ.reduce).matches) return

    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { offset: -88 },
      autoRaf: false,
      prevent: (node) => node.closest?.('[data-lenis-prevent]') != null,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Hold the page still while the first-visit preloader is on screen.
    let resume: ReturnType<typeof setTimeout> | undefined
    if (document.documentElement.classList.contains('is-preloading')) {
      const remaining = Math.max(0, 1150 - performance.now())
      if (remaining > 0) {
        lenis.stop()
        resume = setTimeout(() => lenis.start(), remaining)
      }
    }

    return () => {
      if (resume) clearTimeout(resume)
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
}
