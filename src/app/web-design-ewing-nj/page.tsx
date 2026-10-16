import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowLink, DirectAnswer, LandingFaq, LocalPagesGrid, NumberedCards, Section, SectionTitle } from '@/components/port/Blocks'
import { HeroActions } from '@/components/port/LandingPages'
import { ewingFaqs } from '@/content/landing'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

const ROUTE = '/web-design-ewing-nj'

export const metadata = legacyMetadata(ROUTE)

// Ewing had its own custom layout in the old App.tsx (WebDesignEwingNJ). Hero, Ewing cards and cost answer rewritten 2026-10-16.
const CARDS: Array<[string, string]> = [
  ['Across the river', 'The Scudder Falls Bridge connects Ewing to Lower Makefield and Yardley, PA. If you take Pennsylvania jobs, list those towns and show each state’s contractor registration, so customers on both sides see you are set up to work there.'],
  ['TCNJ, the airport and rentals', 'Ewing is home to The College of New Jersey and Trenton-Mercer Airport, with a mix of single-family streets and rentals. A form that asks owner or landlord, plus the address and a photo, saves a round of phone tag.'],
  ['Local SEO structure', 'Service, town, FAQ, and proof sections help search engines and AI assistants understand what you do in Ewing and Mercer County.'],
  ['Conversion paths', 'Calls, quote forms, booking links, and AI intake flows are placed around the actions that create real customer conversations.'],
]

const FAQS = ewingFaqs

export default function WebDesignEwingPage() {
  return (
    <>
      <JsonLd data={legacyJsonLd(ROUTE)} />
      <PageHero
        label="[WEB DESIGN // EWING NJ]"
        title={
          <>
            Web design for <span className="serif-accent text-accent">Ewing, NJ</span> home-service businesses.
          </>
        }
        lead="Orbit Websites builds websites for home-service companies in Ewing Township, Mercer County, from West Trenton to the Pennington Road (Route 31) and Route 29 river corridors. Ewing sits between Trenton, Lawrence and Hopewell Township, across the Delaware from Bucks County, PA, so some crews here work both sides of the river."
      >
        <HeroActions quoteHref="/quote?source=web-design-ewing-nj" />
      </PageHero>

      <LocalPagesGrid current={ROUTE} />

      <Section label="What you get">
        <SectionTitle>Built for Ewing service businesses competing on trust.</SectionTitle>
        <NumberedCards items={CARDS} />
      </Section>

      <DirectAnswer
        question="How much does web design cost in Ewing, NJ?"
        links={
          <>
            <ArrowLink href="/blog/web-design-cost-factors-mercer-county-nj">What drives web design cost in Mercer County →</ArrowLink>
            <ArrowLink href="/pricing" muted>
              Full website pricing →
            </ArrowLink>
          </>
        }
      >
        Launch builds for Ewing businesses are quoted on a free call and premium builds start at $3,500, the same tiers Orbit Websites uses in every town it serves.
      </DirectAnswer>

      <LandingFaq label="[LOCAL FAQ]" heading="Questions Ewing businesses ask before hiring." items={FAQS} />

      <CtaBand title="Ready for a better Ewing website?" />
    </>
  )
}
