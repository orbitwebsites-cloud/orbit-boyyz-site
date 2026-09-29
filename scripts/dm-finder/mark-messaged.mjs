// Marks a batch as messaged so those businesses never resurface.
//
//   node scripts/dm-finder/mark-messaged.mjs 2026-08-08          # whole batch
//   node scripts/dm-finder/mark-messaged.mjs 2026-08-08 --only=3,7,12

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOG_PATH = join(__dirname, 'messaged.json')

const date = process.argv[2]
if (!date) {
  console.error('Usage: node mark-messaged.mjs <YYYY-MM-DD> [--only=1,4,9]')
  process.exit(1)
}

const batchPath = join(__dirname, 'leads', `${date}-dm-batch.json`)
if (!existsSync(batchPath)) {
  console.error(`No batch found for ${date}`)
  process.exit(1)
}

const batch = JSON.parse(readFileSync(batchPath, 'utf8'))
const onlyArg = process.argv.find((a) => a.startsWith('--only='))
const only = onlyArg ? onlyArg.split('=')[1].split(',').map((n) => Number(n.trim()) - 1) : null
const rows = only ? only.map((i) => batch[i]).filter(Boolean) : batch

const log = existsSync(LOG_PATH) ? JSON.parse(readFileSync(LOG_PATH, 'utf8')) : {}
let added = 0
for (const r of rows) {
  if (log[r.key]) continue
  log[r.key] = { name: r.name, city: r.city, niche: r.niche, messagedOn: date }
  added++
}
writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), 'utf8')
console.log(`Marked ${added} as messaged. Log now holds ${Object.keys(log).length}.`)
