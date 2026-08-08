// Local web UI for the DM lead finder. No dependencies, no build step.
//   node scripts/dm-finder/ui.mjs      (or double-click start-ui.bat)

import { createServer } from 'node:http'
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { dirname, join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { NICHES, DEFAULT_NICHES } from './niches.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LEADS_DIR = join(__dirname, 'leads')
const LOG_PATH = join(__dirname, 'messaged.json')
const PORT = 4180

const readLog = () => (existsSync(LOG_PATH) ? JSON.parse(readFileSync(LOG_PATH, 'utf8')) : {})
const writeLog = (log) => writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), 'utf8')

function allLeads() {
  if (!existsSync(LEADS_DIR)) return []
  const files = readdirSync(LEADS_DIR).filter((f) => f.endsWith('-dm-batch.json')).sort().reverse()
  const seen = new Set()
  const out = []
  for (const f of files) {
    for (const r of JSON.parse(readFileSync(join(LEADS_DIR, f), 'utf8'))) {
      if (seen.has(r.key)) continue
      seen.add(r.key)
      out.push({ ...r, batch: f.slice(0, 10) })
    }
  }
  return out
}

function runFinder(opts) {
  return new Promise((resolve) => {
    const args = [join(__dirname, 'find.mjs')]
    if (opts.niches?.length) args.push(`--niches=${opts.niches.join(',')}`)
    if (opts.limit) args.push(`--limit=${opts.limit}`)
    if (opts.town) args.push(`--town=${opts.town}`)
    const child = spawn(process.execPath, args, { cwd: join(__dirname, '../..') })
    let out = ''
    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (out += d))
    child.on('close', (code) => resolve({ code, out }))
  })
}

const json = (res, body, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end(readFileSync(join(__dirname, 'ui.html')))
  }

  if (url.pathname === '/api/state') {
    const log = readLog()
    const leads = allLeads().map((l) => ({ ...l, status: log[l.key]?.status || (log[l.key] ? 'messaged' : 'new') }))
    return json(res, {
      leads,
      niches: Object.entries(NICHES).map(([k, v]) => ({ key: k, label: v.label, value: v.value, volume: v.volume, on: DEFAULT_NICHES.includes(k) })),
    })
  }

  if (req.method === 'POST') {
    let body = ''
    for await (const chunk of req) body += chunk
    const data = body ? JSON.parse(body) : {}

    if (url.pathname === '/api/find') {
      const r = await runFinder(data)
      return json(res, { ok: r.code === 0, output: r.out })
    }

    if (url.pathname === '/api/status') {
      const log = readLog()
      const lead = allLeads().find((l) => l.key === data.key)
      if (data.status === 'new') delete log[data.key]
      else log[data.key] = { ...(log[data.key] || {}), name: lead?.name, city: lead?.city, niche: lead?.niche, status: data.status, updated: new Date().toISOString().slice(0, 10) }
      writeLog(log)
      return json(res, { ok: true })
    }
  }

  res.writeHead(404)
  res.end('not found')
})

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`
  console.log(`\n  Orbit DM Finder running at ${url}\n  Press Ctrl+C to stop.\n`)
  const opener = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]]
  try { spawn(opener[0], opener[1], { detached: true, stdio: 'ignore' }).unref() } catch {}
})
