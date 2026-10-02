import { process, services, site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { jsonLd, pageMeta, pageSchema, servicesSchema } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Services — Websites, refreshes, AI intake & care plans',
  description:
    'Hand-coded websites, refreshes, AI intake & booking automation and monthly plans for home-service businesses in Plainsboro, Princeton and Central NJ.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageSchema('/services'))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(servicesSchema())} />
      <PageHero
        label="[SERVICES]"
        title={
          <>
            Websites and systems that <span className="serif-accent text-accent">bring in work.</span>
          </>
        }
        lead="Four services, one studio. Every build is hand-coded around how your business actually takes on jobs — calls, quotes and bookings."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={site.booking}>Book a free call</Button>
          <Button href="/pricing" variant="ghost">
            See pricing
          </Button>
          <Button href="/free-website-check" variant="ghost">
            Free website check
          </Button>
        </div>
      </PageHero>

      <nav aria-label="Services" className="container-x">
        <ul className="grid grid-cols-2 gap-2 border-y border-line py-4 md:grid-cols-4">
          {services.map((s) => (
            <li key={s.slug}>
              <a href={`#${s.slug}`} className="label flex items-center gap-2 py-2 text-muted hover:text-accent">
                <span className="text-accent">{s.id}</span> {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-x mt-8 divide-y divide-line">
        {services.map((s, i) => (
          <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-title`} className="grid scroll-mt-28 gap-10 py-16 md:grid-cols-12 md:py-24">
            <div className="md:col-span-5">
              <div className="flex items-center gap-5">
                <span className="display text-[clamp(4rem,9vw,8rem)] leading-none text-outline">{s.id}</span>
                <ServiceIcon slug={s.slug} className="h-12 w-12 text-accent" />
              </div>
              <h2 id={`${s.slug}-title`} data-split className="display t-2 mt-6 max-w-[12ch]">
                {s.title}
              </h2>
            </div>
            <div data-reveal className="md:col-span-6 md:col-start-7 md:pt-4">
              <p className="t-3 display font-medium leading-tight">{s.short}</p>
              <p className="t-lead mt-6 text-muted">{s.copy}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 rounded-2xl border border-line bg-panel/60 px-4 py-3.5 text-[0.95rem]">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href={site.booking} size="sm" variant={i === 0 ? 'primary' : 'ghost'}>
                  Book a call about this
                </Button>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="how-title" className="container-x py-16 md:py-24">
        <SectionLabel>[HOW IT WORKS]</SectionLabel>
        <h2 id="how-title" data-split className="display t-2 mt-6 max-w-[16ch]">
          Five steps, no sales handoff.
        </h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-5">
          {process.map((p) => (
            <li key={p.number} data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6">
              <span className="font-mono text-[0.72rem] tracking-[0.14em] text-accent">STEP {p.number}</span>
              <h3 className="display mt-6 text-xl">{p.title}</h3>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">{p.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand title="Not sure which service fits?" copy="Tell us how your business takes on work today. We will tell you honestly what would help — and what would not." />
    </>
  )
}
