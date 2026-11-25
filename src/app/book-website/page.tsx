import type { Metadata, Viewport } from 'next'
import BookFlow from '@/components/book/BookFlow'
import { websiteBookFlow } from '@/content/bookFlow'

// /book-website: the booking flow for the website offer, for businesses we call
// or text about a new website. Three quick questions about their site, contact
// details, then the Calendly calendar; under the first question sits the trust
// section (what the call is, how the build works, who we are). Same component
// as /book, with its own copy: websiteBookFlow in content/bookFlow.ts.
// Standalone: outside the (site) route group, so none of the site's preloader,
// nav, footer, dock or cursor is rendered or shipped here.
// SEO: noindex,nofollow with no canonical; excluded from sitemap.xml (and so
// from IndexNow) in app/sitemap.ts.
export const metadata: Metadata = {
  title: { absolute: 'Book a call about your website | OrbitBoyzz' },
  description: 'Three quick questions, then pick a time for a free 30-minute call about a new website for your business, weekdays 5 PM ET or later.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
  colorScheme: 'dark',
}

export default function BookWebsitePage() {
  return (
    <main id="main">
      <BookFlow flow={websiteBookFlow} />
    </main>
  )
}
