import { carePlans } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { PricingTiers } from '@/components/ui/PricingTiers'
import { SectionLabel } from '@/components/ui/SectionLabel'

/**
 * [07 // PRICING] Three build tiers. Cards reveal in a stagger, tilt toward the
 * pointer on desktop; the recommended tier carries the gold glow.
 */
export function PricingPreview() {
  const leads = carePlans.find((plan) => plan.name === 'Website + Leads Plan') ?? carePlans[1]
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <div className="mb-14 flex flex-col gap-8 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>[07 // PRICING]</SectionLabel>
            <h2 id="pricing-title" data-split className="display t-1 mt-6 max-w-[13ch]">
              Clear tiers. You approve before you pay the rest.
            </h2>
          </div>
          <p data-reveal className="max-w-sm text-muted">
            50% reserves your build and starts the sprint. The final 50% is due only after you approve the finished site.
          </p>
        </div>

        <PricingTiers />

        <div data-reveal className="mt-8 rounded-[var(--radius)] border border-line px-6 py-6 md:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="label text-accent">Monthly plans · after launch</p>
              <h3 className="mt-3 text-xl text-fg">
                {leads.name} — {leads.price}/mo
              </h3>
              <p className="mt-2 text-muted">{leads.copy}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/pricing" variant="ghost" size="sm">
                Full pricing
              </Button>
              <Button href="/growth" variant="ghost" size="sm">
                HVAC lead response
              </Button>
            </div>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-5 text-sm text-muted">
            {carePlans.map((plan) => (
              <li key={plan.name}>
                <span className="text-fg">{plan.name}</span> {plan.price}/mo
              </li>
            ))}
            <li>Month to month, only after launch.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
