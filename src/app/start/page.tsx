import type { Metadata, Viewport } from 'next'
import { LeadInfoForm } from '@/components/lead/LeadInfoForm'

// /start: a one-screen form we text to a lead so they can send us their
// business info without booking a call. Saves to the CRM (source "start") and
// the inbox: components/lead/LeadInfoForm.tsx.
// Standalone: outside the (site) route group, like /book, so no preloader,
// nav, footer or scroll motion ships here.
// SEO: noindex,nofollow; kept out of sitemap.xml in app/sitemap.ts.
export const metadata: Metadata = {
  title: { absolute: 'Tell us about your business | OrbitBoyzz' },
  description: 'Send OrbitBoyzz your business info in about a minute. No call to book.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
  colorScheme: 'dark',
}

export default function StartPage() {
  return (
    <main id="main">
      <LeadInfoForm />
    </main>
  )
}
