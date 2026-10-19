import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { DemoSite } from '@/components/demo/DemoSite'
import { cleanTown, demoCopy, demoTitle, phoneLink } from '@/content/demoCopy'
import { demos, getDemo, isSampleDemo } from '@/content/demos'
import { site } from '@/content/site'
import './demo.css'

// Free demo homepages for leads: /demo/<slug>, one per entry in src/content/demos.ts
// (see DEMOS.md). Prebuilt at deploy; any other slug 404s.
// SEO: every page is noindex,nofollow with no canonical, and none are listed in
// sitemap.xml, feed.xml or llms.txt. /demo sits outside the (site) route group,
// so Orbit's nav and footer never render and the preview reads as the lead's own site.
export const dynamicParams = false

export function generateStaticParams() {
  return demos.map(({ slug }) => ({ slug }))
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export async function generateMetadata({ params }: PageProps<'/demo/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const demo = getDemo(slug)
  if (!demo) return {}
  const town = cleanTown(demo.town)
  const robots = { index: false, follow: false, googleBot: { index: false, follow: false } }
  // Fictional sample- demos are linked publicly as examples: never describe them as a real business's preview.
  if (isSampleDemo(demo.slug)) {
    const trade = demoCopy(demo.trade).label.toLowerCase()
    const description = `A sample demo homepage by Orbit Websites for a made-up ${trade} business in ${town}, NJ, with a fictional 555 number. Not a client site.`
    return {
      title: { absolute: `${demoTitle(demo)} (sample demo)` },
      description,
      applicationName: demo.name,
      robots,
      openGraph: { type: 'website', siteName: site.name, title: 'Sample demo homepage (fictional business)', description },
    }
  }
  return {
    title: { absolute: demoTitle(demo) },
    description: `${demo.name} — ${demoCopy(demo.trade).label} in ${town}, NJ. Call ${phoneLink(demo.phone).display}.`,
    applicationName: demo.name,
    robots,
    // What a texted/emailed link unfurls as. No og:url or canonical on purpose.
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `Free website preview for ${demo.name}`,
      description: `A preview homepage Orbit Websites built for ${demo.name} in ${town}, NJ. Not live yet.`,
    },
  }
}

export default async function DemoPage({ params }: PageProps<'/demo/[slug]'>) {
  const { slug } = await params
  const demo = getDemo(slug)
  if (!demo) notFound()
  return (
    <main id="main">
      <DemoSite demo={demo} />
    </main>
  )
}
