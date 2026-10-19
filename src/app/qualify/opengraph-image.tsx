import LeadsOpengraphImage from '../leads/opengraph-image'

// Share card for orbitboyzz.com/qualify: the leads site's card (same offer,
// same rules), not the website business's root card, which pitches a call.
export const alt = 'Orbit Boyzz: verified lead lists for outbound agencies, 25 free leads to start'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return LeadsOpengraphImage()
}
