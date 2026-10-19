import type { Metadata, Viewport } from 'next'
import Sample from '@/components/sample/Sample'
import '@/components/qualify/qualify.css'
import '@/components/sample/sample.css'

// /sample — request form for a free 25-lead sample, written for telecom
// advisors and brokers. Private: shared by direct link only, on both
// orbitboyzz.com/sample and leads.orbitboyzz.com/sample (src/proxy.ts passes
// it through on the leads host). Not linked from any page.
// Standalone: outside the (site) route group, so none of Orbit's preloader,
// nav, footer, dock or cursor is rendered or shipped here.
// SEO: noindex,nofollow with no canonical; excluded from sitemap.xml (and so
// from IndexNow) in app/sitemap.ts, and not listed in feed.xml or llms.txt.
export const metadata: Metadata = {
  title: { absolute: 'Get your free 25-lead sample | Orbit Boyzz' },
  description:
    'Tell us who you help and we’ll build 25 businesses that fit, each with a verified email, a business phone number and the decision-maker where public sources show it.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f2e9' },
    { media: '(prefers-color-scheme: dark)', color: '#060606' },
  ],
  colorScheme: 'light dark',
}

export default function SamplePage() {
  return (
    <main id="main">
      <Sample />
    </main>
  )
}
