import { notFound } from 'next/navigation'
import { industryPages, townPages } from '@/content/landing'
import { IndustryLanding, TownLanding } from '@/components/port/LandingPages'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

// Root-level landing pages ported from the old site:
//   /web-design-<town>-nj            (9 generic towns — Ewing + Central NJ have their own folders)
//   /website-design-for-<industry>-nj (7 industries)
// Static folders always win over this dynamic segment, and dynamicParams=false
// makes every other root path 404.
export const dynamicParams = false

type Entry = { kind: 'town'; page: (typeof townPages)[string] } | { kind: 'industry'; page: (typeof industryPages)[string] }

const ENTRIES = new Map<string, Entry>([
  ...Object.values(townPages).map((page) => [page.path.slice(1), { kind: 'town', page }] as const),
  ...Object.values(industryPages).map((page) => [page.path.slice(1), { kind: 'industry', page }] as const),
])

export function generateStaticParams() {
  return [...ENTRIES.keys()].map((landing) => ({ landing }))
}

export async function generateMetadata({ params }: PageProps<'/[landing]'>) {
  const { landing } = await params
  if (!ENTRIES.has(landing)) return {}
  return legacyMetadata(`/${landing}`)
}

export default async function LandingPage({ params }: PageProps<'/[landing]'>) {
  const { landing } = await params
  const entry = ENTRIES.get(landing)
  if (!entry) notFound()

  return (
    <>
      <JsonLd data={legacyJsonLd(entry.page.path)} />
      {entry.kind === 'town' ? <TownLanding page={entry.page} /> : <IndustryLanding page={entry.page} />}
    </>
  )
}
