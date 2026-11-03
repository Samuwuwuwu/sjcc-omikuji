import { motion } from 'motion/react'
import type { useAnimationControls } from 'motion/react'
import type { Ref } from 'react'
import type { Fortune } from '../data/fortunes'
import { FortunePaper } from './FortunePaper'

type Props = {
  fortune: Fortune
  revealed: boolean
  folding?: boolean
  paperRef: Ref<HTMLElement>
  topFold: ReturnType<typeof useAnimationControls>
  bottomFold: ReturnType<typeof useAnimationControls>
}

export function FoldingPaper({ fortune, revealed, folding = false, paperRef, topFold, bottomFold }: Props) {
  return (
    <div className="paper-sheet">
      <div className="paper-real" style={{ visibility: revealed ? 'visible' : 'hidden' }} aria-hidden={!revealed}>
        <FortunePaper ref={paperRef} fortune={fortune} />
      </div>
      {!revealed && (
        <div className="paper-panels" aria-hidden="true" inert>
          <div className="paper-panel paper-panel-middle">
            <div className="paper-panel-front"><div className="panel-print"><FortunePaper fortune={fortune} /></div></div>
          </div>
          <motion.div className="paper-panel paper-panel-top" animate={topFold} initial={{ rotateX: folding ? 0 : -179.5, z: 0.4 }}>
            <div className="paper-panel-front"><div className="panel-print"><FortunePaper fortune={fortune} /></div></div>
            <div className="paper-panel-back" />
          </motion.div>
          <motion.div className="paper-panel paper-panel-bottom" animate={bottomFold} initial={{ rotateX: folding ? 0 : 179.5, z: 0.8 }}>
            <div className="paper-panel-front"><div className="panel-print"><FortunePaper fortune={fortune} /></div></div>
            <div className="paper-panel-back" />
          </motion.div>
        </div>
      )}
    </div>
  )
}
