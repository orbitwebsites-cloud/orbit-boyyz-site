// Markdown variant of a keyword landing page, served by proxy.ts when a client
// sends `Accept: text/markdown`. Built from the same content file the HTML page
// renders (src/content/keyword-pages), so the two cannot drift. Kept free of
// blog/demo imports so the proxy bundle stays small: related posts are listed by URL.
import { HUB_PATH, NJ_PATH, keywordRoutes, type KeywordRoute } from '@/content/keyword-pages'
import { PRICING_SENTENCE } from '@/content/keyword-pages/types'
import { process, site } from '@/content/site'

const ORIGIN = site.url

const list = (items: readonly string[]) => items.map((item) => `- ${item}`).join('\n')
const numbered = (items: readonly string[]) => items.map((item, i) => `${i + 1}. ${item}`).join('\n')
const noDot = (s: string) => s.replace(/\.$/, '')
const link = (label: string, path: string) => `[${label}](${ORIGIN}${path})`

export function keywordMarkdown({ path, kind, page, nj }: KeywordRoute): string {
  const related = [
    ...(nj ? [link(nj.label, nj.path)] : []),
    ...(kind !== 'hub' ? [link('All home-service trades', HUB_PATH)] : []),
    ...(kind !== 'location' ? [link('Web design in New Jersey', NJ_PATH)] : []),
    ...keywordRoutes.filter((r) => r.kind === 'trade' && r.path !== path).map((r) => link(r.page.name, r.path)),
    ...(page.related.links ?? []).map(([label, href]) => link(label, href)),
    ...page.related.posts.map((slug) => `${ORIGIN}/blog/${slug}`),
  ]

  const blocks = [
    `# ${page.hero.h1.join('').trim()}`,
    page.hero.intro,
    `## ${page.directAnswer.question}`,
    page.directAnswer.answer,
    ...page.sections.flatMap((s) => [
      `## ${s.heading}`,
      ...s.paragraphs,
      ...(s.bullets ? [`${s.bullets.title}:`, (s.bullets.ordered ? numbered : list)(s.bullets.items)] : []),
    ]),
    `## ${noDot(page.includes.heading)}`,
    ...(page.includes.intro ? [page.includes.intro] : []),
    list(page.includes.items.map(([title, copy]) => `**${title}.** ${copy}`)),
    ...(page.examples
      ? [`## ${noDot(page.examples.heading)}`, `${page.examples.intro} Sample demos are fictional businesses, not clients.`]
      : []),
    `## ${noDot(page.process.heading)}`,
    page.process.intro,
    numbered(process.map((step) => `**${step.title}.** ${step.copy}`)),
    `## ${page.pricing.question}`,
    `${page.pricing.lead} ${PRICING_SENTENCE}`,
    `Full pricing: ${ORIGIN}/pricing`,
    `## ${noDot(page.faqHeading)}`,
    ...page.faqs.flatMap(([q, a]) => [`### ${q}`, a]),
    '## Related',
    list(related),
    `Contact: ${site.phoneDisplay} · ${site.email} · ${ORIGIN}${site.booking}\nCanonical page: ${ORIGIN}${path}`,
  ]
  return `${blocks.join('\n\n')}\n`
}
