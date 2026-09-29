// Pure project-range calculator shared by the /quote page (src/App.tsx) and the
// public JSON API (api/quote-estimate.ts). Keep this the single source of truth
// so the UI and the API never drift apart.
//
// Pricing model (src/content/site.ts `tiers` + `carePlans`):
// - Launch build: no published price, quoted on a free call (7-day sprint, 50/50).
// - Premium build: from $3,500.
// - AI operations: $5,000–$15,000+ build, optional $750–$2,500/mo retainer.
// - Care plans (optional, after launch): $300 / $500 / $700 per month.

export type QuoteNeed = 'site' | 'refresh' | 'forms' | 'ai'
export type QuoteUrgency = 'normal' | 'fast' | 'urgent'
export type QuoteComplexity = 'simple' | 'medium' | 'complex'
export type AiEmployee = 'none' | 'receptionist' | 'dispatcher' | 'sales' | 'proposal' | 'support'

export const quoteOptions = {
  need: [
    ['site', 'New website'],
    ['refresh', 'Website refresh'],
    ['forms', 'Lead forms / booking'],
    ['ai', 'AI agents / ops engine'],
  ] as Array<[QuoteNeed, string]>,
  complexity: [
    ['simple', 'Simple'],
    ['medium', 'Moderate'],
    ['complex', 'Complex'],
  ] as Array<[QuoteComplexity, string]>,
  urgency: [
    ['normal', 'Normal timeline'],
    ['fast', 'Fast sprint'],
    ['urgent', 'Need it ASAP'],
  ] as Array<[QuoteUrgency, string]>,
  employee: [
    ['none', 'Not sure yet'],
    ['receptionist', 'AI Receptionist'],
    ['dispatcher', 'AI Dispatcher'],
    ['sales', 'AI Sales Qualifier'],
    ['proposal', 'AI Proposal Builder'],
    ['support', 'AI Follow-Up Assistant'],
  ] as Array<[AiEmployee, string]>,
}

export interface QuoteEstimateInput {
  need: QuoteNeed
  complexity: QuoteComplexity
  urgency: QuoteUrgency
  employee: AiEmployee
  automation: boolean
}

export interface QuoteEstimateResult {
  /** "Quoted on a free call", "From $3,500" or "$5,000–$15,000+". */
  upfront: string
  /** null when the build is quoted on a free call (launch build). */
  upfrontLow: number | null
  /** null when there is no published upper figure (launch build, or "From $3,500"). */
  upfrontHigh: number | null
  monthly: string
  monthlyLow: number
  monthlyHigh: number
  employeeCost: string
  employeeCostLow: number
  employeeCostHigh: number
  savings: string
  includes: string[]
  note: string
}

export const LAUNCH_QUOTE_LABEL = 'Quoted on a free call'

const PREMIUM_FROM = 3500
const AI_BUILD = { low: 5000, high: 15000 }
const AI_RETAINER = { low: 750, high: 2500 }
const CARE = { low: 300, high: 700 }

const NEED_VALUES = new Set(quoteOptions.need.map(([value]) => value))
const COMPLEXITY_VALUES = new Set(quoteOptions.complexity.map(([value]) => value))
const URGENCY_VALUES = new Set(quoteOptions.urgency.map(([value]) => value))
const EMPLOYEE_VALUES = new Set(quoteOptions.employee.map(([value]) => value))

export function isQuoteNeed(value: unknown): value is QuoteNeed {
  return typeof value === 'string' && NEED_VALUES.has(value as QuoteNeed)
}

export function isQuoteComplexity(value: unknown): value is QuoteComplexity {
  return typeof value === 'string' && COMPLEXITY_VALUES.has(value as QuoteComplexity)
}

export function isQuoteUrgency(value: unknown): value is QuoteUrgency {
  return typeof value === 'string' && URGENCY_VALUES.has(value as QuoteUrgency)
}

export function isAiEmployee(value: unknown): value is AiEmployee {
  return typeof value === 'string' && EMPLOYEE_VALUES.has(value as AiEmployee)
}

/** Any AI or automation selection is priced as an AI operations build. */
export function isAiSelection({ need, employee, automation }: Pick<QuoteEstimateInput, 'need' | 'employee' | 'automation'>): boolean {
  return need === 'ai' || employee !== 'none' || automation
}

