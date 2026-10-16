import { centralNjFaqs, webDesignFit, webDesignIncludes, webDesignNotFit, webDesignTowns } from '@/content/landing'
import { site } from '@/content/site'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowLink, DirectAnswer, LocalPagesGrid, MonoLabel, NumberedCards, Section, SectionTitle } from '@/components/port/Blocks'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

const ROUTE = '/web-design-central-nj'

export const metadata = legacyMetadata(ROUTE)

// Custom layout from the old App.tsx (WebDesignCentralNJ). Hero, cost answer and FAQ rewritten 2026-10-16.
export default function WebDesignCentralNjPage() {
  return (
    <>
      <JsonLd data={legacyJsonLd(ROUTE)} />
      <PageHero
        label="[WEB DESIGN // CENTRAL NEW JERSEY]"
        title={
          <>
            <span className="serif-accent text-accent">Central New Jersey</span> web design for home-service and local businesses.
          </>
        }
        lead="Orbit Websites is a Plainsboro, NJ studio that designs and hand-codes websites for home-service and local businesses across Central Jersey: Princeton, West Windsor, Ewing, Hamilton, Lawrence, Hopewell, Trenton, Robbinsville and East Windsor in Mercer County, plus Plainsboro and Bordentown. You own the finished site."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={site.phoneHref} icon="phone">
            Call {site.phoneDisplay}
          </Button>
          <Button href="/quote" variant="ghost">
            Get a project range
          </Button>
        </div>
      </PageHero>

      <Section label="What our web design includes">
        <SectionTitle>What our web design includes.</SectionTitle>
        <NumberedCards items={webDesignIncludes} />
      </Section>

      <Section label="Towns we design websites for">
        <SectionTitle>Towns we design websites for.</SectionTitle>
        <ul className="mt-10 border-t border-line">
          {webDesignTowns.map(([town, copy]) => (
            <li key={town} data-reveal className="grid gap-3 border-b border-line py-7 md:grid-cols-12 md:items-baseline md:gap-8">
              <h3 className="display text-2xl md:col-span-4 md:text-3xl">{town}</h3>
              <p className="leading-relaxed text-muted md:col-span-8">{copy}</p>
            </li>
          ))}
        </ul>
      </Section>

      <DirectAnswer
        question="How much does a website cost in Central NJ?"
        links={
          <>
            <ArrowLink href="/blog/custom-website-cost-central-nj">Custom website cost in Central NJ →</ArrowLink>
            <ArrowLink href="/blog/web-design-cost-factors-mercer-county-nj" muted>
              Mercer County web design pricing →
            </ArrowLink>
            <ArrowLink href="/pricing" muted>
              Full website pricing →
            </ArrowLink>
          </>
        }
      >
        Launch builds are quoted on a free call and built in a 7-day sprint. Premium builds start at $3,500, AI operations builds run $5,000–$15,000+, and optional monthly
        plans are $300–$700 after launch.
      </DirectAnswer>

      <LocalPagesGrid current={ROUTE} />

      <Section label="Who we work with">
        <SectionTitle>Built for businesses that take growth seriously.</SectionTitle>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div data-reveal className="rounded-[var(--radius)] border border-accent/30 bg-panel/70 p-6 md:p-8">
            <MonoLabel>[A strong fit if]</MonoLabel>
            <ul className="mt-6 grid gap-4">
              {webDesignFit.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal className="rounded-[var(--radius)] border border-line bg-panel/40 p-6 md:p-8">
            <MonoLabel className="text-dim">[Probably not a fit if]</MonoLabel>
            <ul className="mt-6 grid gap-4 text-muted">
              {webDesignNotFit.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed">
                  <span className="mt-2.5 h-px w-3 shrink-0 bg-dim" aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="local-faq" label="Common questions">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionTitle>Common questions.</SectionTitle>
          </div>
          <div className="md:col-span-8">
            <Accordion items={centralNjFaqs.map(([q, a]) => ({ q, a }))} defaultOpen={0} />
          </div>
        </div>
      </Section>

      <CtaBand title="Let's talk about your Central NJ website." />
    </>
  )
}
