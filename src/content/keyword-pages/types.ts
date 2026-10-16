// Shared shape for the keyword landing pages (SEO plan 2026-10-16).
//
// One file per page lives next to this one (src/content/keyword-pages/<slug>.ts)
// and exports one `KeywordPage`. Everything else (route, metadata, canonical,
// JSON-LD, sitemap, markdown variant, llms.txt, footer and link grids) is wired
// in shared code from ./index.ts, so a page file only ever holds copy.
//
// Honesty rules (enforced in part by ./validate.ts at build time):
// - Facts, prices, process and policies come only from src/content/site.ts and
//   the existing pages. Use the constants below for prices instead of typing them.
// - No reviews, testimonials, client names, results, stats about our work,
//   awards, years in business or team size.
// - Demos are fictional samples: call them demos or examples, never clients.
import { carePlans, faqs, tiers } from '@/content/site'

/** The eight keyword landing pages. A path never changes once it is live. */
export type KeywordPagePath =
  | '/home-service-website-design'
  | '/website-design-for-plumbers'
  | '/website-design-for-hvac-companies'
  | '/website-design-for-electricians'
  | '/website-design-for-roofers'
  | '/website-design-for-landscapers'
  | '/seo-for-contractors'
  | '/web-design-new-jersey'

/** Only the clearly fictional sample demos in src/content/demos.ts (slug starts with "sample-"). */
export type SampleDemoSlug = `sample-${string}`

export type KeywordSection = {
  /** Anchor id, kebab-case and unique on the page, e.g. 'emergency-calls'. */
  id: string
  /** H2, phrased the way the reader thinks about it. */
  heading: string
  /** 1–3 short paragraphs of plain text (no markdown, no HTML). */
  paragraphs: string[]
  /**
   * Optional side panel, e.g. { title: 'What the form asks', items: [...] }. 3–7 short items.
   * `ordered: true` renders numbered steps (an <ol>), for things done in order.
   */
  bullets?: { title: string; items: string[]; ordered?: true }
}

export type KeywordPage = {
  /** Must equal this page's key in ./index.ts. */
  path: KeywordPagePath
  /** Placeholder copy: the page renders but is noindex and left out of sitemap.xml. Delete this line when the page is written. */
  draft?: true
  /** The one search phrase this page is built around (from the kw-targets research). Not rendered. */
  primaryKeyword: string
  /** Close variants the copy should cover naturally. Not rendered; never stuff them. */
  secondaryKeywords: string[]

  /** <title>, used as-is (no suffix is added). 30–65 characters. */
  title: string
  /** Meta description: 110–165 characters, plain and specific. */
  description: string
  /** Short page name: last breadcrumb, schema Service name, markdown H1. E.g. 'Website design for plumbers'. */
  name: string
  /** schema.org Service.serviceType, e.g. 'Website design for plumbing companies'. */
  serviceType: string
  /** Crumbs between Home and this page (Home is added first and `name` last), e.g. [['Home-service website design', '/home-service-website-design']]. */
  breadcrumbs: Array<[name: string, href: string]>

  hero: {
    /** Mono label above the H1, e.g. '[WEB DESIGN // PLUMBERS]'. Brackets and // render in gold. */
    label: string
    /** H1 as [before, accent, after]; the accent renders in the serif gold. Contains the primary keyword or a natural form of it. */
    h1: [before: string, accent: string, after: string]
    /** Hero lead paragraph: who it is for, what we build, where we are. 35–70 words. */
    intro: string
  }
  /** The question people search, answered in 40–70 words so an assistant can quote it whole. */
  directAnswer: { question: string; answer: string }
  /** The body: 3–5 sections specific to this page's reader (a how-to guide, like /seo-for-contractors, may need more). */
  sections: KeywordSection[]
  /** "What the site includes" cards: 4–6 [title, copy] pairs. Only things the site really includes (see site.ts tiers/services). */
  includes: { heading: string; intro?: string; items: Array<[title: string, copy: string]> }
  /** Optional sample demos. Slugs from src/content/demos.ts that start with "sample-" only. */
  examples?: { heading: string; intro: string; demos: SampleDemoSlug[] }
  /** Heading + one-line intro above the five process steps, which always come from site.ts `process`. */
  process: { heading: string; intro: string }
  /** Cost H2 + 1–2 page-specific sentences with NO prices; PRICING_SENTENCE and the tier table are appended. */
  pricing: { question: string; lead: string }
  faqHeading: string
  /** 4–8 FAQs (a guide page may carry a few more). Shown in the accordion and marked up as this page's FAQPage, so text must match exactly. */
  faqs: Array<[question: string, answer: string]>
  related: {
    /** 2–3 blog slugs from src/content/blog.ts that genuinely help this page's reader. */
    posts: string[]
    /** Optional extra internal links [anchor, href] (existing routes only). Hub, NJ page, NJ trade page and sibling trades are linked automatically. */
    links?: Array<[label: string, href: string]>
  }
  cta: { title: string; copy?: string }
}

