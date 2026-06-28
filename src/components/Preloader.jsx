import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null)
  const nameRef = useRef(null)
  const subtitleRef = useRef(null)
  const progressLineRef = useRef(null)
  const percentRef = useRef(null)
  const counterRef = useRef({ val: 0 })

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const root = document.getElementById('root')
    if (root) {
      root.style.overflow = 'hidden'
      root.style.height = '100vh'
    }

    const preventScroll = (e) => e.preventDefault()
    const preventKeys = (e) => {
      if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', preventScroll, { passive: false })
    window.addEventListener('touchmove', preventScroll, { passive: false })
    window.addEventListener('keydown', preventKeys)

    const enableScroll = () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''

      const root = document.getElementById('root')
      if (root) {
        root.style.overflow = ''
        root.style.height = ''
      }

      window.removeEventListener('wheel', preventScroll)
      window.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('keydown', preventKeys)
    }

    const tl = gsap.timeline()

    tl.fromTo(nameRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }
    )

    tl.fromTo(subtitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.3'
    )

    tl.to(counterRef.current, {
      val: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate() {
        if (percentRef.current)
          percentRef.current.textContent = Math.round(counterRef.current.val) + '%'
      }
    }, '-=0.2')

    tl.fromTo(progressLineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 2, ease: 'power2.inOut', transformOrigin: 'left' },
      '<'
    )

    tl.to({}, { duration: 0.5 })

    tl.to(
      [subtitleRef.current, percentRef.current, progressLineRef.current.parentElement.parentElement],
      { opacity: 0, duration: 0.4 }
    )

    tl.add(() => {
      const nameEl = nameRef.current
      if (!nameEl || !containerRef.current) return

      const isMobile = window.innerWidth < 768

      if (isMobile) {
        const nameBounds = nameEl.getBoundingClientRect()
        const computedSize = parseFloat(window.getComputedStyle(nameEl).fontSize)

        const TARGET_LEFT = 24
        const TARGET_TOP = 22
        const TARGET_W = 160

        const scale = TARGET_W / nameBounds.width
        const finalFontSize = computedSize * scale

        const dx = TARGET_LEFT - nameBounds.left
        const dy = TARGET_TOP - nameBounds.top

        gsap.to(nameEl, {
          x: dx,
          y: dy,
          scale,
          transformOrigin: 'top left',
          duration: 1,
          ease: 'power4.inOut',
          onComplete() {
            const clone = document.createElement('div')
            clone.textContent = 'Dawood Butt'
            clone.style.cssText = `
          position: fixed;
          top: ${TARGET_TOP}px;
          left: ${TARGET_LEFT}px;
          font-size: ${finalFontSize}px;
          font-weight: 700;
          font-family: Inter, sans-serif;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: white;
          line-height: 1;
          white-space: nowrap;
          z-index: 40;
          pointer-events: none;
        `
            document.body.appendChild(clone)

            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.35,
              onComplete() {
                enableScroll()
                onComplete()
              },
            })
          }
        })

      } else {
        const target = document.querySelector('#navbar-logo-target')
        if (!target) {
          if (!containerRef.current) return
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete() {
              enableScroll()
              onComplete()
            },
          })
          return
        }

        const computedSize = parseFloat(window.getComputedStyle(nameEl).fontSize)
        const nameBounds = nameEl.getBoundingClientRect()
        const targetBounds = target.getBoundingClientRect()

        const dx = targetBounds.left - nameBounds.left
        const dy = targetBounds.top - nameBounds.top
        const scale = targetBounds.width / nameBounds.width

        window.__preloaderFontSize = computedSize * scale
        window.__preloaderScale = scale

        gsap.to(nameEl, {
          x: dx,
          y: dy,
          scale,
          transformOrigin: 'top left',
          duration: 1,
          ease: 'power4.inOut',
          onComplete() {
            window.dispatchEvent(new CustomEvent('preloader-done'))
            if (!containerRef.current) return
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.35,
              onComplete() {
                enableScroll()
                onComplete()
              },
            })
          }
        })
      }
    })

  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <h1
          ref={nameRef}
          style={{
            opacity: 0,
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            letterSpacing: '-0.02em',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: 'white',
            lineHeight: 1,
            margin: 0,
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Dawood Butt
        </h1>

        <p
          ref={subtitleRef}
          style={{
            opacity: 0,
            fontSize: window.innerWidth < 768 ? '0.65rem' : '0.9rem',
            letterSpacing: window.innerWidth < 768 ? '0.5em' : '0.7em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            margin: 0,
          }}
        >
          Frontend Developer
        </p>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '48px',
        left: '32px',
        right: '32px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', olor: 'rgba(255,255,255,0.75)', }}>
            Loading
          </span>
          <span ref={percentRef} style={{ fontSize: '10px', olor: 'rgba(255,255,255,0.75)', }}>0%</span>
        </div>
        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }}>
          <div
            ref={progressLineRef}
            style={{
              height: '100%',
              background: '#00d4ff',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>
    </div>
  )
}