import { forwardRef } from 'react'
import type { Fortune } from '../data/fortunes'
import { SparkIcon } from './Icons'

export const FortunePaper = forwardRef<HTMLElement, { fortune: Fortune }>(
  function FortunePaper({ fortune }, ref) {
    return (
      <article className="fortune-paper" ref={ref} tabIndex={-1} aria-label={`${fortune.meaning}: ${fortune.message}`}>
        <div className="paper-inner">
          <p className="paper-reading">{fortune.reading}</p>
          <h2 className="paper-japanese" lang="ja" data-characters={fortune.japanese.length}>{fortune.japanese}</h2>
          <p className="paper-meaning">{fortune.meaning}</p>
          <div className="paper-divider" aria-hidden="true"><SparkIcon /></div>
          <p className="paper-message">{fortune.message}</p>
        </div>
      </article>
    )
  },
)
