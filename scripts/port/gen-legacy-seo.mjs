// Copies the metadata table + JSON-LD builders out of the old prerender.mjs
// into a typed module for the new site (so the graph logic is the same code).
import { readFileSync, writeFileSync } from 'node:fs'

const lines = readFileSync('D:/orbitboyzz-revamp/old-site-src/prerender.mjs', 'utf8').split(/\r?\n/)
const start = lines.findIndex((l) => l.startsWith('// --- Brand entity signals'))
const end = lines.findIndex((l) => l.startsWith('// --- Head + body assembly'))
let body = lines.slice(start, end).join('\n')

const rep = (from, to, all = false) => {
  if (!body.includes(from)) throw new Error(`missing: ${from}`)
  body = all ? body.split(from).join(to) : body.replace(from, to)
}

rep("const { render, blogPosts, faqs } = await import('./dist-server/entry-server.js')\n", '')
rep("const distDir = join(__dirname, 'dist')\n", '')
rep("const template = readFileSync(join(distDir, 'index.html'), 'utf-8')\n", '')
rep('const SAME_AS = [', 'const SAME_AS: string[] = [')
rep('const pageMeta = {', 'export const legacyPageMeta: Record<string, { title: string; description: string }> = {')
rep('const organization = {', 'export const organization = {')
rep('const website = {', 'export const website = {')
rep('faqs.map(([q, a]) =>', 'faqs.map(([q, a]) =>', true)
rep('function blogPostingGraph(post) {', 'export function blogPostingGraph(post: BlogPost) {')
rep('  const fallbackFaqs = {', '  const fallbackFaqs: Record<string, Array<[string, string]>> = {')
rep('  const graph = [\n    {\n      \'@type\': \'BlogPosting\'', "  const graph: Array<Record<string, unknown>> = [\n    {\n      '@type': 'BlogPosting'")
rep('function isoDate(displayDate) {', 'export function isoDate(displayDate: string) {')
rep('  const months = {', '  const months: Record<string, string> = {')
rep('function breadcrumbGraph(route, name) {', 'function breadcrumbGraph(route: string, name: string) {')
rep('function faqGraph(route, id, entries) {', 'function faqGraph(route: string, id: string, entries: ReadonlyArray<readonly [string, string]>) {')
rep('const townFaqMap = {', 'const townFaqMap: Record<string, { town: string; county: string; nearby: string }> = {')
rep('function townLandingFaqGraph(route, page) {', 'function townLandingFaqGraph(route: string, page: { town: string; county: string; nearby: string }) {')
rep('const industryFaqMap = {', 'const industryFaqMap: Record<string, { short: string; jobType: string }> = {')
rep('function industryLandingFaqGraph(route, page) {', 'function industryLandingFaqGraph(route: string, page: { short: string; jobType: string }) {')
rep('function topLevelBreadcrumbGraph(route, name) {', 'function topLevelBreadcrumbGraph(route: string, name: string) {')
rep('function graphFor(route) {\n  const graph = [organization, website]', 'export function graphFor(route: string) {\n  const graph: Array<Record<string, unknown>> = [organization, website]')
rep('  const topLevelBreadcrumbs = {', '  const topLevelBreadcrumbs: Record<string, string> = {')
rep('  const industryServiceMap = {', '  const industryServiceMap: Record<string, { id: string; name: string; serviceType: string; desc: string; label: string }> = {')

const out = `// Ported from the old site's prerender.mjs (the SEO source of truth): the
// per-route <title>/description table and the JSON-LD graph builders are the
// same code, so every ported route emits exactly what the old prerender did.
// Copied programmatically — keep in sync with PORT-NOTES.md if edited.
import { blogPosts, type BlogPost } from '@/content/blog'
import { legacyFaqs as faqs } from '@/content/landing'

export const ORIGIN = 'https://orbitboyzz.me'
const OG_IMAGE = \`\${ORIGIN}/orbit-logo.png\`

${body.trimEnd()}

/** Full JSON-LD document for a route, as the old prerender emitted it. */
export function legacyJsonLd(route: string) {
  return { '@context': 'https://schema.org', '@graph': graphFor(route) }
}

/** Full JSON-LD document for a blog post, as the old prerender emitted it. */
export function blogJsonLd(post: BlogPost) {
  return { '@context': 'https://schema.org', '@graph': [organization, website, ...blogPostingGraph(post)] }
}
`
writeFileSync('D:/orbitboyzz-revamp/site/src/lib/legacy-seo.ts', out)
console.log('ok', out.split('\n').length, 'lines')
