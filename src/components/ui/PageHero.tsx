import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { SectionLabel } from './SectionLabel'
import { TransitionLink } from './TransitionLink'

/** A visible breadcrumb step; the last one (the current page) has no href. */
export type Crumb = { name: string; href?: string }

/**
 * Inner-page hero. The title rises out of a mask with CSS (paints with the
 * HTML — no JS needed for LCP), the rest fades up behind it. Optional
 * breadcrumbs render above the label, styled like the blog post trail.
 */
export function PageHero({
  label,
  title,
  lead,
  children,
  breadcrumbs,
}: {
  label: string
  title: ReactNode
  lead?: string
  children?: ReactNode
  breadcrumbs?: readonly Crumb[]
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+4rem)] md:pb-24 md:pt-[calc(var(--nav-h)+7rem)]">
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(214,179,106,0.16),transparent_65%)]" />
      <div className="container-x">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="page-fade mb-7 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-dim" style={{ '--delay': '-400ms' } as CSSProperties}>
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumbs.map((crumb, i) => (
                <Fragment key={`${crumb.name}-${i}`}>
                  {i > 0 && (
                    <li aria-hidden="true" className="text-accent">
                      /
                    </li>
                  )}
                  <li>
                    {crumb.href ? (
                      <TransitionLink href={crumb.href} className="hover:text-fg">
                        {crumb.name}
                      </TransitionLink>
                    ) : (
                      <span aria-current="page" className="text-muted">
                        {crumb.name}
                      </span>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>
          </nav>
        )}
        <div className="page-fade" style={{ '--delay': '-300ms' } as CSSProperties}>
          <SectionLabel>{label}</SectionLabel>
        </div>
        <h1 className="display t-1 mt-7 max-w-[16ch] text-balance">
          <span className="mask">
            <span className="page-rise">{title}</span>
          </span>
        </h1>
        {lead && (
          <p className="page-fade t-lead mt-8 max-w-2xl text-muted" style={{ '--delay': '0ms' } as CSSProperties}>
            {lead}
          </p>
        )}
        {children && (
          <div className="page-fade mt-10" style={{ '--delay': '120ms' } as CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
