import Image from 'next/image'
import Link from 'next/link'
import { bookCall, bookFaqs, bookFinal, bookProcess, bookSpeed, bookWork } from '@/content/bookProof'
import { ArrowRight, Check } from '@/components/qualify/shared'

// Proof under the /book intro screen (rendered by Book.tsx on the intro only,
// so the questions themselves stay distraction-free): the work, the speed
// fact, the three-step process, what happens on the call, five answers and a
// second Start button. Copy and its rules: src/content/bookProof.ts. Styles:
// ./book.css (bk- classes on top of qualify.css's qf- tokens). Static on
// purpose: no scroll effects, only a small hover lift on the work cards.

export function BookProof({ questionCount, onStart }: { questionCount: number; onStart: () => void }) {
  return (
    <div className="bk-proof">
      <section id="work" className="bk-section" aria-labelledby="bk-work-title">
        <div className="bk-head">
          <p className="qf-kicker">
            <span aria-hidden="true" />
            {bookWork.kicker}
          </p>
          <h2 id="bk-work-title" className="bk-title">
            {bookWork.title}
          </h2>
          <p className="bk-copy">{bookWork.copy}</p>
        </div>
        <ul className="bk-work">
          {bookWork.items.map((item) => (
            <li key={item.name} className="bk-card">
              <div className="bk-shot">
                <div className="bk-shot-bar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <em>{item.domain}</em>
                </div>
                <div className="bk-shot-img">
                  <Image
                    src={item.image}
                    alt={`${item.name} homepage${item.kind === 'Concept' ? ' (concept)' : ''}`}
                    fill
                    sizes="(min-width: 1152px) 368px, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              </div>
              <div className="bk-card-body">
                <p className="bk-tag" data-kind={item.kind.toLowerCase()}>
                  {item.kind} · {item.year}
                </p>
                <h3>{item.name}</h3>
                <p>{item.copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Phones: kicker and title, the figure, then the fact. Wider: the figure left of both. */}
      <section className="bk-section bk-speed" aria-labelledby="bk-speed-title">
        <div className="bk-speed-head">
          <p className="qf-kicker">
            <span aria-hidden="true" />
            {bookSpeed.kicker}
          </p>
          <h2 id="bk-speed-title" className="bk-title">
            {bookSpeed.title}
          </h2>
        </div>
        <p className="bk-figure" aria-hidden="true">
          {bookSpeed.figure}
          <span>+</span>
        </p>
        <div className="bk-speed-body">
          <p className="bk-copy">{bookSpeed.fact}</p>
          <ul className="bk-cats" aria-label="The four Lighthouse categories">
            {bookSpeed.categories.map((category) => (
              <li key={category}>
                <Check size={14} />
                {category}
              </li>
            ))}
          </ul>
          <p className="bk-note">{bookSpeed.note}</p>
        </div>
      </section>

      <section className="bk-section" aria-labelledby="bk-steps-title">
        <div className="bk-head">
          <p className="qf-kicker">
            <span aria-hidden="true" />
            {bookProcess.kicker}
          </p>
          <h2 id="bk-steps-title" className="bk-title">
            {bookProcess.title}
          </h2>
        </div>
        <ol className="bk-steps">
          {bookProcess.steps.map((step) => (
            <li key={step.number} className="bk-step">
              <span className="bk-step-num" aria-hidden="true">
                {step.number}
              </span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bk-section bk-split" aria-labelledby="bk-call-title">
        <div className="bk-head">
          <p className="qf-kicker">
            <span aria-hidden="true" />
            {bookCall.kicker}
          </p>
          <h2 id="bk-call-title" className="bk-title">
            {bookCall.title}
          </h2>
        </div>
        <ul className="bk-list">
          {bookCall.items.map((item) => (
            <li key={item}>
              <Check size={16} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bk-section bk-split" aria-labelledby="bk-faq-title">
        <div className="bk-head">
          <p className="qf-kicker">
            <span aria-hidden="true" />
            {bookFaqs.kicker}
          </p>
          <h2 id="bk-faq-title" className="bk-title">
            {bookFaqs.title}
          </h2>
        </div>
        <dl className="bk-faq">
          {bookFaqs.items.map((item) => (
            <div key={item.q}>
              <dt>{item.q}</dt>
              <dd>
                {item.a}
                {item.link && (
                  <>
                    {' '}
                    <Link href={item.link.href}>{item.link.label}</Link>.
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bk-final" aria-labelledby="bk-final-title">
        <h2 id="bk-final-title" className="bk-title">
          {bookFinal.title}
        </h2>
        <p className="bk-copy">{bookFinal.copy.replace('{n}', String(questionCount))}</p>
        <button type="button" className="qf-primary" onClick={onStart}>
          {bookFinal.cta}
          <ArrowRight size={18} />
        </button>
      </section>
    </div>
  )
}
