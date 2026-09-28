import { carePlans } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { PricingTiers } from '@/components/ui/PricingTiers'
import { SectionLabel } from '@/components/ui/SectionLabel'

/**
 * [07 // PRICING] Three build tiers. Cards reveal in a stagger, tilt toward the
 * pointer on desktop; the recommended tier carries the gold glow.
 */
export function PricingPreview() {
  const from = carePlans[0].price
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="cv-auto relative py-24 md:py-36">
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

        <div data-reveal className="mt-8 flex flex-col items-start justify-between gap-6 rounded-[var(--radius)] border border-line px-6 py-6 md:flex-row md:items-center md:px-8">
          <p className="text-muted">
            <span className="text-fg">Optional care plans from {from}/mo</span> — hosting, security, edits and local SEO. Month to month, only after launch.
          </p>
          <Button href="/pricing" variant="ghost" size="sm">
            Full pricing
          </Button>
        </div>
      </div>
    </section>
  )
}
