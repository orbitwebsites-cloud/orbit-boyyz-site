import { leadsRequest } from '@/content/leads'
import { cn } from '@/lib/cn'

/**
 * "What happens after you request": the three steps between the form and the
 * sheet, shown next to the request form on leads.orbitboyzz.com and /qualify.
 * `heading` keeps the outline in order: h3 under the leads page's h2, h2 under
 * /qualify's h1.
 */
export function NextSteps({ heading: Heading = 'h3', className }: { heading?: 'h2' | 'h3'; className?: string }) {
  return (
    <div className={cn('min-w-0', className)}>
      <Heading className="label text-accent">{leadsRequest.nextLabel}</Heading>
      <ol className="mt-5 border-t border-line">
        {leadsRequest.next.map((step, i) => (
          <li key={step.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2 border-b border-line py-4">
            <span className="pt-[0.2em] font-mono text-[0.75rem] tracking-[0.14em] text-accent" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <p className="font-medium leading-snug text-fg">{step.title}</p>
              <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{step.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
