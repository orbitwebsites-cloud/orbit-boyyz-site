// Pure project-range calculator shared by the /quote page (src/App.tsx) and the
// public JSON API (api/quote-estimate.ts). Keep this the single source of truth
// so the UI and the API never drift apart.

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
  upfront: string
  upfrontLow: number
  upfrontHigh: number
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

export function calculateQuoteEstimate({
  need,
  complexity,
  urgency,
  employee,
  automation,
}: QuoteEstimateInput): QuoteEstimateResult {
  let upfrontLow = 150
  let upfrontHigh = 400
  let monthlyLow = 100
  let monthlyHigh = 300
  let employeeCostLow = 0
  let employeeCostHigh = 0
  const includes = ['strategy call', 'mobile-first build', 'basic conversion structure']

  if (need === 'refresh') {
    upfrontLow = 90
    upfrontHigh = 250
    monthlyLow = 100
    monthlyHigh = 300
    includes.push('copy cleanup', 'layout refresh')
  }

  if (need === 'forms') {
    upfrontLow = 175
    upfrontHigh = 500
    monthlyLow = 150
    monthlyHigh = 400
    includes.push('lead form logic', 'booking/contact routing')
  }

  if (need === 'ai') {
    upfrontLow = 5000
    upfrontHigh = 15000
    monthlyLow = 750
    monthlyHigh = 2500
    employeeCostLow = 3500
    employeeCostHigh = 6500
    includes.push('AI intake flow', 'database-backed routing', 'automation maintenance')
  }

  if (complexity === 'medium') {
    upfrontLow += 75
    upfrontHigh += 180
    monthlyHigh += 50
    includes.push('multi-page structure')
  }

  if (complexity === 'complex') {
    upfrontLow += 150
    upfrontHigh += 450
    monthlyLow += 30
    monthlyHigh += 90
    includes.push('custom workflow mapping')
  }

  if (urgency === 'fast') {
    upfrontLow += 30
    upfrontHigh += 90
    includes.push('priority sprint')
  }

  if (urgency === 'urgent') {
    upfrontLow += 70
    upfrontHigh += 180
    includes.push('rush launch window')
  }

  if (automation && need !== 'ai') {
    upfrontLow += 180
    upfrontHigh += 520
    monthlyLow += 30
    monthlyHigh += 90
    employeeCostLow = Math.max(employeeCostLow, 2500)
    employeeCostHigh = Math.max(employeeCostHigh, 5000)
    includes.push('starter automation layer')
  }

  if (employee !== 'none') {
    employeeCostLow = Math.max(employeeCostLow, 3000)
    employeeCostHigh = Math.max(employeeCostHigh, 6500)
    if (need !== 'ai') {
      monthlyLow += 30
      monthlyHigh += 90
      upfrontLow += 150
      upfrontHigh += 420
    }
    includes.push(quoteOptions.employee.find(([value]) => value === employee)?.[1] ?? 'AI employee')
  }

  const savingsLow = employeeCostLow ? Math.max(0, employeeCostLow - monthlyHigh) : 0
  const savingsHigh = employeeCostHigh ? Math.max(0, employeeCostHigh - monthlyLow) : 0

  return {
    upfront: `$${upfrontLow.toLocaleString()}-$${upfrontHigh.toLocaleString()}`,
    upfrontLow,
    upfrontHigh,
    monthly: `$${monthlyLow.toLocaleString()}-$${monthlyHigh.toLocaleString()}/mo`,
    monthlyLow,
    monthlyHigh,
    employeeCost:
      employeeCostLow > 0 ? `$${employeeCostLow.toLocaleString()}-$${employeeCostHigh.toLocaleString()}/mo` : 'N/A',
    employeeCostLow,
    employeeCostHigh,
    savings:
      savingsHigh > 0
        ? `saving ~$${savingsLow.toLocaleString()}-$${savingsHigh.toLocaleString()}/mo compared to hiring an employee`
        : 'standard website work; savings depend on your current admin costs',
    includes,
    note:
      need === 'ai' || employee !== 'none'
        ? 'AI agent and operations builds vary the most because pricing depends on APIs, workflow complexity, and how much admin work the system replaces.'
        : 'Standard site work stays accessible. Add-ons, booking flows, and automation increase both upfront build cost and monthly maintenance.',
  }
}
