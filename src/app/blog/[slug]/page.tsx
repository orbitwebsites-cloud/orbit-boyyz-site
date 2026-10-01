import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { blogClusters, blogFallbackFaqs, blogLandingLinks, blogPosts, type BlogPost } from '@/content/blog'
import { Accordion } from '@/components/ui/Accordion'
import { CtaBand } from '@/components/ui/CtaBand'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { ArrowLink } from '@/components/port/Blocks'
import { BlogCards } from '@/components/port/BlogCards'
import { blogJsonLd, isoDate } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

export const dynamicParams = false

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

const find = (slug: string) => blogPosts.find((p) => p.slug === slug)

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>) {
  const post = find((await params).slug)
  if (!post) return {}
  // Blog titles are full questions: no brand suffix (same as the old prerender).
  return legacyMetadata(`/blog/${post.slug}`, { title: post.title, description: post.description }, { article: true })
}

// --- ported from the old BlogPost component -------------------------------
function getPostCluster(slug: string) {
  return blogClusters.find((cluster) => cluster.slugs.some((s) => s === slug)) ?? blogClusters[0]
}

function getRelatedPosts(post: BlogPost) {
  const cluster = getPostCluster(post.slug)
  const clusterPosts = cluster.slugs
    .filter((s) => s !== post.slug)
    .map((s) => find(s))
    .filter((item): item is BlogPost => Boolean(item))
  const fallbackPosts = blogPosts.filter((item) => item.slug !== post.slug && !clusterPosts.some((related) => related.slug === item.slug))
  return [...clusterPosts, ...fallbackPosts].slice(0, 3)
}

const quoteHrefForSource = (sourcePath: string) => `/quote?source=${encodeURIComponent(sourcePath)}`

