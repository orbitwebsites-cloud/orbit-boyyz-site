import { privacyIntro, privacySections, privacyUpdated } from '@/content/legal'
import { site } from '@/content/site'
import { PageHero } from '@/components/ui/PageHero'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { legacyJsonLd } from '@/lib/legacy-seo'
import { JsonLd, legacyMetadata } from '@/lib/legacy-meta'

export const metadata = legacyMetadata('/privacy')

const linkCls = 'link-u text-accent hover:text-accent-hi'

export default function PrivacyPage() {
  // The last section ("Contact us") carries links, so it is rendered by hand below.
  const body = privacySections.filter((s) => s.heading !== 'Contact us')

  return (
    <>
      <JsonLd data={legacyJsonLd('/privacy')} />
      <PageHero label="[LEGAL // PRIVACY POLICY]" title="Privacy Policy" />

      <article className="container-x pb-24">
        <div className="mx-auto max-w-[68ch]">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-dim">Last updated: {privacyUpdated}</p>
          <p className="mt-8 text-[1.08rem] leading-[1.75] text-fg/85">{privacyIntro}</p>

          {body.map((s) => (
            <section key={s.heading} className="mt-12">
              <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">{s.heading}</h2>
              <p className="mt-4 text-[1.05rem] leading-[1.75] text-muted">{s.body}</p>
            </section>
          ))}

          <section className="mt-12">
            <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">Contact us</h2>
            <p className="mt-4 text-[1.05rem] leading-[1.75] text-muted">
              Questions about this policy or your data can be sent to{' '}
              <a href={`mailto:${site.email}`} className={linkCls}>
                {site.email}
              </a>{' '}
              or by calling{' '}
              <a href={site.phoneHref} className={linkCls}>
                609 662 8052
              </a>
              . See also our{' '}
              <TransitionLink href="/about" className={linkCls}>
                About page
              </TransitionLink>{' '}
              and{' '}
              <TransitionLink href="/contact" className={linkCls}>
                Contact page
              </TransitionLink>
              .
            </p>
          </section>
        </div>
      </article>
    </>
  )
}
