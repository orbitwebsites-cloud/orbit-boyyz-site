'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/cn'

type Item = { q: string; a: string }

/**
 * FAQ accordion. Answers stay in the DOM (server-rendered, crawlable). The
 * open/close is pure CSS — a grid-template-rows 0fr ↔ 1fr transition
 * (power2.inOut, 400ms) — so no animation library ships for it.
 */
export function Accordion({ items, defaultOpen = 0 }: { items: readonly Item[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const base = useId()

  return (
    <ul className="border-t border-line">
      {items.map((item, i) => {
        const isOpen = open === i
        const id = `${base}-${i}`
        return (
          <li key={item.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                id={`${id}-q`}
                aria-expanded={isOpen}
                aria-controls={`${id}-a`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="flex gap-5">
                  <span className="mt-1.5 font-mono text-[0.72rem] tracking-[0.14em] text-dim">{String(i + 1).padStart(2, '0')}</span>
                  <span className={cn('display text-[clamp(1.2rem,1.9vw,1.6rem)] leading-snug transition-colors duration-[var(--d-sm)]', isOpen ? 'text-fg' : 'text-fg/80 group-hover:text-fg')}>
                    {item.q}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-[rotate,border-color,background-color] duration-[var(--d-sm)] ease-[var(--ease-out)]',
                    isOpen ? 'rotate-45 border-accent bg-accent text-accent-ink' : 'border-line-strong text-fg',
                  )}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a`}
              role="region"
              aria-labelledby={`${id}-q`}
              data-open={isOpen}
              className="acc-panel"
              inert={!isOpen}
            >
              <div>
                <p className="max-w-2xl pb-7 pl-10 text-muted md:pl-12">{item.a}</p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