export default async function BlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  const post = find((await params).slug)
  if (!post) notFound()

  const cluster = getPostCluster(post.slug)
  const related = getRelatedPosts(post)
  const landingLinks = blogLandingLinks[post.slug] ?? [
    [cluster.landing[0], cluster.landing[1]],
    ['/quote', 'Get a project range'],
    ['/pricing', 'See pricing'],
  ]
  const path = `/blog/${post.slug}`
  const faqs = post.faqs ?? blogFallbackFaqs[post.slug]

  return (
    <>
      <JsonLd data={blogJsonLd(post)} />

      <article className="pb-8">
        <header className="relative overflow-hidden pb-12 pt-[calc(var(--nav-h)+3rem)] md:pb-16 md:pt-[calc(var(--nav-h)+5.5rem)]">
          <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(214,179,106,0.14),transparent_65%)]" />
          <div className="container-x">
            <div className="mx-auto max-w-[68ch]">
              <nav aria-label="Breadcrumb" className="page-fade font-mono text-[0.7rem] uppercase tracking-[0.14em] text-dim" style={{ '--delay': '-300ms' } as CSSProperties}>
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <TransitionLink href="/" className="hover:text-fg">
                      Home
                    </TransitionLink>
                  </li>
                  <li aria-hidden="true" className="text-accent">
                    /
                  </li>
                  <li>
                    <TransitionLink href="/blog" className="hover:text-fg">
                      Blog
                    </TransitionLink>
                  </li>
                  <li aria-hidden="true" className="text-accent">
                    /
                  </li>
                  <li className="text-muted">{cluster.label}</li>
                </ol>
              </nav>
              <div className="page-fade mt-8" style={{ '--delay': '-200ms' } as CSSProperties}>
                <SectionLabel>{`[ANSWER // LAST UPDATED ${post.updated.toUpperCase()}]`}</SectionLabel>
              </div>
              <h1 className="display mt-6 text-balance text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.02]">
                <span className="mask">
                  <span className="page-rise">{post.title}</span>
                </span>
              </h1>
              <p className="page-fade t-lead mt-7 text-muted" style={{ '--delay': '0ms' } as CSSProperties}>
                {post.description}
              </p>
              <p className="page-fade mt-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-dim" style={{ '--delay': '80ms' } as CSSProperties}>
                Updated <time dateTime={isoDate(post.updated)}>{post.updated}</time> · Orbit Websites
              </p>
            </div>
          </div>
        </header>

        <div className="container-x">
          <div className="mx-auto max-w-[68ch]">
            <aside data-reveal className="rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-7">
              <SectionLabel>[WHO THIS IS FOR]</SectionLabel>
              <p className="mt-4 text-[1.15rem] leading-relaxed">{post.audience}</p>
            </aside>

            <div className="mt-12 space-y-12 md:mt-14">
              {post.sections.map((section) => (
                <section key={section.heading} data-reveal>
                  <h2 className="display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">{section.heading}</h2>
                  <p className="mt-4 text-[1.08rem] leading-[1.75] text-fg/85">{section.body}</p>
                </section>
              ))}
            </div>

            <aside
              data-reveal
              aria-label="Key takeaways"
              className="mt-14 rounded-[var(--radius)] border border-accent/30 bg-[radial-gradient(ellipse_at_top_right,rgba(214,179,106,0.12),transparent_60%),var(--panel)] p-6 md:p-8"
            >
              <SectionLabel>[EXTRACTABLE TAKEAWAYS]</SectionLabel>
              <ol className="mt-6 grid gap-5">
                {post.takeaways.map((takeaway, index) => (
                  <li key={takeaway} className="grid grid-cols-[3rem_1fr] gap-3">
                    <span className="display text-3xl leading-none text-accent">{String(index + 1).padStart(2, '0')}</span>
                    <span className="leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ol>
            </aside>

            {faqs && (
              <section aria-labelledby="post-faq" className="mt-14">
                <h2 id="post-faq" className="display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">
                  Questions
                </h2>
                <div className="mt-6">
                  <Accordion items={faqs.map(([q, a]) => ({ q, a }))} defaultOpen={0} />
                </div>
              </section>
            )}

            <aside data-reveal aria-label="Next steps" className="mt-14 rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-8">
              <SectionLabel>[ORBIT BOYZZ // CENTRAL NEW JERSEY]</SectionLabel>
              <p className="mt-4 leading-relaxed text-muted">
                Orbit Websites builds launch, premium, and AI-powered websites for local businesses across Central New Jersey. Launch builds are quoted on a free call, premium builds start at $3,500, and AI systems run $5,000–$15,000+.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[0.72rem] uppercase tracking-[0.14em]">
                {landingLinks.map(([to, label]) => {
                  const href = to === '/quote' ? quoteHrefForSource(path) : to
                  return (
                    <li key={`${href}-${label}`}>
                      <ArrowLink href={href}>{label} -&gt;</ArrowLink>
                    </li>
                  )
                })}
                <li>
                  <ArrowLink href="/pricing">See pricing →</ArrowLink>
                </li>
                <li>
                  <ArrowLink href="/services">Our services →</ArrowLink>
                </li>
                <li>
                  <ArrowLink href="/web-design-central-nj">Web design in Central NJ →</ArrowLink>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-title" className="container-x py-16 md:py-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionLabel>{`[RELATED ANSWERS // ${cluster.label.toUpperCase()}]`}</SectionLabel>
            <h2 id="related-title" className="display t-3 mt-5">
              Keep reading
            </h2>
            <p className="mt-3 max-w-2xl text-muted">{cluster.description}</p>
          </div>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em]">
            <ArrowLink href={`/blog/${cluster.slugs[0]}`}>Open cluster</ArrowLink>
          </span>
        </div>
        <BlogCards className="mt-8" posts={related} />
      </section>

      <CtaBand title="See the approach before you commit." copy="Book a free 30-minute call. We’ll review your current website and walk you through a relevant example. No obligation to buy." />
    </>
  )
}
