import type { CSSProperties, ReactNode } from 'react'
import { SectionLabel } from './SectionLabel'

/**
 * Inner-page hero. The title rises out of a mask with CSS (paints with the
 * HTML — no JS needed for LCP), the rest fades up behind it.
 */
export function PageHero({ label, title, lead, children }: { label: string; title: ReactNode; lead?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+4rem)] md:pb-24 md:pt-[calc(var(--nav-h)+7rem)]">
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(214,179,106,0.16),transparent_65%)]" />
      <div className="container-x">
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
