import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { projects } from '../data/projects'
import { getLenis } from '../lib/lenis'
import { setSelectedProject } from '../store/projectSlice'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const NAV_H = 80
const CARD_TOP = NAV_H + 8
const CARD_HEIGHT = `calc(100vh - ${CARD_TOP + 8}px)`
const CARD_BG = '#0a0c0e'

function ProjectCard({ project }) {
  return (
    <>
      <div className="proj-card-bg" />
      <div className="proj-card-vignette" />

      <div className="proj-content">
        <div className="proj-top-row">
          <div className="proj-text-col">
            <span className="proj-eyebrow">
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: project.color, display: 'inline-block' }} />
              {project.subtitle}
            </span>
            <h3 className="proj-title">{project.title}</h3>
            <p className="proj-desc">{project.description}</p>
            <div className="proj-tech-list">
              {project.tech.map((t, j) => (
                <span key={j} className="proj-tech-tag">{t}</span>
              ))}
            </div>
          </div>

          <div className="proj-img-frame">
            <img className="proj-img" src={project.img} alt={project.title} loading="lazy" />
          </div>
        </div>
      </div>

      <span className="proj-num-badge">
        {project.num}/{String(projects.length).padStart(2, '0')}
      </span>

      {/* stopPropagation so clicking "Live" opens the external link
          instead of also triggering the card's navigate-to-detail click */}
      <a
        href={project.live}
        target="_blank"
        rel="noopener noreferrer"
        className="proj-live-btn"
        style={{ color: '#000', borderColor: project.color, background: project.color }}
        onClick={(e) => e.stopPropagation()}
      >
        Live
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </>
  )
}

