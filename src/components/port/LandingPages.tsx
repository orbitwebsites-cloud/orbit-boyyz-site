import type { IndustryPage, TownPage } from '@/content/landing'
import { site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowLink, DirectAnswer, LandingFaq, LocalPagesGrid, NumberedCards, Section, SectionTitle } from './Blocks'

type Faq = [string, string]

/** Old townLandingFaqs() — verbatim. */
export function townLandingFaqs(page: TownPage): Faq[] {
  return [
    [
      `How much does web design cost in ${page.town}?`,
      `A focused starter website for a ${page.town} business usually ranges from $150 to $400. AI intake, booking logic, quote routing, and deeper custom design can move the project into the $5,000 to $15,000 range.`,
    ],
    [
      `Do you work with businesses near ${page.town}?`,
      `Yes. Orbit Websites serves ${page.town}, ${page.county}, and nearby areas including ${page.nearby}. Pages should only target towns where the business actually works.`,
    ],
    [
      'What makes a local business website convert?',
      'The highest-converting local websites make the next step obvious: call, request a quote, book a visit, or start intake. The page also needs clear services, proof, service-area context, fast mobile performance, and pricing or budget guidance.',
    ],
  ]
}

/** Old industryLandingFaqs() — verbatim. */
export function industryLandingFaqs(page: IndustryPage): Faq[] {
  const lower = page.industryShort.toLowerCase()
  return [
    [
      `How much does a website cost for a ${lower} company in NJ?`,
      `A focused starter site for a ${lower} company usually ranges from $150 to $400. AI intake, routing, booking, proposal logic, and deeper custom workflows usually move the project into the $5,000 to $15,000 range.`,
    ],
    [
      `What should a ${lower} website include?`,
      `A strong ${lower} website should include service details, local service areas, trust signals, clear calls to action, mobile-first pages, and an intake path built around ${page.jobType}.`,
    ],
    [
      'When does AI intake make sense?',
      `AI intake makes sense when faster response or better qualification can recover revenue. For ${lower} businesses, it can collect the details staff need before calling back and route higher-value requests sooner.`,
    ],
  ]
}

export function HeroActions({ quoteHref }: { quoteHref: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button href={site.phoneHref} icon="phone">
        Call {site.phoneDisplay}
      </Button>
      <Button href={quoteHref} variant="ghost">
        Get a range
      </Button>
      <Button href="/pricing" variant="ghost">
        See pricing
      </Button>
    </div>
  )
}

export function TownLanding({ page }: { page: TownPage }) {
  const cards: Array<[string, string]> = [
    ['Local SEO structure', `Service, town, FAQ, and proof sections help search engines understand that your business serves ${page.town}, ${page.county}, and nearby areas like ${page.nearby}.`],
    ['Lead-focused pages', 'The site is structured around calls, quote requests, booking paths, and forms instead of generic brochure sections.'],
    ['Fast mobile performance', 'Hand-coded React and prerendered pages keep the experience lightweight for local buyers comparing options from a phone.'],
    ['AI intake when it makes sense', 'AI qualification, routing, and proposal workflows are added when lead value and response speed justify the investment.'],
  ]

  return (
    <>
      <PageHero
        label={page.label}
        title={
          <>
            Web design for <span className="serif-accent text-accent">{page.town}</span> local businesses.
          </>
        }
        lead={`Orbit Websites builds hand-coded websites and AI intake systems for ${page.town} businesses that need more calls, quote requests, bookings, and qualified leads from local search. Starter websites usually range from $150 to $400, with AI intake builds starting around $5,000 when faster response can pay for itself.`}
      >
        <HeroActions quoteHref={`/quote?source=${encodeURIComponent(page.path)}`} />
      </PageHero>

      <LocalPagesGrid current={page.path} />

      <Section label="What you get">
        <SectionTitle>Built for {page.town} businesses that need measurable leads.</SectionTitle>
        <NumberedCards items={cards} />
      </Section>

      <DirectAnswer question={`How much does web design cost in ${page.town}?`}>
        A starter website for a {page.town} local business usually ranges from $150 to $400 for a focused site. AI-powered lead intake, booking logic, routing, and
        proposal workflows usually move the project into the $5,000 to $15,000 range, depending on integrations and workflow complexity.
      </DirectAnswer>

      <LandingFaq label="[LOCAL FAQ]" heading={`Questions ${page.town} businesses ask before hiring.`} items={townLandingFaqs(page)} />

      <CtaBand title={`Ready for a better ${page.town.replace(/, NJ$/, '')} website?`} />
    </>
  )
}

export function IndustryLanding({ page }: { page: IndustryPage }) {
  const lower = page.industryShort.toLowerCase()
  const cards: Array<[string, string]> = [
    ['Local search visibility', `The site is structured to rank for service-specific and town-specific searches — "${lower} near me", "${lower} ${page.towns.split(',')[0]}", and job-type variations.`],
    ['AI-powered intake', page.aiUseCase],
    ['Fast mobile performance', `Most local buyers compare options on mobile. Hand-coded React and prerendered pages stay lightweight so a buyer comparing ${lower} companies doesn't bounce before calling.`],
    ['Built to convert', `Every page is structured around ${page.jobType} — quote requests, click-to-call, booking, and contact forms — not generic brochure copy.`],
  ]

  return (
    <>
      <PageHero
        label={page.label}
        title={
          <>
            Web design for <span className="serif-accent text-accent">{page.industryShort}</span> companies in NJ.
          </>
        }
        lead={`Orbit Websites builds hand-coded websites and AI intake systems for ${page.industry} in ${page.towns}. We build around ${page.jobType} — not vanity traffic. Starter builds usually range from $150 to $400, with AI-powered lead intake starting around $5,000 when faster response can pay for itself.`}
      >
        <HeroActions quoteHref={`/quote?source=${encodeURIComponent(page.path)}`} />
      </PageHero>

      <LocalPagesGrid />

      <Section label="What you get">
        <SectionTitle>Built for {page.industry} that need real leads.</SectionTitle>
        <NumberedCards items={cards} />
      </Section>

      <DirectAnswer
        question={`How much does a website cost for a ${lower} company in NJ?`}
        links={
          <>
            <ArrowLink href="/pricing">See pricing →</ArrowLink>
            <ArrowLink href="/services" muted>
              Our services →
            </ArrowLink>
            <ArrowLink href="/web-design-central-nj" muted>
              Web design in Central NJ →
            </ArrowLink>
          </>
        }
      >
        A starter site for a {lower} company typically ranges from $150 to $400 for a focused site. Projects with AI intake, job-type routing, emergency alert logic, or
        proposal automation usually run $5,000 to $15,000 depending on workflow complexity. Average {page.jobType} run {page.avgJob}, so the site pays back in a handful of
        jobs.
      </DirectAnswer>

      <LandingFaq label="[INDUSTRY FAQ]" heading={`Questions ${lower} businesses ask before hiring.`} items={industryLandingFaqs(page)} />

      <CtaBand title={`Let's build your ${page.industryShort} website.`} />
    </>
  )
}
