// One-off extractor: evaluates the data arrays in the OLD site's source files
// (read-only) and writes typed content modules into the NEW site.
// Run: node extract.mjs   (from the scratchpad)
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'

const OLD = 'D:/orbitboyzz-revamp/old-site-src'
const NEW = 'D:/orbitboyzz-revamp/site'
const require = createRequire(`${NEW}/package.json`)
const ts = require('typescript')

/** Parse a TS/TSX file and return { name -> initializer JS source } for top-level consts. */
function topLevelConsts(file) {
  const text = readFileSync(file, 'utf8')
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const out = {}
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      if (!decl.initializer || !ts.isIdentifier(decl.name)) continue
      out[decl.name.text] = decl.initializer.getText(sf)
    }
  }
  return out
}

/** Evaluate an initializer expression (TS syntax stripped) in a sandbox. */
function evaluate(src, globals = {}) {
  const js = ts.transpileModule(`globalThis.__v = (${src});`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None, jsx: ts.JsxEmit.React },
  }).outputText
  const ctx = vm.createContext({ ...globals })
  vm.runInContext(js, ctx)
  // round-trip through JSON so the value is plain data
  return JSON.parse(JSON.stringify(ctx.__v))
}

const lucide = new Proxy({}, { has: () => false })
void lucide
const iconNames = ['Activity', 'ArrowRight', 'ArrowUpRight', 'BookOpen', 'Check', 'CalendarClock', 'DatabaseZap', 'ExternalLink', 'FileText', 'MapPin', 'Menu', 'PhoneCall', 'Search', 'Sparkles', 'TrendingUp', 'Workflow']
const iconGlobals = Object.fromEntries(iconNames.map((n) => [n, n]))

// ---------------------------------------------------------------- App.tsx
const app = topLevelConsts(`${OLD}/src/App.tsx`)
const get = (name, g) => evaluate(app[name], g)

const blogPosts = get('blogPosts')
const faqs = get('faqs')
const blogClusters = get('blogClusters')
const blogLandingLinks = get('blogLandingLinks')
const buyerIntentAnswerSlugs = get('buyerIntentAnswerSlugs')
const webDesignIncludes = get('webDesignIncludes')
const webDesignTowns = get('webDesignTowns')
const webDesignFit = get('webDesignFit')
const webDesignNotFit = get('webDesignNotFit')
const localWebDesignLinks = get('localWebDesignLinks')
const industryWebDesignPages = get('industryWebDesignPages')
const townWebDesignPages = get('townWebDesignPages')
const oldServices = get('services', iconGlobals)
const localUseCases = get('localUseCases')

// Sanity checks
const keys = new Set()
for (const p of blogPosts) Object.keys(p).forEach((k) => keys.add(k))
console.log('blog posts:', blogPosts.length, 'keys:', [...keys].join(','))
console.log('posts with faqs:', blogPosts.filter((p) => p.faqs).map((p) => p.slug).join(', '))
console.log('towns:', Object.keys(townWebDesignPages).length, 'industries:', Object.keys(industryWebDesignPages).length)

// ---------------------------------------------------------------- GrowthPage.tsx / ProjectBrief.tsx
const growth = topLevelConsts(`${OLD}/src/GrowthPage.tsx`)
const growthServices = evaluate(growth.services)
const growthTiers = evaluate(growth.tiers)
const growthEntryOffer = evaluate(growth.entryOffer)
const growthFaqs = evaluate(growth.faqs)
const brief = topLevelConsts(`${OLD}/src/ProjectBrief.tsx`)
const briefQuestions = evaluate(brief.questions)
console.log('growth services', growthServices.length, 'tiers', growthTiers.length, 'faqs', growthFaqs.length, 'brief questions', briefQuestions.length)

// ---------------------------------------------------------------- writers
const HEADER = (src) =>
  `// GENERATED from ${src} (old site, read-only) by a one-off extraction script.\n// Copy is verbatim — do not rewrite. Edit here if the owner changes wording.\n`
const lit = (v) => JSON.stringify(v, null, 2)

// Map an old post object into a stable key order.
const posts = blogPosts.map((p) => {
  const { slug, title, description, updated, audience, takeaways, sections, faqs, ...rest } = p
  if (Object.keys(rest).length) throw new Error(`unexpected keys on ${slug}: ${Object.keys(rest)}`)
  return { slug, title, description, updated, audience, takeaways, sections, ...(faqs ? { faqs } : {}) }
})

