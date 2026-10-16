import { keywordRoutes } from '@/content/keyword-pages'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { cn } from '@/lib/cn'
import { ArrowLink, Section } from './Blocks'

/**
 * "[WHO WE BUILD FOR]" — cards for the keyword landing pages (hub, trades, SEO,
 * New Jersey) plus a row of the older New Jersey trade pages. Server component;
 * used on the home page, /services, /web-design-central-nj, the NJ trade pages
 * and every keyword page, so they all link each other with the same labels.
 */
export function TradeLinksGrid({
  current,
  heading,
  label = '[WHO WE BUILD FOR]',
  className,
}: {
  /** Path of the page showing the grid; its card is marked as the current page. */
  current?: string
  heading?: string
  label?: string
  className?: string
}) {
  const njPages = keywordRoutes.flatMap((r) => (r.nj ? [r.nj] : []))
  return (
    <Section label="Who we build for" className={className}>
      <SectionLabel>{label}</SectionLabel>
      {heading && <h2 className="display t-3 mt-6 max-w-[26ch] text-balance">{heading}</h2>}
      <ul className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {keywordRoutes.map((r) => {
          const active = r.path === current
          return (
            <li key={r.path}>
              <TransitionLink
                href={r.path}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group flex h-full flex-col justify-between gap-3 rounded-2xl border p-4 transition-colors sm:gap-4 sm:p-5 duration-[var(--d-sm)]',
                  active ? 'border-accent/60 bg-accent/10' : 'border-line bg-panel/50 hover:border-accent/50',
                )}
              >
                <span className="display text-lg leading-tight transition-colors group-hover:text-accent-hi sm:text-xl">{r.navLabel}</span>
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-dim">{r.navNote}</span>
              </TransitionLink>
            </li>
          )
        })}
      </ul>
      <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-3 text-[0.95rem]">
        <span className="label text-dim">In New Jersey</span>
        {njPages.map((p) =>
          p.path === current ? (
            <span key={p.path} aria-current="page" className="font-medium text-fg">
              {p.label}
            </span>
          ) : (
            <ArrowLink key={p.path} href={p.path} muted>
              {p.label} →
            </ArrowLink>
          ),
        )}
      </div>
    </Section>
  )
}
