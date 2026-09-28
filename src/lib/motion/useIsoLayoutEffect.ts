import { useEffect, useLayoutEffect } from 'react'

/** useLayoutEffect on the client (so GSAP sets initial states before paint), useEffect on the server. */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
