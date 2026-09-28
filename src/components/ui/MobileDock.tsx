'use client'

import { useEffect, useRef } from 'react'
import { site } from '@/content/site'
import { PhoneIcon } from './Button'

/** Phone-width action bar: Call + Book stay one thumb away once you scroll. */
export function MobileDock() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 160
      el.dataset.show = window.scrollY > 480 && !nearBottom ? 'true' : 'false'
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={ref}
      data-show="false"
      className="dock fixed inset-x-3 bottom-3 z-[70] flex gap-2 rounded-full border border-line-strong bg-panel/90 p-1.5 backdrop-blur-xl md:hidden"
    >
      <a
        href={site.phoneHref}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line text-[0.92rem] font-semibold"
      >
        <PhoneIcon /> Call
      </a>
      <a
        href={site.booking}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 flex-[1.6] items-center justify-center rounded-full bg-accent text-[0.92rem] font-semibold text-accent-ink"
      >
        Book a free call
      </a>
    </div>
  )
}
