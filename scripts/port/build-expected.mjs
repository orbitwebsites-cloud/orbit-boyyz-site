// Builds expected.json: per-route title / description / canonical / JSON-LD
// graph, plus the expected feed.xml and sitemap.xml, by running the OLD
// site's prerender.mjs logic unchanged (only its I/O is stubbed out).
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

let src = readFileSync('D:/orbitboyzz-revamp/old-site-src/prerender.mjs', 'utf8')

const swap = (from, to) => {
  if (!src.includes(from)) throw new Error(`pattern not found: ${from}`)
  src = src.replace(from, to)
}
swap(
  "const { render, blogPosts, faqs } = await import('./dist-server/entry-server.js')",
  "const { blogPosts, faqs } = JSON.parse(readFileSync(new URL('./old-data.json', import.meta.url), 'utf8'))",
)
swap("const template = readFileSync(join(distDir, 'index.html'), 'utf-8')", '')
swap("writeFileSync(join(distDir, 'feed.xml'), feed, 'utf-8')", 'return feed')
swap("writeFileSync(join(distDir, 'sitemap.xml'), sitemap, 'utf-8')", 'return sitemap')
const runAt = src.indexOf('// --- Run ---')
if (runAt < 0) throw new Error('run marker not found')
src =
  src.slice(0, runAt) +
  `
export const __expected = (() => {
  const routes = {}
  for (const route of Object.keys(pageMeta)) {
    routes[route] = {
      title: pageMeta[route].title,
      description: pageMeta[route].description,
      canonical: route === '/' ? ORIGIN + '/' : ORIGIN + route,
      jsonLd: { '@context': 'https://schema.org', '@graph': graphFor(route) },
    }
  }
  const order = [...Object.keys(pageMeta)]
  for (const post of blogPosts) {
    const route = '/blog/' + post.slug
    order.push(route)
    routes[route] = {
      title: post.title,
      description: post.description,
      canonical: ORIGIN + route,
      jsonLd: { '@context': 'https://schema.org', '@graph': [organization, website, ...blogPostingGraph(post)] },
    }
  }
  return { routes, feed: writeFeed(), sitemap: writeSitemap(order), order }
})()
`
writeFileSync('./prerender-expected.mjs', src)
const { __expected } = await import(pathToFileURL('./prerender-expected.mjs').href)

// /form is a client-only route in the old SPA (not prerendered): it inherited
// the default <head> from index.html.
const indexHtml = readFileSync('D:/orbitboyzz-revamp/old-site-src/index.html', 'utf8')
__expected.routes['/form'] = {
  title: indexHtml.match(/<title>([^<]*)<\/title>/)[1],
  description: indexHtml.match(/<meta name="description" content="([^"]*)"/)[1],
  canonical: null,
  jsonLd: null,
}
writeFileSync('./expected.json', JSON.stringify(__expected, null, 1))
console.log('routes', Object.keys(__expected.routes).length, 'sitemap urls', (__expected.sitemap.match(/<loc>/g) || []).length)
