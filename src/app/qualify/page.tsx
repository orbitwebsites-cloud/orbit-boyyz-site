import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LEADS_BOOK_PATH } from '@/lib/leadsSite'

// /qualify used to be the free lead sample request, linked from agency outreach
// replies. That offer is gone: the links now go to the lead-list booking flow
// (/book-leads), keeping ?src= so the reply that sent them is still recorded.
// On leads.orbitboyzz.com, src/proxy.ts sends /qualify there before this runs.
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default async function QualifyPage({ searchParams }: { searchParams: Promise<{ src?: string | string[] }> }) {
  const { src } = await searchParams
  const source = Array.isArray(src) ? src[0] : src
  redirect(source ? `${LEADS_BOOK_PATH}?src=${encodeURIComponent(source)}` : LEADS_BOOK_PATH)
}
