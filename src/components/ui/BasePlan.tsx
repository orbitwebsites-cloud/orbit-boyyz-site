import { basePlan } from '@/content/site'
import { ArrowLink } from '@/components/port/Blocks'
import { SectionLabel } from '@/components/ui/SectionLabel'

/** The base website plan on /pricing: one monthly price, website and local SEO included. Copy: basePlan in content/site.ts. */
export function BasePlan() {
  return (
    <section aria-labelledby="base-plan-title" className="container-x py-12 md:py-20">
      <SectionLabel>[BASE PLAN]</SectionLabel>
      <div className="mt-8 grid gap-8 rounded-[var(--radius)] border border-accent/40 bg-panel p-7 md:grid-cols-2 md:gap-12 md:p-12">
        <div>
          <h2 id="base-plan-title" className="display t-2">
            {basePlan.name}
          </h2>
          <p className="display mt-5 text-[clamp(2.2rem,5vw,3.75rem)] text-accent">{basePlan.price}</p>
          <p className="label mt-3">{basePlan.meta}</p>
          <p className="mt-6 max-w-md leading-relaxed text-muted">{basePlan.copy}</p>
          <div className="mt-8">
            <ArrowLink href="/book-website">{basePlan.cta}</ArrowLink>
          </div>
        </div>
        <ul className="self-center border-t border-line">
          {basePlan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 border-b border-line py-4">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
