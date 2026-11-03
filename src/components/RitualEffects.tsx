import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import type { RevealPhase } from '../App'

type Props = { taps: number; phase: RevealPhase; reduced: boolean }

export function RitualEffects({ taps, phase, reduced }: Props) {
  if (reduced) return null
  const released = phase === 'burst' || phase === 'open' || phase === 'settled'

  return (
    <div className="ritual-effects" aria-hidden="true">
      {taps > 0 && !released && (
        <div className="tap-impact" key={taps}>
          <motion.div className="impact-ring"
            initial={{ scale: 0.45, opacity: 0.7 }} animate={{ scale: 1.1 + taps * 0.1, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }} />
          {Array.from({ length: 8 }, (_, i) => (
            <span className="impact-spoke" key={i} style={{ rotate: `${i * 45 + taps * 12}deg` }}>
              <motion.i initial={{ y: -95, scaleY: 0.3, opacity: 0 }}
                animate={{ y: -175 - taps * 18, scaleY: [0.3, 1.2, 0.2], opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, ease: 'easeOut' }} />
            </span>
          ))}
        </div>
      )}

      {released && (
        <div className="release-effects">
          <motion.div className="burst-rays"
            initial={{ scale: 0.5, rotate: -12, opacity: 0 }}
            animate={{ scale: [0.5, 1.12, 1.3], rotate: [-12, 0, 7], opacity: [0, 0.38, 0] }}
            transition={{ duration: 1.15, times: [0, 0.22, 1], ease: 'easeOut' }}>
            <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="currentColor">
              {Array.from({ length: 18 }, (_, i) => <path key={i} d="M493 345 476 0 524 0 507 345Z" transform={`rotate(${i * 20} 500 500)`} />)}
            </svg>
          </motion.div>
          <motion.div className="release-ring" initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 0.85, ease: 'easeOut' }} />
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i * 137.5 * Math.PI) / 180
            const distance = 165 + (i % 5) * 32
            return (
              <motion.span key={i} className={`paper-fleck fleck-${i % 3}`}
                style={{ '--fleck-size': `${5 + i % 4 * 2}px` } as CSSProperties}
                initial={{ x: 0, y: 0, rotate: i * 21, opacity: 0, scale: 0.4 }}
                animate={{ x: Math.cos(angle) * distance, y: [0, Math.sin(angle) * distance - 35, Math.sin(angle) * distance + 70], rotate: i * 21 + 160, opacity: [0, 1, 1, 0], scale: [0.4, 1, 0.6] }}
                transition={{ duration: 1.25 + (i % 3) * 0.15, delay: i % 4 * 0.025, ease: 'easeOut' }} />
            )
          })}
        </div>
      )}
    </div>
  )
}
