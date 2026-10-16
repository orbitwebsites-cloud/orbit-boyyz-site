// Build-time checks for the keyword landing pages. app/[landing]/page.tsx calls
// validateKeywordPages() from generateStaticParams, so `next build` (and the
// dev server, on first request) fails with a list of problems instead of
// publishing a broken link, a made-up price or an invalid demo.
import { blogPosts } from '@/content/blog'
import { demos } from '@/content/demos'
import { legacyPageMeta } from '@/lib/legacy-seo'
import { keywordRoutes } from './index'
import { PAYMENT_SENTENCE, PRICING_SENTENCE, SEO_PLANS_SENTENCE, SITE_PRICES, pricesIn, type KeywordPage } from './types'

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Claims the site cannot back up. A backstop only: the honesty rules in ./types.ts still apply.
const BANNED: Array<[RegExp, string]> = [
  [/award[- ]winning/i, 'award claim'],
  [/\b(?:5|five)[- ]star\b/i, 'star-rating claim'],
  [/\btrusted by\b/i, '"trusted by" claim'],
  [/\bsatisfied (?:customers|clients)\b/i, 'customer-count claim'],
  [/\b\d+\+? years? (?:of experience|in business)\b/i, 'years-in-business claim'],
  [
    /(?<!(?:n['’]t|not|never|cannot|honestly) )\bguarantee[ds]? (?:rankings?|results|leads|traffic|more calls)\b/i,
    'guarantee claim (write "we don’t guarantee …" or "nobody can honestly guarantee …")',
  ],
  [/#1\b|\bNo\. ?1\b|\bnumber one (?:rated|web|website|choice|company|agency|designer|in)\b/i, '"#1" claim'],
]

/** Every visible string in a page, for the price, claim and keyword checks. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out))
  return out
}

function visibleText(page: KeywordPage) {
  // primaryKeyword/secondaryKeywords are research notes, not page copy.
  const { primaryKeyword: _p, secondaryKeywords: _s, ...rest } = page
  void _p
  void _s
  return strings(rest)
}

export function validateKeywordPages() {
  const errors: string[] = []

  // The shared sentences are built from site.ts and pages are told to embed them,
  // so they must always pass the same price check the pages get.
  const shared: Array<[name: string, text: string]> = [
    ['PRICING_SENTENCE', PRICING_SENTENCE],
    ['SEO_PLANS_SENTENCE', SEO_PLANS_SENTENCE],
    ['PAYMENT_SENTENCE', PAYMENT_SENTENCE],
  ]
  for (const [name, text] of shared) {
    for (const amount of pricesIn(text)) {
      if (!SITE_PRICES.has(amount)) errors.push(`${name}: price "${amount}" is not in SITE_PRICES (check the price regex in ./types.ts)`)
    }
  }

  const known = new Set<string>([...Object.keys(legacyPageMeta), ...blogPosts.map((p) => `/blog/${p.slug}`), '/book'])
  const postSlugs = new Set(blogPosts.map((p) => p.slug))

  for (const { path, page, nj } of keywordRoutes) {
    const fail = (message: string) => errors.push(`${path}: ${message}`)
    const checkHref = (href: string, where: string) => {
      const bare = href.replace(/[?#].*$/, '') || '/'
      if (!href.startsWith('/') || href.startsWith('//')) fail(`${where} "${href}" must be an internal path`)
      else if (!known.has(bare)) fail(`${where} "${href}" is not an existing route`)
    }

    if (page.path !== path) fail(`page.path is "${page.path}", expected "${path}"`)
    if (nj && !known.has(nj.path)) fail(`NJ counterpart ${nj.path} is not an existing route`)

    if (page.title.length < 20 || page.title.length > 70) fail(`title is ${page.title.length} characters (keep it 30–65)`)
    if (page.description.length < 70 || page.description.length > 170) fail(`description is ${page.description.length} characters (keep it 110–165)`)
    if (!page.hero.label.startsWith('[') || !page.hero.label.endsWith(']')) fail('hero.label must look like "[WEB DESIGN // PLUMBERS]"')

    if (page.sections.length === 0) fail('needs at least one section')
    const ids = page.sections.map((s) => s.id)
    ids.forEach((id) => !KEBAB.test(id) && fail(`section id "${id}" must be kebab-case`))
    if (new Set(ids).size !== ids.length) fail('section ids must be unique')
    page.sections.forEach((s) => s.paragraphs.length === 0 && fail(`section "${s.id}" has no paragraphs`))

    if (page.includes.items.length === 0) fail('includes.items is empty')

    if (page.faqs.length < 2) fail('needs at least two FAQs')
    const questions = page.faqs.map(([q]) => q.trim().toLowerCase())
    if (new Set(questions).size !== questions.length) fail('duplicate FAQ question')

    const posts = page.related.posts
    if (posts.length < 2 || posts.length > 3) fail(`related.posts has ${posts.length} posts (use 2–3)`)
    if (new Set(posts).size !== posts.length) fail('related.posts has a duplicate')
    posts.forEach((slug) => !postSlugs.has(slug) && fail(`related post "${slug}" is not in src/content/blog.ts`))

    page.breadcrumbs.forEach(([, href]) => checkHref(href, 'breadcrumb'))
    page.related.links?.forEach(([, href]) => checkHref(href, 'related link'))

    page.examples?.demos.forEach((slug) => {
      const demo = demos.find((d) => d.slug === slug)
      if (!demo) fail(`demo "${slug}" is not in src/content/demos.ts`)
      else if (!slug.startsWith('sample-')) fail(`demo "${slug}" is a real lead's preview; only fictional sample- demos may be linked`)
      else if (demo.trade === 'restaurant') fail(`demo "${slug}" is a restaurant, not a home-service example`)
    })

    const text = visibleText(page)
    for (const s of text) {
      for (const amount of pricesIn(s)) {
        if (!SITE_PRICES.has(amount)) fail(`price "${amount}" is not an Orbit price in site.ts (use PRICING_SENTENCE / SEO_PLANS_SENTENCE)`)
      }
      for (const [re, what] of BANNED) if (re.test(s)) fail(`${what}: "${s.slice(0, 90)}…"`)
    }

    const keyword = page.primaryKeyword.toLowerCase()
    const uses = text.join(' ').toLowerCase().split(keyword).length - 1
    if (uses > 8) fail(`primary keyword "${page.primaryKeyword}" appears ${uses} times; write for people (8 at most)`)
  }

  if (errors.length) throw new Error(`Keyword page content check failed:\n- ${errors.join('\n- ')}`)
}
