import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

function splitText(text, splitType) {
  if (splitType === 'chars') {
    return text.split('').map((c) => (c === ' ' ? '\u00A0' : c))
  }
  return text.split(' ')
}

export default function RevealText({
  text,
  tag = 'h2',
  className = '',
  splitType = 'words',
  delay = 45,
  duration = 1,
  ease = 'power4.out',
  textAlign = 'left',
  restColor = '#edeae3',
  inkColor = '#00D4FF',
  threshold = 0.2,
  rootMargin = '0px',
  once = true,
  onComplete,
}) {
  const containerRef = useRef(null)
  const playedRef = useRef(false)
  const pieces = splitText(text, splitType)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const targets = el.querySelectorAll('.reveal-piece')

    const setInitial = () =>
      gsap.set(targets, {
        opacity: 0,
        y: '65%',
        rotateX: -75,
        filter: 'blur(9px)',
        color: inkColor,
      })

    setInitial()

    const play = () => {
      if (once && playedRef.current) return
      playedRef.current = true
      gsap.to(targets, {
        opacity: 1,
        y: '0%',
        rotateX: 0,
        filter: 'blur(0px)',
        color: restColor,
        duration,
        ease,
        stagger: delay / 1000,
        onComplete,
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            play()
            if (once) observer.unobserve(el)
          } else if (!once) {
            playedRef.current = false
            setInitial()
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [text, splitType, delay, duration, ease, threshold, rootMargin, once, restColor, inkColor])

  const Tag = tag

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{ textAlign, perspective: '700px', display: 'block' }}
    >
      {pieces.map((piece, i) => (
        <span
          key={i}
          className="reveal-piece"
          style={{
            display: 'inline-block',
            transformOrigin: '50% 100%',
            willChange: 'transform, opacity, filter, color',
            marginRight: splitType === 'words' ? '0.28em' : 0,
          }}
        >
          {piece}
        </span>
      ))}
    </Tag>
  )
}