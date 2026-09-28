'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps, MouseEvent } from 'react'
import { usePageTransition } from '@/lib/motion/PageTransition'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

/** next/link that plays the page-transition wipe for internal route changes. */
export function TransitionLink({ href, onClick, ...props }: Props) {
  const transition = usePageTransition()
  const pathname = usePathname()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented || !transition) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!href.startsWith('/')) return
    const path = href.split('#')[0] || '/'
    if (path === pathname) return
    e.preventDefault()
    transition.navigate(href)
  }

  return <Link href={href} onClick={handleClick} {...props} />
}
