import { useLayoutEffect, useRef } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

type Props = { active: boolean; reduced: boolean; children: ReactNode }
const spring = { stiffness: 240, damping: 25, mass: 0.55 }

export function TiltingPaper({ active, reduced, children }: Props) {
  const surface = useRef<HTMLDivElement>(null)
  const dragging = useRef<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(x, spring)
  const rotateY = useSpring(y, spring)
  const interactive = active && !reduced

  function settle() {
    const pointer = dragging.current
    dragging.current = null
    if (pointer !== null && surface.current?.hasPointerCapture(pointer)) surface.current.releasePointerCapture(pointer)
    x.set(0)
    y.set(0)
  }

  useLayoutEffect(() => {
    if (interactive) return
    const pointer = dragging.current
    dragging.current = null
    if (pointer !== null && surface.current?.hasPointerCapture(pointer)) surface.current.releasePointerCapture(pointer)
    x.set(0)
    y.set(0)
    rotateX.jump(0)
    rotateY.jump(0)
  }, [interactive, x, y, rotateX, rotateY])

  function follow(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || !event.isPrimary) return
    if (event.pointerType !== 'mouse' && dragging.current !== event.pointerId) return
    // Read the stationary hit area, not the rotating paper, to avoid feedback jitter.
    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontal = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
    const vertical = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
    x.set(-vertical * 5)
    y.set(horizontal * 7)
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || !event.isPrimary || event.pointerType === 'mouse' || dragging.current !== null) return
    dragging.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
    follow(event)
  }

  return (
    <div ref={surface} className="paper-tilt-surface" data-active={active} data-tilt={interactive}
      onPointerEnter={follow} onPointerMove={follow} onPointerDown={startDrag}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') settle() }}
      onPointerUp={settle} onPointerCancel={settle} onLostPointerCapture={settle}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) settle() }}>
      <motion.div className="paper-tilt" style={{ rotateX, rotateY }}>
        {children}
      </motion.div>
    </div>
  )
}
