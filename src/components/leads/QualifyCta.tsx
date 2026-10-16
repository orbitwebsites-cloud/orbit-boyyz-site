import type { ReactNode } from 'react'
import { ArrowIcon } from '@/components/ui/Button'
import { Magnetic } from '@/components/ui/Magnetic'
import { cn } from '@/lib/cn'
import { LEADS_QUALIFY_URL } from '@/lib/leadsSite'

/**
 * The leads site's one primary action: the agency questionnaire on
 * orbitboyzz.com/qualify (?src=leads-site). Same look as the site's <Button>,
 * but a same-tab link: <Button> opens absolute URLs in a new tab.
 */
export function QualifyCta({
  children,
  size = 'md',
  magnetic = false,
  className,
}: {
  children: ReactNode
  size?: 'md' | 'sm'
  magnetic?: boolean
  className?: string
}) {
  const link = (
    <a href={LEADS_QUALIFY_URL} className={cn('btn btn-primary', size === 'sm' && 'btn-sm', className)}>
      <span>{children}</span>
      <span className="btn-arrow">
        <ArrowIcon />
      </span>
    </a>
  )
  return magnetic ? <Magnetic>{link}</Magnetic> : link
}
