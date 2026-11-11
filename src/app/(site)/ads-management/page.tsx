import { BookedScene } from '@/components/agency/BookedScene'
import { Cta } from '@/components/agency/Cta'
import { Faq } from '@/components/agency/Faq'
import { Hero } from '@/components/agency/Hero'
import { Manifesto } from '@/components/agency/Manifesto'
import { MetricsScene } from '@/components/agency/MetricsScene'
import { AdsPricing } from '@/components/agency/OfferBlocks'
import { WebsiteScene } from '@/components/agency/WebsiteScene'
import { faqSchema, jsonLd, pageMeta, pageSchema } from '@/lib/seo'

const PATH = '/ads-management'

export const metadata = pageMeta({
  title: 'Facebook Ads Management for NJ Home-Service Businesses',
  description:
    'We run your ads in your own account, build the landing page, and text every lead to book the estimate. Pay per booking to start, then a monthly retainer.',
  path: PATH,
})

const QUESTIONS: [string, string][] = [
  ['How do you charge?', 'Per booking to start. When the bookings add up to more than a flat fee would cost you, we move you to a monthly retainer.'],
  ['Do you take my ad budget?', 'No. Ads run in your own account and you pay Meta directly. We never hold your ad spend.'],
  ['How do leads agree to be texted?', 'Your form has a consent box. Nobody gets a text unless they ticked it.'],
  ['Who is this for?', 'Home-service businesses in New Jersey, especially remodelers: kitchens, baths, basements and windows.'],
  ['What do I have to do?', 'Show up to the estimate and sell the job. We handle the ads, the page, the texting and the booking.'],
  ['Is the call really free?', 'Yes. 30 minutes, free, weekdays 5 PM ET or later. You decide afterwards whether to go ahead.'],
]

/** /ads-management: the first offer on its own page. */
export default function AdsManagementPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageSchema(PATH))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(QUESTIONS.map(([q, a]) => ({ q, a })), PATH))} />
      <Hero theme="light" label="OrbitBoyzz · Ads management for home-service businesses" lines={['Ads that end in', 'booked']} accent="estimates." />
      <Manifesto
        theme="dark"
        paragraphs={[
          { text: 'Getting the lead is the easy part. Most of them go cold in the hours after the form is filled out, waiting on a call back.' },
          {
            text: 'So we run the ads in your account, build the page they land on, and text every lead until the estimate is on your calendar.',
            accent: ['ads', 'page', 'text', 'calendar.'],
          },
        ]}
      />
      <MetricsScene />
      <BookedScene />
      <WebsiteScene label="The page behind the ad" lead="A page that" em="asks for the job." />
      <AdsPricing />
      <Faq questions={QUESTIONS} />
      <Cta />
    </>
  )
}
