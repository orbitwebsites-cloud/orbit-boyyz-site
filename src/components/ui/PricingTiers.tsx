import { site, tiers } from '@/content/site'
import { cn } from '@/lib/cn'
import { Button } from './Button'
import { TiltCard } from './TiltCard'

/** The three build tiers. Shared by the homepage preview and /pricing. */
export function PricingTiers({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel
  return (
    <div className="grid gap-4 md:grid-cols-3 md:gap-5">
      {tiers.map((t) => {
        const featured = 'featured' in t && t.featured
        return (
          <div key={t.id} data-reveal className="h-full">
            <TiltCard
              className={cn(
                'flex h-full flex-col rounded-[calc(var(--radius)+0.25rem)] border p-7 md:p-8',
                featured
                  ? 'border-accent/50 bg-[linear-gradient(180deg,rgba(214,179,106,0.12),rgba(16,15,13,0.95)_45%)] shadow-[0_0_80px_-20px_var(--accent-glow)]'
                  : 'border-line bg-panel/80',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="label">{t.meta}</span>
                {featured && (
                  <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[0.62rem] font-semibold tracking-[0.14em] text-accent-ink">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <H className="display mt-8 text-[1.9rem]">{t.name}</H>
              <p
                className={cn(
                  'display mt-2',
                  /\d/.test(t.price) ? 'text-[clamp(1.6rem,2.4vw,2.2rem)]' : 'text-[1.35rem] text-muted',
                  featured ? 'text-accent' : /\d/.test(t.price) && 'text-fg',
                )}
              >
                {t.price}
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{t.copy}</p>
              <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-[0.92rem]">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="mt-1 shrink-0" aria-hidden="true">
                      <path d="m2 6.2 2.6 2.6L10 3.4" stroke="#D6B36A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Button href={site.booking} variant={featured ? 'primary' : 'ghost'} size="sm" className="w-full justify-between">
                  {t.cta}
                </Button>
              </div>
            </TiltCard>
          </div>
        )
      })}
    </div>
  )
}
