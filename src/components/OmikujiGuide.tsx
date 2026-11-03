import { useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { fortunes } from '../data/fortunes'

const sections = [
  { id: 'ritual', label: 'Ritual' },
  { id: 'grades', label: 'Grades' },
  { id: 'custom', label: 'Keep or tie' },
] as const
type Section = typeof sections[number]['id']

export function OmikujiGuide({ busy }: { busy: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const [section, setSection] = useState<Section>('ritual')
  const [open, setOpen] = useState(false)

  function show() {
    if (!dialog.current || dialog.current.open) return
    setSection('ritual')
    setOpen(true)
    dialog.current.showModal()
    heading.current?.focus({ preventScroll: true })
  }

  function close() {
    dialog.current?.close()
  }

  function closed() {
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }

  function clickBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close()
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === 'ArrowRight') next = (index + 1) % sections.length
    else if (event.key === 'ArrowLeft') next = (index + sections.length - 1) % sections.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = sections.length - 1
    else return
    event.preventDefault()
    setSection(sections[next].id)
    tabs.current[next]?.focus()
  }

  return (
    <>
      <button ref={trigger} className="guide-trigger" onClick={show} disabled={busy}
        aria-label="About traditional omikuji" title="About omikuji" aria-haspopup="dialog" aria-expanded={open} aria-controls="omikuji-guide">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1Zm0 0v14M6 9c1.2-.1 2.2.1 3 .5M6 12c1.2-.1 2.2.1 3 .5m6-3c.8-.4 1.8-.6 3-.5m-3 3.5c.8-.4 1.8-.6 3-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <dialog ref={dialog} id="omikuji-guide" className="omikuji-guide" aria-labelledby="guide-title" onClose={closed} onClick={clickBackdrop}>
        <div className="guide-paper">
          <header className="guide-header">
            <h2 ref={heading} id="guide-title" tabIndex={-1}>What is omikuji?</h2>
            <button className="guide-close" aria-label="Close omikuji guide" onClick={close}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="guide-tabs" role="tablist" aria-label="Explore omikuji">
            {sections.map((item, index) => (
              <button key={item.id} ref={(element) => { tabs.current[index] = element }} id={`guide-tab-${item.id}`}
                role="tab" aria-selected={section === item.id} aria-controls="guide-panel" tabIndex={section === item.id ? 0 : -1}
                onClick={() => setSection(item.id)} onKeyDown={(event) => navigate(event, index)}>{item.label}</button>
            ))}
          </div>

          <section className="guide-content" role="tabpanel" id="guide-panel" aria-labelledby={`guide-tab-${section}`} tabIndex={0}>
            {section === 'ritual' ? (
              <>
                <p>Omikuji are paper fortunes drawn at Shinto shrines and Buddhist temples in Japan. They pair an overall grade with short advice about everyday life. Some traditional slips also include a poem.</p>
                <p>One common ritual: shake a box of numbered sticks, draw one, then collect the matching slip. Other places let you draw a paper slip directly.</p>
              </>
            ) : section === 'grades' ? (
              <>
                <p>A grade gives the overall reading. These are the six you can draw here.</p>
                <dl className="guide-grades">
                  {fortunes.map((fortune) => (
                    <div key={fortune.id}><dt lang="ja">{fortune.japanese}</dt><dd>{fortune.meaning}</dd></div>
                  ))}
                </dl>
                <p className="guide-small">The grades and their order can vary between shrines and temples.</p>
              </>
            ) : (
              <>
                <p>A common custom is to take a good fortune home and keep it close.</p>
                <p>An unlucky slip can be folded and tied at a designated rack, symbolically leaving the bad luck behind.</p>
                <p>Customs vary. When visiting a shrine or temple, follow its signs and use the place provided for tying.</p>
              </>
            )}
          </section>

          <a className="guide-source" href="https://faq.japan-travel.jnto.go.jp/en/japan-magazine/2007_omikuji/" target="_blank" rel="noopener noreferrer">Explore more with JNTO<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
        </div>
      </dialog>
    </>
  )
}
