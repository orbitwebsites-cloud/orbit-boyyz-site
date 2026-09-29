// Pulls the Privacy policy copy out of the old App.tsx JSX (h2 + p text) into
// src/content/legal.ts. Whitespace is collapsed exactly like the browser does.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire('D:/orbitboyzz-revamp/site/package.json')
const ts = require('typescript')
const file = 'D:/orbitboyzz-revamp/old-site-src/src/App.tsx'
const text = readFileSync(file, 'utf8')
const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

let privacyFn
sf.forEachChild((n) => {
  if (ts.isFunctionDeclaration(n) && n.name?.text === 'Privacy') privacyFn = n
})

const vars = { email: 'orbitboyzz@gmail.com', phone: '609 662 8052' }
function textOf(node) {
  if (ts.isJsxText(node)) return node.text
  if (ts.isJsxExpression(node)) {
    const e = node.expression
    if (!e) return ''
    if (ts.isStringLiteral(e)) return e.text
    if (ts.isIdentifier(e)) return vars[e.text] ?? `{${e.text}}`
    return ''
  }
  if (ts.isJsxElement(node)) return node.children.map(textOf).join('')
  return ''
}
const norm = (s) => s.replace(/\s+/g, ' ').trim()

const blocks = []
let updated = ''
function walk(node) {
  if (ts.isJsxElement(node)) {
    const tag = node.openingElement.tagName.getText(sf)
    if (tag === 'h2' || tag === 'p') {
      const t = norm(textOf(node))
      if (t.startsWith('Last updated:')) updated = t.replace('Last updated: ', '')
      else blocks.push({ tag, text: t })
      return
    }
  }
  ts.forEachChild(node, walk)
}
walk(privacyFn)

const intro = blocks[0]
const sections = []
for (let i = 1; i < blocks.length; i += 2) {
  if (blocks[i].tag !== 'h2' || blocks[i + 1]?.tag !== 'p') throw new Error('unexpected structure at ' + i)
  sections.push({ heading: blocks[i].text, body: blocks[i + 1].text })
}
const out = `// GENERATED from src/App.tsx (Privacy component, old site, read-only) by a one-off extraction script.
// Copy is verbatim — do not rewrite. The final "Contact us" section is rendered
// with its links in app/privacy/page.tsx (its text is kept here for reference).
export const privacyUpdated = ${JSON.stringify(updated)}

export const privacyIntro = ${JSON.stringify(intro.text)}

export const privacySections: Array<{ heading: string; body: string }> = ${JSON.stringify(sections, null, 2)}
`
writeFileSync('D:/orbitboyzz-revamp/site/src/content/legal.ts', out)
console.log(updated, sections.length, sections.at(-1))
