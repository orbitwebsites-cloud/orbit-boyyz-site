import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LEADS_BOOK_PATH } from '@/lib/leadsSite'

// /sample used to be the free lead sample request for telecom advisors, shared
// by direct link. That offer is gone: the link now goes to the lead-list
// booking flow (/book-leads), keeping ?src=.
// On leads.orbitboyzz.com, src/proxy.ts sends /sample there before this runs.
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default async function SamplePage({ searchParams }: { searchParams: Promise<{ src?: string | string[] }> }) {
  const { src } = await searchParams
  const source = Array.isArray(src) ? src[0] : src
  redirect(source ? `${LEADS_BOOK_PATH}?src=${encodeURIComponent(source)}` : LEADS_BOOK_PATH)
}