const usd = (n: number) => `$${n.toLocaleString('en-US')}`
const range = (low: number, high: number) => `${usd(low)}–${usd(high)}`

export function calculateQuoteEstimate({
  need,
  complexity,
  urgency,
  employee,
  automation,
}: QuoteEstimateInput): QuoteEstimateResult {
  let employeeCostLow = 0
  let employeeCostHigh = 0
  const includes = ['strategy call', 'mobile-first build', 'basic conversion structure']

  if (need === 'refresh') includes.push('copy cleanup', 'layout refresh')
  if (need === 'forms') includes.push('lead form logic', 'booking/contact routing')
  if (need === 'ai') {
    employeeCostLow = 3500
    employeeCostHigh = 6500
    includes.push('AI intake flow', 'database-backed routing', 'automation maintenance')
  }
  if (complexity === 'medium') includes.push('multi-page structure')
  if (complexity === 'complex') includes.push('custom workflow mapping')
  if (urgency === 'fast') includes.push('priority sprint')
  if (urgency === 'urgent') includes.push('rush launch window')
  if (automation && need !== 'ai') {
    employeeCostLow = Math.max(employeeCostLow, 2500)
    employeeCostHigh = Math.max(employeeCostHigh, 5000)
    includes.push('automation layer')
  }
  if (employee !== 'none') {
    employeeCostLow = Math.max(employeeCostLow, 3000)
    employeeCostHigh = Math.max(employeeCostHigh, 6500)
    includes.push(quoteOptions.employee.find(([value]) => value === employee)?.[1] ?? 'AI employee')
  }

  const ai = isAiSelection({ need, employee, automation })
  const launchLevel = complexity === 'simple'
  const websitePart = launchLevel ? 'the website itself is quoted on the same free call' : `the website itself is a premium build from ${usd(PREMIUM_FROM)}`

  let upfront: string
  let upfrontLow: number | null
  let upfrontHigh: number | null
  let monthlyLow: number
  let monthlyHigh: number
  let note: string

  if (ai) {
    upfront = `${range(AI_BUILD.low, AI_BUILD.high)}+`
    upfrontLow = AI_BUILD.low
    upfrontHigh = AI_BUILD.high
    monthlyLow = AI_RETAINER.low
    monthlyHigh = AI_RETAINER.high
    note =
      (need === 'ai' ? '' : `This range covers the AI or automation layer; ${websitePart}. `) +
      'AI agent and operations builds vary the most because pricing depends on APIs, workflow complexity, and how much admin work the system replaces. ' +
      `The ${range(AI_RETAINER.low, AI_RETAINER.high)}/mo retainer is optional and only makes sense when it replaces measurable admin labor or recovers high-intent leads.`
  } else if (launchLevel) {
    upfront = LAUNCH_QUOTE_LABEL
    upfrontLow = null
    upfrontHigh = null
    monthlyLow = CARE.low
    monthlyHigh = CARE.high
    note =
      'Launch builds are quoted on a free call after a quick look at your needs. The build runs as a 7-day sprint: 50% to start, 50% when you approve the finished site. Care plans are optional, month to month, and start only after launch.'
  } else {
    upfront = `From ${usd(PREMIUM_FROM)}`
    upfrontLow = PREMIUM_FROM
    upfrontHigh = null
    monthlyLow = CARE.low
    monthlyHigh = CARE.high
    note = `Moderate and complex sites are premium builds, which start at ${usd(PREMIUM_FROM)}; the exact number comes from a free call. Care plans are optional, month to month, and start only after launch.`
  }

  const savingsLow = employeeCostLow ? Math.max(0, employeeCostLow - monthlyHigh) : 0
  const savingsHigh = employeeCostHigh ? Math.max(0, employeeCostHigh - monthlyLow) : 0

  return {
    upfront,
    upfrontLow,
    upfrontHigh,
    monthly: `${range(monthlyLow, monthlyHigh)}/mo`,
    monthlyLow,
    monthlyHigh,
    employeeCost: employeeCostLow > 0 ? `${range(employeeCostLow, employeeCostHigh)}/mo` : 'N/A',
    employeeCostLow,
    employeeCostHigh,
    savings:
      savingsHigh > 0
        ? `saving ~${range(savingsLow, savingsHigh)}/mo compared to hiring an employee`
        : 'standard website work; savings depend on your current admin costs',
    includes,
    note,
  }
}
