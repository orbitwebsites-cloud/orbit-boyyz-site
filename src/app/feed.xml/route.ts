// /feed.xml — RSS 2.0 feed of the blog, byte-for-byte the same format as the
// old prerender.mjs writeFeed().
import { blogPosts } from '@/content/blog'
import { ORIGIN, isoDate } from '@/lib/legacy-seo'

export const dynamic = 'force-static'

function xmlEscape(value: string) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

function rfc822Date(displayDate: string) {
  return new Date(`${isoDate(displayDate)}T12:00:00Z`).toUTCString()
}

export function GET() {
  const items = blogPosts
    .map((post) => {
      const url = `${ORIGIN}/blog/${post.slug}`
      return `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xmlEscape(post.description)}</description>
      <pubDate>${rfc822Date(post.updated)}</pubDate>
    </item>`
    })
    .join('\n')

  const latestPost = blogPosts
    .map((post) => isoDate(post.updated))
    .sort()
    .at(-1)

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Orbit Websites Blog</title>
    <link>${ORIGIN}/blog</link>
    <description>Direct answers about local business websites, AI intake, pricing, and web design in Central New Jersey.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(`${latestPost ?? '2026-06-13'}T12:00:00Z`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`

  return new Response(feed, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
