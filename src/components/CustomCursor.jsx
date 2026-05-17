import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const trailsRef = useRef([])
  const pos = useRef({ x: -100, y: -100 })
  const followerPos = useRef({ x: -100, y: -100 })
  const isHovering = useRef(false)
  const trailCount = 6

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    const trails = trailsRef.current
    if (!cursor || !follower) return

    document.body.style.cursor = 'none'

    const trailPositions = Array.from({ length: trailCount }, () => ({ x: -100, y: -100 }))

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power3.out',
      })
    }

    window.addEventListener('mousemove', onMove)

    const ticker = () => {
      followerPos.current.x += (pos.current.x - followerPos.current.x) * 0.1
      followerPos.current.y += (pos.current.y - followerPos.current.y) * 0.1
      gsap.set(follower, { x: followerPos.current.x, y: followerPos.current.y })

      trailPositions[0].x += (pos.current.x - trailPositions[0].x) * 0.18
      trailPositions[0].y += (pos.current.y - trailPositions[0].y) * 0.18

      for (let i = 1; i < trailCount; i++) {
        trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.22
        trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.22
      }

      trails.forEach((trail, i) => {
        if (!trail) return
        const opacity = isHovering.current ? 0 : (1 - i / trailCount) * 0.4
        const scale = 1 - (i / trailCount) * 0.75
        gsap.set(trail, {
          x: trailPositions[i].x,
          y: trailPositions[i].y,
          opacity,
          scale,
        })
      })
    }

    gsap.ticker.add(ticker)

    const onEnter = (e) => {
      isHovering.current = true
      const isMagnetic = e.currentTarget.dataset.magnetic !== undefined

      gsap.to(cursor, {
        scale: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power3.out',
      })

      gsap.to(follower, {
        scale: isMagnetic ? 1.5 : 1.7,
        borderColor: 'rgba(0, 229, 255, 1)',
        borderWidth: '1px',
        backgroundColor: 'rgba(0, 229, 255, 0.06)',
        boxShadow: '0 0 14px rgba(0,229,255,0.2), inset 0 0 8px rgba(0,229,255,0.06)',
        duration: 0.4,
        ease: 'expo.out',
      })

      // Dashed ring slow rotate
      gsap.to(follower, {
        rotation: 360,
        duration: 4,
        ease: 'none',
        repeat: -1,
      })
    }

    const onLeave = () => {
      isHovering.current = false

      gsap.killTweensOf(follower, 'rotation')

      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
      })

      gsap.to(follower, {
        scale: 1,
        borderColor: 'rgba(0, 229, 255, 0.35)',
        borderWidth: '1px',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        rotation: 0,
        duration: 0.4,
        ease: 'expo.out',
      })
    }

    const onClick = () => {
      gsap.timeline()
        .to(follower, { scale: isHovering.current ? 1.1 : 0.6, duration: 0.1, ease: 'power2.in' })
        .to(follower, {
          scale: isHovering.current ? 1.25 : 1,
          duration: 0.55,
          ease: 'elastic.out(1, 0.35)',
        })

      gsap.timeline()
        .to(cursor, { scale: 3, opacity: 0, duration: 0.35, ease: 'power2.out' })
        .set(cursor, { scale: 1, opacity: 1 })
    }

    const interactables = document.querySelectorAll('a, button, [data-cursor], [data-magnetic]')
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    window.addEventListener('click', onClick)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      gsap.ticker.remove(ticker)
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  const sharedStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    zIndex: 99999,
    willChange: 'transform',
    transform: 'translate(-50%, -50%)',
  }

  return (
    <>
      {/* Dot */}
      <div
        ref={cursorRef}
        style={{
          ...sharedStyle,
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#00E5FF',
          boxShadow: '0 0 8px rgba(0,229,255,1), 0 0 20px rgba(0,229,255,0.5), 0 0 40px rgba(0,229,255,0.2)',
        }}
      />

      {/* Follower ring */}
      <div
        ref={followerRef}
        style={{
          ...sharedStyle,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          borderWidth: '1px',
          borderStyle: 'dashed',
          borderColor: 'rgba(0, 229, 255, 0.35)',
          backgroundColor: 'transparent',
          zIndex: 99998,
        }}
      />

      {/* Trails */}
      {Array.from({ length: trailCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailsRef.current[i] = el)}
          style={{
            ...sharedStyle,
            width: `${6 - i * 0.7}px`,
            height: `${6 - i * 0.7}px`,
            borderRadius: '50%',
            background: `rgba(0, 229, 255, ${0.55 - i * 0.07})`,
            boxShadow: i < 2 ? '0 0 6px rgba(0,229,255,0.4)' : 'none',
            zIndex: 99997 - i,
          }}
        />
      ))}
    </>
  )
}