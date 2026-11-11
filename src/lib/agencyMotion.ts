// GSAP entry for the scroll scenes in src/components/agency. Uses the site's
// single registered GSAP instance; smooth scrolling comes from LenisProvider.
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { MQ } from '@/lib/motion/tokens'

/** Media query that gates every scroll scene. */
export const MOTION_OK = MQ.motion

export { gsap, ScrollTrigger, useGSAP }
