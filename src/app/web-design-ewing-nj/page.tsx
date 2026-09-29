import { CtaBand } from '@/components/ui/CtaBand'
import { PageHero } from '@/components/ui/PageHero'
import { DirectAnswer, LandingFaq, LocalPagesGrid, NumberedCards, Section, SectionTitle } from '@/components/port/Blocks'
import { HeroActions } from '@/components/port/LandingPages'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

const ROUTE = '/web-design-ewing-nj'

export const metadata = legacyMetadata(ROUTE)

// Ewing had its own custom layout + copy in the old App.tsx (WebDesignEwingNJ) — verbatim.
const CARDS: Array<[string, string]> = [
  ['Local SEO structure', 'Service, town, FAQ, and proof sections help search engines and AI assistants understand what you do in Ewing and Mercer County.'],
  ['Conversion paths', 'Calls, quote forms, booking links, and AI intake flows are placed around the actions that create real customer conversations.'],
  ['Fast hand-coded pages', 'Next.js, React, Tailwind, and prerendered pages keep the site lightweight for mobile visitors comparing local options.'],
  ['Automation when it pays', 'AI lead intake, routing, and proposal workflows are added when faster response can recover missed revenue or reduce admin work.'],
]

const FAQS: Array<[string, string]> = [
  [
    'How much does web design cost in Ewing, NJ?',
    'A focused starter website for an Ewing business usually ranges from $150 to $400. AI intake, booking logic, quote routing, and deeper custom design can move the project into the $5,000 to $15,000 range.',
  ],
  [
    'Do you work with businesses near Ewing?',
    'Yes. Orbit Websites serves Ewing Township, Mercer County, and nearby towns including Trenton, Lawrence, Hamilton, Princeton, and West Windsor.',
  ],
  [
    'What makes an Ewing local business website convert?',
    'The site needs clear services, local proof, fast mobile pages, direct click-to-call actions, quote or booking paths, and enough service-area context for buyers and search engines to understand the business quickly.',
  ],
]

export default function WebDesignEwingPage() {
  return (
    <>
      <JsonLd data={legacyJsonLd(ROUTE)} />
      <PageHero
        label="[WEB DESIGN // EWING NJ]"
        title={
          <>
            Web design for <span className="serif-accent text-accent">Ewing, NJ</span> local businesses.
          </>
        }
        lead="Orbit Websites builds hand-coded websites and AI intake systems for Ewing Township businesses that need more calls, quote requests, bookings, and qualified leads from local search. Starter website builds usually range from $150 to $400, with AI intake upgrades starting around $5,000 when the workflow can prove ROI."
      >
        <HeroActions quoteHref="/quote?source=web-design-ewing-nj" />
      </PageHero>

      <LocalPagesGrid current={ROUTE} />

      <Section label="What you get">
        <SectionTitle>Built for Ewing service businesses competing on trust.</SectionTitle>
        <NumberedCards items={CARDS} />
      </Section>

      <DirectAnswer question="How much does web design cost in Ewing, NJ?">
        A starter website for an Ewing, NJ local business usually ranges from $150 to $400 for a focused site. AI-powered lead intake, booking logic, routing, and proposal
        workflows usually move the project into the $5,000 to $15,000 range, depending on integrations and workflow complexity.
      </DirectAnswer>

      <LandingFaq label="[LOCAL FAQ]" heading="Questions Ewing businesses ask before hiring." items={FAQS} />

      <CtaBand title="Ready for a better Ewing website?" />
    </>
  )
}
