import { useRef, useState, useEffect, useCallback } from 'react'
import { skills } from '../data/skills'
import RevealText from '../components/RevealText'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'tools', label: 'Tools' },
]

const AUTO_SPEED = 0.045 
const FRICTION = 0.94
const MOMENTUM_STOP_THRESHOLD = 0.02

function getAccentColor(iconUrl) {
  let m = iconUrl.match(/simpleicons\.org\/[^/]+\/([0-9A-Fa-f]{6})/)
  if (m) return `#${m[1]}`
  m = iconUrl.match(/color=%23([0-9A-Fa-f]{6})/)
  if (m) return `#${m[1]}`
  return '#00D4FF'
}

function TechCard({ skill }) {
  const cardRef = useRef(null)
  const accent = getAccentColor(skill.icon)

  const handleMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const r = card.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rotY = (px - 0.5) * 16
    const rotX = (0.5 - py) * 16
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`
    card.style.setProperty('--mx', `${px * 100}%`)
    card.style.setProperty('--my', `${py * 100}%`)
    card.style.setProperty('--accent', accent)
  }, [accent])

  const handleLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)'
  }, [])

  return (
    <div
      ref={cardRef}
      className="tech2-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ '--accent': accent }}
    >
      <span className="tech2-card-spotlight" aria-hidden="true" />
      <div className="tech2-card-icon">
        <img src={skill.icon} alt={skill.name} loading="lazy" draggable={false} />
      </div>
      <span className="tech2-card-name">{skill.name}</span>
      <span className="tech2-card-tag">{skill.category}</span>
    </div>
  )
}

export default function TechStack() {
  const [filter, setFilter] = useState('all')
  const trackRef = useRef(null)
  const wrapRef = useRef(null)

  const posRef = useRef(0)
  const halfWidthRef = useRef(0)
  const rafRef = useRef(null)
  const draggingRef = useRef(false)
  const startXRef = useRef(0)
  const startPosRef = useRef(0)
  const velocityRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTRef = useRef(0)
  const momentumRef = useRef(0)
  const lastFrameRef = useRef(0)

  const filtered =
    filter === 'all' ? skills : skills.filter((s) => s.category === filter)
  const doubled = [...filtered, ...filtered]

  useEffect(() => {
    posRef.current = 0
    momentumRef.current = 0
    const measure = () => {
      if (trackRef.current) {
        halfWidthRef.current = trackRef.current.scrollWidth / 2
      }
    }
    const t = setTimeout(measure, 0)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [filter])

  // main animation loop
  useEffect(() => {
    lastFrameRef.current = performance.now()

    const tick = (now) => {
      const dt = now - lastFrameRef.current
      lastFrameRef.current = now
      const half = halfWidthRef.current

      if (!draggingRef.current) {
        if (Math.abs(momentumRef.current) > MOMENTUM_STOP_THRESHOLD) {
          posRef.current += momentumRef.current * dt
          momentumRef.current *= FRICTION
        } else {
          posRef.current -= AUTO_SPEED * dt
        }
      }

      if (half > 0) {
        if (posRef.current <= -half) posRef.current += half
        if (posRef.current > 0) posRef.current -= half
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${posRef.current}px)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const onPointerDown = (e) => {
    draggingRef.current = true
    momentumRef.current = 0
    startXRef.current = e.clientX
    startPosRef.current = posRef.current
    lastXRef.current = e.clientX
    lastTRef.current = performance.now()
    velocityRef.current = 0
    wrapRef.current?.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!draggingRef.current) return
    const delta = e.clientX - startXRef.current
    posRef.current = startPosRef.current + delta

    const now = performance.now()
    const dt = now - lastTRef.current
    if (dt > 0) {
      velocityRef.current = (e.clientX - lastXRef.current) / dt
    }
    lastXRef.current = e.clientX
    lastTRef.current = now
  }

  const onPointerUp = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    momentumRef.current = velocityRef.current
  }

  return (
    <>
      <style>{`
        .tech2-section {
          position: relative;
          overflow: hidden;
          padding: clamp(80px, 10vh, 120px) 0;
        }

        .tech2-glow {
          position: absolute;
          top: -10%;
          left: 10%;
          width: 45vw;
          height: 50vh;
          border-radius: 50%;
          filter: blur(160px);
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
        }

        .tech2-header {
          position: relative;
          z-index: 1;
          padding: 0 6vw;
          margin-bottom: clamp(40px, 6vh, 60px);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 24px;
        }

        .tech2-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-family: Inter, sans-serif;
          margin-bottom: 16px;
        }

        .tech2-title {
          font-family: Inter, sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 4vw, 3rem);
          letter-spacing: -0.03em;
          color: #edeae3;
          margin-bottom: 12px;
        }

        .tech2-subtitle {
          font-family: Inter, sans-serif;
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255,255,255,0.45);
          max-width: 420px;
        }

        /* ── filter tabs ── */
        .tech2-tabs {
          display: flex;
          gap: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 999px;
          padding: 5px;
          flex-shrink: 0;
        }

        .tech2-tab {
          font-family: Inter, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.5);
          background: transparent;
          border: none;
          border-radius: 999px;
          padding: 9px 18px;
          cursor: pointer;
          transition: color 0.25s ease, background 0.25s ease;
        }

        .tech2-tab.active {
          color: #000;
          background: #00D4FF;
        }

        .tech2-tab:not(.active):hover {
          color: #edeae3;
        }

        /* ── drag track ── */
        .tech2-wrap {
          position: relative;
          z-index: 1;
          overflow: hidden;
          cursor: grab;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
          touch-action: pan-y;
        }

        .tech2-wrap:active {
          cursor: grabbing;
        }

        .tech2-track {
          display: flex;
          width: max-content;
          gap: 16px;
          padding: 4px 0 4px 6vw;
          will-change: transform;
        }

        /* ── card ── */
        .tech2-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 13px;
          flex-shrink: 0;
          background: linear-gradient(155deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 18px;
          padding: 16px 26px 16px 16px;
          overflow: hidden;
          user-select: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.12s ease-out;
        }

        .tech2-card:hover {
          border-color: var(--accent);
          box-shadow: 0 18px 36px -16px color-mix(in srgb, var(--accent) 55%, transparent);
        }

        .tech2-card-spotlight {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0;
          background: radial-gradient(120px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent) 28%, transparent), transparent 70%);
          transition: opacity 0.3s ease;
        }

        .tech2-card:hover .tech2-card-spotlight {
          opacity: 1;
        }

        .tech2-card-icon {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: rgba(255,255,255,0.05);
          flex-shrink: 0;
        }

        .tech2-card-icon img {
          width: 20px;
          height: 20px;
          object-fit: contain;
          pointer-events: none;
        }

        .tech2-card-name {
          position: relative;
          z-index: 1;
          font-family: Inter, sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #edeae3;
          white-space: nowrap;
        }

        .tech2-card-tag {
          position: relative;
          z-index: 1;
          font-family: Inter, sans-serif;
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 4px 9px;
          margin-left: 4px;
          white-space: nowrap;
        }

        .tech2-hint {
          position: relative;
          z-index: 1;
          margin-top: 22px;
          padding: 0 6vw;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: Inter, sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.25);
        }

        @media (max-width: 640px) {
          .tech2-card { padding: 13px 20px 13px 12px; gap: 10px; }
          .tech2-card-icon { width: 32px; height: 32px; }
          .tech2-card-icon img { width: 17px; height: 17px; }
          .tech2-card-name { font-size: 12.5px; }
          .tech2-card-tag { display: none; }
          .tech2-track { gap: 10px; padding-left: 6vw; }
          .tech2-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <section className="tech2-section">
        <div className="tech2-glow" aria-hidden="true" />

        <div className="tech2-header">
          <div>
            <p className="tech2-eyebrow">
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%', background: '#00D4FF',
                display: 'inline-block', boxShadow: '0 0 8px 2px rgba(0,212,255,0.6)',
              }} />
              Tech Stack
            </p>
            <RevealText
              text="Tools I Work With"
              tag="h2"
              splitType="chars"
              delay={40}
              duration={0.8}
              className="font-bold text-5xl md:text-7xl"
              textAlign="left"
            />
            <p className="tech2-subtitle">
              Drag, scroll, or just let it run — a snapshot of the technologies
              I use to design and ship products.
            </p>
          </div>

          <div className="tech2-tabs">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`tech2-tab ${filter === f.id ? 'active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="tech2-wrap"
          ref={wrapRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div className="tech2-track" ref={trackRef}>
            {doubled.map((skill, i) => (
              <TechCard key={`${skill.id}-${i}`} skill={skill} />
            ))}
          </div>
        </div>

        {/* <p className="tech2-hint">← drag to explore →</p> */}
      </section>
    </>
  )
}