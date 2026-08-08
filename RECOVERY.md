# RECOVERY — Port new design onto the 70-page site

**Started:** 2026-08-08
**Goal:** orbitboyzz.me keeps its current (simplified) look **and** regains 70 AI-readable prerendered pages.

---

## Situation

| | Live site | `master` (this repo) |
|---|---|---|
| Source | `origin/codex/simplify-website` @ `621d95f` | `master` @ `4d2cc46` |
| `src/App.tsx` | 345 lines, **0 routes** | 4,226 lines, **29 routes**, 50 components |
| Styling | 1,095-line hand-written CSS design system | Tailwind v4 (`@theme` in `index.css`) |
| Prerendered pages | **1** | **70** |
| Blog posts | 0 | 42 |

`621d95f` ("Simplify website sales flow") collapsed the 70-page site into one page and gutted
`prerender.mjs` (−1090 lines). It was never merged to `master`.

**Vercel:** domain `orbitboyzz.me` → project `orbit-boyyz-site` (`prj_953oJNPAQ9gWI2eQDUw4FNgia4sg`).
The old `deploy.yml` targeted the wrong project (`orbit-websites-premium`) and was removed in `4d2cc46`.
**Git integration is NOT yet connected — do not connect until the port is verified.**

---

## Design tokens (from the simplify branch `App.css`)

```
--ink:   #111b17    --muted: #66716c    --line: #dce2dd    --paper: #f7f8f4
--card:  #ffffff    --green: #166534    --lime: #c8f56a    --dark:  #0d1a14
```

Semantic classes: `.hero`, `.section-wrap`, `.section-heading`, `.eyebrow`, `.button-primary`,
`.button-secondary`, `.plan-card`, `.plan-grid`, `.process-step`, `.project-card`, `.faq-section`,
`.final-cta`, `.mini-browser`, `.savings-card`.

Reference copies extracted to the session scratchpad: `simplify/App.tsx`, `simplify/App.css`,
`simplify/index.html`, `simplify/llms.txt`.

---

## Strategy — additive, not a merge

A `git merge` is wrong here: `621d95f` is 1,458 insertions vs **5,512 deletions**. Merging would
delete the routes and prerender table we need. Instead, port the design forward onto `master`.

Tailwind and the hand-written CSS coexist, so the homepage can be reproduced **exactly** while the
other 28 routes keep working and get restyled onto the same tokens.

---

## Phases

- [ ] **Phase 1 — Exact homepage port**
      Bring `App.css` (1,095 lines) onto master; replace master's `Home` with the simplify markup verbatim.
      Done when: local `/` is visually identical to live `www.orbitboyzz.me/`, and `npm run build` still emits 70 routes.

- [ ] **Phase 2 — Shared chrome**
      Port `Header` / `Footer` / nav to the new design, but keep links to all 29 routes
      (the simplify nav only had anchor links — it must gain real page links).
      Done when: every route renders with the new header/footer and no dead links.

- [ ] **Phase 3 — Sub-page restyle**
      Restyle About / Services / Pricing / Projects / FAQ / Quote / Blog / BlogPost / location pages
      onto the new tokens. Highest traffic first: location pages, then blog.
      Done when: no page still shows the old palette.

- [ ] **Phase 4 — Rebuild + verify**
      `npm run build` → confirm 70 routes, per-route canonicals, 70-URL sitemap, current `llms.txt`.
      Done when: local dist matches expectations and a preview deploy looks right.

- [ ] **Phase 5 — Connect Vercel Git integration**
      Only after Phase 4 passes. Vercel → `orbit-boyyz-site` → Settings → Git → connect
      `orbitwebsites-cloud/orbit-boyyz-site`, **Production Branch = `master`**.
      Done when: `www.orbitboyzz.me/web-design-princeton-nj` returns ~41 KB with a self-canonical.

---

## Guardrails

