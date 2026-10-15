'use client'

// Pieces shared by the Typeform-style booking flows: /qualify (agencies,
// Qualify.tsx) and /book (website clients, components/book/Book.tsx).
// Styles live in ./qualify.css (qf- classes), imported by both pages.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { CALENDLY_SCRIPT_SRC } from '@/content/qualifyConfig'
import { checkEmail, looksLikeEmail, normalizeEmail, type EmailCheck } from '@/lib/emailCheck'

export { looksLikeEmail }

export const KEY_LETTERS = 'ABCDEFGHIJ'

// Screen transition timing (was framer-motion: 0.34s, or 0.12s opacity-only
// under reduced motion). The CSS keyframes in qualify.css use the same values.
const SCREEN_MS = 340
const SCREEN_MS_REDUCED = 120

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function isTypingTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
}

export function keyToIndex(key: string) {
  if (key.length !== 1) return -1
  if (key >= '1' && key <= '9') return Number(key) - 1
  const lower = key.toLowerCase()
  if (lower >= 'a' && lower <= 'z') return lower.charCodeAt(0) - 97
  return -1
}

/** Jump to the top between steps. 'instant' so no inherited smooth
 *  scroll-behavior turns it into an animation. */
export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

export function focusSoon(element: HTMLElement | null) {
  if (!element) return
  // Wait one frame so the entering screen is in the DOM before focus moves.
  window.requestAnimationFrame(() => element.focus({ preventScroll: true }))
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? ''
}

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

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

// ---------------------------------------------------------------------------
// Icons (lucide paths, inline so the app needs no icon package)
// ---------------------------------------------------------------------------

type IconProps = { size?: number; className?: string }

function Icon({ size = 24, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function ArrowLeft(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </Icon>
  )
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Icon>
  )
}

export function Check(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Icon>
  )
}

export function LoaderCircle(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </Icon>
  )
}

export function Send(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </Icon>
  )
}

export function CalendarClock(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </Icon>
  )
}

// ---------------------------------------------------------------------------
// Screen transitions
// ---------------------------------------------------------------------------

/** false while a screen is animating out (replaces framer-motion's useIsPresent). */
const PresenceContext = createContext(true)

export function useIsPresent() {
  return useContext(PresenceContext)
}

type StageMotion = {
  exiting: boolean
  motion: 'exit' | 'enter' | undefined
  style: CSSProperties
}

/**
 * mode="wait" screen transitions: when the step changes, the previous view is
 * kept on stage (frozen, inert, keyboard handlers off) while it animates out;
 * then the new screen mounts and animates in. The first render doesn't animate.
 * `view` must be a memoised object that changes whenever the screen should re-render.
 */
export function useScreenStage<V>(view: V, stepOf: (view: V) => number, direction: number) {
  const [shown, setShown] = useState<V>(view)
  const [exiting, setExiting] = useState<{ view: V; dir: number } | null>(null)
  const [animateIn, setAnimateIn] = useState(false)

  if (shown !== view) {
    // Adjusting state from the previous render (react.dev "storing information
    // from previous renders"): `shown` is what was on screen for its step.
    setShown(view)
    if (!exiting && stepOf(shown) !== stepOf(view)) setExiting({ view: shown, dir: direction })
  }

  useEffect(() => {
    if (!exiting) return
    const timer = window.setTimeout(
      () => {
        setExiting(null)
        setAnimateIn(true)
      },
      prefersReducedMotion() ? SCREEN_MS_REDUCED : SCREEN_MS,
    )
    return () => window.clearTimeout(timer)
  }, [exiting])

  const stage: StageMotion = {
    exiting: Boolean(exiting),
    motion: exiting ? 'exit' : animateIn ? 'enter' : undefined,
    style: { '--qf-dir': exiting ? exiting.dir : direction } as CSSProperties,
  }
  return { stageView: exiting ? exiting.view : view, stage }
}

export function StageScreen({ stage, screenKey, children }: { stage: StageMotion; screenKey: string; children: ReactNode }) {
  return (
    <PresenceContext.Provider value={!stage.exiting}>
      <section key={screenKey} className="qf-screen" data-motion={stage.motion} style={stage.style}>
        {/* The outgoing screen is inert while it animates away, so keystrokes
            can't land in its inputs or buttons after the step has changed. */}
        <div inert={stage.exiting}>{children}</div>
      </section>
    </PresenceContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Email check
// ---------------------------------------------------------------------------

type Rejection = { email: string; suggestion?: string }

const emailKey = normalizeEmail

/**
 * Runs /api/verify-email for an email field. `precheck` warms the answer on
 * blur (and shows a rejection early); `verify` is awaited on submit and
 * resolves to null when the address is rejected. A rejection only shows while
 * the field still holds the address it was about, so editing clears it.
 * Callers keep their fields read-only while `checking` (and while sending):
 * an edit made during the check would otherwise skip it and reach the
 * Calendly prefill unverified.
 */
export function useEmailCheck(email: string) {
  const [rejection, setRejection] = useState<Rejection | null>(null)
  const [checking, setChecking] = useState(false)

  const precheck = useCallback((value: string) => {
    const key = emailKey(value)
    if (!looksLikeEmail(key)) return
    void checkEmail(key).then((result) => {
      if (result.status === 'rejected') setRejection({ email: key, suggestion: result.suggestion })
    })
  }, [])

  const verify = useCallback(async (value: string): Promise<EmailCheck | null> => {
    const key = emailKey(value)
    setChecking(true)
    try {
      const result = await checkEmail(key)
      if (result.status === 'rejected') {
        setRejection({ email: key, suggestion: result.suggestion })
        return null
      }
      return result
    } finally {
      setChecking(false)
    }
  }, [])

  const active = rejection && rejection.email === emailKey(email) ? rejection : null
  return { rejected: Boolean(active), suggestion: active?.suggestion ?? '', checking, precheck, verify }
}

/** One-click fix for a mistyped domain, shown under the email error. */
export function EmailSuggestion({ suggestion, disabled, onUse }: { suggestion: string; disabled?: boolean; onUse: (email: string) => void }) {
  if (!suggestion) return null
  return (
    <button type="button" className="qf-suggest" disabled={disabled} onClick={() => onUse(suggestion)}>
      Did you mean <strong>{suggestion}</strong>?
    </button>
  )
}

// ---------------------------------------------------------------------------
// Calendly
// ---------------------------------------------------------------------------

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
