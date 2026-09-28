import { cn } from '@/lib/cn'

/** Renders "[01 // THE PROBLEM]" with gold brackets and slashes. */
export function SectionLabel({ children, className }: { children: string; className?: string }) {
  const parts = children.split(/(\[|\]|\/\/)/g).filter(Boolean)
  return (
    <p className={cn('label flex items-center gap-[0.35em]', className)}>
      {parts.map((p, i) =>
        p === '[' || p === ']' || p === '//' ? (
          <span key={i} className="text-accent">
            {p}
          </span>
        ) : (
          <span key={i}>{p.trim()}</span>
        ),
      )}
    </p>
  )
}
