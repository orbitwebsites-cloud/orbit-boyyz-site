'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { OrbitSystem } from '@/components/ui/OrbitSystem'
import { MQ } from '@/lib/motion/tokens'

const OrbitCanvas = dynamic(() => import('./OrbitCanvas'), { ssr: false, loading: () => null })

/**
 * Static-first hero visual. The CSS orbit paints with the HTML (so LCP is text,
 * never the canvas). The WebGL scene is fetched after the page is idle, and
 * only when motion is allowed and the device has more than 4 cores.
 */
export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null)
  const [mount, setMount] = useState(false)

  useEffect(() => {
    if (window.matchMedia(MQ.reduce).matches) return
    if ((navigator.hardwareConcurrency ?? 0) <= 4) return
    let idleId: number | undefined
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(() => setMount(true), { timeout: 2000 })
      else setMount(true)
    }, 900)
    return () => {
      clearTimeout(timer)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
    }
  }, [])

  const markReady = () => {
    if (ref.current) ref.current.dataset['3d'] = 'ready'
  }

  return (
    <div ref={ref} data-3d="idle" className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {/* Static fallback: CSS 3D orbit */}
      <div className="orbit-fallback absolute inset-0">
        <OrbitSystem className="absolute left-1/2 top-[18%] w-[135vw] max-w-none -translate-x-1/2 opacity-60 md:left-[64%] md:top-1/2 md:w-[min(64vw,60rem)] md:-translate-y-1/2 md:opacity-100" />
      </div>
      {mount && (
        <div className="orbit-canvas absolute inset-0">
          <OrbitCanvas onReady={markReady} />
        </div>
      )}
      {/* Legibility wash behind the headline */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,6,6,0.92)_0%,rgba(6,6,6,0.55)_42%,rgba(6,6,6,0)_70%)] max-md:bg-[linear-gradient(180deg,rgba(6,6,6,0.2)_0%,rgba(6,6,6,0.75)_45%,rgba(6,6,6,0.95)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  )
}
