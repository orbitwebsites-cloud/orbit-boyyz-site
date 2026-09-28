// Motion system — the only easings and durations used on the site.
// Mirrors the CSS custom properties in src/app/globals.css (--ease-*, --d-*).

/** GSAP ease names. `out` for entrances, `inOut` for transitions/scrubs. */
export const EASE = {
  out: 'expo.out',
  inOut: 'power2.inOut',
} as const

/** Same curves as cubic-bezier arrays, for motion/react. */
export const BEZIER = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.45, 0, 0.55, 1],
} as const

/** Durations in seconds: 200 / 400 / 800 / 1200ms. */
export const DUR = {
  xs: 0.2,
  sm: 0.4,
  md: 0.8,
  lg: 1.2,
} as const

export const STAGGER = {
  chars: 0.014,
  words: 0.04,
  lines: 0.08,
  items: 0.08,
} as const

export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
  fine: '(pointer: fine) and (prefers-reduced-motion: no-preference)',
} as const

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(MQ.reduce).matches
}
