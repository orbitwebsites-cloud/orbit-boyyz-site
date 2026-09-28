# site/ — merged build notes

Base: `v-opus` (Opus 5.5 build) — see `../COMPARISON.md` for the section-by-section verdict.
Ported from `v-fable` (Fable 5.1 build) and added during the merge:

| Change | File(s) | Why |
|---|---|---|
| Desktop-only preloader gate | `src/app/layout.tsx` (inline script) | On phones the curtain only delays the LCP |
| `motion-go` class on `load` | `layout.tsx`, `globals.css` | Orbit rings / pulses / scroll cue start after load, not at first paint |
| Lighter hero intro on phones | `globals.css` `@media (max-width: 767px)`, `Hero.tsx` (`--w`) | Per-character masked rise → per-word transform-only settle; text is painted on frame one |
| ~~`content-visibility: auto` on below-fold sections~~ **reverted** | — | Placeholder heights made ScrollTrigger measure wrong positions (late reveals, risk to the Process pin). Correctness > ~0.4s of throttled layout |
| No WebGL on phones/tablets | `sections/HeroScene.tsx` | `(max-width:1023px), (pointer:coarse)` keep the CSS orbit — saves ~240KB + a per-frame render loop |

## Animation pass 2 (after "js add animations")
| Effect | Where | Notes |
|---|---|---|
| Scroll progress hairline under the nav | `ui/Nav.tsx`, `.scroll-progress` | CSS scroll timeline, zero JS; hidden where unsupported |
| Background grid parallax | `body::before` + `grid-drift` | CSS scroll timeline, motion only |
| Section labels "decode" like a terminal | `ui/SectionLabel.tsx` (`data-scramble`), `lib/motion/scramble.ts`, `RouteMotion.tsx` | IntersectionObserver (ScrollTrigger per label cost ~500ms TBT); real text kept in `data-text` |
| Button light sweep on hover + hero CTA glint every ~5s | `.btn-primary::after`, `glint` | Glint starts after `load` |
| Reduced-motion "dissolve" mode | `RouteMotion.tsx` (MQ.reduce), `rm-fade` | Nothing moves, but hero + blocks fade in (opacity only), so the page isn't dead for people with motion turned off |
| Removed `motion/react` | `ui/Nav.tsx`, `ui/Accordion.tsx`, `globals.css`, `package.json` | −137KB raw / ~44KB gz initial JS. Menu = clip-path wipe + staggered items in CSS; FAQ = grid-rows 0fr↔1fr |
| Sticky giant step counter | `sections/Process.tsx`, `.step-counter` | Fable's strongest motion moment, merged into Opus's layout |
| Calendly inline embed | `app/contact/page.tsx` | Book without leaving the page (themed to the palette) |
| Logo link `aria-label` removed | `ui/Nav.tsx` | Fixed `label-content-name-mismatch` (a11y 100) |

## Measured (Lighthouse, production server)
- After merge: mobile perf **87 / 89 / 91**, a11y/BP/SEO **100**; desktop **100**.
- After animation pass 2, A/B against the previous commit, alternating on the same laptop: round 1 **91 vs 90**, then both fall together (85/78, 76/68) as the laptop thermally throttles — Lighthouse's simulation scales with local CPU, so compare rounds, not absolute numbers. Desktop **98**, LCP 0.8s, TBT 30ms.
- Motion walk with WebGL: 0 console errors. Mobile menu + FAQ verified.

## Why mobile perf isn't ≥95 and what would get it there
Experiments (`--blocked-url-patterns`) showed Lighthouse's *simulated* LCP is driven almost entirely by JS bytes on the critical path: blocking all JS → 98. What's left up-front is React/Next (~70KB gz), GSAP + ScrollTrigger + SplitText (~46KB gz) and Lenis. Getting to 95 would need GSAP/Lenis loaded *after* first paint (dynamic `import()` inside effects across ~12 components) or fewer/lighter sections on the homepage. Real-device numbers matter more than the sim; ship, then measure with Vercel Speed Insights.

## Still to do after deploy
- Port blog, town and industry pages from `D:\orbit boyyz site\src\App.tsx` (56 routes) and un-hide the footer links to `/quote`, `/blog`, `/web-design-central-nj`, `/orbitboyzz`.
- Real team photo on `/about`; screen recordings for work cards if wanted.
- 301 map for any old URL that changes; resubmit sitemap + IndexNow.
