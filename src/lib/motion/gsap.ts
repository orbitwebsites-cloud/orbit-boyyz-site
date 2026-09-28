// Client-only GSAP entry point. Import gsap/ScrollTrigger/SplitText from here so
// plugins are registered exactly once and defaults follow the motion tokens.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DUR, EASE } from './tokens'

let registered = false

if (typeof window !== 'undefined' && !registered) {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  gsap.defaults({ ease: EASE.out, duration: DUR.md })
  ScrollTrigger.config({ ignoreMobileResize: true })
  registered = true
}

export { gsap, ScrollTrigger, SplitText }
