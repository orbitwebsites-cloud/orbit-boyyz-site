import type { Metadata, Viewport } from 'next'
import Sample from '@/components/sample/Sample'
import '@/components/qualify/qualify.css'
import '@/components/sample/sample.css'

// /sample — request form for a free 100-lead sample, written for telecom
// advisors and brokers. Private: shared by direct link only, on both
// orbitboyzz.com/sample and leads.orbitboyzz.com/sample (src/proxy.ts passes
// it through on the leads host, like /qualify). Not linked from any page.
// Standalone: <SiteChrome> drops Orbit's preloader, nav, footer, dock and
// cursor on this path (src/lib/demoPath.ts → isStandalonePath).
// SEO: noindex,nofollow with no canonical; excluded from sitemap.xml (and so
// from IndexNow) in app/sitemap.ts, and not listed in feed.xml or llms.txt.
export const metadata: Metadata = {
  title: { absolute: 'Get your free 100-lead sample | Orbit Boyzz' },
  description:
    'Tell us who you help and we’ll build 100 businesses that look ready to switch or renew, with the decision-maker, a verified email and a phone number.',
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
  return <Sample />
}
