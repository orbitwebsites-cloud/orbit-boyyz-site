// Registry of the keyword landing pages: the one place that wires a page file
// into the site. Routing (app/[landing]), metadata + canonical and JSON-LD
// (lib/legacy-seo), sitemap.xml, the markdown variant (proxy.ts), the footer
// and the "who we build for" grids all read this list.
//
// Page agents edit only their own content file; the wiring below (kind, labels,
// NJ counterpart) stays here so a copy change can never break navigation.
import type { KeywordPage, KeywordPagePath } from './types'
import { homeServiceWebsiteDesign } from './home-service-website-design'
import { seoForContractors } from './seo-for-contractors'
import { webDesignNewJersey } from './web-design-new-jersey'
import { websiteDesignForElectricians } from './website-design-for-electricians'
import { websiteDesignForHvacCompanies } from './website-design-for-hvac-companies'
import { websiteDesignForLandscapers } from './website-design-for-landscapers'
import { websiteDesignForPlumbers } from './website-design-for-plumbers'
import { websiteDesignForRoofers } from './website-design-for-roofers'

/** hub: links every trade · trade: one trade · topic: a service across trades · location: a place. */
export type KeywordKind = 'hub' | 'trade' | 'topic' | 'location'

export type KeywordRoute = {
  path: KeywordPagePath
  kind: KeywordKind
  /** Card label in the "who we build for" grid. */
  navLabel: string
  /** Mono line under the card label. */
  navNote: string
  /** Footer link label. */
  footerLabel: string
  /** The older New Jersey page for the same trade (src/content/landing.ts industryPages), linked both ways. */
  nj?: { path: string; label: string }
  page: KeywordPage
}

/** Display order: hub, the five trades, then SEO and New Jersey. */
export const keywordRoutes: readonly KeywordRoute[] = [
  {
    path: '/home-service-website-design',
    kind: 'hub',
    navLabel: 'All home-service trades',
    navNote: 'Website design',
    footerLabel: 'Home-service websites',
    page: homeServiceWebsiteDesign,
  },
  {
    path: '/website-design-for-plumbers',
    kind: 'trade',
    navLabel: 'Plumbers',
    navNote: 'Website design',
    footerLabel: 'Plumber websites',
    nj: { path: '/website-design-for-plumbers-nj', label: 'Plumber websites in NJ' },
    page: websiteDesignForPlumbers,
  },
  {
    path: '/website-design-for-hvac-companies',
    kind: 'trade',
    navLabel: 'HVAC companies',
    navNote: 'Website design',
    footerLabel: 'HVAC websites',
    nj: { path: '/website-design-for-hvac-companies-nj', label: 'HVAC websites in NJ' },
    page: websiteDesignForHvacCompanies,
  },
  {
    path: '/website-design-for-electricians',
    kind: 'trade',
    navLabel: 'Electricians',
    navNote: 'Website design',
    footerLabel: 'Electrician websites',
    nj: { path: '/website-design-for-electricians-nj', label: 'Electrician websites in NJ' },
    page: websiteDesignForElectricians,
  },
  {
    path: '/website-design-for-roofers',
    kind: 'trade',
    navLabel: 'Roofers',
    navNote: 'Website design',
    footerLabel: 'Roofing websites',
    page: websiteDesignForRoofers,
  },
  {
    path: '/website-design-for-landscapers',
    kind: 'trade',
    navLabel: 'Landscapers & lawn care',
    navNote: 'Website design',
    footerLabel: 'Landscaping websites',
    nj: { path: '/website-design-for-landscaping-companies-nj', label: 'Landscaping websites in NJ' },
    page: websiteDesignForLandscapers,
  },
  {
    path: '/seo-for-contractors',
    kind: 'topic',
    navLabel: 'SEO for contractors',
    navNote: 'Local SEO',
    footerLabel: 'SEO for contractors',
    page: seoForContractors,
  },
  {
    path: '/web-design-new-jersey',
    kind: 'location',
    navLabel: 'New Jersey businesses',
    navNote: 'Web design in NJ',
    footerLabel: 'New Jersey',
    page: webDesignNewJersey,
  },
]

export const keywordRouteByPath: ReadonlyMap<string, KeywordRoute> = new Map(keywordRoutes.map((r) => [r.path, r]))

export const KEYWORD_PATHS: ReadonlySet<string> = new Set(keywordRoutes.map((r) => r.path))

/** Placeholder pages: noindex and kept out of sitemap.xml until their copy is written. */
export const DRAFT_KEYWORD_PATHS: ReadonlySet<string> = new Set(keywordRoutes.filter((r) => r.page.draft).map((r) => r.path))

export const HUB_PATH = '/home-service-website-design'
export const NJ_PATH = '/web-design-new-jersey'

export type { KeywordPage, KeywordPagePath } from './types'
