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
import { jsonLd, localBusinessSchema, websiteSchema } from '@/lib/seo'

// Preloader (section 1) and Footer (section 13) are global, in app/layout.tsx.
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(localBusinessSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(websiteSchema())} />
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
