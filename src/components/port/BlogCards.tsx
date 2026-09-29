import type { BlogPost } from '@/content/blog'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { ArrowIcon } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

/** Card grid used on /blog and under each post ("related answers"). */
export function BlogCards({ posts, className }: { posts: readonly BlogPost[]; className?: string }) {
  return (
    <ul className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {posts.map((post) => (
        <li key={post.slug} data-reveal>
          <TransitionLink
            href={`/blog/${post.slug}`}
            className="group flex h-full flex-col justify-between gap-8 rounded-[var(--radius)] border border-line bg-panel/60 p-6 transition-colors duration-[var(--d-sm)] hover:border-accent/50 md:p-7"
          >
            <div>
              <p className="flex items-center justify-between gap-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-dim">
                <span>
                  <span className="text-accent">[</span> Blog <span className="text-accent">{'//'}</span> AEO <span className="text-accent">]</span>
                </span>
                <time>{post.updated}</time>
              </p>
              <h3 className="display mt-6 text-[1.55rem] leading-[1.08] text-balance transition-colors group-hover:text-accent-hi">{post.title}</h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{post.description}</p>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent">
              Read answer <ArrowIcon className="transition-transform duration-[var(--d-sm)] group-hover:translate-x-1" />
            </span>
          </TransitionLink>
        </li>
      ))}
    </ul>
  )
}
