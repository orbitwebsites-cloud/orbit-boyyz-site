import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Magnetic } from './Magnetic'
import { TransitionLink } from './TransitionLink'

type Props = {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'sm'
  magnetic?: boolean
  className?: string
  icon?: 'arrow' | 'phone' | 'none'
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.59a1 1 0 0 1-.25 1L6.6 10.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

/**
 * The one button. Internal hrefs use the page-transition link, tel:/mailto:/https
 * render a plain anchor (external ones open in a new tab).
 */
export function Button({ href, children, variant = 'primary', size = 'md', magnetic = false, className, icon = 'arrow' }: Props) {
  const cls = cn('btn', variant === 'primary' ? 'btn-primary' : 'btn-ghost', size === 'sm' && 'btn-sm', icon === 'none' && 'px-6!', className)
  const inner = (
    <>
      <span>{children}</span>
      {icon !== 'none' && <span className="btn-arrow">{icon === 'phone' ? <PhoneIcon /> : <ArrowIcon />}</span>}
    </>
  )

  const isInternal = href.startsWith('/')
  const isExternal = href.startsWith('http')
  const el = isInternal ? (
    <TransitionLink href={href} className={cls}>
      {inner}
    </TransitionLink>
  ) : (
    <a href={href} className={cls} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {inner}
    </a>
  )

  return magnetic ? <Magnetic>{el}</Magnetic> : el
}
