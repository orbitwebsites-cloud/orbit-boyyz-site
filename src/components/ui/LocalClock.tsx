'use client'

import { useEffect, useRef } from 'react'

/** Live Plainsboro time for the hero HUD. Server renders a placeholder; no re-renders. */
export function LocalClock() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/New_York',
      timeZoneName: 'short',
    })
    const tick = () => {
      if (ref.current) ref.current.textContent = fmt.format(new Date())
    }
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <span ref={ref} suppressHydrationWarning>
      --:-- ET
    </span>
  )
}
