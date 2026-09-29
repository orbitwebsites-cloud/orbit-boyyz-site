// Watchdog: detects if Cloudflare's "managed robots.txt" / "Block AI bots" feature
// silently flips back on and re-blocks AI crawlers (GPTBot, ClaudeBot, Google-Extended).
// Run: node scripts/check-robots.mjs   (exit 0 = healthy, exit 1 = AI bots blocked again)
const URL = 'https://orbitboyzz.me/robots.txt'
const AI_BOTS = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'PerplexityBot', 'OAI-SearchBot']

const res = await fetch(URL, { headers: { 'User-Agent': 'orbit-robots-watchdog' }, cache: 'no-store' })
const body = await res.text()

// Parse into (user-agent group -> rules). A bot is "blocked" if any group matching it
// (or '*') carries Disallow: /  — which is exactly what the Cloudflare managed block injects.
const lines = body.split('\n').map((l) => l.trim())
const blocked = new Set()
let agents = []
for (const line of lines) {
  if (/^User-agent:/i.test(line)) {
    const ua = line.split(':')[1].trim()
    agents = agents.length && !/Disallow|Allow/i.test(prev) ? [...agents, ua] : [ua]
  } else if (/^Disallow:\s*\/\s*$/i.test(line)) {
    for (const a of agents) blocked.add(a)
  } else if (/^Allow:/i.test(line) || /^Disallow:/i.test(line)) {
    agents = [] // rule line ends the consecutive-agent grouping
  }
  var prev = line
}

const managedBlock = body.includes('BEGIN Cloudflare Managed content')
const aiTrainNo = /ai-train\s*=\s*no/i.test(body)
const hitBots = AI_BOTS.filter((b) => blocked.has(b) || blocked.has('*'))

const healthy = res.status === 200 && !managedBlock && !aiTrainNo && hitBots.length === 0

console.log(`[${new Date().toISOString()}] robots.txt watchdog`)
console.log(`  status=${res.status} bytes=${body.length}`)
console.log(`  Cloudflare managed block present: ${managedBlock}`)
console.log(`  ai-train=no signal present:       ${aiTrainNo}`)
console.log(`  AI bots disallowed:               ${hitBots.length ? hitBots.join(', ') : 'none'}`)

if (healthy) {
  console.log('  RESULT: HEALTHY — AI crawlers allowed.')
  process.exit(0)
} else {
  console.error('  RESULT: ⚠️  REGRESSION — AI crawlers are being blocked again.')
  console.error('  FIX: Cloudflare dashboard → AI Crawl Control → turn OFF "managed robots.txt";')
  console.error('       Security → Bots → set "Block AI bots" to Off.')
  process.exit(1)
}
