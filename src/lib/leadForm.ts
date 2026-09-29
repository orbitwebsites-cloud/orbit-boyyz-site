// Pure validation shared by the /form page (src/LeadForm.tsx) and the
// serverless handler (api/lead-form.ts). Keep this the single source of
// truth so the UI and the API never drift apart — mirrors quoteEstimate.ts.

export interface LeadFormInput {
  businessName: string
  industry: string
  contactName: string
  phone: string
  email: string
  details: string
}

export interface LeadFormErrors {
  businessName?: string
  industry?: string
  contactName?: string
  phone?: string
  email?: string
  details?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Loosely accepts US formats: (609) 662-8052, 609-662-8052, 6096628052, +1 609 662 8052
const PHONE_RE = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

export function validateLeadForm(input: LeadFormInput): LeadFormErrors {
  const errors: LeadFormErrors = {}

  if (!input.businessName.trim()) errors.businessName = 'Business name is required.'
  else if (input.businessName.trim().length > 120) errors.businessName = 'Keep it under 120 characters.'

  if (!input.industry.trim()) errors.industry = 'Tell us what kind of business this is.'
  else if (input.industry.trim().length > 120) errors.industry = 'Keep it under 120 characters.'

  if (!input.contactName.trim()) errors.contactName = 'Your name is required.'
  else if (input.contactName.trim().length > 120) errors.contactName = 'Keep it under 120 characters.'

  if (!input.phone.trim()) errors.phone = 'Phone number is required — this is how we text you back.'
  else if (!PHONE_RE.test(input.phone.trim())) errors.phone = 'Enter a valid US phone number.'

  if (!input.email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(input.email.trim())) errors.email = 'Enter a valid email address.'

  if (input.details.trim().length > 2000) errors.details = 'Keep it under 2000 characters.'

  return errors
}

export function hasLeadFormErrors(errors: LeadFormErrors): boolean {
  return Object.keys(errors).length > 0
}

export function normalizePhoneForSms(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return `+${digits}`
}
