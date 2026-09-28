# site/ — merged build notes

Base: `v-opus` (Opus 5.5 build) — see `../COMPARISON.md` for the section-by-section verdict.
Ported from `v-fable` (Fable 5.1 build) and added during the merge:

| Change | File(s) | Why |
|---|---|---|
| Desktop-only preloader gate | `src/app/layout.tsx` (inline script) | On phones the curtain only delays the LCP |
| `motion-go` class on `load` | `layout.tsx`, `globals.css` | Orbit rings / pulses / scroll cue start after load, not at first paint |
| Static hero on phones | `globals.css` `@media (max-width: 767px)` | ~60 animations at first paint delayed FCP ~1s on throttled mobile; scroll motion untouched |
| `content-visibility: auto` on 7 below-fold, non-pinned sections | `Work`, `Roi`, `SpeedProof`, `PricingPreview`, `Faq`, `FinalCta`, `Footer` + `.cv-auto` | Pre-paint layout 728ms → 343ms (home is ~1,100 DOM nodes). Pinned sections excluded (paint containment breaks fixed pinning) |
| Removed `motion/react` | `ui/Nav.tsx`, `ui/Accordion.tsx`, `globals.css`, `package.json` | −137KB raw / ~44KB gz initial JS. Menu = clip-path wipe + staggered items in CSS; FAQ = grid-rows 0fr↔1fr |
| Sticky giant step counter | `sections/Process.tsx`, `.step-counter` | Fable's strongest motion moment, merged into Opus's layout |
| Calendly inline embed | `app/contact/page.tsx` | Book without leaving the page (themed to the palette) |
| Logo link `aria-label` removed | `ui/Nav.tsx` | Fixed `label-content-name-mismatch` (a11y 100) |

## Measured (Lighthouse, production server, 3 mobile runs after merge)
- Mobile: perf **87 / 89 / 91**, a11y **100**, best-practices **100**, SEO **100**; LCP 3.5–3.7s (simulated), TBT 60–170ms, CLS 0.
- Desktop: perf **100**, LCP 0.8s.
- Motion walk with WebGL: 0 console errors. Mobile menu + FAQ verified.

## Why mobile perf isn't ≥95 and what would get it there
Experiments (`--blocked-url-patterns`) showed Lighthouse's *simulated* LCP is driven almost entirely by JS bytes on the critical path: blocking all JS → 98. What's left up-front is React/Next (~70KB gz), GSAP + ScrollTrigger + SplitText (~46KB gz) and Lenis. Getting to 95 would need GSAP/Lenis loaded *after* first paint (dynamic `import()` inside effects across ~12 components) or fewer/lighter sections on the homepage. Real-device numbers matter more than the sim; ship, then measure with Vercel Speed Insights.

## Still to do after deploy
- Port blog, town and industry pages from `D:\orbit boyyz site\src\App.tsx` (56 routes) and un-hide the footer links to `/quote`, `/blog`, `/web-design-central-nj`, `/orbitboyzz`.
- Real team photo on `/about`; screen recordings for work cards if wanted.
- 301 map for any old URL that changes; resubmit sitemap + IndexNow.
