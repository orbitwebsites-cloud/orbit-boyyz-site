import type { ReactNode } from 'react'
import { ArrowIcon } from '@/components/ui/Button'
import { Magnetic } from '@/components/ui/Magnetic'
import { cn } from '@/lib/cn'
import { LEADS_BOOK_PATH } from '@/lib/leadsSite'

/**
 * The leads site's one primary action: the lead-list booking flow
 * (/book-leads). A plain link, so it works the same on every host.
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
    <a href={LEADS_BOOK_PATH} className={cn('btn btn-primary', size === 'sm' && 'btn-sm', block && 'w-full sm:w-auto', className)}>
      <span>{children}</span>
      <span className="btn-arrow">
        <ArrowIcon />
      </span>
    </a>
  )
  return magnetic ? <Magnetic className={block ? 'w-full sm:w-auto' : undefined}>{link}</Magnetic> : link
}
