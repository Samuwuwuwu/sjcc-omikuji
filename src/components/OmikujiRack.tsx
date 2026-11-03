import { motion } from 'motion/react'
import type { Ref } from 'react'
import type { useAnimationControls } from 'motion/react'

type Props = {
  knot: ReturnType<typeof useAnimationControls>
  anchorRef: Ref<SVGCircleElement>
  reduced: boolean
}

function QuietKnot({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} fill="#f9f4e9" stroke="#c7b9a8" strokeWidth="1.2">
      <path d="M-34-13-3-5 3 5-37-2ZM3-5 34 9 30 19-5 5Z" />
      <path d="m-6-7 12 2-1 13-12-3z" fill="#eee4d5" />
    </g>
  )
}

export function OmikujiRack({ knot, anchorRef, reduced }: Props) {
  return (
    <div className="omikuji-rack" aria-hidden="true">
      <svg viewBox="0 0 520 420" fill="none">
        <path d="M77 364h366" stroke="#bfb0a0" strokeWidth="1.2" />
        <path d="M86 356V88m348 268V88M73 100h374" stroke="#8d6b56" strokeWidth="8" strokeLinecap="round" />
        <path d="M87 160h346M87 244h346" stroke="#9a8778" strokeWidth="1.6" />
        <path d="M70 357h32m316 0h32" stroke="#8d6b56" strokeWidth="5" strokeLinecap="round" />
        <QuietKnot x={148} y={160} angle={-9} />
        <QuietKnot x={371} y={160} angle={8} />
        <QuietKnot x={194} y={244} angle={5} />
        <QuietKnot x={320} y={244} angle={-12} />
        <circle ref={anchorRef} cx="260" cy="160" r="1" fill="transparent" />
        <g transform="translate(260 160)">
          <motion.g animate={knot} initial="flat"
            variants={{ flat: { opacity: 0 }, tied: { opacity: 1, transition: { duration: reduced ? 0.15 : 0.1, when: 'beforeChildren' } } }}
            fill="#fcf9f0" stroke="#8e8186" strokeWidth="1.2">
            <motion.path
              variants={{
                flat: { d: 'M-50 -7 L-3 -7 L4 7 L-50 7 Z' },
                tied: { d: 'M-53 -21 L-6 -8 L-2 6 L-56 -6 Z', transition: { duration: reduced ? 0 : 0.48, ease: [0.16, 1, 0.3, 1] } },
              }} />
            <motion.path
              variants={{
                flat: { d: 'M-4 -7 L50 -7 L50 7 L3 7 Z' },
                tied: { d: 'M3 -7 L53 11 L47 25 L-6 7 Z', transition: { duration: reduced ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] } },
              }} />
            <motion.path d="m-9-10 19 4-3 18-19-5z" fill="#e8dce4"
              variants={{ flat: { opacity: 0, scale: 0.5, rotate: -18 }, tied: { opacity: 1, scale: 1, rotate: 0, transition: { duration: reduced ? 0.15 : 0.3, delay: reduced ? 0 : 0.18 } } }} />
            <motion.path d="m-6-4 12 4m-13 2 12 4" stroke="#a1969b"
              variants={{ flat: { pathLength: 0, opacity: 0 }, tied: { pathLength: 1, opacity: 1, transition: { duration: reduced ? 0.1 : 0.25, delay: reduced ? 0 : 0.3 } } }} />
          </motion.g>
        </g>
      </svg>
    </div>
  )
}
