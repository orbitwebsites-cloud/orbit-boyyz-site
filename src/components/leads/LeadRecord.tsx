import type { ReactNode } from 'react'
import { leadsSample } from '@/content/leads'
import { cn } from '@/lib/cn'

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

const row = leadsSample.row

/** A masked value: the hidden characters (•) sit dimmer than the ones shown, so the mask reads at a glance. */
function Masked({ value, className }: { value: string; className?: string }) {
  return (
    <span className={className}>
      {value.split(/(•+)/).map((part, i) =>
        part.startsWith('•') ? (
          <span key={i} className="text-dim">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  )
}

const ROWS: Array<{ label: string; value: ReactNode }> = [
  { label: 'Company', value: <span className="font-medium text-fg">{row.company}</span> },
  {
    label: 'Owner',
    value: (
      <>
        <Masked value={row.owner} />
        <span className="text-dim" aria-hidden="true">
          ·
        </span>
        <span className="text-muted">{row.title}</span>
      </>
    ),
  },
  {
    label: 'Email',
    value: (
      <>
        <Masked value={row.email} className="min-w-0 wrap-anywhere" />
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/50 bg-accent/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-accent">
          <CheckMark /> valid
        </span>
      </>
    ),
  },
  { label: 'Phone', value: <Masked value={row.phone} className="tabular-nums" /> },
  { label: 'Website', value: <span className="wrap-anywhere">{row.website}</span> },
  // No spaces around the slash: 'City / State' wraps to two lines in the phone label column.
  { label: 'City/State', value: <span>{row.city}</span> },
  {
    label: 'Google',
    value: (
      <>
        <span className="text-accent" aria-hidden="true">
          ★
        </span>
        <span className="tabular-nums">{row.rating}</span>
        <span className="text-dim" aria-hidden="true">
          ·
        </span>
        <span className="tabular-nums text-muted">{row.reviews} reviews</span>
      </>
    ),
  },
]

/**
 * One real row from a list we built (src/content/leads.ts leadsSample), with
 * the owner's name, the email and the phone masked. Shows what a lead carries
 * and that its email came back "valid". Hero visual on leads.orbitboyzz.com and
 * the proof card on /qualify.
 */
export function LeadRecord({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        'relative rounded-[calc(var(--radius)+0.5rem)] border border-line-strong bg-panel/90 p-5 shadow-[0_40px_120px_-40px_rgba(214,179,106,0.35)] backdrop-blur sm:p-7',
        className,
      )}
    >
      <span className="absolute -top-3 left-5 rounded-full border border-line bg-bg px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-dim sm:left-7">
        {leadsSample.badge}
      </span>
      {/* The eyebrow never wraps; when the card is too narrow for both (most phones), the badge drops under the title. */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <p className="label whitespace-nowrap">{leadsSample.title}</p>
          <p className="mt-1 font-semibold">{leadsSample.context}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-accent/40 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">
          <CheckMark /> Email verified
        </span>
      </div>

      <dl className="mt-6 divide-y divide-line border-y border-line">
        {ROWS.map((r) => (
          <div key={r.label} className="grid grid-cols-[5.75rem_minmax(0,1fr)] items-baseline gap-3 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">{r.label}</dt>
            <dd className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[0.92rem] leading-snug text-fg/90">{r.value}</dd>
          </div>
        ))}
      </dl>

      <figcaption className="mt-5 text-[0.82rem] leading-snug text-dim">{leadsSample.caption}</figcaption>
    </figure>
  )
}
