import type { CSSProperties } from 'react'
import { hero, services, site } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { LocalClock } from '@/components/ui/LocalClock'
import { HeroScene } from './HeroScene'

// Words rendered in the serif-italic gold accent.
const ACCENT = new Set(['book', 'jobs,'])
const PLANET_COLORS = ['#F4EFE6', '#D6B36A', '#7FB4FF', '#ECD29A']

type Word = { text: string; start: number; accent: boolean }

function splitHeadline(text: string): Word[] {
  const words: Word[] = []
  let index = 0
  for (const w of text.split(' ')) {
    words.push({ text: w, start: index, accent: ACCENT.has(w) })
    index += w.length
  }
  return words
}

/**
 * [Hero] Headline is split into characters on the server and rises in with a
 * CSS stagger (expo.out, 1200ms, 14ms per char) — it paints with the HTML, so
 * LCP never waits for JS. The WebGL orbit loads later behind a CSS fallback.
 */
export function Hero() {
  const words = splitHeadline(hero.headline)

  return (
    <section data-hero className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[var(--nav-h)]">
      <HeroScene />

      <div className="container-x relative flex flex-1 flex-col pb-10 pt-8 md:pt-12">
        {/* HUD */}
        <div className="intro-fade flex items-start justify-between gap-6" style={{ '--delay': '0ms' } as CSSProperties}>
          <p className="label flex items-center gap-2.5">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <p className="label hidden text-right text-dim md:block">
            40.33°N / 74.58°W
            <br />
            <span className="text-muted">
              Local <LocalClock />
            </span>
          </p>
        </div>

        <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
          <h1 className="display t-hero max-w-[12.5ch] text-balance">
            <span className="sr-only">{hero.headline}</span>
            <span aria-hidden="true">
              {words.map((w, wi) => (
                <span key={wi}>
                  <span className={w.accent ? 'hero-word is-accent serif-accent text-accent' : 'hero-word'}>
                    {Array.from(w.text).map((ch, ci) => (
                      <span key={ci} className="hero-char" style={{ '--i': w.start + ci } as CSSProperties}>
                        {ch}
                      </span>
                    ))}
                  </span>
                  {wi < words.length - 1 ? ' ' : null}
                </span>
              ))}
            </span>
          </h1>

          <p className="intro-fade t-lead mt-8 max-w-[34rem] text-muted" style={{ '--delay': '550ms' } as CSSProperties}>
            {hero.sub}
          </p>

          <div className="intro-fade mt-10 flex flex-wrap items-center gap-3" style={{ '--delay': '700ms' } as CSSProperties}>
            <Button href={site.booking} magnetic>
              {hero.primaryCta}
            </Button>
            <a href="#work" className="btn btn-ghost">
              <span>{hero.secondaryCta}</span>
              <span className="btn-arrow">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 1v11M2.5 7.5 7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <a href={site.phoneHref} className="ml-1 font-mono text-[0.82rem] tracking-[0.04em] text-muted transition-colors hover:text-accent">
              or call <span className="text-fg">{site.phoneDisplay}</span>
            </a>
          </div>

          <ul className="intro-fade mt-10 flex flex-wrap gap-2" style={{ '--delay': '850ms' } as CSSProperties}>
            {hero.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3.5 py-2 text-[0.82rem] text-muted backdrop-blur-sm">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="m2 6.2 2.6 2.6L10 3.4" stroke="#D6B36A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {chip}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom HUD: planets legend + scroll cue */}
        <div className="intro-fade flex items-end justify-between gap-6 border-t border-line pt-5" style={{ '--delay': '1000ms' } as CSSProperties}>
          <ul className="hidden flex-wrap gap-x-6 gap-y-2 md:flex">
            {services.map((s, i) => (
              <li key={s.slug} className="label flex items-center gap-2 text-dim">
                <span className="h-2 w-2 rounded-full" style={{ background: PLANET_COLORS[i], boxShadow: `0 0 10px ${PLANET_COLORS[i]}` }} aria-hidden="true" />
                {s.id} {s.title}
              </li>
            ))}
          </ul>
          <p className="label md:hidden">Scroll</p>
          <div className="flex items-center gap-3">
            <span className="label hidden md:inline">Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-line">
              <span className="scroll-cue absolute inset-0 bg-accent" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
