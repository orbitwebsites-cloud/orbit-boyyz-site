import type { Metadata, Viewport } from 'next'
import { Archivo, Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { site } from '@/content/site'
import { Footer } from '@/components/sections/Footer'
import { Preloader } from '@/components/sections/Preloader'
import { Cursor } from '@/components/ui/Cursor'
import { MobileDock } from '@/components/ui/MobileDock'
import { Nav } from '@/components/ui/Nav'
import { SiteChrome } from '@/components/ui/SiteChrome'
import { LenisProvider } from '@/lib/motion/LenisProvider'
import { PageTransitionProvider } from '@/lib/motion/PageTransition'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--ff-display',
  display: 'swap',
})

const body = Archivo({
  subsets: ['latin'],
  variable: '--ff-body',
  display: 'swap',
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic'],
  variable: '--ff-serif',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--ff-mono',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Page not found · Orbit Websites',
    template: '%s · Orbit Websites',
  },
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  openGraph: { type: 'website', siteName: site.name, locale: 'en_US' },
  formatDetection: { telephone: true },
}

export const viewport: Viewport = {
  themeColor: '#060606',
  colorScheme: 'dark',
}

// Runs before first paint: decides whether the first-visit preloader plays.
// Desktop only — on phones the curtain just delays the LCP.
const preloadScript = `(function(){try{var d=document.documentElement,k='ob:visited';if(location.pathname==='/'&&matchMedia('(pointer: fine) and (min-width: 768px)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!localStorage.getItem(k)){d.classList.add('is-preloading')}localStorage.setItem(k,'1');var go=function(){requestAnimationFrame(function(){d.classList.add('motion-go')})};if(document.readyState==='complete'){go()}else{addEventListener('load',go)}}catch(e){}})();`

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloadScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
        >
          Skip to content
        </a>
        {/* SiteChrome drops Orbit's chrome on /demo/* lead previews so they read as the lead's own site. */}
        <SiteChrome>
          <Preloader />
        </SiteChrome>
        <LenisProvider>
          <PageTransitionProvider>
            <SiteChrome>
              <Nav />
            </SiteChrome>
            <main id="main">{children}</main>
            <SiteChrome>
              <Footer />
              <MobileDock />
            </SiteChrome>
          </PageTransitionProvider>
        </LenisProvider>
        <SiteChrome>
          <Cursor />
        </SiteChrome>
      </body>
    </html>
  )
}