// --- Prices and policies, built from src/content/site.ts so they cannot drift ---

const tier = (id: (typeof tiers)[number]['id']) => {
  const found = tiers.find((t) => t.id === id)
  if (!found) throw new Error(`No tier ${id} in site.ts`)
  return found
}
const plan = (name: (typeof carePlans)[number]['name']) => {
  const found = carePlans.find((p) => p.name === name)
  if (!found) throw new Error(`No care plan ${name} in site.ts`)
  return found
}

/** "7-day sprint" */
const SPRINT = tier('launch').meta.split('·')[0].trim()
/** "$3,500" */
const PREMIUM_FROM = tier('premium').price.replace(/^From\s+/i, '')
/** "$5,000–$15,000+" */
const AI_RANGE = tier('ai').price.replace(/\s*–\s*/, '–')
const CARE = carePlans.map((p) => p.price)

/**
 * Every Orbit price in one sentence. The renderer appends it to `pricing.lead`;
 * use it in a cost FAQ answer as `${PRICING_SENTENCE}` instead of typing prices.
 */
export const PRICING_SENTENCE = `Launch builds are quoted on a free call and built in a ${SPRINT}, premium builds start at ${PREMIUM_FROM}, AI operations builds run ${AI_RANGE}, and optional monthly plans are ${CARE.slice(0, -1).join(', ')} or ${CARE[CARE.length - 1]} after launch.`

/** The two plans that include SEO work, with their real prices. For SEO answers. */
export const SEO_PLANS_SENTENCE = `After launch, the optional ${plan('Website + Leads Plan').name} (${plan('Website + Leads Plan').price}/mo) adds steady local SEO and monthly site improvements, and ${plan('Growth Partner').name} (${plan('Growth Partner').price}/mo) adds active SEO and content. Both are month to month.`

/** "50% to start, 50% when you approve the finished site." */
export const PAYMENT_SENTENCE = '50% reserves the build and starts the sprint, and you approve the finished site before paying the other 50%.'

/**
 * A site-wide FAQ from site.ts, verbatim, as a [question, answer] pair, e.g.
 * siteFaq('Do you guarantee Google rankings?'). Throws at build time if the question changes.
 */
export function siteFaq(question: (typeof faqs)[number]['q']): [string, string] {
  const found = faqs.find((f) => f.q === question)
  if (!found) throw new Error(`No site FAQ "${question}"`)
  return [found.q, found.a]
}

/**
 * A well-formed dollar amount: "$300", "$3,500", "$15,000", "$3500", "$9.99".
 * Commas count only as thousands separators, so the comma after "$3,500," in a
 * sentence is not part of the amount.
 */
export const PRICE_RE = /\$\s?\d+(?:,\d{3})*(?:\.\d+)?/g

/** The dollar amounts in a string, normalized (no spaces), e.g. ["$3,500", "$300"]. */
export const pricesIn = (text: string): string[] => (text.match(PRICE_RE) ?? []).map((amount) => amount.replace(/\s/g, ''))

/** Every dollar amount that appears in site.ts tiers and care plans. ./validate.ts rejects any other "$" amount on a page. */
export const SITE_PRICES: ReadonlySet<string> = new Set(pricesIn(JSON.stringify({ tiers, carePlans })))
