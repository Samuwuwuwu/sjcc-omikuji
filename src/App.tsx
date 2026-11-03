import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'motion/react'
import { FortuneBox } from './components/FortuneBox'
import { FoldingPaper } from './components/FoldingPaper'
import { ArrowIcon, SaveIcon, ShareIcon } from './components/Icons'
import { drawFortune } from './data/fortunes'
import type { Fortune } from './data/fortunes'
import { createFortuneImage, downloadFortune, shareFortune } from './lib/exportFortune'

type Stage = 'draw' | 'reveal' | 'fortune'
const ease = [0.22, 1, 0.36, 1] as const

export default function App() {
  const [stage, setStage] = useState<Stage>('draw')
  const [fortune, setFortune] = useState<Fortune | null>(null)
  const [sharing, setSharing] = useState(false)
  const [preparedImage, setPreparedImage] = useState<{ fortuneId: string; file: File } | null>(null)
  const [saveMessage, setSaveMessage] = useState('')
  const locked = useRef(false)
  const alive = useRef(true)
  const paperElement = useRef<HTMLElement>(null)
  const stageElement = useRef<HTMLDivElement>(null)
  const [paperScale, setPaperScale] = useState(1)
  const [paperInFront, setPaperInFront] = useState(false)
  const drawButton = useRef<HTMLButtonElement>(null)
  const box = useAnimationControls()
  const paper = useAnimationControls()
  const topFold = useAnimationControls()
  const bottomFold = useAnimationControls()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  useEffect(() => {
    if (stage !== 'reveal') return
    let cancelled = false

    async function reveal() {
      // Let newly mounted Motion elements finish registering their controls.
      // This also keeps the short reduced-motion path reliable in StrictMode.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      if (cancelled) return
      if (reduceMotion) {
        setPaperInFront(true)
        box.set({ opacity: 0 })
        topFold.set({ rotateX: 0 })
        bottomFold.set({ rotateX: 0 })
        await paper.start({ opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.2 } })
      } else {
        paper.set({ opacity: 0, y: -40, scale: 0.24, rotate: -9 })
        topFold.set({ rotateX: -179.5 })
        bottomFold.set({ rotateX: 179.5 })
        await box.start({
          rotate: [0, -5, 7, -9, 8, -5, 2, 0],
          x: [0, -7, 9, -10, 9, -5, 2, 0],
          y: [0, -3, -10, -4, -8, -2, 0, 0],
          transition: { duration: 0.92, times: [0, 0.12, 0.24, 0.38, 0.53, 0.68, 0.82, 1], ease: 'easeInOut' },
        })
        if (cancelled) return
        await paper.start({ opacity: 1, y: -158, rotate: -6, transition: { duration: 0.42, ease } })
        if (cancelled) return
        setPaperInFront(true)
        await Promise.all([
          box.start({ y: 76, rotate: 3, opacity: 0, scale: 0.92, transition: { duration: 0.34, ease } }),
          paper.start({ y: -16, rotate: 1.5, scale: 0.88, transition: { duration: 0.4, ease } }),
        ])
        if (cancelled) return
        await Promise.all([
          paper.start({ y: 0, rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 190, damping: 23, mass: 0.75 } }),
          topFold.start({ rotateX: [-179.5, -88, 5, 0], transition: { duration: 0.64, times: [0, 0.4, 0.85, 1], ease: 'easeInOut' } }),
          bottomFold.start({ rotateX: [179.5, 80, -4, 0], transition: { duration: 0.6, delay: 0.1, times: [0, 0.4, 0.85, 1], ease: 'easeInOut' } }),
        ])
      }
      if (!cancelled) setStage('fortune')
    }

    void reveal()
    return () => { cancelled = true }
  }, [stage, reduceMotion, box, paper, topFold, bottomFold])

  useEffect(() => {
    if (stage === 'fortune') paperElement.current?.focus({ preventScroll: true })
  }, [stage])

  useLayoutEffect(() => {
    if (!fortune || !stageElement.current || !paperElement.current) return
    const container = stageElement.current
    const result = paperElement.current
    const fit = () => setPaperScale(Math.min(1, (container.clientHeight - 28) / result.offsetHeight, (container.clientWidth - 40) / result.offsetWidth))
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    observer.observe(result)
    return () => observer.disconnect()
  }, [fortune])

  useEffect(() => {
    if (!fortune) return
    let cancelled = false
    void createFortuneImage(fortune).then((file) => {
      if (!cancelled) setPreparedImage({ fortuneId: fortune.id, file })
    }).catch(() => {
      if (!cancelled) setSaveMessage('Couldn’t prepare the image. Please draw again.')
    })
    return () => { cancelled = true }
  }, [fortune])

  function draw() {
    if (locked.current || stage !== 'draw') return
    locked.current = true
    setFortune(drawFortune(fortune?.id))
    setSaveMessage('')
    setStage('reveal')
  }

  function reset() {
    box.set({ opacity: 1, rotate: 0, x: 0, y: 0, scale: 1 })
    paper.set({ opacity: 0 })
    locked.current = false
    setSaveMessage('')
    setPaperInFront(false)
    setStage('draw')
    requestAnimationFrame(() => drawButton.current?.focus({ preventScroll: true }))
  }

  const imageFile = preparedImage?.fortuneId === fortune?.id ? preparedImage?.file : undefined

  function save() {
    if (!imageFile) return
    downloadFortune(imageFile)
    setSaveMessage('Saved.')
  }

  async function share() {
    if (!imageFile || sharing) return
    setSharing(true)
    setSaveMessage('')
    try {
      const result = await shareFortune(imageFile)
      if (alive.current && result === 'downloaded') setSaveMessage('Image saved. Tag @sjccnyp on Instagram.')
    } catch {
      if (alive.current) setSaveMessage('Couldn’t share. Please save the image instead.')
    } finally {
      if (alive.current) setSharing(false)
    }
  }

  const isFortune = stage === 'fortune'

  return (
    <div className="app-shell">
      <header className="site-header flex items-center justify-center">
        <div className="brand flex items-center gap-3">
          <img src="/sakuran-logo.png" width="50" height="50" alt="Sakuran Japanese Culture Club" />
          <h1>Spectrum 2026</h1>
        </div>
      </header>

      <main className="main-composition">
        <section className="ritual" aria-label="Draw your Japanese fortune" aria-busy={stage === 'reveal'}>
          <div ref={stageElement} className={`fortune-stage ${stage}`}>
            <motion.div
              className="sun-disc"
              animate={{ opacity: isFortune ? 0.42 : 1, scale: isFortune ? 0.9 : 1 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.8, ease }}
              aria-hidden="true"
            />

            <motion.div className="box-wrap" animate={box} initial={{ opacity: 1 }} aria-hidden={stage !== 'draw'}>
              <motion.button
                className="box-button"
                onClick={draw}
                tabIndex={-1}
                disabled={stage !== 'draw'}
                aria-label="Draw your fortune"
                whileHover={stage === 'draw' && !reduceMotion ? { y: -7, rotate: 2 } : undefined}
                whileTap={stage === 'draw' && !reduceMotion ? { scale: 0.97, rotate: -2 } : undefined}
                transition={{ duration: 0.4, ease }}
              ><FortuneBox /></motion.button>
            </motion.div>

            {fortune && (
              <div className="paper-holder" style={{ zIndex: paperInFront ? 3 : 1 }}>
                <div className="paper-fit" style={{ transform: `scale(${paperScale})` }}>
                  <motion.div className="paper-motion" animate={paper} initial={{ opacity: 0 }}>
                    <FoldingPaper fortune={fortune} revealed={isFortune} paperRef={paperElement} topFold={topFold} bottomFold={bottomFold} />
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          <div className="ritual-actions">
            <AnimatePresence mode="wait" initial={false}>
              {stage === 'draw' && (
                <motion.button key="draw" ref={drawButton} className="draw-button group" onClick={draw}
                  whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={reduceMotion ? undefined : { y: 3, scale: 0.985 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                  <span>Draw fortune</span><span className="draw-arrow"><ArrowIcon /></span>
                </motion.button>
              )}
              {isFortune && (
                <motion.div key="result" className="result-actions" initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <div className="sharing-actions">
                    <button className="share-button" onClick={() => void share()} disabled={!imageFile || sharing}><ShareIcon /><span>Share</span></button>
                    <button className="save-button" onClick={save} disabled={!imageFile || sharing}><SaveIcon /><span>Save image</span></button>
                  </div>
                  <button className="again-button" onClick={reset} disabled={sharing}>Draw again<ArrowIcon /></button>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="save-message" role="status" aria-live="polite">{saveMessage}</p>
          </div>
        </section>
      </main>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isFortune && fortune ? `${fortune.japanese}. ${fortune.meaning}. ${fortune.message}` : stage === 'reveal' ? 'Drawing your fortune.' : ''}
      </div>
    </div>
  )
}
