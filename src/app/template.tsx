import { RouteMotion } from '@/lib/motion/RouteMotion'

// template.tsx remounts on every navigation, so each route gets a fresh motion context.
export default function Template({ children }: { children: React.ReactNode }) {
  return <RouteMotion>{children}</RouteMotion>
}
