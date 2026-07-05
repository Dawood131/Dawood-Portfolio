import { useState, useRef, useEffect, useMemo } from 'react'
import { experience } from '../data/experience'
import RevealText from '../components/RevealText'

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
}

function parseMonthYear(str) {
  const [monthName, year] = str.trim().split(/\s+/)
  const m = MONTHS[monthName.toLowerCase()]
  if (m === undefined || !year) return null
  return new Date(parseInt(year, 10), m, 1)
}

function parseDuration(durationStr, now) {
  const [startStr, endStr] = durationStr.split('—').map((s) => s.trim())
  const start = parseMonthYear(startStr)
  let end
  if (!endStr || /present/i.test(endStr)) {
    end = now
  } else {
    const endStart = parseMonthYear(endStr)
    end = endStart ? new Date(endStart.getFullYear(), endStart.getMonth() + 1, 0) : now
  }
  if (!start) return 0
  return Math.max(0, end - start)
}

// Sums real elapsed ms across every role (handles "Present" against the
// actual current date) then converts to a Y/M/D readable breakdown.
function useExperienceStats(items) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    // re-derive periodically so an open tab keeps counting forward
    const id = setInterval(() => setNow(new Date()), 1000 * 60 * 60)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    const totalMs = items.reduce((sum, item) => sum + parseDuration(item.duration, now), 0)
    const totalDays = totalMs / (1000 * 60 * 60 * 24)

    const years = Math.floor(totalDays / 365.25)
    const afterYears = totalDays - years * 365.25
    const months = Math.floor(afterYears / 30.44)
    const days = Math.max(0, Math.round(afterYears - months * 30.44))

    // Use "yr" / "mo" / "d" instead of bare single letters — "m" alone
    // reads as minutes at a glance, "mo" doesn't.
    const parts = []
    if (years > 0) parts.push(`${years}yr`)
    if (months > 0 || years > 0) parts.push(`${months}mo`)
    parts.push(`${days}d`)

    return { label: parts.join(' '), years, months, days }
  }, [items, now])
}

