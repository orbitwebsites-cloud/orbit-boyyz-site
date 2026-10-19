import type { ReactNode } from 'react'
import { ArrowIcon } from '@/components/ui/Button'
import { Magnetic } from '@/components/ui/Magnetic'
import { cn } from '@/lib/cn'
import { LEADS_REQUEST_HREF } from '@/lib/leadsSite'

/**
 * The leads site's one primary action: a jump to the 25-free-leads request
 * form at the bottom of the page (#request, src/components/leads/LeadsRequest.tsx).
 * Same look as the site's <Button>. `block` makes it full width (phones).
 */
export function RequestCta({
  children,
  size = 'md',
  magnetic = false,
  block = false,
  className,
}: {
  children: ReactNode
  size?: 'md' | 'sm'
  magnetic?: boolean
  block?: boolean
  className?: string
}) {
  const link = (
    <a href={LEADS_REQUEST_HREF} className={cn('btn btn-primary', size === 'sm' && 'btn-sm', block && 'w-full sm:w-auto', className)}>
      <span>{children}</span>
      <span className="btn-arrow">
        <ArrowIcon />
      </span>
    </a>
  )
  return magnetic ? <Magnetic className={block ? 'w-full sm:w-auto' : undefined}>{link}</Magnetic> : link
}
