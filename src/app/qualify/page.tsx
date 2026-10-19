import type { Metadata, Viewport } from 'next'
import Qualify from '@/components/qualify/Qualify'
import '@/components/qualify/qualify.css'

// /qualify — private booking step linked from agency outreach replies
// (prefill: ?n=<first name>&a=<agency>&e=<email>&d=<domain>).
// Standalone: outside the (site) route group, so none of Orbit's preloader,
// nav, footer, dock or cursor is rendered or shipped here.
// SEO: noindex,nofollow with no canonical; excluded from sitemap.xml (and so
// from IndexNow) in app/sitemap.ts, and not listed in feed.xml or llms.txt.
export const metadata: Metadata = {
  title: { absolute: 'Book your call | Orbit Boyzz' },
  description: 'A few quick questions before we book your call with Orbit Boyzz.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f2e9' },
    { media: '(prefers-color-scheme: dark)', color: '#060606' },
  ],
  colorScheme: 'light dark',
}

export default function QualifyPage() {
  return (
    <main id="main">
      <Qualify />
    </main>
  )
}