function Chevron({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        flexShrink: 0,
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// Deterministic gradient + initial, used whenever a real logo is missing
// or fails to load — so the marker never looks broken/empty.
const MONOGRAM_GRADIENTS = [
  ['#00D4FF', '#7C3AED'],
  ['#4ade80', '#06b6d4'],
  ['#f472b6', '#6366f1'],
  ['#fb923c', '#ef4444'],
]

function getMonogramGradient(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return MONOGRAM_GRADIENTS[hash % MONOGRAM_GRADIENTS.length]
}

function LogoMarker({ item }) {
  const [failed, setFailed] = useState(false)
  const isActive = item.status === 'active'
  const showLogo = item.logo && !failed
  const [from, to] = getMonogramGradient(item.company)

  return (
    <span className={`exp-tl-dot ${isActive ? 'is-active' : ''}`}>
      {isActive && <span className="exp-tl-dot-ring" />}
      {showLogo ? (
        <img
          src={item.logo}
          alt={`${item.company} logo`}
          className="exp-tl-logo-img"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="exp-tl-monogram"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          {item.company.charAt(0)}
        </span>
      )}
    </span>
  )
}

function ExperienceItem({ item, index, isLast, isOpen, onToggle }) {
  const headRef = useRef(null)
  const isActive = item.status === 'active'

  const handleMove = (e) => {
    const el = headRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div className={`exp-tl-item ${isOpen ? 'is-open' : ''}`}>
      <div className="exp-tl-marker">
        <LogoMarker item={item} />
        {!isLast && <span className="exp-tl-line" />}
      </div>

      <div className="exp-tl-card">
        <button
          ref={headRef}
          className="exp-tl-head"
          onMouseMove={handleMove}
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <span className="exp-spotlight" aria-hidden="true" />

          <div className="exp-tl-main">
            <div className="exp-tl-title-row">
              <h3 className="exp-tl-company">{item.company}</h3>
              <span className={`exp-badge ${isActive ? 'is-active' : 'is-done'}`}>
                {isActive ? 'Active' : 'Completed'}
              </span>
            </div>
            <p className="exp-tl-role">{item.role}</p>
            <p className="exp-tl-duration">{item.duration}</p>
          </div>

          <Chevron open={isOpen} />
        </button>

        <div className="exp-tl-collapse">
          <div>
            <div className="exp-tl-body">
              <p className="exp-desc">{item.description}</p>
              <ul className="exp-bullets">
                {item.bullets.map((b, i) => (
                  <li key={i}>
                    <span className="exp-bullet-arrow">▸</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  const [openIndex, setOpenIndex] = useState(0)
  const stats = useExperienceStats(experience)
  const current = experience.find((e) => e.status === 'active')

  return (
    <>
      <style>{`
        .exp-section {
          position: relative;
          padding: clamp(60px, 10vh, 120px) 6vw;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .exp-glow {
          position: absolute;
          top: 5%;
          left: 50%;
          transform: translateX(-50%);
          width: 60vw;
          height: 50vh;
          filter: blur(150px);
          opacity: 0.07;
          pointer-events: none;
          z-index: 0;
        }

        /* ── header: sits at the extreme left edge of the section's
           padding, exactly like the Skills section heading — no
           max-width, no centering, just align-self: flex-start ── */
        .exp-header {
          position: relative;
          z-index: 1;
          align-self: flex-start;
          width: 100%;
          margin-bottom: clamp(64px, 4vh, 36px);
          text-align: left;
        }

        .exp-eyebrow {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-family: 'Space Mono', monospace;
          margin-bottom: 10px;
        }

        .exp-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00D4FF;
          box-shadow: 0 0 8px 2px rgba(0,212,255,0.6);
          display: inline-block;
        }

        .exp-heading {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 800;
          color: white;
          letter-spacing: -0.035em;
          line-height: 1;
          font-family: Inter, sans-serif;
        }

        /* ── summary stats bar (stays centered) ── */
        .exp-stats {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(18px, 3vw, 36px);
          margin-bottom: clamp(36px, 6vh, 56px);
          padding: 14px clamp(20px, 3vw, 32px);
          border-radius: 16px;
          border: 1px solid rgba(0,212,255,0.16);
          background: linear-gradient(155deg, rgba(12,15,18,0.85), rgba(8,9,11,0.85));
          box-shadow: 0 20px 50px -20px rgba(0,0,0,0.6);
          flex-wrap: wrap;
        }

        .exp-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 70px;
        }

        .exp-stat-value {
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: clamp(15px, 1.8vw, 18px);
          color: #00D4FF;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .exp-stat-label {
          font-family: Inter, sans-serif;
          font-size: 10.5px;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .exp-stat-divider {
          width: 1px;
          height: 28px;
          background: rgba(255,255,255,0.1);
        }

        .exp-timeline {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        .exp-tl-item {
          position: relative;
          display: flex;
          gap: 20px;
        }

        /* ── left rail: logo marker + connecting line ── */
        .exp-tl-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 34px;
          padding-top: 14px;
        }

        .exp-tl-dot {
          position: relative;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #11151a;
          border: 2px solid rgba(255,255,255,0.16);
          box-shadow: 0 0 0 4px #0a0c0e;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .exp-tl-dot.is-active {
          border-color: #4ade80;
          box-shadow: 0 0 0 4px #0a0c0e, 0 0 14px rgba(74,222,128,0.5);
        }

        /* object-fit: contain inside a fully-filled circle means any
           logo shape — round, square, or rectangular — letterboxes
           cleanly inside the dot with no cropping or stretching */
        .exp-tl-logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          border-radius: 50%;
          background: rgba(255,255,255,0.96);
          padding: 5px;
          box-sizing: border-box;
        }

        .exp-tl-monogram {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Inter, sans-serif;
          font-weight: 800;
          font-size: 14px;
          color: #fff;
          text-transform: uppercase;
        }

        .exp-tl-dot-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1.5px solid #4ade80;
          animation: exp-dot-pulse 2s ease-out infinite;
          z-index: -1;
        }

        @keyframes exp-dot-pulse {
          0%   { transform: scale(0.85); opacity: 0.9; }
          100% { transform: scale(1.45); opacity: 0; }
        }

        .exp-tl-line {
          width: 2px;
          flex: 1;
          margin-top: 6px;
          background: linear-gradient(180deg, rgba(0,212,255,0.35), rgba(255,255,255,0.06));
        }

        /* ── card ── */
        .exp-tl-card {
          flex: 1;
          min-width: 0;
          margin-bottom: 14px;
          border-radius: 16px;
          background: linear-gradient(155deg, #0e1114 0%, #0a0b0d 100%);
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .exp-tl-item.is-open .exp-tl-card {
          border-color: rgba(0,212,255,0.35);
        }

        .exp-tl-head {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 22px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          overflow: hidden;
          color: rgba(0,212,255,0.6);
        }

        .exp-spotlight {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0;
          pointer-events: none;
          background: radial-gradient(
            circle at var(--spot-x, 50%) var(--spot-y, 50%),
            rgba(0,212,255,0.1),
            transparent 60%
          );
          transition: opacity 0.3s ease;
        }
        .exp-tl-head:hover .exp-spotlight { opacity: 1; }

        .exp-tl-main {
          position: relative;
          z-index: 1;
          min-width: 0;
        }

        .exp-tl-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 3px;
        }

        .exp-tl-company {
          font-family: Inter, sans-serif;
          font-weight: 800;
          font-size: clamp(17px, 2vw, 20px);
          color: #fff;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .exp-badge {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid;
          flex-shrink: 0;
        }

        .exp-badge.is-active {
          color: #4ade80;
          border-color: rgba(74,222,128,0.4);
          background: rgba(74,222,128,0.1);
        }

        .exp-badge.is-done {
          color: rgba(255,255,255,0.55);
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.03);
        }

        .exp-tl-role {
          font-family: Inter, sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          margin: 0 0 4px;
        }

        .exp-tl-duration {
          font-family: 'Space Mono', monospace;
          font-size: 11.5px;
          color: rgba(255,255,255,0.38);
          margin: 0;
        }

        /* ── grid-rows accordion collapse ── */
        .exp-tl-collapse {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .exp-tl-item.is-open .exp-tl-collapse {
          grid-template-rows: 1fr;
        }
        .exp-tl-collapse > div {
          overflow: hidden;
          min-height: 0;
        }

        .exp-tl-body {
          padding: 0 22px 22px;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 16px;
          margin-top: -1px;
          animation: exp-body-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes exp-body-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .exp-desc {
          font-size: 13.5px;
          line-height: 1.7;
          color: rgba(255,255,255,0.55);
          font-family: Inter, sans-serif;
          margin: 0 0 14px;
        }

        .exp-bullets {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .exp-bullets li {
          font-family: 'Space Mono', monospace;
          font-size: 12.5px;
          color: rgba(255,255,255,0.62);
          line-height: 1.6;
          display: flex;
          gap: 8px;
        }

        .exp-bullet-arrow { color: #00D4FF; flex-shrink: 0; }

        @media (max-width: 600px) {
          .exp-section { padding: clamp(48px, 8vh, 80px) 5vw 60px; }

          .exp-tl-item { gap: 14px; }
          .exp-tl-marker { width: 26px; padding-top: 12px; }
          .exp-tl-dot { width: 26px; height: 26px; }
          .exp-tl-logo-img { padding: 4px; }
          .exp-tl-monogram { font-size: 12px; }

          .exp-tl-card { margin-bottom: 12px; border-radius: 14px; }
          .exp-tl-head { padding: 14px 16px; gap: 10px; }
          .exp-tl-title-row { gap: 6px; margin-bottom: 2px; }
          .exp-tl-company { font-size: 16px; }
          .exp-badge { font-size: 9px; padding: 2px 8px; }
          .exp-tl-role { font-size: 12.5px; }
          .exp-tl-duration { font-size: 11px; }

          .exp-tl-body { padding: 0 16px 18px; padding-top: 14px; }
          .exp-desc { font-size: 13px; margin-bottom: 12px; }
          .exp-bullets { gap: 7px; }
          .exp-bullets li { font-size: 12px; gap: 7px; line-height: 1.55; }

          .exp-stats { gap: 14px; padding: 12px 16px; }
          .exp-stat { min-width: 60px; }
        }

        /* very small phones: stack the stats bar so nothing squeezes */
       @media (max-width: 480px) {
  .exp-stats {
    gap: 10px;
    padding: 12px 14px;
  }
  .exp-stat {
    min-width: 0;
    flex: 1;
  }
  .exp-stat-value {
    font-size: 12px;
    max-width: 100%;
  }
  .exp-stat-label {
    font-size: 8.5px;
  }
  .exp-stat-divider {
    height: 22px;
  }
}
      `}</style>

      <section className="exp-section">
        <div className="exp-glow" aria-hidden="true" />

        <div className="exp-header">
          <p className="exp-eyebrow">
            <span className="exp-eyebrow-dot" />
            Career Log
          </p>
          <RevealText
            text="EXPERIENCE"
            tag="h2"
            splitType="chars"
            delay={40}
            duration={0.8}
            className="font-bold text-5xl md:text-7xl"
            textAlign="left"
          />
        </div>

        <div className="exp-stats">
          <div className="exp-stat">
            <span className="exp-stat-value">{stats.label}</span>
            <span className="exp-stat-label">Experience</span>
          </div>
          <span className="exp-stat-divider" />
          <div className="exp-stat">
            <span className="exp-stat-value">{experience.length}</span>
            <span className="exp-stat-label">Companies</span>
          </div>
          {current && (
            <>
              <span className="exp-stat-divider" />
              <div className="exp-stat">
                <span className="exp-stat-value">{current.company}</span>
                <span className="exp-stat-label">Currently At</span>
              </div>
            </>
          )}
        </div>

        <div className="exp-timeline">
          {experience.map((item, i) => (
            <ExperienceItem
              key={item.id}
              item={item}
              index={i}
              isLast={i === experience.length - 1}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </section>
    </>
  )
}