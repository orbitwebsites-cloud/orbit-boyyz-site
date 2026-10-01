import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { PricingPreview } from '@/components/sections/PricingPreview'
import { Problem } from '@/components/sections/Problem'
import { Process } from '@/components/sections/Process'
import { Roi } from '@/components/sections/Roi'
import { Services } from '@/components/sections/Services'
import { SpeedProof } from '@/components/sections/SpeedProof'
import { Work } from '@/components/sections/Work'
import type { Metadata } from 'next'
import { faqs } from '@/content/site'
import { faqSchema, jsonLd, localBusinessSchema, websiteSchema } from '@/lib/seo'

const description =
  'Hand-coded websites and AI intake & booking systems for home-service businesses in Plainsboro, Princeton and Central New Jersey.'
const social = 'Orbit Websites — Your website should book jobs, not just sit there.'

export const metadata: Metadata = {
  title: { absolute: 'Orbit Websites — Custom websites & AI systems for Central NJ' },
  description,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', siteName: 'Orbit Websites', locale: 'en_US', url: '/', title: social, description },
  twitter: { card: 'summary_large_image', title: social, description },
}

// Preloader (section 1) and Footer (section 13) are global, in app/layout.tsx.
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(localBusinessSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs.slice(0, 6), '/'))} />
      <Hero />
      <Marquee />
      <Problem />
      <Services />
      <Work />
      <Roi />
      <Process />
      <SpeedProof />
      <PricingPreview />
      <Faq />
      <FinalCta />
    </>
  )
}