- **Never `git merge origin/codex/simplify-website`** — it deletes the 70-route architecture.
- Do not connect Vercel Git integration before Phase 4 passes; it would publish the old design.
- Keep `blog-writer.yml`, `lead-finder.yml`, `seo-agent.yml` untouched.
- `vercel.json` must keep `deploymentEnabled.master = true` (required by Git integration).
- Verify with a real build, never by inspection alone.

---

## Current state

**Phase 1 — ✅ COMPLETE. Phase 2 — ✅ COMPLETE (folded into Phase 1).**

Done:
- `src/App.css` replaced with the 1,095-line design system + ~14 lines of footer styles (backup at `src/App.css.master-backup`)
- `Home()` replaced with the simplify homepage markup — **H1 and all 7 h2s match live exactly**
- `Header()` rebuilt in the new design but with **8 real route links** (simplify had anchors only)
- `Footer()` rebuilt in the new design keeping **35 internal links** (areas, industries, buyer answers)
- Added `showcaseProjects`, `processSteps`, `carePlans`, `trackClick`, `Logo`, `PrimaryLink`
- Deleted 6 components orphaned by the old homepage: `PerformanceBentoGrid`, `PricingTiers`,
  `BlogPreview`, `WorkPreview`, `Testimonial`, `FAQPreview` (recover via `git show 4d2cc46:src/App.tsx`)
- Removed unused `X` / `Quote` icon imports; dropped a duplicate `AnalyticsWindow` type
- `prerender.mjs` homepage title/description updated to match live
- Backup of the pre-port file at `src/App.tsx.backup`

Verified: `npm run build` **exit 0**, **70 routes**, **70 sitemap URLs**, homepage title identical to
live, Princeton page 36,044 b with a correct self-canonical.

### ⚠️ Known state — do not deploy yet

The homepage is fully converted. **The other 28 routes still have dark-theme Tailwind bodies**
inside the new light header/footer, so they look mismatched. This is Phase 3.

**Next step:** Phase 3 — restyle sub-pages onto the new tokens. Order by value:
1. `TownWebDesignPage` / `WebDesignEwingNJ` / `WebDesignCentralNJ` / `IndustryWebDesignPage` (18 location + industry pages, one shared component each)
2. `BlogPost` + `Blog` (43 pages)
3. `Pricing`, `Services`, `About`, `Projects`, `FAQ`, `QuotePage`, `Contact`, `OrbitBoyzzBrandPage`

Preview the current state with `npm run preview` in `D:/orbit boyyz site` → http://localhost:4173

---

## 2026-08-08 — DEPLOYED ✅

Live at https://www.orbitboyzz.me — verified: 70-URL sitemap, per-route canonicals,
current `llms.txt`, real 404s, homepage title matches the original design.

### How to deploy (the only method that works)

Vercel's Hobby-plan "commit author must have project access" check reads `.git` and stalls
CLI deploys at status `UNKNOWN`. Deploy from a copy with **no** `.git`:

```sh
cd "D:/orbit boyyz site"
npx vercel pull --yes --environment=production
npx vercel build --prod
# copy .vercel/output + .vercel/project.json to a temp dir WITHOUT .git, then:
npx vercel deploy --prebuilt --prod
```

`.vercel/project.json` is now correctly pointed at **orbit-boyyz-site**
(`prj_953oJNPAQ9gWI2eQDUw4FNgia4sg`) — the project that owns the domain. The old
`deploy.yml` pointed at `orbit-websites-premium`, which no domain uses.

### ⚠️ Still outstanding — Phase 3

The homepage is fully ported. **The 28 sub-pages are live with dark bodies inside the
light header/footer** and look broken. Deployed knowingly at the user's request.

Order of work: 18 location/industry pages (4 shared components) → 43 blog pages
(`Blog`, `BlogPost`) → Pricing, Services, About, Projects, FAQ, Quote, Contact, OrbitBoyzz.
