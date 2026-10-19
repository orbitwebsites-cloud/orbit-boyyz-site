'use client'

// The Calendly step of the /book flow, kept out of ./shared.tsx
// so pages that only reuse the form pieces (/sample, which leads.orbitboyzz.com
// also serves) never bundle the scheduler code, its booking URL or its styles.

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CALENDLY_SCRIPT_SRC } from '@/content/qualifyConfig'
import { CalendarClock, Check } from './shared'
import './calendly.css'

/** Calendly link with invitee prefill; '' unless the base is a real https URL. */
export function buildCalendlyUrl(base: string, prefill: { name?: string; email?: string; a1?: string }) {
  if (!base.trim()) return ''
  try {
    const url = new URL(base.trim())
    // Only a real https booking link goes into the iframe and the fallback href.
    if (url.protocol !== 'https:') return ''
    for (const key of ['name', 'email', 'a1'] as const) {
      const value = prefill[key]?.trim()
      if (value) url.searchParams.set(key, value)
    }
    // Calendly re-encodes these values; a '+' for a space would reach the
    // booking form literally, so spaces go out as %20.
    url.search = url.searchParams.toString().replace(/\+/g, '%20')
    return url.toString()
  } catch {
    return ''
  }
}

type CalendlyWindow = Window & {
  Calendly?: { initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void }
}

/**
 * Calendly inline embed. widget.js loads only when this mounts, i.e. on a
 * flow's final screen. `fallback` finishes the "didn't load" sentence with
 * another way to reach us.
 */
export function CalendlyInline({ url, fallback }: { url: string; fallback: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const calendlyWindow = window as CalendlyWindow

    // widget.js auto-initialises .calendly-inline-widget on load; only init
    // by hand when that didn't happen (e.g. the script was already loaded).
    const ensureWidget = () => {
      if (!container.querySelector('iframe') && calendlyWindow.Calendly) {
        container.replaceChildren()
        calendlyWindow.Calendly.initInlineWidget({ url, parentElement: container })
      }
    }

    if (calendlyWindow.Calendly) {
      ensureWidget()
      return
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT_SRC}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = CALENDLY_SCRIPT_SRC
      script.async = true
      document.body.appendChild(script)
    }
    let timer = 0
    const onLoad = () => {
      timer = window.setTimeout(ensureWidget, 80)
    }
    const onError = () => setFailed(true)
    script.addEventListener('load', onLoad)
    script.addEventListener('error', onError)
    return () => {
      window.clearTimeout(timer)
      script?.removeEventListener('load', onLoad)
      script?.removeEventListener('error', onError)
    }
  }, [url])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://calendly.com') return
      const data = event.data as { event?: unknown } | null
      if (data && data.event === 'calendly.event_scheduled') setBooked(true)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div className="qf-calendly-wrap">
      {booked && (
        <p className="qf-booked" role="status">
          <Check size={16} /> Booked. Calendly is emailing you the invite.
        </p>
      )}
      {failed ? (
        <div className="qf-fallback">
          <CalendarClock size={22} />
          <p>
            The scheduler didn’t load here.{' '}
            <a href={url} target="_blank" rel="noreferrer">
              Open the booking page
            </a>{' '}
            {fallback}
          </p>
        </div>
      ) : (
        <div ref={containerRef} className="calendly-inline-widget qf-calendly" data-url={url} />
      )}
      {!failed && (
        <p className="qf-calendly-link">
          Scheduler not showing?{' '}
          <a href={url} target="_blank" rel="noreferrer">
            Open it in a new tab
          </a>
        </p>
      )}
    </div>
  )
}
