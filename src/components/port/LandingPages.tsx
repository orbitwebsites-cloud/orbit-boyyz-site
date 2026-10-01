import { townLandingFaqs, type IndustryPage, type TownPage } from '@/content/landing'
import { site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowLink, DirectAnswer, LandingFaq, LocalPagesGrid, NumberedCards, Section, SectionTitle } from './Blocks'

type Faq = [string, string]

/** Old industryLandingFaqs() — verbatim. */
export function industryLandingFaqs(page: IndustryPage): Faq[] {
  const lower = page.industryShort.toLowerCase()
  return [
    [
      `How much does a website cost for a ${lower} company in NJ?`,
      `A focused launch site for a ${lower} company is quoted on a free call after a quick look at your needs, and premium builds start at $3,500. AI intake, routing, booking, proposal logic, and deeper custom workflows run $5,000 to $15,000+, and optional care plans are $300–$700/mo.`,
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
    ...page.local,
    ['Service-area structure', `Clear service, town, and FAQ sections tell customers and search engines that you work in ${page.town}, ${page.county}, and nearby ${page.nearby}.`],
    ['Built around calls and quotes', 'Click-to-call, quote requests, and booking paths come first, with AI intake added only when lead value and response speed justify it.'],
  ]

  return (
    <>
      <PageHero
        label={page.label}
        title={
          <>
            Web design for <span className="serif-accent text-accent">{page.town}</span> home-service businesses.
          </>
        }
        lead={page.intro}
      >
        <HeroActions quoteHref={`/quote?source=${encodeURIComponent(page.path)}`} />
      </PageHero>

      <LocalPagesGrid current={page.path} />

      <Section label="What you get">
        <SectionTitle>Built for {page.audience} in {page.town}.</SectionTitle>
        <NumberedCards items={cards} />
      </Section>

      <DirectAnswer question={`How much does web design cost in ${page.town}?`}>
        A launch website for a {page.town} local business is quoted on a free call after a quick look at your needs: a 7-day sprint, 50% to start and 50% on approval.
        Premium builds start at $3,500. AI-powered lead intake, booking logic, routing, and proposal workflows run $5,000 to $15,000+, depending on integrations and
        workflow complexity, and optional monthly plans are $300–$700/mo.
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
            Web design for <span className="serif-accent text-accent">{page.industry}</span> in NJ.
          </>
        }
        lead={`Orbit Websites builds hand-coded websites and AI intake systems for ${page.industry} in ${page.towns}. We build around ${page.jobType} — not vanity traffic. Launch builds are quoted on a free call, premium builds start at $3,500, and AI-powered lead intake runs $5,000–$15,000+ when faster response can pay for itself.`}
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
        A launch site for a {lower} company is quoted on a free call after a quick look at your needs, and premium builds start at $3,500. Projects with AI intake,
        job-type routing, emergency alert logic, or proposal automation run $5,000 to $15,000+ depending on workflow complexity, and optional care plans are $300–$700/mo. Average {page.jobType} run {page.avgJob}, so the site pays back in a handful of
        jobs.
      </DirectAnswer>

      <LandingFaq label="[INDUSTRY FAQ]" heading={`Questions ${lower} businesses ask before hiring.`} items={industryLandingFaqs(page)} />

      <CtaBand title={`Let's build your ${page.industryShort} website.`} />
    </>
  )
}
