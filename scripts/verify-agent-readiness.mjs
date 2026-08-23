#!/usr/bin/env node
// Local verification for the agent-readiness fixes: pure estimate-logic
// tests (no server needed) plus, when BASE_URL is set, live HTTP checks
// against a running deployment (404 body, JSON errors, OpenAPI validity,
// markdown negotiation, trust-anchor pages).
//
// Usage:
//   node scripts/verify-agent-readiness.mjs                 # logic-only
//   BASE_URL=https://orbitboyzz.me node scripts/verify-agent-readiness.mjs
//   BASE_URL=http://localhost:3000 node scripts/verify-agent-readiness.mjs

import assert from 'node:assert/strict'
import { calculateQuoteEstimate } from '../src/lib/quoteEstimate.ts'

let passed = 0
let failed = 0

function test(name, fn) {
  return (async () => {
    try {
      await fn()
      console.log(`  ok  - ${name}`)
      passed++
    } catch (err) {
      console.log(`FAIL  - ${name}`)
      console.log(`        ${err.message}`)
      failed++
    }
  })()
}

console.log('== Quote estimate logic ==')
await test('starter site default range is $150-$400', () => {
  const r = calculateQuoteEstimate({ need: 'site', complexity: 'simple', urgency: 'normal', employee: 'none', automation: false })
  assert.equal(r.upfront, '$150-$400')
  assert.equal(r.monthly, '$100-$300/mo')
  assert.equal(r.employeeCost, 'N/A')
})

await test('AI need sets a $5,000-$15,000 base range with employee cost', () => {
  const r = calculateQuoteEstimate({ need: 'ai', complexity: 'simple', urgency: 'normal', employee: 'none', automation: false })
  assert.equal(r.upfrontLow, 5000)
  assert.equal(r.upfrontHigh, 15000)
  assert.ok(r.employeeCostLow > 0)
})

await test('complexity, urgency, and employee selections stack additively', () => {
  const base = calculateQuoteEstimate({ need: 'site', complexity: 'simple', urgency: 'normal', employee: 'none', automation: false })
  const loaded = calculateQuoteEstimate({ need: 'site', complexity: 'complex', urgency: 'urgent', employee: 'dispatcher', automation: false })
  assert.ok(loaded.upfrontLow > base.upfrontLow)
  assert.ok(loaded.upfrontHigh > base.upfrontHigh)
  assert.notEqual(loaded.employeeCost, 'N/A')
})

console.log(`\n${passed} passed, ${failed} failed (logic)`)

const BASE_URL = process.env.BASE_URL
if (!BASE_URL) {
  console.log('\nBASE_URL not set — skipping live HTTP checks.')
  process.exit(failed > 0 ? 1 : 0)
}

console.log(`\n== Live checks against ${BASE_URL} ==`)

await test('nonexistent path returns HTTP 404 with a recovery body', async () => {
  const res = await fetch(new URL('/this-path-does-not-exist-12345', BASE_URL))
  assert.equal(res.status, 404)
  const body = await res.text()
  assert.match(body, /sitemap|llms\.txt/i)
})

await test('/openapi.json is valid JSON with the expected operations', async () => {
  const res = await fetch(new URL('/openapi.json', BASE_URL))
  assert.equal(res.status, 200)
  const spec = await res.json()
  assert.ok(spec.paths['/api/quote-estimate'])
  assert.equal(spec.paths['/api/quote-estimate'].post.operationId, 'createQuoteEstimate')
})

await test('POST /api/quote-estimate returns a JSON estimate', async () => {
  const res = await fetch(new URL('/api/quote-estimate', BASE_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ need: 'ai', complexity: 'complex', urgency: 'urgent', employee: 'dispatcher', automation: true }),
  })
  assert.equal(res.status, 200)
  assert.match(res.headers.get('content-type') ?? '', /application\/json/)
  const data = await res.json()
  assert.ok(data.estimate.upfront)
})

await test('POST /api/quote-estimate with a bad field returns a structured JSON 400', async () => {
  const res = await fetch(new URL('/api/quote-estimate', BASE_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ need: 'not-a-real-need' }),
  })
  assert.equal(res.status, 400)
  const data = await res.json()
  assert.ok(data.error.code)
  assert.ok(data.error.message)
})

await test('unknown /api/* path returns a structured JSON 404', async () => {
  const res = await fetch(new URL('/api/does-not-exist', BASE_URL))
  assert.equal(res.status, 404)
  assert.match(res.headers.get('content-type') ?? '', /application\/json/)
  const data = await res.json()
  assert.equal(data.error.code, 'not_found')
})

await test('Accept: text/markdown on / returns markdown with Vary: Accept', async () => {
  const res = await fetch(new URL('/', BASE_URL), { headers: { Accept: 'text/markdown' } })
  assert.equal(res.status, 200)
  assert.match(res.headers.get('content-type') ?? '', /text\/markdown/)
  assert.match(res.headers.get('vary') ?? '', /Accept/)
  const body = await res.text()
  assert.match(body, /^# /)
})

await test('default Accept on / still returns HTML with Vary: Accept', async () => {
  const res = await fetch(new URL('/', BASE_URL), { headers: { Accept: 'text/html' } })
  assert.equal(res.status, 200)
  assert.match(res.headers.get('content-type') ?? '', /text\/html/)
  assert.match(res.headers.get('vary') ?? '', /Accept/)
})

await test('/privacy page has substantial content', async () => {
  const res = await fetch(new URL('/privacy', BASE_URL))
  assert.equal(res.status, 200)
  const body = await res.text()
  assert.ok(body.length > 500)
})

console.log(`\n${passed} passed, ${failed} failed (total)`)
process.exit(failed > 0 ? 1 : 0)
