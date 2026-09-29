import { legacyServices, localUseCases } from '@/content/landing'
import { site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ArrowLink, Section, SectionTitle } from '@/components/port/Blocks'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

export const metadata = legacyMetadata('/orbitboyzz')

// Old OrbitBoyzzBrandPage (App.tsx) — copy verbatim.
export default function OrbitBoyzzPage() {
  return (
    <>
      <JsonLd data={legacyJsonLd('/orbitboyzz')} />
      <PageHero
        label="[BRAND // ORBITBOYZZ]"
        title={
          <>
            OrbitBoyzz is Orbit Websites, <span className="serif-accent text-accent">built in Plainsboro.</span>
          </>
        }
        lead="OrbitBoyzz is the domain and brand handle for Orbit Websites. The official site is orbitboyzz.me. We build premium local business websites and AI operations systems for Plainsboro, Princeton, West Windsor Township, and Central New Jersey."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={site.phoneHref} icon="phone">
            Call {site.phoneDisplay}
          </Button>
          <Button href={`mailto:${site.email}`} variant="ghost">
            {site.email}
          </Button>
        </div>
      </PageHero>

      <Section label="Brand facts" className="pt-0 md:pt-0">
        <dl className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line md:grid-cols-3">
          {[
            ['Official brand', 'OrbitBoyzz / Orbit Websites'],
            ['Official domain', 'orbitboyzz.me'],
            ['Primary location', 'Plainsboro, New Jersey'],
          ].map(([title, value]) => (
            <div key={title} className="bg-bg p-6 md:p-8">
              <dt className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">{title}</dt>
              <dd className="display mt-4 text-2xl md:text-3xl">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="Direct answer">
        <div
          data-reveal
          className="rounded-[calc(var(--radius)+0.5rem)] border border-accent/25 bg-[radial-gradient(ellipse_at_top_left,rgba(214,179,106,0.12),transparent_60%),var(--panel)] p-6 md:p-12"
        >
          <SectionLabel>[DIRECT ANSWER]</SectionLabel>
          <h2 className="display t-2 mt-6 max-w-[20ch]">Is OrbitBoyzz the same as Orbit Websites?</h2>
          <p className="t-lead mt-6 max-w-[68ch] text-muted">
            Yes. OrbitBoyzz and Orbit Websites refer to the same web design and AI operations business. OrbitBoyzz is the branded domain at orbitboyzz.me, while Orbit
            Websites is the service name used for custom websites, local SEO foundations, quote forms, booking flows, and AI employee systems.
          </p>
        </div>
      </Section>

      <Section label="Services">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>[02 // SERVICES]</SectionLabel>
            <SectionTitle className="mt-6">Website services for local businesses and AI-ready operations.</SectionTitle>
          </div>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em]">
            <ArrowLink href="/services">View services</ArrowLink>
          </span>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {legacyServices.map((s) => (
            <li key={s.id} data-reveal className="flex min-h-[15rem] flex-col justify-between gap-8 rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-7">
              <SectionLabel>{s.id}</SectionLabel>
              <div>
                <h3 className="display text-2xl">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Areas">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <SectionTitle className="md:col-span-6">Local website help for Plainsboro and nearby areas.</SectionTitle>
          <p className="leading-relaxed text-muted md:col-span-4">
            We work with businesses in Plainsboro, Princeton, West Windsor Township, and surrounding Central New Jersey communities.
          </p>
          <div className="md:col-span-2 md:justify-self-end">
            <Button href={site.phoneHref} icon="phone" size="sm">
              Call now
            </Button>
          </div>
        </div>
        <ol className="mt-10 border-t border-line">
          {localUseCases.map(([title, copy], i) => (
            <li key={title} data-reveal className="grid gap-3 border-b border-line py-7 md:grid-cols-12 md:items-baseline md:gap-8">
              <span className="display text-4xl text-outline md:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="display text-2xl md:col-span-6">{title}</h3>
              <p className="text-muted md:col-span-5">{copy}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand />
    </>
  )
}
