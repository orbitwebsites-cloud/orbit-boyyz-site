import type { Metadata } from 'next'
import { BookedScene } from '@/components/agency/BookedScene'
import { Cta } from '@/components/agency/Cta'
import { Faq, HOME_QUESTIONS } from '@/components/agency/Faq'
import { Hero } from '@/components/agency/Hero'
import { LeadsScene } from '@/components/agency/LeadsScene'
import { Manifesto } from '@/components/agency/Manifesto'
import { MetricsScene } from '@/components/agency/MetricsScene'
import { Paths } from '@/components/agency/Paths'
import { WebsiteScene } from '@/components/agency/WebsiteScene'
import { legacyPageMeta } from '@/lib/legacy-seo'
import { faqSchema, jsonLd, localBusinessSchema, websiteSchema } from '@/lib/seo'

// Title + description live in the shared per-route table (lib/legacy-seo).
const { title, description } = legacyPageMeta['/']
const social = 'OrbitBoyzz: marketing that ends in booked jobs.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', siteName: 'OrbitBoyzz', locale: 'en_US', url: '/', title: social, description },
  twitter: { card: 'summary_large_image', title: social, description },
}

// The FAQ schema lists exactly the questions the page shows.
const homeFaq = HOME_QUESTIONS.map(([q, a]) => ({ q, a }))

/** Homepage: the two marketing offers, ads management then cold lead generation. */
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(localBusinessSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(homeFaq, '/'))} />
      <Hero
        theme="dark"
        label="OrbitBoyzz · Ads management + cold lead generation"
        lines={['Marketing that', 'ends in']}
        accent="booked jobs."
      />
      <Manifesto
        theme="light"
        paragraphs={[
          { text: 'Most agencies send you a report full of clicks and impressions. You cannot put a click on a calendar.' },
          {
            text: 'We run the ads, build the page, and text every lead until there is an estimate on your calendar. Then we count those.',
            accent: ['ads,', 'page,', 'text', 'calendar.'],
          },
        ]}
      />
      <div className="bg-paper">
        <MetricsScene />
      </div>
      <BookedScene />
      <WebsiteScene label="The page behind the ad" lead="A page that" em="asks for the job." />
      <LeadsScene />
      <Paths />
      <Faq />
      <Cta />
    </>
  )
}
