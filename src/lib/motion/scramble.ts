const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>#*+'
const running = new WeakMap<HTMLElement, number>()

/**
 * Mission-control "decode": characters cycle through random glyphs and lock
 * into the real text left to right. The real text is captured once (in
 * data-text) so a second call can never "lock in" scrambled glyphs, the width
 * is pinned so the layout never jitters, and cleanup restores the text.
 */
export function scramble(el: HTMLElement, duration = 700): () => void {
  el.dataset.text ??= el.textContent ?? ''
  const final = el.dataset.text
  if (!final.trim()) return () => {}

  cancelAnimationFrame(running.get(el) ?? 0)
  el.textContent = final
  el.style.display = 'inline-block'
  el.style.minWidth = `${el.getBoundingClientRect().width}px`

  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min((now - start) / duration, 1)
    const locked = Math.floor(p * final.length)
    let out = final.slice(0, locked)
    for (let i = locked; i < final.length; i++) {
      out += final[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
    }
    el.textContent = p < 1 ? out : final
    if (p < 1) running.set(el, requestAnimationFrame(tick))
    else running.delete(el)
  }
  running.set(el, requestAnimationFrame(tick))

  return () => {
    cancelAnimationFrame(running.get(el) ?? 0)
    running.delete(el)
    el.textContent = final
    el.style.minWidth = ''
  }
}
