// Line icons for the four services. Every stroke uses pathLength=1 so the
// services section can "draw" them on enter (stroke-dashoffset 1 → 0).

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  pathLength: 1,
  className: 'svc-stroke',
}

export function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {slug === 'websites' && (
        <>
          <rect x="5" y="9" width="38" height="30" rx="4" {...common} />
          <path d="M5 16h38" {...common} />
          <path d="M13 26h14M13 31h9" {...common} />
          <circle cx="35" cy="28.5" r="4" {...common} />
        </>
      )}
      {slug === 'refresh' && (
        <>
          <path d="M38 20a15 15 0 0 0-27.5-4" {...common} />
          <path d="M10 8v8h8" {...common} />
          <path d="M10 28a15 15 0 0 0 27.5 4" {...common} />
          <path d="M38 40v-8h-8" {...common} />
        </>
      )}
      {slug === 'ai-operations' && (
        <>
          <circle cx="24" cy="24" r="6" {...common} />
          <circle cx="9" cy="11" r="3" {...common} />
          <circle cx="39" cy="11" r="3" {...common} />
          <circle cx="9" cy="37" r="3" {...common} />
          <circle cx="39" cy="37" r="3" {...common} />
          <path d="M11.5 13 19.5 20M36.5 13 28.5 20M11.5 35 19.5 28M36.5 35 28.5 28" {...common} />
        </>
      )}
      {slug === 'care' && (
        <>
          <path d="M24 5 8 11v11c0 10 7 17.5 16 21 9-3.5 16-11 16-21V11L24 5Z" {...common} />
          <path d="m17 24 5 5 9-10" {...common} />
        </>
      )}
    </svg>
  )
}
