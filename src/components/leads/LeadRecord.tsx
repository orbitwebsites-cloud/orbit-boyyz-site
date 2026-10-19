import type { CSSProperties, ReactNode } from 'react'

/** A redaction bar standing in for a value: the card shows fields, not data. */
function Bar({ w, delay = 0 }: { w: string; delay?: number }) {
  return <span className="ld-redact" style={{ width: w, animationDelay: `${delay}ms` } as CSSProperties} aria-hidden="true" />
}

export function CheckMark({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="m2 6.2 2.6 2.6L10 3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Cross({ className }: { className?: string }) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="m2 2 6 6M8 2 2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** The email-check outcomes: only "valid" ships as verified. */
export function EmailCheckLegend() {
  return (
    <ul className="flex flex-wrap gap-2 text-[0.78rem]">
      <li className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-3 py-1.5 text-accent">
        <CheckMark /> valid: ships as verified
      </li>
      <li className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-muted">
        <Cross /> catch-all
      </li>
      <li className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-muted">
        <Cross /> risky
      </li>
    </ul>
  )
}

const ROWS: Array<{ label: string; value: ReactNode }> = [
  { label: 'Company', value: <Bar w="68%" /> },
  {
    label: 'Owner',
    value: (
      <>
        <Bar w="44%" delay={120} />
        <span className="text-dim" aria-hidden="true">
          ·
        </span>
        <Bar w="22%" delay={160} />
      </>
    ),
  },
  {
    label: 'Email',
    value: (
      <>
        <Bar w="52%" delay={240} />
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/50 bg-accent/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-accent">
          <CheckMark /> valid
        </span>
      </>
    ),
  },
  { label: 'Phone', value: <Bar w="40%" delay={320} /> },
  { label: 'Website', value: <Bar w="50%" delay={400} /> },
  { label: 'City / State', value: <Bar w="36%" delay={480} /> },
  {
    label: 'Google',
    value: (
      <>
        <span className="text-accent" aria-hidden="true">
          ★
        </span>
        <Bar w="14%" delay={560} />
        <span className="text-dim" aria-hidden="true">
          ·
        </span>
        <Bar w="26%" delay={600} />
      </>
    ),
  },
]

/**
 * Hero visual: one row of a delivered sheet with the values redacted. Shows
 * which fields a lead carries and that only "valid" emails count as verified.
 */
export function LeadRecord() {
  return (
    <figure className="relative rounded-[calc(var(--radius)+0.5rem)] border border-line-strong bg-panel/90 p-5 shadow-[0_40px_120px_-40px_rgba(214,179,106,0.35)] backdrop-blur sm:p-7">
      <span className="absolute -top-3 left-5 rounded-full border border-line bg-bg px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-dim sm:left-7">
        Illustration · values redacted
      </span>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label">One lead, one row</p>
          <p className="mt-1 font-semibold">Your client’s niche</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-accent/40 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> Built to order
        </span>
      </div>

      <dl className="mt-6 divide-y divide-line border-y border-line">
        {ROWS.map((row) => (
          <div key={row.label} className="grid grid-cols-[5.75rem_minmax(0,1fr)] items-center gap-3 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">{row.label}</dt>
            <dd className="flex min-w-0 items-center gap-2">{row.value}</dd>
          </div>
        ))}
      </dl>

      <figcaption className="mt-5">
        <p className="label text-dim">Email check</p>
        <div className="mt-3">
          <EmailCheckLegend />
        </div>
        <p className="mt-3 text-[0.82rem] leading-snug text-dim">
          Catch-all and risky addresses are never marked as verified. Owner name and title where public sources show them.
        </p>
      </figcaption>
    </figure>
  )
}
