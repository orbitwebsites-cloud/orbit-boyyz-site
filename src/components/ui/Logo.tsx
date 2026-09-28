import { cn } from '@/lib/cn'

/** The orbit mark from public/orbit-icon.svg, inline so it inherits sizing. */
export function OrbitMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <circle cx="64" cy="64" r="38" stroke="#D6B36A" strokeWidth="8" />
      <circle cx="64" cy="64" r="14" fill="#F4EFE6" />
      <path d="M24 72C40 45 78 32 106 44" stroke="#F4EFE6" strokeWidth="7" strokeLinecap="round" />
      <circle cx="104" cy="44" r="8" fill="#D6B36A" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <OrbitMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="display whitespace-nowrap text-[1.08rem] font-bold tracking-[-0.03em]">Orbit Websites</span>
        <span className="mt-1 font-mono text-[0.58rem] tracking-[0.2em] text-dim">ORBITBOYZZ</span>
      </span>
    </span>
  )
}
