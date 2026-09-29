// Browser check for the ported pages: motion ON (no-preference), zero console
// errors, full-page screenshots at 1440x900 and 390x844, plus a few
// interaction smoke tests (nothing is submitted).
//   node port-shots.mjs [only-name]
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://localhost:3110'
const OUT = 'D:/orbitboyzz-revamp/site/shots/port'
mkdirSync(OUT, { recursive: true })
const only = process.argv[2]

const PAGES = [
  ['blog-post', '/blog/how-much-does-a-website-cost-for-a-local-business'],
  ['blog-post-faq', '/blog/web-design-cost-factors-mercer-county-nj'],
  ['blog', '/blog'],
  ['town-princeton', '/web-design-princeton-nj'],
  ['town-ewing', '/web-design-ewing-nj'],
  ['industry-hvac', '/website-design-for-hvac-companies-nj'],
  ['central-nj', '/web-design-central-nj'],
  ['quote', '/quote?source=%2Fweb-design-princeton-nj'],
  ['form', '/form'],
  ['project-brief', '/project-brief'],
  ['growth', '/growth'],
  ['developers', '/developers'],
  ['privacy', '/privacy'],
  ['orbitboyzz', '/orbitboyzz'],
].filter(([n]) => !only || n === only)

const SIZES = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})

const results = []
for (const [name, path] of PAGES) {
  for (const [size, viewport] of SIZES) {
    const page = await browser.newPage()
    const errors = []
    const posts = []
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push('console: ' + m.text())
    })
    page.on('requestfailed', (r) => {
      if (!r.url().includes('calendly')) errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`)
    })
    page.on('request', (r) => {
      if (r.method() === 'POST') posts.push(r.url())
    })
    await page.setViewport(viewport)
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
    // Skip the first-visit preloader (it only runs on "/").
    await page.evaluateOnNewDocument(() => localStorage.setItem('ob:visited', '1'))
    await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 90000 })
    await sleep(1200)

    // Walk the page so every scroll-triggered reveal fires, then return to top.
    const total = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y <= total; y += 300) {
      await page.evaluate((v) => window.scrollTo(0, v), y)
      await sleep(45)
    }
    await sleep(1400)
    await page.evaluate(() => window.scrollTo(0, 0))
    await sleep(900)

    // Layout sanity: no horizontal overflow.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    if (overflow > 1) errors.push(`horizontal overflow ${overflow}px`)
    // Hidden content sanity: nothing left at opacity 0 after the walk.
    const hidden = await page.evaluate(
      () => [...document.querySelectorAll('[data-reveal],[data-split]')].filter((el) => getComputedStyle(el).opacity === '0' || getComputedStyle(el).visibility === 'hidden').length,
    )
    if (hidden) errors.push(`${hidden} reveal blocks still hidden after scroll`)

    const checks = []
    if (size === 'desktop') {
      if (name === 'quote') {
        const before = await page.$eval('dd.display', (el) => el.textContent)
        const [btn] = await page.$$('xpath/.//button[normalize-space()="AI agents / ops engine"]')
        await btn.click()
        await sleep(300)
        const after = await page.$eval('dd.display', (el) => el.textContent)
        const src = await page.evaluate(() => document.body.textContent.includes('Estimate started from /web-design-princeton-nj'))
        checks.push(`estimator ${before} → ${after}${after === '$5,000-$15,000' ? ' ✓' : ' ✗'}; source banner ${src ? '✓' : '✗'}`)
        if (after !== '$5,000-$15,000' || !src) errors.push('estimator interaction failed')
        await btn.evaluate((b) => b.blur())
        // restore default so the screenshot shows the initial state
        const [site] = await page.$$('xpath/.//button[normalize-space()="New website"]')
        await site.click()
        await sleep(300)
      }
      if (name === 'form') {
        const [submit] = await page.$$('xpath/.//button[@type="submit"]')
        await submit.click()
        await sleep(400)
        const errs = await page.$$eval('[aria-invalid="true"]', (els) => els.length)
        checks.push(`empty submit shows ${errs} field errors, POSTs sent: ${posts.length}`)
        if (errs < 5 || posts.length) errors.push('lead form validation failed or a POST was sent')
      }
      if (name === 'project-brief') {
        await page.evaluate(() => localStorage.removeItem('orbit-project-brief-v1'))
        await page.type('input[autocomplete="name"]', 'Test Person')
        await page.type('input[autocomplete="email"]', 'test@example.com')
        const [start] = await page.$$('xpath/.//button[@type="submit"]')
        await start.click()
        await sleep(900)
        const q = await page.$eval('#brief-question', (el) => el.textContent).catch(() => null)
        checks.push(`brief step 1: ${q ? q.slice(0, 60) : 'MISSING'}; POSTs sent: ${posts.length}`)
        if (!q || posts.length) errors.push('project brief flow failed or a POST was sent')
        await page.screenshot({ path: `${OUT}/${name}-question-${size}.png` })
        await page.evaluate(() => localStorage.removeItem('orbit-project-brief-v1'))
        await page.goto(BASE + path, { waitUntil: 'networkidle0' })
        await sleep(1200)
      }
      if (name === 'growth') {
        const [run] = await page.$$('xpath/.//button[normalize-space()="Run the demo"]')
        await run.click()
        await sleep(3400)
        const done = await page.$$eval('#demo li', (els) => els.filter((e) => e.className.includes('border-accent')).length)
        checks.push(`flow demo stages active: ${done}/4`)
        if (done !== 4) errors.push('flow demo did not complete')
      }
    }

    const file = `${OUT}/${name}-${size}.png`
    await page.screenshot({ path: file, fullPage: true })
    results.push({ name, size, errors, checks, file })
    await page.close()
  }
}
await browser.close()

let bad = 0
for (const r of results) {
  if (r.errors.length) bad++
  console.log(`${r.errors.length ? 'FAIL' : 'PASS'} ${r.name.padEnd(16)} ${r.size.padEnd(8)} ${r.checks.join(' | ')} ${r.errors.join(' | ')}`)
}
console.log(`\n${results.length - bad}/${results.length} page loads with zero console errors`)