export default function Projects() {
  const introRef = useRef(null)
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const glowRefs = useRef([])
  const tlRef = useRef(null)
  const [active, setActive] = useState(0)
  const total = projects.length
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleCardClick = useCallback((project) => {
    dispatch(setSelectedProject(project))
    navigate(`/project/${project.id}`)
  }, [dispatch, navigate])

  const scrollToY = useCallback((y, opts) => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(y, { duration: 1.2, ...opts })
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [])

  const goTo = useCallback((i) => {
    const st = tlRef.current?.scrollTrigger
    if (i === 0) {
      if (st) {
        scrollToY(st.start)
      } else {
        introRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }
    if (!st || total <= 1) return
    const frac = (i - 1) / (total - 1)
    const y = st.start + frac * (st.end - st.start)
    scrollToY(y)
  }, [total, scrollToY])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const cards = cardsRef.current.filter(Boolean)
        const glows = glowRefs.current.filter(Boolean)
        const n = cards.length
        if (n === 0) return

        if (reduceMotion || n <= 1) {
          cards.forEach((card) => gsap.set(card, { yPercent: 0, scale: 1, opacity: 1 }))
          return
        }

        cards.forEach((card, i) => {
          gsap.set(card, {
            yPercent: i === 0 ? 0 : 105,
            scale: 1,
            zIndex: i + 1,
            transformOrigin: 'top center',
            force3D: true,
          })
        })

        glows.forEach((g, i) => gsap.set(g, { opacity: i === 0 ? 0.14 : 0 }))

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${window.innerHeight * n}`,
            pin: true,
            pinType: 'transform',
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(n - 1, Math.round(self.progress * (n - 1)))
              setActive((prev) => (prev === idx ? prev : idx))
            },
          },
        })
        tlRef.current = tl

        for (let i = 1; i < n; i++) {
          const pos = i - 1
          tl.to(cards[i], { yPercent: 0, duration: 0.8, ease: 'none' }, pos)
          tl.to(cards[i - 1], { scale: 0.88, yPercent: -8, duration: 0.8, ease: 'none' }, pos)
          if (glows[i - 1] && glows[i]) {
            tl.to(glows[i - 1], { opacity: 0, duration: 0.8, ease: 'none' }, pos)
            tl.to(glows[i], { opacity: 0.14, duration: 0.8, ease: 'none' }, pos)
          }
        }

        tl.to({}, { duration: 0.5 })
      }, sectionRef)

      return () => ctx.revert()
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <style>{`
        .proj-card-wrap {
          position: absolute;
          left: 4vw;
          right: 4vw;
          border-radius: 26px;
          overflow: hidden;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          isolation: isolate;
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow:
            0 40px 90px -28px rgba(0,0,0,0.7),
            inset 0 1px 0 rgba(255,255,255,0.06);
          --pad: clamp(26px, 3.2vw, 48px);
          cursor: pointer;
        }

        .proj-card-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(36% 42% at 4% 0%, var(--accent-soft) 0%, transparent 72%),
            radial-gradient(40% 46% at 100% 100%, var(--accent-soft-2) 0%, transparent 72%),
            linear-gradient(155deg, rgba(255,255,255,0.04) 0%, transparent 30%);
        }

        .proj-card-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.14;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .proj-card-vignette {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          box-shadow:
            inset 0 -90px 110px -60px rgba(0,0,0,0.55),
            inset 0 80px 100px -70px rgba(0,0,0,0.35);
        }

        .proj-card-wrap:hover {
          border-color: var(--accent-border-hover);
        }

        .proj-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--pad);
        }

        .proj-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 30px;
        }

        .proj-text-col {
          display: flex;
          flex-direction: column;
          max-width: 46%;
          padding-top: clamp(4px, 1vw, 14px);
        }

        .proj-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(12px, 1.3vw, 15px);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-family: Inter, sans-serif;
          font-weight: 700;
          margin-bottom: 22px;
          color: var(--accent);
        }

        .proj-title {
          font-size: clamp(3rem, 5.4vw, 5.4rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.035em;
          line-height: 0.96;
          font-family: Inter, sans-serif;
          margin-bottom: 20px;
        }

        .proj-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          line-height: 1.65;
          font-family: Inter, sans-serif;
          font-weight: 400;
          margin-bottom: 22px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        .proj-tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .proj-tech-tag {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 5px 11px;
          border-radius: 7px;
          font-family: Inter, sans-serif;
          font-weight: 500;
          background: rgba(255,255,255,0.04);
        }

        .proj-img-frame {
          position: relative;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          overflow: hidden;
          border-radius: 8px;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform;
        }

        @media (min-width: 1024px) {
          .proj-img-frame {
            transform: translateX(130px) translateZ(0);
          }
        }

        .proj-img {
          width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        @media (min-width: 1024px) {
          .proj-img {
            width: 80%;
            height: 80%;
          }
        }

        .proj-num-badge {
          position: absolute;
          left: var(--pad);
          bottom: var(--pad);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.32);
          font-family: Inter, sans-serif;
          font-weight: 600;
          z-index: 3;
        }

        .proj-live-btn {
          position: absolute;
          right: var(--pad);
          bottom: var(--pad);
          z-index: 3;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          font-family: Inter, sans-serif;
          font-weight: 700;
          padding: 12px 20px 12px 22px;
          border-radius: 999px;
          border: 1px solid;
          transition: transform 0.25s, box-shadow 0.3s;
          white-space: nowrap;
        }

        .proj-live-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -6px var(--accent-soft);
        }

        .proj-live-btn svg { transition: transform 0.3s ease; }
        .proj-live-btn:hover svg { transform: translate(2px, -2px); }

        .proj-dots { display: flex; flex-direction: column; gap: 14px; }
        .proj-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.18); border: none; padding: 0;
          cursor: pointer; transition: background 0.3s, height 0.3s, border-radius 0.3s;
        }
        .proj-dot.is-active { background: #fff; height: 22px; border-radius: 3px; }
        .proj-dots-mobile { display: none; }

        .proj-scroll-hint {
          display: flex; align-items: center; gap: 10px;
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.32); font-family: Inter, sans-serif;
        }

        @keyframes proj-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        @media (max-width: 768px) {
          .proj-dots-desktop { display: none !important; }
          .proj-dots-mobile { display: flex !important; }
          .proj-scroll-hint { display: none; }

          .proj-card-wrap {
            left: 3vw; right: 3vw; border-radius: 20px; --pad: 20px;
            box-shadow: 0 16px 40px -16px rgba(0,0,0,0.6);
          }
          .proj-content { padding-bottom: calc(var(--pad) + 46px); justify-content: flex-start; }

          .proj-top-row { flex-direction: column; gap: 18px; }
          .proj-text-col { max-width: 100%; order: 2; }
          .proj-img-frame {
            order: 1;
            justify-content: center;
            height: 210px;
            margin: calc(-1 * var(--pad)) calc(-1 * var(--pad)) 0;
            width: calc(100% + var(--pad) * 2);
          }
          .proj-img { width: 100%; height: 100%; }

          .proj-title { font-size: 2.3rem; margin-bottom: 10px; }
          .proj-desc { -webkit-line-clamp: 3; margin-bottom: 14px; }

          .proj-card-bg::after {
            mix-blend-mode: normal;
            opacity: 0.05;
          }
        }
      `}</style>

      <section
        ref={introRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: `${CARD_TOP}px 6vw 64px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-60%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70vw',
            height: '70vh',
            borderRadius: '50%',
            filter: 'blur(140px)',
            opacity: 0.14,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', marginBottom: '10px',
            fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%', background: '#00D4FF',
              display: 'inline-block', boxShadow: '0 0 8px 2px rgba(0,212,255,0.6)',
            }} />
            Selected Work
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, color: 'white',
            letterSpacing: '-0.035em', lineHeight: 1, fontFamily: 'Inter, sans-serif',
          }}>
            PROJECTS
          </h2>
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            to="/projects"
            style={{
              fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontFamily: 'Inter, sans-serif',
              borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px',
              transition: 'color 0.3s, border-color 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#00D4FF'; e.currentTarget.style.borderColor = '#00D4FF' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          >
            View All →
          </Link>
        </div>
      </section>

      <section
        ref={sectionRef}
        style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
      >
        {projects.map((project, i) => (
          <div
            key={`glow-${project.id}`}
            ref={el => (glowRefs.current[i] = el)}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70vw',
              height: '70vh',
              borderRadius: '50%',
              filter: 'blur(140px)',
              opacity: i === 0 ? 0.14 : 0,
              pointerEvents: 'none',
              zIndex: 0,
              willChange: 'opacity',
            }}
          />
        ))}

        <div className="proj-dots-desktop" style={{ position: 'absolute', right: '2.2vw', top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}>
          <div className="proj-dots">
            {projects.map((p, i) => (
              <button key={p.id} className={`proj-dot ${i === active ? 'is-active' : ''}`} onClick={() => goTo(i)} aria-label={`Go to ${p.title}`} aria-current={i === active} />
            ))}
          </div>
        </div>

        <div className="proj-dots-mobile" style={{ position: 'absolute', left: 0, right: 0, bottom: '14px', justifyContent: 'center', gap: '8px', zIndex: 100 }}>
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => goTo(i)}
              aria-label={`Go to ${p.title}`}
              aria-current={i === active}
              style={{
                width: i === active ? '20px' : '6px', height: '6px', borderRadius: '3px',
                border: 'none', padding: 0, cursor: 'pointer',
                background: i === active ? '#fff' : 'rgba(255,255,255,0.25)', transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={el => (cardsRef.current[i] = el)}
            className="proj-card-wrap"
            onClick={() => handleCardClick(project)}
            style={{
              top: CARD_TOP,
              height: CARD_HEIGHT,
              background: CARD_BG,
              '--accent': project.color,
              '--accent-soft': `${project.color}26`,
              '--accent-soft-2': `${project.color}16`,
              '--accent-border-hover': `${project.color}55`,
              ...(i === 0 ? { transform: 'translateY(0%)' } : {}),
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </section>
    </>
  )
}