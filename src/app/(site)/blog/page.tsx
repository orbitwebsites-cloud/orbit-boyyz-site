import type { CSSProperties } from 'react'
import { blogClusters, blogPosts, buyerIntentAnswerSlugs, type BlogPost } from '@/content/blog'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { ArrowIcon } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { ArrowLink, Section, SectionTitle } from '@/components/port/Blocks'
import { BlogCards } from '@/components/port/BlogCards'
import { isoDate, legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

export const metadata = legacyMetadata('/blog')

const bySlug = new Map(blogPosts.map((p) => [p.slug, p]))
// Stable sort: newest first (the source array is oldest-first).
const newestFirst = blogPosts.map((p, i) => ({ p, i })).sort((a, b) => isoDate(b.p.updated).localeCompare(isoDate(a.p.updated)) || b.i - a.i).map(({ p }) => p)
const postsFor = (slugs: readonly string[]) => slugs.map((s) => bySlug.get(s)).filter((p): p is BlogPost => Boolean(p))

export default function BlogIndexPage() {
  const buyerIntent = postsFor(buyerIntentAnswerSlugs)

  return (
    <>
      <JsonLd data={legacyJsonLd('/blog')} />

      {/* Hero (same structure as PageHero, with an inline link in the lead) */}
      <section className="relative overflow-hidden pb-14 pt-[calc(var(--nav-h)+4rem)] md:pb-20 md:pt-[calc(var(--nav-h)+7rem)]">
        <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(214,179,106,0.16),transparent_65%)]" />
        <div className="container-x">
          <div className="page-fade" style={{ '--delay': '-300ms' } as CSSProperties}>
            <SectionLabel>[BLOG // ANSWER ENGINE OPTIMIZATION]</SectionLabel>
          </div>
          <h1 className="display t-1 mt-7 max-w-[18ch] text-balance">
            <span className="mask">
              <span className="page-rise">
                Answers for owners asking AI <span className="serif-accent text-accent">what kind of website</span> to build.
              </span>
            </span>
          </h1>
          <p className="page-fade t-lead mt-8 max-w-[62ch] text-muted" style={{ '--delay': '0ms' } as CSSProperties}>
            Orbit Websites publishes direct, extractable answers about AI operations websites, local business automation, intake systems, proposal automation, and
            measurable website ROI for Central New Jersey companies.{' '}
            <TransitionLink href="/web-design-central-nj" className="link-u text-accent hover:text-accent-hi">
              See our Central NJ web design work →
            </TransitionLink>
          </p>
        </div>
      </section>

      {/* Topic clusters */}
      <Section label="Topics" className="pt-0 md:pt-0">
        <ul className="grid gap-4 md:grid-cols-2">
          {blogClusters.map((cluster) => (
            <li key={cluster.label} data-reveal className="flex flex-col justify-between gap-8 rounded-[var(--radius)] border border-line bg-panel/60 p-6 md:p-8">
              <div>
                <SectionLabel>{`[TOPIC // ${cluster.label.toUpperCase()}]`}</SectionLabel>
                <p className="mt-4 max-w-[48ch] leading-relaxed text-muted">{cluster.description}</p>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {postsFor(cluster.slugs).map((post) => (
                    <li key={post.slug}>
                      <TransitionLink
                        href={`/blog/${post.slug}`}
                        className="group flex items-start justify-between gap-4 py-3 text-[0.95rem] leading-snug transition-colors hover:text-accent-hi"
                      >
                        <span>{post.title}</span>
                        <ArrowIcon className="mt-1 shrink-0 text-dim transition-colors group-hover:text-accent" />
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.14em]">
                <ArrowLink href={`/blog/${cluster.slugs[0]}`}>Read cluster</ArrowLink>
                <ArrowLink href={cluster.landing[0]} muted>
                  {cluster.landing[1]}
                </ArrowLink>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Buyer-intent answers */}
      <Section label="Cost and decision answers">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>[BUYER INTENT // COST + DECISION ANSWERS]</SectionLabel>
            <SectionTitle className="mt-6">Pages built for owners close to requesting a quote.</SectionTitle>
          </div>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em]">
            <ArrowLink href="/quote?source=%2Fblog">Get a range</ArrowLink>
          </span>
        </div>
        <ul className="mt-10 border-t border-line">
          {buyerIntent.map((post) => (
            <li key={post.slug} data-reveal className="border-b border-line">
              <TransitionLink href={`/blog/${post.slug}`} className="group grid gap-3 py-7 md:grid-cols-12 md:items-center md:gap-8">
                <h3 className="display text-2xl leading-tight transition-colors group-hover:text-accent-hi md:col-span-6">{post.title}</h3>
                <p className="leading-relaxed text-muted md:col-span-5">{post.description}</p>
                <span className="hidden justify-self-end text-accent md:col-span-1 md:inline-flex">
                  <span className="sr-only">Read answer</span>
                  <ArrowIcon className="transition-transform duration-[var(--d-sm)] group-hover:translate-x-1" />
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </Section>

      {/* Every post */}
      <Section label="All answers">
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel>[ALL ANSWERS]</SectionLabel>
            <SectionTitle className="mt-6">Every answer, newest first.</SectionTitle>
          </div>
          <p className="hidden font-mono text-[0.72rem] uppercase tracking-[0.14em] text-dim md:block">{blogPosts.length} posts</p>
        </div>
        <BlogCards className="mt-10" posts={newestFirst} />
      </Section>

      <CtaBand title="Want a straight answer for your business?" copy="Book a free 30-minute call. We’ll review your current website and walk you through a relevant example. No obligation to buy." />
    </>
  )
}
