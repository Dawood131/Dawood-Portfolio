import { useRef, useEffect, useCallback } from 'react'
import RevealText from '../components/RevealText'
import { GraduationCap } from "lucide-react";

// 👇 Bas ye do cheezein update karni hain time pe:
// currentSemester -> har naye semester pe number badhao
// endYear -> jab degree complete ho jaye tab actual saal daal do (abhi tak null rakho)
const EDU = {
    degree: 'BS Software Engineering',
    institute: 'Virtual University of Pakistan',
    totalSemesters: 8,
    currentSemester: 0,
    startYear: 2026,
    endYear: null, // null = abhi "Present" dikhega
}

function getStatus(item) {
    if (item.currentSemester <= 0) {
        return { label: 'Starting soon', tone: 'pending' }
    }
    if (item.currentSemester >= item.totalSemesters || item.endYear) {
        return { label: 'Completed', tone: 'done' }
    }
    return { label: `Semester ${item.currentSemester}`, tone: 'active' }
}

function getYearRange(item) {
    return `${item.startYear} — ${item.endYear ?? 'Present'}`
}

// ---- Border glow hover-tracking logic (self-contained, no external component) ----
function useEdgeGlow() {
    const cardRef = useRef(null)

    const getCenter = useCallback((el) => {
        const { width, height } = el.getBoundingClientRect()
        return [width / 2, height / 2]
    }, [])

    const getEdgeProximity = useCallback((el, x, y) => {
        const [cx, cy] = getCenter(el)
        const dx = x - cx
        const dy = y - cy
        let kx = Infinity
        let ky = Infinity
        if (dx !== 0) kx = cx / Math.abs(dx)
        if (dy !== 0) ky = cy / Math.abs(dy)
        return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1)
    }, [getCenter])

    const getCursorAngle = useCallback((el, x, y) => {
        const [cx, cy] = getCenter(el)
        const dx = x - cx
        const dy = y - cy
        if (dx === 0 && dy === 0) return 0
        const radians = Math.atan2(dy, dx)
        let degrees = radians * (180 / Math.PI) + 90
        if (degrees < 0) degrees += 360
        return degrees
    }, [getCenter])

    const handlePointerMove = useCallback((e) => {
        const card = cardRef.current
        if (!card) return
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const edge = getEdgeProximity(card, x, y)
        const angle = getCursorAngle(card, x, y)
        card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`)
        card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`)
    }, [getEdgeProximity, getCursorAngle])

    return { cardRef, handlePointerMove }
}

