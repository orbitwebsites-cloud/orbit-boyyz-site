import type { Metadata, Viewport } from 'next'
import Book from '@/components/book/Book'
import '@/components/qualify/qualify.css'
import '@/components/book/book.css'

// /book — the short questionnaire every "Book a call" button on the site
// leads to (site.booking); the Calendly scheduler loads on its last screen.
// The intro screen carries the proof (work, speed, process, the call, FAQ):
// components/book/BookProof.tsx, copy and its rules in content/bookProof.ts.
// Standalone: outside the (site) route group, so none of Orbit's preloader,
// nav, footer, dock or cursor is rendered or shipped here.
// SEO: noindex,nofollow with no canonical; excluded from sitemap.xml (and so
// from IndexNow) in app/sitemap.ts.
export const metadata: Metadata = {
  title: { absolute: 'Book a free call | Orbit Websites' },
  description: 'A few quick questions, then pick a time for a free 30-minute website call with Orbit Websites, weekdays 5 PM ET or later.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f2e9' },
    { media: '(prefers-color-scheme: dark)', color: '#060606' },
  ],
  colorScheme: 'light dark',
}

export default function BookPage() {
  return (
    <main id="main">
      <Book />
    </main>
  )
}
