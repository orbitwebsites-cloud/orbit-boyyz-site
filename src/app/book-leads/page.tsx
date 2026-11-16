import type { Metadata, Viewport } from 'next'
import BookFlow from '@/components/book/BookFlow'
import { leadsBookFlow } from '@/content/bookFlow'

// /book-leads: the booking flow for the lead-list offer. Every button on
// leads.orbitboyzz.com leads here, and so do the old /qualify and /sample
// links (they redirect). Three quick questions about lead data, contact
// details, then the Calendly calendar; under the first question sits the trust
// section (what the call is, how the lists are built, who we are). Same
// component as /book, with its own copy: leadsBookFlow in content/bookFlow.ts.
// Served on both orbitboyzz.com and leads.orbitboyzz.com (src/proxy.ts passes
// it through on the leads host).
// Standalone: outside the (site) route group, so none of the site's preloader,
// nav, footer, dock or cursor is rendered or shipped here.
// SEO: noindex,nofollow with no canonical; excluded from sitemap.xml (and so
// from IndexNow) in app/sitemap.ts.
export const metadata: Metadata = {
  title: { absolute: 'Book a call about lead lists | Orbit Boyzz' },
  description: 'Three quick questions, then pick a time for a free 30-minute call about verified lead lists for your niche, weekdays 5 PM ET or later.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
  colorScheme: 'dark',
}

export default function BookLeadsPage() {
  return (
    <main id="main">
      <BookFlow flow={leadsBookFlow} />
    </main>
  )
}
