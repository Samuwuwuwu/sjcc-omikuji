import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'motion/react'
import { FortuneBox } from './components/FortuneBox'
import { FoldingPaper } from './components/FoldingPaper'
import { RitualEffects } from './components/RitualEffects'
import { AgainIcon, SaveIcon, ShareIcon, SparkIcon } from './components/Icons'
import { drawFortune, fortuneColors } from './data/fortunes'
import type { Fortune } from './data/fortunes'
import { createFortuneImage, downloadFortune, shareFortune } from './lib/exportFortune'

type Stage = 'draw' | 'reveal' | 'fortune'
export type RevealPhase = 'idle' | 'charge' | 'suspend' | 'burst' | 'open' | 'settled'
const ease = [0.16, 1, 0.3, 1] as const

export default function App() {
  const [stage, setStage] = useState<Stage>('draw')
  const [phase, setPhase] = useState<RevealPhase>('idle')
  const [tapCount, setTapCount] = useState(0)
  const taps = useRef(0)
  const [fortune, setFortune] = useState<Fortune | null>(null)
  const [sharing, setSharing] = useState(false)
  const [preparedImage, setPreparedImage] = useState<{ fortuneId: string; file: File } | null>(null)
  const [saveMessage, setSaveMessage] = useState('')
  const locked = useRef(false)
  const alive = useRef(true)
  const paperElement = useRef<HTMLElement>(null)
  const stageElement = useRef<HTMLDivElement>(null)
  const boxButton = useRef<HTMLButtonElement>(null)
  const [paperScale, setPaperScale] = useState(1)
  const [paperInFront, setPaperInFront] = useState(false)
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
      // Register the newly mounted paper before starting its controls.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      if (cancelled) return
      if (reduceMotion) {
        setPaperInFront(true)
        box.set({ opacity: 0 })
        topFold.set({ rotateX: 0 })
        bottomFold.set({ rotateX: 0 })
        await paper.start({ opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.2 } })
      } else {
        setPhase('charge')
        paper.set({ opacity: 0, y: -50, scale: 0.2, rotate: -9 })
        topFold.set({ rotateX: -179.5 })
        bottomFold.set({ rotateX: 179.5 })
        await box.start({
          rotate: [0, -11, 13, -14, 11, -7, 0],
          x: [0, -9, 12, -13, 10, -5, 0],
          y: [0, -7, -16, -9, -18, -8, 0],
          scale: [1, 1.02, 1.04, 1.03, 1.05, 1.03, 1.02],
          transition: { duration: 0.58, ease: 'easeInOut' },
        })
        if (cancelled) return
        setPhase('suspend')
        await Promise.all([
          box.start({ y: -16, rotate: -5, scale: 1.07, transition: { duration: 0.38, ease } }),
          paper.start({ opacity: 1, y: -205, rotate: -12, transition: { duration: 0.38, ease } }),
        ])
        if (cancelled) return
        // A held beat gives the release its weight.
        await box.start({ scale: 1.075, transition: { duration: 0.2 } })
        if (cancelled) return
        setPaperInFront(true)
        setPhase('burst')
        await Promise.all([
          box.start({ y: 100, rotate: 12, opacity: 0, scale: 1.24, transition: { duration: 0.24, ease } }),
          paper.start({ y: -18, rotate: 8, scale: 0.88, transition: { duration: 0.34, ease } }),
        ])
        if (cancelled) return
        setPhase('open')
        await Promise.all([
          paper.start({ y: 0, rotate: -3, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 19, mass: 0.85 } }),
          topFold.start({ rotateX: [-179.5, -80, 8, 0], transition: { duration: 0.6, times: [0, 0.38, 0.8, 1], ease: 'easeInOut' } }),
          bottomFold.start({ rotateX: [179.5, 75, -6, 0], transition: { duration: 0.58, delay: 0.08, times: [0, 0.38, 0.8, 1], ease: 'easeInOut' } }),
        ])
      }
      if (!cancelled) {
        setPhase('settled')
        setStage('fortune')
      }
    }

    void reveal()
    return () => { cancelled = true }
  }, [stage, reduceMotion, box, paper, topFold, bottomFold])

  useLayoutEffect(() => {
    if (stage === 'draw' || !stageElement.current || !paperElement.current) return
    const container = stageElement.current
    const result = paperElement.current
    const fit = () => setPaperScale(Math.max(0.1, Math.min(1, (container.clientHeight - 34) / result.offsetHeight, (container.clientWidth - 48) / result.offsetWidth)))
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    observer.observe(result)
    return () => observer.disconnect()
  }, [fortune, stage])

  useEffect(() => {
    if (!fortune) return
    let cancelled = false
    void createFortuneImage(fortune).then((file) => {
      if (!cancelled) setPreparedImage({ fortuneId: fortune.id, file })
    }).catch(() => {
      if (!cancelled) setSaveMessage('Couldn’t prepare the image. Please try again.')
    })
    return () => { cancelled = true }
  }, [fortune])

  function tapBox() {
    if (locked.current || stage !== 'draw') return
    const next = Math.min(taps.current + 1, 3)
    taps.current = next
    setTapCount(next)

    if (!reduceMotion && navigator.vibrate) navigator.vibrate(next === 3 ? [18, 35, 30] : next * 12)

    if (next === 3) {
      locked.current = true
      setFortune(drawFortune(fortune?.id))
      setPreparedImage(null)
      setSaveMessage('')
      setStage('reveal')
      return
    }

    if (!reduceMotion) {
      const strength = 5 + next * 3
      void box.start({
        rotate: [0, -strength, strength * 0.8, -strength * 0.45, 0],
        x: [0, -next * 4, next * 4, -next, 0],
        y: [0, -next * 9, 2, -next * 3, 0],
        scale: [1, 1 + next * 0.025, 0.98, 1.015, 1],
        transition: { duration: 0.46, ease: 'easeOut' },
      })
    }
  }

  function reset() {
    box.set({ opacity: 1, rotate: 0, x: 0, y: 0, scale: 1 })
    paper.set({ opacity: 0 })
    locked.current = false
    taps.current = 0
    setTapCount(0)
    setSaveMessage('')
    setPaperInFront(false)
    setPhase('idle')
    setStage('draw')
    requestAnimationFrame(() => boxButton.current?.focus({ preventScroll: true }))
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
      if (alive.current && result === 'downloaded') setSaveMessage('Saved. Tag @sjccnyp when you post.')
    } catch {
      if (alive.current) setSaveMessage('Couldn’t share. Try saving the image.')
    } finally {
      if (alive.current) setSharing(false)
    }
  }

  const isFortune = stage === 'fortune'
  const colors = fortuneColors(stage === 'draw' ? undefined : fortune?.id)
  const sceneStyle = { '--fortune-accent': colors.accent, '--fortune-tint': colors.tint } as CSSProperties

  return (
    <div className={`app-shell phase-${phase}`} style={sceneStyle}>
      <motion.div className="summon-veil" aria-hidden="true" initial={{ opacity: 0 }}
        animate={{ opacity: !reduceMotion && phase === 'suspend' ? 0.96 : 0 }}
        transition={{ duration: phase === 'suspend' ? 0.28 : 0.55 }} />

      <header className="site-header">
        <div className="brand">
          <img src="/sakuran-logo.png" width="46" height="46" alt="Sakuran Japanese Culture Club" />
          <h1>Spectrum 2026</h1>
        </div>
      </header>

      <main className="main-composition">
        <section className="ritual" aria-label="Draw your Japanese fortune" aria-busy={stage === 'reveal'}>
          <div ref={stageElement} className={`fortune-stage ${stage} charge-${tapCount}`}>
            <motion.div className="ritual-title" aria-hidden="true"
              animate={{ opacity: stage === 'draw' ? 1 : 0, y: stage === 'draw' || reduceMotion ? 0 : -18 }}
              transition={{ duration: 0.28, ease }}>Omikuji<span className="title-star"><SparkIcon /></span></motion.div>

            <motion.div className="sun-disc" aria-hidden="true"
              animate={{
                opacity: phase === 'suspend' ? 0.32 : isFortune ? 0.38 : 1,
                scale: reduceMotion ? 1 : isFortune ? 1.13 : 1 + tapCount * 0.075,
                rotate: reduceMotion ? 0 : tapCount * 14,
              }}
              transition={{ duration: reduceMotion ? 0.15 : 0.5, ease }} />

            <RitualEffects taps={tapCount} phase={phase} reduced={!!reduceMotion} />

            <motion.div className="box-wrap" animate={box} initial={{ opacity: 1 }} aria-hidden={stage !== 'draw'}>
              <motion.button ref={boxButton} className="box-button" onClick={tapBox}
                disabled={stage !== 'draw'}
                aria-label={`Tap the fortune box. ${3 - tapCount} ${3 - tapCount === 1 ? 'tap' : 'taps'} remaining.`}
                whileHover={stage === 'draw' && !reduceMotion ? { y: -5, rotate: 2 } : undefined}
                whileTap={stage === 'draw' && !reduceMotion ? { scale: 0.96 } : undefined}
                transition={{ duration: 0.2, ease }}>
                <FortuneBox />
              </motion.button>
            </motion.div>

            {fortune && stage !== 'draw' && (
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
                <motion.div key="tap" className="tap-prompt"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                  <div className="tap-seals" aria-hidden="true">
                    {[1, 2, 3].map((n) => <span key={n} className={tapCount >= n ? 'lit' : ''}><SparkIcon /></span>)}
                  </div>
                  <p>{tapCount === 0 ? 'Tap the box' : tapCount === 1 ? 'Keep going' : 'One more'}</p>
                </motion.div>
              )}
              {isFortune && (
                <motion.div key="result" className="result-actions"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }}
                  onAnimationComplete={() => paperElement.current?.focus({ preventScroll: true })}
                  transition={{ duration: 0.35, ease }}>
                  <button className="share-button" onClick={() => void share()} disabled={!imageFile || sharing}>
                    <ShareIcon /><span>{sharing ? 'Sharing…' : 'Share'}</span>
                  </button>
                  <button className="seal-button save-button" onClick={save} disabled={!imageFile || sharing} aria-label="Save image" title="Save image"><SaveIcon /></button>
                  <button className="seal-button again-button" onClick={reset} disabled={sharing} aria-label="Draw again" title="Draw again"><AgainIcon /></button>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="save-message" role="status" aria-live="polite">{saveMessage}</p>
          </div>
        </section>
      </main>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isFortune && fortune ? `${fortune.japanese}. ${fortune.meaning}. ${fortune.message}` : stage === 'reveal' ? 'Your fortune is opening.' : tapCount > 0 ? `${tapCount} of 3 taps. ${3 - tapCount} remaining.` : 'Tap the box three times to reveal your fortune.'}
      </div>
    </div>
  )
}
