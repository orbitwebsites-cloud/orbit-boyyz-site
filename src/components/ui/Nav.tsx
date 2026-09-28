'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { nav, site } from '@/content/site'
import { cn } from '@/lib/cn'
import { useLenis } from '@/lib/motion/LenisProvider'
import { ArrowIcon, PhoneIcon } from './Button'
import { Wordmark } from './Logo'
import { Magnetic } from './Magnetic'
import { TransitionLink } from './TransitionLink'

export function Nav() {
  const pathname = usePathname()
  const lenis = useLenis()
  const headerRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  // Scrolled state is written straight to a data attribute — no re-renders on scroll.
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

  useEffect(() => {
    if (!open) return
    const l = lenis?.current
    const root = document.documentElement
    l?.stop()
    root.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      l?.start()
      root.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenis])

  const close = () => setOpen(false)

  return (
    <>
      <header ref={headerRef} data-scrolled="false" className="fixed inset-x-0 top-0 z-[90]">
        <div className="nav-bg absolute inset-0 border-b border-line bg-bg/75 backdrop-blur-xl" />
        <div className="container-x relative flex h-[var(--nav-h)] items-center justify-between gap-4">
          <TransitionLink href="/" className="relative z-10" onClick={close}>
            <Wordmark />
          </TransitionLink>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-line bg-panel/60 p-1 backdrop-blur-md">
              {nav.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.88rem] transition-colors duration-[var(--d-sm)]',
                        active ? 'bg-fg/[0.07] text-fg' : 'text-muted hover:text-fg',
                      )}
                    >
                      {active && <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />}
                      {item.label}
                    </TransitionLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <a
              href={site.phoneHref}
              className="hidden items-center gap-2 font-mono text-[0.8rem] tracking-[0.04em] text-fg transition-colors hover:text-accent md:flex"
            >
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {site.phoneDisplay}
            </a>
            <a
              href={site.phoneHref}
              aria-label={`Call ${site.phoneDisplay}`}
              className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-fg md:hidden"
            >
              <PhoneIcon />
            </a>
            <span className="hidden sm:inline-flex">
              <Magnetic>
                <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                  <span>Book a free call</span>
                  <span className="btn-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              </Magnetic>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-line-strong lg:hidden"
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span className="relative block h-3 w-4" aria-hidden="true">
                <span
                  className={cn(
                    'absolute left-0 top-0 h-px w-4 bg-fg transition-transform duration-[var(--d-sm)] ease-[var(--ease-out)]',
                    open && 'translate-y-[6px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute bottom-0 left-0 h-px w-4 bg-fg transition-transform duration-[var(--d-sm)] ease-[var(--ease-out)]',
                    open && '-translate-y-[5px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: always in the DOM, CSS-driven (clip-path wipe + staggered items).
          `inert` keeps it out of the tab order and the a11y tree while closed. */}
      <div
        id="mobile-menu"
        data-open={open}
        data-lenis-prevent
        inert={!open}
        className="mobile-menu fixed inset-0 z-[85] flex flex-col overflow-y-auto bg-bg px-[var(--gutter)] pb-8 pt-[calc(var(--nav-h)+2rem)] lg:hidden"
      >
        <p className="label mb-6">
          <span className="text-accent">[</span> MENU <span className="text-accent">]</span>
        </p>
        <ul className="flex flex-col">
          {[{ label: 'Home', href: '/' }, ...nav].map((item, i) => (
            <li
              key={item.href}
              className="mobile-menu__item overflow-hidden border-b border-line"
              style={{ '--i': i } as CSSProperties}
            >
              <TransitionLink
                href={item.href}
                onClick={close}
                className="display flex items-baseline justify-between py-3.5 text-[2.1rem]"
              >
                {item.label}
                <span className="font-mono text-xs tracking-[0.14em] text-dim">0{i + 1}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="mobile-menu__item mt-auto flex flex-col gap-3 pt-10" style={{ '--i': nav.length + 2 } as CSSProperties}>
          <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full justify-between">
            <span>Book a free call</span>
            <span className="btn-arrow">
              <ArrowIcon />
            </span>
          </a>
          <a href={site.phoneHref} className="btn btn-ghost w-full justify-between">
            <span>Call {site.phoneDisplay}</span>
            <span className="btn-arrow">
              <PhoneIcon />
            </span>
          </a>
          <p className="label mt-3 text-center">
            {site.location} · {site.serviceArea}
          </p>
        </div>
      </div>
    </>
  )
}
