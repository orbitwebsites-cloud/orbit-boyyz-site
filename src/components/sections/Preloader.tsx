/**
 * First-visit preloader (< 1.2s). Pure CSS: the orbit mark draws itself, the
 * counter runs 00→100, then the panel wipes up. It only displays when the
 * inline script in layout.tsx has added `html.is-preloading` (first visit to
 * the homepage, motion allowed). Never blocks content for crawlers or no-JS.
 */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="flex w-[min(20rem,70vw)] flex-col items-center">
        <svg viewBox="0 0 128 128" className="h-24 w-24" fill="none">
          <circle className="preloader__ring" pathLength={1} cx="64" cy="64" r="38" stroke="#D6B36A" strokeWidth="6" />
          <circle className="preloader__core" cx="64" cy="64" r="14" fill="#F4EFE6" />
          <path
            className="preloader__arc"
            pathLength={1}
            d="M24 72C40 45 78 32 106 44"
            stroke="#F4EFE6"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle className="preloader__planet" cx="104" cy="44" r="8" fill="#D6B36A" />
        </svg>
        <div className="mt-8 flex w-full items-center justify-between font-mono text-[0.7rem] tracking-[0.18em] text-muted">
          <span>ORBIT WEBSITES</span>
          <span className="preloader__count text-accent" />
        </div>
        <div className="preloader__bar mt-3 h-px w-full bg-line">
          <span />
        </div>
      </div>
    </div>
  )
}
