'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
import { gsap } from './gsap'
import { useLenis } from './LenisProvider'
import { DUR, EASE, MQ } from './tokens'

type Ctx = { navigate: (href: string) => void }
const TransitionContext = createContext<Ctx | null>(null)

export function usePageTransition() {
  return useContext(TransitionContext)
}

/**
 * Route transitions: a panel wipes up to cover the page (power2.inOut, 400ms),
 * the route changes underneath, then the panel lifts away (expo.out, 800ms).
 * Reduced motion → plain navigation.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const lenis = useLenis()
  const overlayRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const pending = useRef(false)
  const failsafe = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const reveal = useCallback(() => {
    const el = overlayRef.current
    if (!el) return
    pending.current = false
    if (failsafe.current) clearTimeout(failsafe.current)
    gsap.to(el, {
      yPercent: -100,
      duration: DUR.md,
      ease: EASE.out,
      delay: 0.08,
      onComplete: () => {
        gsap.set(el, { autoAlpha: 0, yPercent: 100 })
      },
    })
  }, [])

  const navigate = (href: string) => {
    const el = overlayRef.current
    if (!el || window.matchMedia(MQ.reduce).matches) {
      router.push(href)
      return
    }
    if (pending.current) return
    pending.current = true
    if (labelRef.current) labelRef.current.textContent = href.split('#')[0] || '/'
    gsap.killTweensOf(el)
    gsap
      .timeline()
      .set(el, { autoAlpha: 1, y: 0, yPercent: 100 })
      .to(el, { yPercent: 0, duration: DUR.sm, ease: EASE.inOut })
      .add(() => {
        // Pages mounted after a client navigation time their intro to the lifting panel.
        const root = document.documentElement
        root.classList.remove('is-preloading')
        root.classList.add('pt-nav')
        lenis?.current?.scrollTo(0, { immediate: true, force: true })
        window.scrollTo(0, 0)
        router.push(href)
        failsafe.current = setTimeout(reveal, 4000)
      })
  }

  useEffect(() => {
    if (pending.current) reveal()
  }, [pathname, reveal])

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={overlayRef} aria-hidden="true" className="pt-overlay pointer-events-none fixed inset-0 z-[110] flex items-end bg-panel">
        <div className="absolute inset-x-0 top-0 h-px bg-accent/70" />
        <div className="container-x flex w-full items-center justify-between pb-8">
          <span className="label">[ ORBIT // NAVIGATING ]</span>
          <span ref={labelRef} className="label text-accent" />
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
