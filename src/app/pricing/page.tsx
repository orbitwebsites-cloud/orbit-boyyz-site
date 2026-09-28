import { carePlans, faqs, site, tiers } from '@/content/site'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { PricingTiers } from '@/components/ui/PricingTiers'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TiltCard } from '@/components/ui/TiltCard'
import { cn } from '@/lib/cn'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Pricing — Launch builds, premium sites from $3,500 & AI operations',
  description:
    'Transparent website pricing for Central NJ businesses: 7-day launch builds (50% to start), premium Next.js builds from $3,500, AI operations from $5,000, and optional care plans from $300/mo.',
  path: '/pricing',
})

// "What's included" matrix — built only from the features listed in site.ts.
// Premium = "Everything in Launch" + its own list. AI operations lists its own
// system features; any website scope is agreed on the call.
const launch = tiers[0].features
const premiumOwn = tiers[1].features.filter((f) => !f.startsWith('Everything'))
const aiOwn = tiers[2].features

type Cell = true | false | 'scoped'
const rows: { group: string; items: { name: string; cells: [Cell, Cell, Cell] }[] }[] = [
  { group: 'Website', items: launch.map((name) => ({ name, cells: [true, true, 'scoped'] })) },
  { group: 'Premium', items: premiumOwn.map((name) => ({ name, cells: [false, true, 'scoped'] })) },
  { group: 'AI operations', items: aiOwn.map((name) => ({ name, cells: [false, false, true] })) },
]

const PRICING_FAQ = faqs.filter((f) => /payment|care plan|long|AI operations tier/i.test(f.q))

function CellMark({ v }: { v: Cell }) {
  if (v === true)
    return (
      <svg width="16" height="16" viewBox="0 0 12 12" fill="none" className="mx-auto" role="img" aria-label="Included">
        <path d="m2 6.2 2.6 2.6L10 3.4" stroke="#D6B36A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (v === 'scoped') return <span className="font-mono text-[0.68rem] tracking-[0.08em] text-muted">On the call</span>
  return (
    <span className="text-dim" aria-label="Not included">
      —
    </span>
  )
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        label="[PRICING]"
        title={
          <>
            Clear tiers. <span className="serif-accent text-accent">No surprises.</span>
          </>
        }
        lead="50% reserves your build and starts the sprint. You approve the finished site before paying the remaining 50%. Care plans are optional and start only after launch."
      />

      <section aria-label="Build tiers" className="container-x">
        <PricingTiers headingLevel="h2" />
      </section>

      <section aria-labelledby="matrix-title" className="container-x py-20 md:py-28">
        <SectionLabel>[WHAT&apos;S INCLUDED]</SectionLabel>
        <h2 id="matrix-title" data-split className="display t-2 mt-6">
          Side by side.
        </h2>
        <div data-reveal className="mt-10 overflow-x-auto rounded-[var(--radius)] border border-line" data-lenis-prevent>
          <table className="w-full min-w-[40rem] border-collapse text-left text-[0.93rem]">
            <thead>
              <tr className="border-b border-line bg-panel/80">
                <th scope="col" className="px-5 py-5 font-normal">
                  <span className="label">Feature</span>
                </th>
                {tiers.map((t) => (
                  <th key={t.id} scope="col" className="px-5 py-5 text-center">
                    <span className="display block text-lg">{t.name}</span>
                    <span className="mt-1 block font-mono text-[0.7rem] tracking-[0.06em] text-muted">{t.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            {rows.map((g) => (
              <tbody key={g.group}>
                <tr>
                  <th colSpan={4} scope="colgroup" className="bg-bg-2 px-5 pb-2 pt-5 text-left">
                    <span className="label text-accent">{g.group}</span>
                  </th>
                </tr>
                {g.items.map((r) => (
                  <tr key={r.name} className="border-t border-line">
                    <th scope="row" className="px-5 py-3.5 font-normal text-fg/90">
                      {r.name}
                    </th>
                    {r.cells.map((c, i) => (
                      <td key={i} className={cn('px-5 py-3.5 text-center', i === 1 && 'bg-accent/[0.04]')}>
                        <CellMark v={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
        <p className="mt-4 text-sm text-dim">
          Launch builds are quoted after the call. Premium starts at $3,500. AI operations builds run $5,000–$15,000+ with an optional $750–$2,500/mo retainer.
        </p>
      </section>

      <section aria-labelledby="care-title" className="container-x py-12 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>[AFTER LAUNCH]</SectionLabel>
            <h2 id="care-title" data-split className="display t-2 mt-6 max-w-[14ch]">
              Optional monthly care.
            </h2>
          </div>
          <p data-reveal className="max-w-sm text-muted">
            Month to month, only after launch. Hosting with us is optional — the site is yours either way.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {carePlans.map((p) => {
            const featured = 'featured' in p && p.featured
            return (
              <div key={p.name} data-reveal>
                <TiltCard className={cn('h-full rounded-[var(--radius)] border p-7', featured ? 'border-accent/50 bg-panel-2' : 'border-line bg-panel/70')}>
                  <p className="label">{p.name}</p>
                  <p className="display mt-6 text-5xl">
                    {p.price}
                    <span className="ml-1 font-sans text-base font-normal text-muted">/mo</span>
                  </p>
                  <p className="mt-4 text-muted">{p.copy}</p>
                  <ul className="mt-6 space-y-2 border-t border-line pt-5 text-[0.92rem]">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </div>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="pfaq-title" className="container-x grid gap-10 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-4">
          <SectionLabel>[PRICING FAQ]</SectionLabel>
          <h2 id="pfaq-title" className="display t-2 mt-6">
            Money questions.
          </h2>
          <div className="mt-8">
            <Button href={site.booking} size="sm">
              Get a quote on a call
            </Button>
          </div>
        </div>
        <div className="md:col-span-8">
          <Accordion items={PRICING_FAQ} />
        </div>
      </section>

      <CtaBand title="Get a real number for your project." />
    </>
  )
}