function EduCard({ item }) {
    const revealRef = useRef(null)
    const { cardRef, handlePointerMove } = useEdgeGlow()

    useEffect(() => {
        const el = revealRef.current
        if (!el) return
        el.style.opacity = '0'
        el.style.transform = 'translateY(20px)'
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) return
            el.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.16,1,.3,1)'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            obs.unobserve(el)
        }, { threshold: 0.1 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const status = getStatus(item)

    return (
        <div ref={revealRef} className="edu-glow-wrap">
            <div
                ref={cardRef}
                onPointerMove={handlePointerMove}
                className="edu-glow-card"
            >
                <span className="edu-edge-light" />
                <div className="edu-card">
                    <div className="edu-card-icon">
                        <GraduationCap size={22} />
                    </div>
                    <div className="edu-card-body">
                        <h3 className="edu-card-degree">{item.degree}</h3>
                        <p className="edu-card-institute">{item.institute}</p>
                    </div>
                    <div className="edu-card-right">
                        <span className="edu-card-year">{getYearRange(item)}</span>
                        <span className={`edu-status-badge ${status.tone}`}>{status.label}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Education() {
    return (
        <>
            <style>{`
        .edu-section {
          position: relative;
          padding: clamp(60px,8vh,90px) 6vw;
          overflow-x: hidden;
        }

        .edu-header { margin-bottom: clamp(32px,5vh,48px); }

        .edu-eyebrow {
          display: flex; align-items: center; gap: 9px;
          font: 400 10px/1 'Space Mono', monospace;
          letter-spacing: .3em; text-transform: uppercase;
          color: rgba(255,255,255,.28); margin-bottom: 12px;
        }
        .edu-eyebrow span {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00D4FF; flex-shrink: 0;
          box-shadow: 0 0 8px 2px rgba(0,212,255,.6);
          display: inline-block;
        }
        .edu-subtitle {
          font-family: Inter, sans-serif;
          font-size: 14px; line-height: 1.75;
          color: rgba(255,255,255,0.4);
          max-width: 420px; margin-top: 14px;
        }

        /* ---- Border glow card ---- */
        .edu-glow-wrap {
          width: 100%;
          max-width: 966px;
          margin: 0 auto;
        }

        .edu-glow-card {
          --edge-proximity: 0;
          --cursor-angle: 45deg;
          --edge-sensitivity: 35;
          --color-sensitivity: 55;
          position: relative;
          border-radius: 16px;
          isolation: isolate;
          transform: translate3d(0, 0, 0.01px);
          display: grid;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.025);
          overflow: visible;
        }

        .edu-glow-card::before,
        .edu-glow-card::after,
        .edu-glow-card > .edu-edge-light {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          transition: opacity 0.25s ease-out;
          z-index: -1;
        }

        .edu-glow-card:not(:hover)::before,
        .edu-glow-card:not(:hover)::after,
        .edu-glow-card:not(:hover) > .edu-edge-light {
          opacity: 0;
          transition: opacity 0.75s ease-in-out;
        }

        .edu-glow-card::before {
          border: 1px solid transparent;
          background:
            linear-gradient(rgba(18,20,26,1) 0 100%) padding-box,
            radial-gradient(at 80% 55%, rgba(0,212,255,0.9) 0px, transparent 50%) border-box,
            radial-gradient(at 15% 20%, rgba(56,189,248,0.9) 0px, transparent 50%) border-box,
            linear-gradient(#00D4FF 0 100%) border-box;
          opacity: calc((var(--edge-proximity) - var(--color-sensitivity)) / (100 - var(--color-sensitivity)));
          mask-image:
            conic-gradient(
              from var(--cursor-angle) at center,
              black 30%, transparent 45%, transparent 70%, black 85%
            );
        }

        .edu-glow-card > .edu-edge-light {
          inset: -30px;
          pointer-events: none;
          z-index: 1;
          mask-image:
            conic-gradient(from var(--cursor-angle) at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%);
          opacity: calc((var(--edge-proximity) - var(--edge-sensitivity)) / (100 - var(--edge-sensitivity)));
          mix-blend-mode: plus-lighter;
        }

        .edu-glow-card > .edu-edge-light::before {
          content: "";
          position: absolute;
          inset: 30px;
          border-radius: inherit;
          box-shadow:
            inset 0 0 0 1px rgba(0,212,255,1),
            inset 0 0 6px 0 rgba(0,212,255,0.5),
            inset 0 0 20px 2px rgba(0,212,255,0.25),
            0 0 6px 0 rgba(0,212,255,0.5),
            0 0 25px 2px rgba(0,212,255,0.25),
            0 0 50px 4px rgba(0,212,255,0.15);
        }

        .edu-card {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          padding: clamp(22px,3.5vw,30px);
          position: relative;
          z-index: 1;
        }

        .edu-card-icon {
          width: 46px; height: 46px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.3);
          box-shadow: 0 0 20px rgba(0,212,255,0.15);
          color: #00d4ff;
        }

        .edu-card-body { flex: 1; min-width: 180px; }

        .edu-card-degree {
          margin: 0 0 4px;
          color: #edeae3;
          font: 700 clamp(1.05rem,2vw,1.3rem)/1.25 'Inter', sans-serif;
          letter-spacing: -0.02em;
        }

        .edu-card-institute {
          margin: 0;
          color: rgba(255,255,255,.45);
          font: 400 14px/1.5 'Inter', sans-serif;
        }

        .edu-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .edu-card-year {
          font: 400 12px/1 'Space Mono', monospace;
          color: rgba(255,255,255,.3);
          letter-spacing: .04em;
          white-space: nowrap;
        }

        .edu-status-badge {
          font: 600 9.5px/1 'Space Mono', monospace;
          letter-spacing: .08em; text-transform: uppercase;
          padding: 6px 13px; border-radius: 999px; border: 1px solid;
          white-space: nowrap;
        }
        .edu-status-badge.pending {
          color: #f0b429;
          border-color: rgba(240,180,41,.3);
          background: rgba(240,180,41,.08);
        }
        .edu-status-badge.active {
          color: #00d4ff;
          border-color: rgba(0,212,255,.3);
          background: rgba(0,212,255,.08);
        }
        .edu-status-badge.done {
          color: #4ade80;
          border-color: rgba(74,222,128,.3);
          background: rgba(74,222,128,.08);
        }

        /* ---- Mobile: clean stacked layout, no side scroll, no weird margins ---- */
        @media (max-width: 640px) {
          .edu-section { padding: clamp(48px,8vh,64px) 5vw; }

          .edu-glow-wrap {
            max-width: 100%;
            margin: 0;
          }

          .edu-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            padding: 20px;
          }

          .edu-card-body { min-width: 0; width: 100%; }

          .edu-card-right {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            gap: 10px;
          }

          .edu-card-year { order: 2; }
          .edu-status-badge { order: 1; }
        }
      `}</style>

            <section className="edu-section">
                <div className="edu-header">
                    <p className="edu-eyebrow">
                        <span />
                        Education
                    </p>
                    <RevealText
                        text="Academic Journey"
                        tag="h2"
                        splitType="chars"
                        delay={50}
                        duration={0.8}
                        className="font-bold text-4xl md:text-6xl"
                        textAlign="left"
                    />
                    <p className="edu-subtitle">
                        The academic foundation behind the code — still building,
                        always learning.
                    </p>
                </div>

                <EduCard item={EDU} />
            </section>
        </>
    )
}