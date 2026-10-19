import { normalizeEmail } from './emailCheck'

// Free / personal mailbox providers. The leads request form asks for a work
// email (the agency's own domain), so addresses on these are turned away.
const FREE_MAIL_DOMAINS: ReadonlySet<string> = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'rocketmail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'passport.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'aim.com',
  'proton.me',
  'protonmail.com',
  'protonmail.ch',
  'pm.me',
  'gmx.com',
  'gmx.net',
  'mail.com',
  'yandex.com',
  'zoho.com',
  'zohomail.com',
  'tutanota.com',
  'tuta.io',
  'comcast.net',
  'verizon.net',
  'att.net',
  'sbcglobal.net',
])

// Country variants of the big providers: yahoo.co.uk, hotmail.fr, outlook.de, live.ca...
const FREE_MAIL_FAMILY = /^(?:yahoo|hotmail|outlook|live|aol|gmx|yandex|proton(?:mail)?)\.(?:[a-z]{2,3}|co\.[a-z]{2}|com\.[a-z]{2})$/

/** True when the address is on a free / personal mailbox provider. */
export function isFreeMail(raw: string) {
  const email = normalizeEmail(raw)
  const domain = email.slice(email.lastIndexOf('@') + 1)
  return FREE_MAIL_DOMAINS.has(domain) || FREE_MAIL_FAMILY.test(domain)
}
