import type { Metadata } from 'next'
import { Intake } from '@/components/intake/Intake'

// /intake: the questions we ask before a first call. Sent to people directly,
// not linked from the site, and kept out of search.
export const metadata: Metadata = {
  title: 'Before your call',
  description: 'A few questions so we can prepare for your call.',
  robots: { index: false, follow: false },
}

export default function IntakePage() {
  return <Intake />
}
