import { useRef } from 'react'

// Subtle 3D tilt-on-hover for cards. Returns props + ref to spread on the
// element you want to tilt. Reads the cursor position relative to that
// element and applies a perspective rotateX/rotateY transform, restoring on
// leave. Inert on touch devices (no hover state).
//
// Usage:
//   const tilt = useTilt(7)
//   <div ref={tilt.ref} onMouseMove={tilt.onMouseMove}
//        onMouseLeave={tilt.onMouseLeave} style={tilt.style}>
export function useTilt(maxDeg = 7) {
  const ref = useRef(null)

  const onMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width   // 0..1 across element
    const py = (e.clientY - r.top) / r.height   // 0..1 down element
    const ry = (px - 0.5) * (maxDeg * 2)         // tilt left/right
    const rx = -(py - 0.5) * (maxDeg * 2)        // tilt up/down (inverted)
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = ''
  }

  return {
    ref,
    onMouseMove,
    onMouseLeave,
    style: { transition: 'transform 0.25s ease-out', willChange: 'transform' },
  }
}
