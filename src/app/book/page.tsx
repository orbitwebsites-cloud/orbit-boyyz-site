import type { Metadata, Viewport } from 'next'
import Book from '@/components/book/Book'
import '@/components/qualify/qualify.css'

// /book — the short questionnaire every "Book a call" button on the site
// leads to (site.booking); the Calendly scheduler loads on its last screen.
// Standalone: <SiteChrome> drops Orbit's preloader, nav, footer, dock and
// cursor on this path (src/lib/demoPath.ts → isStandalonePath).
// SEO: noindex,nofollow with no canonical; excluded from sitemap.xml (and so
// from IndexNow) in app/sitemap.ts.
export const metadata: Metadata = {
  title: { absolute: 'Book a free call | Orbit Websites' },
  description: 'A few quick questions, then pick a time for a free website call with Orbit Websites.',
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
  return <Book />
}
