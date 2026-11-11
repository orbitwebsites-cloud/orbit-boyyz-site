import { Cta } from '@/components/agency/Cta'
import { Faq } from '@/components/agency/Faq'
import { Hero } from '@/components/agency/Hero'
import { LeadsScene } from '@/components/agency/LeadsScene'
import { Manifesto } from '@/components/agency/Manifesto'
import { LeadsOffer } from '@/components/agency/OfferBlocks'
import { faqSchema, jsonLd, pageMeta, pageSchema } from '@/lib/seo'

const PATH = '/cold-leads'

export const metadata = pageMeta({
  title: 'Cold Lead Generation for Outreach Teams',
  description:
    'New leads every month for cold email, calls and texts. Built from Google Maps and each business’s own website, every email verified. $0.20 a lead, plans from 10,000 a month.',
  path: PATH,
})

const QUESTIONS: [string, string][] = [
  ['How much does it cost?', '$0.20 per lead. Plans start at 10,000 new leads a month, so the smallest plan is $2,000 a month.'],
  ['Where do the leads come from?', 'Each list is built when you ask for it, from Google Maps listings and each business’s own website.'],
  ['Are the emails verified?', 'Every email is checked with a verification service before the sheet ships. Only “valid” counts as verified.'],
  ['What is in each row?', 'Company, owner name and title where public sources show them, verified email, business phone, website, city and state, Google rating and review count.'],
  ['Can I try it first?', 'Yes. You can start with 25 free leads for your niche and area before committing to a plan.'],
  ['How do I get the leads?', 'As a sheet, one row per lead.'],
]

/** /cold-leads: the second offer on its own page. */
export default function ColdLeadsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageSchema(PATH))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(QUESTIONS.map(([q, a]) => ({ q, a })), PATH))} />
      <Hero theme="dark" label="OrbitBoyzz · Cold lead generation for outreach teams" lines={['Never run out of', 'people to']} accent="contact." />
      <Manifesto
        theme="light"
        paragraphs={[
          { text: 'Cold outreach stops when the list runs dry. Sequences end, callers sit idle, and the pipeline goes quiet a few weeks later.' },
          {
            text: 'We deliver new leads every month, built around who you sell to, with every email verified before it reaches you.',
            accent: ['every', 'month,', 'verified'],
          },
        ]}
      />
      <LeadsScene />
      <LeadsOffer />
      <Faq questions={QUESTIONS} />
      <Cta />
    </>
  )
}
