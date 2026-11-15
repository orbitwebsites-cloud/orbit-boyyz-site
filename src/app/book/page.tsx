import type { Metadata, Viewport } from 'next'
import BookFlow from '@/components/book/BookFlow'

// /book: the short flow every "Book a free call" button on the site leads to
// (site.booking). Three quick marketing questions, contact details, then the
// Calendly calendar. Under the first question sits the trust section (what the
// call is, how we get paid, who we are): components/book/BookTrust.tsx, with
// copy and its rules in content/bookFlow.ts.
// Standalone: outside the (site) route group, so none of the site's preloader,
// nav, footer, dock or cursor is rendered or shipped here.
// SEO: noindex,nofollow with no canonical; excluded from sitemap.xml (and so
// from IndexNow) in app/sitemap.ts.
export const metadata: Metadata = {
  title: { absolute: 'Book a free call | OrbitBoyzz' },
  description: 'Three quick questions, then pick a time for a free 30-minute marketing call with OrbitBoyzz, weekdays 5 PM ET or later.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
  colorScheme: 'dark',
}

export default function BookPage() {
  return (
    <main id="main">
      <BookFlow />
    </main>
  )
}
