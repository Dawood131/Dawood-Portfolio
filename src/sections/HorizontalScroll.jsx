import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const words = [
    { text: 'I', outline: false },
    { text: 'BUILD', outline: true },
    { text: 'WHAT', outline: false },
    { text: 'USERS', outline: true },
    { text: 'FEEL', outline: false },
    { text: 'NOT', outline: true },
    { text: 'JUST', outline: false },
    { text: 'SEE', outline: true },
]

export default function HorizontalScroll() {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const lineRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current
        const track = trackRef.current
        if (!section || !track) return

        const ctx = gsap.context(() => {
        const totalWidth = track.scrollWidth - window.innerWidth
const isMobile = window.innerWidth < 768

// ✅ Mobile pe last word center me roke — paddingRight se
if (isMobile) {
  track.style.paddingRight = `${window.innerWidth * 0.5}px`
}

// ✅ Recalculate after padding
const scrollWidth = track.scrollWidth - window.innerWidth

const mainAnim = gsap.to(track, {
  x: -scrollWidth,
  ease: 'none',
  paused: true,
})

ScrollTrigger.create({
  trigger: section,
  start: 'top top',
  end: () => `+=${scrollWidth}`,
  scrub: 1,
  pin: true,
  pinSpacing: true,
  anticipatePin: 1,
  invalidateOnRefresh: true,
  animation: mainAnim,
})

if (lineRef.current) {
  gsap.to(lineRef.current, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${scrollWidth}`,
      scrub: 1,
    },
  })
}

const wordEls = track.querySelectorAll('.h-word-text')

wordEls.forEach((word) => {
  const isOutline = word.dataset.outline === 'true'

  gsap.set(word, {
    color: 'rgba(255,255,255,0.08)',
    WebkitTextStroke: isOutline ? '1.5px rgba(255,255,255,0.08)' : 'none',
  })

  gsap.to(word, {
    keyframes: [
      {
        color: 'rgba(255,255,255,0.08)',
        WebkitTextStroke: isOutline ? '1.5px rgba(255,255,255,0.08)' : 'none',
        ease: 'none'
      },
      {
        color: '#00D4FF',
        WebkitTextStroke: 'none',
        ease: 'none'
      },
      {
        color: '#ffffff',
        WebkitTextStroke: 'none',
        ease: 'none'
      },
    ],
    ease: 'none',
    scrollTrigger: {
      trigger: word,
      containerAnimation: mainAnim,
      start: 'left 95%',
      end: 'left 5%',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
})

        }, section)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(60vh, 100vh, 100vh)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {/* Progress line */}
            {/* <div style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '1px',
                background: 'rgba(255,255,255,0.06)',
                zIndex: 2,
            }}>
                <div
                    ref={lineRef}
                    style={{
                        height: '100%',
                        background: '#00D4FF',
                        transformOrigin: 'left',
                        transform: 'scaleX(0)',
                        boxShadow: '0 0 8px rgba(0,212,255,0.5)',
                    }}
                />
            </div> */}

            {/* Horizontal track */}
            <div
                ref={trackRef}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6vw',
                    paddingLeft: '8vw',
                    paddingRight: '8vw',
                    willChange: 'transform',
                    whiteSpace: 'nowrap',
                }}
            >
                {words.map((w, i) => (
                    <div
                        key={i}
                        className="h-word"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6vw',
                            flexShrink: 0,
                        }}
                    >
                        <span
                            className="h-word-text"
                            data-outline={String(w.outline)}
                            style={{
                                fontSize: 'clamp(4rem, 11vw, 11rem)',
                                fontWeight: 900,
                                fontFamily: 'Inter, sans-serif',
                                letterSpacing: '-0.04em',
                                lineHeight: 1,
                                userSelect: 'none',
                                flexShrink: 0,
                            }}
                        >
                            {w.text}
                        </span>

                        {i < words.length - 1 && (
                            <div style={{
                                width: '8px', height: '8px',
                                borderRadius: '50%',
                                background: '#00D4FF',
                                flexShrink: 0,
                                opacity: 0.5,
                                boxShadow: '0 0 12px rgba(0,212,255,0.6)',
                            }} />
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}