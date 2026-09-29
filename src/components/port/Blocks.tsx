import type { ReactNode } from 'react'
import { localWebDesignLinks } from '@/content/landing'
import { Accordion } from '@/components/ui/Accordion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { cn } from '@/lib/cn'

/** Shared building blocks for the ported landing / brand pages. Server components. */

export function Section({ children, className, label, id }: { children: ReactNode; className?: string; label?: string; id?: string }) {
  return (
    <section id={id} aria-label={label} className={cn('container-x py-14 md:py-20', className)}>
      {children}
    </section>
  )
}

export function SectionTitle({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} data-split className={cn('display t-2 max-w-[20ch] text-balance', className)}>
      {children}
    </h2>
  )
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-8', className)}>{children}</div>
}

export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent', className)}>{children}</p>
}

/** Two-column numbered cards: 01 Title / copy. */
export function NumberedCards({ items }: { items: ReadonlyArray<readonly [string, string]> }) {
  return (
    <ol className="mt-10 grid gap-4 md:grid-cols-2">
      {items.map(([title, copy], i) => (
        <li key={title} data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-[4rem_1fr] sm:items-start">
            <span className="display text-5xl leading-none text-outline">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="display text-2xl">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{copy}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** "[LOCAL PAGES // MERCER COUNTY]" — the town page link grid. */
export function LocalPagesGrid({ current }: { current?: string }) {
  return (
    <Section label="Local web design pages">
      <SectionLabel>[LOCAL PAGES // MERCER COUNTY]</SectionLabel>
      <ul className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 xl:grid-cols-6">
        {localWebDesignLinks.map(([label, href]) => {
          const active = href === current
          return (
            <li key={href}>
              <TransitionLink
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex h-full flex-col justify-between gap-3 rounded-2xl border p-4 transition-colors sm:gap-4 sm:p-5 duration-[var(--d-sm)]',
                  active ? 'border-accent/60 bg-accent/10' : 'border-line bg-panel/50 hover:border-accent/50',
                )}
              >
                <span className="display text-lg leading-tight transition-colors group-hover:text-accent-hi sm:text-xl">{label}</span>
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-dim">Web design + AI intake</span>
              </TransitionLink>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

/** "[DIRECT ANSWER]" panel with a question heading. */
export function DirectAnswer({ question, children, links }: { question: string; children: ReactNode; links?: ReactNode }) {
  return (
    <Section label="Direct answer">
      <div
        data-reveal
        className="relative overflow-hidden rounded-[calc(var(--radius)+0.5rem)] border border-accent/25 bg-[radial-gradient(ellipse_at_top_left,rgba(214,179,106,0.12),transparent_60%),var(--panel)] p-6 md:p-12"
      >
        <SectionLabel>[DIRECT ANSWER]</SectionLabel>
        <h2 className="display t-3 mt-6 max-w-[28ch] text-balance">{question}</h2>
        <p className="t-lead mt-6 max-w-[68ch] text-muted">{children}</p>
        {links && <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">{links}</div>}
      </div>
    </Section>
  )
}

export function ArrowLink({ href, children, muted = false }: { href: string; children: ReactNode; muted?: boolean }) {
  const cls = cn('link-u font-medium', muted ? 'text-muted hover:text-fg' : 'text-accent hover:text-accent-hi')
  return href.startsWith('/') ? (
    <TransitionLink href={href} className={cls}>
      {children}
    </TransitionLink>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  )
}

/** FAQ block for landing pages (answers stay in the DOM for crawlers). */
export function LandingFaq({ label, heading, items }: { label: string; heading: string; items: ReadonlyArray<readonly [string, string]> }) {
  return (
    <Section label={heading}>
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <SectionLabel>{label}</SectionLabel>
          <h2 data-split className="display t-3 mt-6 max-w-[18ch] text-balance">
            {heading}
          </h2>
        </div>
        <div className="md:col-span-8">
          <Accordion items={items.map(([q, a]) => ({ q, a }))} defaultOpen={0} />
        </div>
      </div>
    </Section>
  )
}
