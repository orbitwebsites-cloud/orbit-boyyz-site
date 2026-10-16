'use client'

import { useEffect, useRef } from 'react'
import { leadsHero } from '@/content/leads'
import { OrbitMark } from '@/components/ui/Logo'
import { LEADS_URL } from '@/lib/leadsSite'
import { QualifyCta } from './QualifyCta'

/**
 * Minimal header for leads.orbitboyzz.com: logo home and one CTA. Glass bar
 * and gold scroll hairline once scrolled (the main nav's CSS).
 */
export function LeadsHeader() {
  const headerRef = useRef<HTMLElement>(null)

  // Scrolled state goes straight to a data attribute: no re-renders on scroll.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const onScroll = () => {
      el.dataset.scrolled = window.scrollY > 24 ? 'true' : 'false'
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header ref={headerRef} data-scrolled="false" className="fixed inset-x-0 top-0 z-[90]">
      <div className="nav-bg absolute inset-0 border-b border-line bg-bg/75 backdrop-blur-xl" />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="container-x relative flex h-[var(--nav-h)] items-center justify-between gap-3">
        <a href={LEADS_URL} className="flex min-w-0 items-center gap-2.5">
          <OrbitMark className="h-8 w-8 shrink-0" />
          <span className="flex flex-col leading-none">
            <span className="display whitespace-nowrap text-[1.08rem] font-bold tracking-[-0.03em]">Orbit Boyzz</span>
            <span className="mt-1 whitespace-nowrap font-mono text-[0.58rem] tracking-[0.2em] text-dim">LEAD DATA</span>
          </span>
        </a>
        <QualifyCta size="sm">
          <span className="sm:hidden">{leadsHero.ctaShort}</span>
          <span className="hidden sm:inline">{leadsHero.cta}</span>
        </QualifyCta>
      </div>
    </header>
  )
}