writeFileSync(
  `${NEW}/src/content/blog.ts`,
  `${HEADER('src/App.tsx (blogPosts, blogClusters, blogLandingLinks, buyerIntentAnswerSlugs)')}
export type BlogSection = { heading: string; body: string }
export type BlogFaq = [question: string, answer: string]
export type BlogPost = {
  slug: string
  title: string
  description: string
  /** Display date, e.g. "June 1, 2026" (converted with isoDate() for schema/sitemap). */
  updated: string
  audience: string
  takeaways: string[]
  sections: BlogSection[]
  faqs?: BlogFaq[]
}
export type BlogCluster = {
  label: string
  description: string
  slugs: readonly string[]
  landing: readonly [href: string, label: string]
}

export const blogPosts: BlogPost[] = ${lit(posts)}

export const blogClusters: BlogCluster[] = ${lit(blogClusters)}

/** Per-post "next step" links shown under each article. */
export const blogLandingLinks: Record<string, Array<[href: string, label: string]>> = ${lit(blogLandingLinks)}

/** Cost + decision answers featured on /blog. */
export const buyerIntentAnswerSlugs = ${lit(buyerIntentAnswerSlugs)} as const

/** FAQ fallback used by the old prerender for posts without their own faqs. */
export const blogFallbackFaqs: Record<string, BlogFaq[]> = ${lit({
    'custom-web-design-vs-wix-squarespace': [
      [
        'Is a custom website better for local SEO than Wix or Squarespace?',
        'Often, yes. Custom sites give more control over page speed, schema, service-area structure, copy, and conversion paths than a generic template, which can make them a better fit for serious local SEO work.',
      ],
      [
        'What is the true cost difference between a template and a custom website?',
        'A template usually has a lower monthly platform cost, but the true cost depends on setup time, redesign work, add-ons, SEO limitations, integrations, and whether the site can create enough calls, quote requests, or bookings to justify a custom build.',
      ],
    ],
  })}
`,
)

writeFileSync(
  `${NEW}/src/content/landing.ts`,
  `${HEADER('src/App.tsx (townWebDesignPages, industryWebDesignPages, webDesign*, localWebDesignLinks, faqs, services, localUseCases)')}
export type TownPage = {
  path: string
  label: string
  town: string
  county: string
  nearby: string
  audience: string
}
export type IndustryPage = {
  path: string
  label: string
  industry: string
  industryShort: string
  jobType: string
  avgJob: string
  aiUseCase: string
  towns: string
}

/** Generic town landing pages. Ewing and Central NJ have custom pages (see landing-custom.ts). */
export const townPages: Record<string, TownPage> = ${lit(townWebDesignPages)}

export const industryPages: Record<string, IndustryPage> = ${lit(industryWebDesignPages)}

/** "What our web design includes" — /web-design-central-nj */
export const webDesignIncludes: Array<[title: string, copy: string]> = ${lit(webDesignIncludes)}

/** "Towns we design websites for" — /web-design-central-nj */
export const webDesignTowns: Array<[town: string, copy: string]> = ${lit(webDesignTowns)}

export const webDesignFit: string[] = ${lit(webDesignFit)}

export const webDesignNotFit: string[] = ${lit(webDesignNotFit)}

/** "[LOCAL PAGES // MERCER COUNTY]" link grid on every landing page. */
export const localWebDesignLinks: Array<[label: string, href: string]> = ${lit(localWebDesignLinks)}

/** Old site FAQ list (the first 3 are shown + marked up on /web-design-central-nj). */
export const legacyFaqs: Array<[question: string, answer: string]> = ${lit(faqs)}

/** Old ServicesPreview cards (shown on /orbitboyzz). */
export const legacyServices: Array<{ id: string; title: string; copy: string; icon: string }> = ${lit(oldServices)}

/** Old AreasSection rows (shown on /orbitboyzz). */
export const localUseCases: Array<[title: string, copy: string]> = ${lit(localUseCases)}
`,
)

writeFileSync(
  `${NEW}/src/content/growth.ts`,
  `${HEADER('src/GrowthPage.tsx (services, tiers, entryOffer, faqs)')}
export const growthServices: Array<{ number: string; title: string; body: string; stat: string; label: string }> = ${lit(growthServices)}

export const growthTiers: Array<{ name: string; price: string; description: string; featured?: boolean; features: string[] }> = ${lit(growthTiers)}

export const growthEntryOffer: { name: string; price: string; description: string; features: string[] } = ${lit(growthEntryOffer)}

export const growthFaqs: Array<[question: string, answer: string]> = ${lit(growthFaqs)}
`,
)

writeFileSync(
  `${NEW}/src/content/brief.ts`,
  `${HEADER('src/ProjectBrief.tsx (questions)')}
export type BriefQuestion = { category: string; question: string; helper: string; placeholder: string }

export const briefQuestions: BriefQuestion[] = ${lit(briefQuestions)}
`,
)

// Also dump raw data for the SEO expectation builder.
writeFileSync('./old-data.json', JSON.stringify({ blogPosts, faqs }, null, 0))
console.log('wrote blog.ts, landing.ts, growth.ts, brief.ts, old-data.json')
