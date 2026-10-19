import { notFound } from 'next/navigation'
import { keywordRoutes } from '@/content/keyword-pages'
import { validateKeywordPages } from '@/content/keyword-pages/validate'
import { industryPages, townPages } from '@/content/landing'
import { KeywordLanding } from '@/components/port/KeywordLanding'
import { IndustryLanding, TownLanding } from '@/components/port/LandingPages'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

// Root-level landing pages:
//   /web-design-<town>-nj            (9 generic towns — Ewing + Central NJ have their own folders)
//   /website-design-for-<industry>-nj (4 home-service industries, ported from the old site)
//   keyword pages                     (src/content/keyword-pages: hub, 5 trades, SEO, New Jersey)
// Static folders always win over this dynamic segment, and dynamicParams=false
// makes every other root path 404.
export const dynamicParams = false

type Entry =
  | { kind: 'town'; page: (typeof townPages)[string] }
  | { kind: 'industry'; page: (typeof industryPages)[string] }
  | { kind: 'keyword'; route: (typeof keywordRoutes)[number] }

const ENTRIES = new Map<string, Entry>([
  ...Object.values(townPages).map((page) => [page.path.slice(1), { kind: 'town', page }] as const),
  ...Object.values(industryPages).map((page) => [page.path.slice(1), { kind: 'industry', page }] as const),
  ...keywordRoutes.map((route) => [route.path.slice(1), { kind: 'keyword', route }] as const),
])

export function generateStaticParams() {
  // Fails the build with a readable list if a keyword page links a missing post,
  // uses a price that is not in site.ts, or points at a non-sample demo.
  validateKeywordPages()
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

  if (entry.kind === 'keyword') {
    return (
      <>
        <JsonLd data={legacyJsonLd(entry.route.path)} />
        <KeywordLanding route={entry.route} />
      </>
    )
  }

  return (
    <>
      <JsonLd data={legacyJsonLd(entry.page.path)} />
      {entry.kind === 'town' ? <TownLanding page={entry.page} /> : <IndustryLanding page={entry.page} />}
    </>
  )
}
