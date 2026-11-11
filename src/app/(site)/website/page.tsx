import { Cta } from '@/components/agency/Cta'
import { Faq } from '@/components/agency/Faq'
import { Hero } from '@/components/agency/Hero'
import { Manifesto } from '@/components/agency/Manifesto'
import { WebsiteOffer } from '@/components/agency/WebsiteOffer'
import { WebsiteScene } from '@/components/agency/WebsiteScene'
import { Work } from '@/components/agency/Work'
import { TradeLinksGrid } from '@/components/port/TradeLinks'
import { faqSchema, jsonLd, pageMeta, pageSchema } from '@/lib/seo'

const PATH = '/website'

export const metadata = pageMeta({
  title: 'Website Design for New Jersey Home-Service Businesses',
  description:
    'Hand-coded websites built to turn visitors into calls, quotes and bookings. Designed with you on a call, built in seven days, and yours to keep.',
  path: PATH,
})

const QUESTIONS: [string, string][] = [
  ['Is the call really free?', 'Yes. 30 minutes, free, weekdays 5 PM ET or later. You decide afterwards whether to go ahead.'],
  ['How long does it take to launch?', 'A launch build runs on a seven-day sprint once scope and direction are clear. Bigger projects get a timeline you agree to before paying anything.'],
  ['How does payment work?', '50% reserves your build and starts the sprint. You approve the finished site before paying the other 50%.'],
  ['Why hand-coded instead of a website builder?', 'Speed and no platform limits. Builders load heavy scripts and plugins that slow a site down on phones. Hand-coded is lean and fast.'],
  ['Do I own the site?', 'Yes. Once you approve it and pay the balance, it is yours. Hosting with us is optional.'],
  ['What does a care plan cover?', 'Managed hosting, security updates, backups and content changes. Higher plans add local SEO upkeep and ongoing improvements.'],
]

/** /website: the website-design offer on its own page. */
export default function WebsitePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageSchema(PATH))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(QUESTIONS.map(([q, a]) => ({ q, a })), PATH))} />
      <Hero theme="light" label="OrbitBoyzz · Websites for NJ home-service businesses" lines={['A website that', 'asks for']} accent="the job." />
      <Manifesto
        theme="dark"
        paragraphs={[
          { text: 'Most local business websites just sit there. They look fine, load slow, and quietly lose the customer who was ready to call.' },
          {
            text: 'We build the opposite. A fast, clear site with one job: turning the visitor who is ready into a call, a quote or a booking.',
            accent: ['call,', 'quote', 'booking.'],
          },
        ]}
      />
      <WebsiteScene label="How we build it" lead="From wireframe to live" em="in seven days." />
      <Work />
      <WebsiteOffer />
      <TradeLinksGrid heading="Websites built for the trade you run." />
      <Faq questions={QUESTIONS} />
      <Cta />
    </>
  )
}
