# Free demo homepages

Send a lead a link to a personalized preview of their new website:

```
https://orbitboyzz.com/demo/<slug>
e.g. https://orbitboyzz.com/demo/joes-plumbing-hamilton
```

The page looks like **their** site (their name, town, phone, trade copy, light theme, no Orbit
nav/footer). The only Orbit element is a slim banner at the top: "Free preview built for
&lt;Name&gt; by Orbit Websites — not live yet. Want it? Call 609-662-8052". It links to
`https://orbitboyzz.com/contact?demo=<slug>`, so you can see which demo a contact came from.

## Add a lead: one entry

Append an object to `demos` in `src/content/demos.ts`, then commit and deploy:

```ts
{
  slug: 'joes-plumbing-hamilton', // the URL; lowercase-with-hyphens, unique
  name: "Joe's Plumbing",
  trade: 'plumbing',
  town: 'Hamilton',               // town only, shown as "Hamilton, NJ"
  phone: '(609) 555-0123',        // the LEAD's number, any format
  // optional:
  services: ['Drain cleaning', 'Water heaters', 'Sump pumps'],
  tagline: 'Family plumbing for Hamilton since 1998.', // only if they told you
  accent: '#0e7490',              // their brand color (hex)
  areas: ['Trenton', 'Robbinsville'],
},
```

| Field | Required | Notes |
| --- | --- | --- |
| `slug` | yes | URL segment. Pattern: `<business>-<town>`. |
| `name` | yes | Exactly as the owner writes it. |
| `trade` | yes | `hvac`, `plumbing`, `electrical`, `roofing`, `landscaping`, `remodeling`, `restaurant`, `general` |
| `town` | yes | Drives the hero, service-area line and nearby towns. |
| `phone` | yes | Used for **every** call button on their page. Orbit's number appears only in the banner. |
| `services` | no | Their real services (restaurants: menu favorites). Default: the trade's standard six. |
| `tagline` | no | Replaces the hero sub-line. |
| `accent` | no | Hex color. Default: the trade's color. Button text color is picked automatically for contrast. |
| `areas` | no | Nearby towns. Default: a Central NJ lookup in `src/content/demoCopy.ts`; set this for towns outside it. |

Preview locally with `npm run dev` and open `http://localhost:3000/demo/<slug>`.
Unknown slugs 404 (pages are prebuilt from `demos.ts` at deploy).

To take a demo down, delete its entry and redeploy.

## What the page shows

- **Service trades:** hero with click-to-call, "how it works" card, six services, an emergency
  call band, why-us points, reviews, service area (town + neighbors), FAQ, closing call CTA,
  footer, and a sticky call bar on phones.
- **Restaurants:** hero with "Call to order", menu (favorites + category slots), call-ahead
  order band, hours + location, reviews, FAQ.
- Default copy per trade lives in `src/content/demoCopy.ts`.

**Never fake facts.** Reviews, hours and menu prices are dashed placeholder slots labeled
"Your Google reviews appear here" etc. Don't add ratings, testimonials, years in business,
license numbers or claims the owner hasn't given you.

## SEO safety (already handled — keep it that way)

- Every demo page is `noindex, nofollow`, with no canonical and no `og:url`.
- Demos are not in `sitemap.xml` (built from `legacyPageMeta` + blog posts), `feed.xml` or
  `public/llms.txt`. Don't add them there. `robots.txt` is intentionally unchanged.
- Slugs aren't secret: anyone with the link can open it. Don't put private info in a demo.

## How the Orbit nav/footer are hidden

`src/app/layout.tsx` wraps Orbit's preloader, nav, footer, mobile dock and cursor in
`<SiteChrome>` (`src/components/ui/SiteChrome.tsx`), which renders nothing when the path
starts with `/demo/`. The demo's light theme overrides live in `src/app/demo/[slug]/demo.css`
and only load on demo pages.

## Files

- `src/content/demos.ts` — lead entries (the only file you edit to add a lead)
- `src/content/demoCopy.ts` — per-trade copy, FAQ, nearby-town lookup
- `src/components/demo/DemoSite.tsx` — the page itself
- `src/app/demo/[slug]/page.tsx` — route, static params, noindex metadata
