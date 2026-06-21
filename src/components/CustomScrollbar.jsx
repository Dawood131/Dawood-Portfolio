import { useEffect, useRef, useState } from 'react'
import { getLenis } from '../lib/lenis'

// A thin custom scrollbar that is fully driven by Lenis. The native browser
// scrollbar is hidden globally (see hideNativeScrollbar.css), so there is no
// second scroll source left to fight with Lenis/ScrollTrigger anymore — this
// is what actually removes the blink/jump/overlap glitch you were seeing,
// instead of trying to patch around the race condition.
export default function CustomScrollbar() {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)
  const dragging = useRef(false)
  const dragStartY = useRef(0)
  const dragStartScroll = useRef(0)
  const [thumbStyle, setThumbStyle] = useState({ top: 0, height: 40 })

  useEffect(() => {
    const lenis = getLenis()
    if (!lenis) return

    const updateThumb = () => {
      const trackEl = trackRef.current
      if (!trackEl) return
      const trackHeight = trackEl.clientHeight

      const scrollHeight = lenis.limit // max scrollable distance
      const progress = scrollHeight > 0 ? lenis.scroll / scrollHeight : 0

      // Thumb size proportional to viewport vs total scrollable content,
      // clamped so it never becomes invisibly small.
      const viewport = window.innerHeight
      const total = scrollHeight + viewport
      const rawHeight = (viewport / total) * trackHeight
      const height = Math.max(36, rawHeight)

      const top = progress * (trackHeight - height)

      setThumbStyle({ top, height })
    }

    lenis.on('scroll', updateThumb)
    updateThumb()

    window.addEventListener('resize', updateThumb)
    return () => {
      lenis.off('scroll', updateThumb)
      window.removeEventListener('resize', updateThumb)
    }
  }, [])

  const onThumbPointerDown = (e) => {
    const lenis = getLenis()
    if (!lenis) return
    dragging.current = true
    dragStartY.current = e.clientY
    dragStartScroll.current = lenis.scroll
    document.body.style.userSelect = 'none'
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onThumbPointerMove = (e) => {
    if (!dragging.current) return
    const lenis = getLenis()
    const trackEl = trackRef.current
    if (!lenis || !trackEl) return

    const trackHeight = trackEl.clientHeight
    const thumbHeight = thumbRef.current?.clientHeight || 40
    const deltaY = e.clientY - dragStartY.current
    const scrollableTrack = trackHeight - thumbHeight
    const scrollRatio = scrollableTrack > 0 ? lenis.limit / scrollableTrack : 0

    const target = dragStartScroll.current + deltaY * scrollRatio
    lenis.scrollTo(target, { immediate: true })
  }

  const onThumbPointerUp = (e) => {
    dragging.current = false
    document.body.style.userSelect = ''
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch (_) {}
  }

  // Clicking on the empty track (not the thumb) jumps to that position,
  // matching native scrollbar "page jump" behavior, but through Lenis only.
  const onTrackPointerDown = (e) => {
    if (e.target === thumbRef.current) return
    const lenis = getLenis()
    const trackEl = trackRef.current
    if (!lenis || !trackEl) return

    const rect = trackEl.getBoundingClientRect()
    const clickRatio = (e.clientY - rect.top) / rect.height
    lenis.scrollTo(clickRatio * lenis.limit, { duration: 0.6 })
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={onTrackPointerDown}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '14px',
        height: '100vh',
        zIndex: 100000,
        cursor: 'pointer',
      }}
    >
      <div
        ref={thumbRef}
        onPointerDown={onThumbPointerDown}
        onPointerMove={onThumbPointerMove}
        onPointerUp={onThumbPointerUp}
        style={{
          position: 'absolute',
          right: '3px',
          width: '6px',
          borderRadius: '999px',
          transition: 'background 0.2s',
          top: thumbStyle.top,
          height: thumbStyle.height,
          cursor: 'grab',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.4)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
      />
    </div>
  )
}