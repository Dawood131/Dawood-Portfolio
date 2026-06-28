import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { projects } from '../data/projects'
import { setSelectedProject } from '../store/projectSlice'
import RevealText from '../components/RevealText'

function useTilt(strength = 8) {
  const ref = useRef(null)
  const onMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--tilt-x', `${(-py * strength).toFixed(2)}deg`)
    el.style.setProperty('--tilt-y', `${(px * strength).toFixed(2)}deg`)
    el.style.setProperty('--glow-x', `${(px + 0.5) * 100}%`)
    el.style.setProperty('--glow-y', `${(py + 0.5) * 100}%`)
  }
  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', `0deg`)
    el.style.setProperty('--tilt-y', `0deg`)
  }
  return { ref, onMouseMove, onMouseLeave }
}

function FeaturedProjectCard({ project }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tilt = useTilt(4)

  const handleOpen = () => {
    dispatch(setSelectedProject(project))
    navigate(`/project/${project.id}`)
  }

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onClick={handleOpen}
      className="feat-card"
      style={{
        '--accent': project.color,
        background: `radial-gradient(140% 140% at var(--glow-x,20%) var(--glow-y,10%), ${project.color}38, ${project.color}0d 45%, #0a0b0d 78%)`,
      }}
    >
      <span className="feat-ghost-num">{project.num}</span>

      <div className="feat-row">
        <div className="feat-text-col">
          <span className="feat-category-pill" style={{ borderColor: `${project.color}55`, color: project.color }}>
            {project.category}
          </span>
          <h3 className="feat-title">{project.title}</h3>
          <p className="feat-subtitle">{project.subtitle}</p>
          <p className="feat-desc">{project.description}</p>

          <div className="feat-tech-row">
            {project.tech.map((t) => (
              <span key={t} className="feat-tech-tag">{t}</span>
            ))}
          </div>

          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="feat-live-btn"
            style={{ borderColor: project.color, color: project.color }}
            onClick={(e) => e.stopPropagation()}
          >
            View Live
            <svg width="12" height="12" viewBox="0 0 11 11" fill="none">
              <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="feat-img-col">
          <img src={project.img} alt={project.title} loading="lazy" />
        </div>
      </div>
    </div>
  )
}

function CompactProjectCard({ project }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tilt = useTilt(6)

  const handleOpen = () => {
    dispatch(setSelectedProject(project))
    navigate(`/project/${project.id}`)
  }

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onClick={handleOpen}
      className="compact-card"
      style={{ '--accent': project.color }}
    >
      <div
        className="compact-panel"
        style={{
          background: `radial-gradient(130% 130% at var(--glow-x,25%) var(--glow-y,10%), ${project.color}40, ${project.color}10 45%, #0a0b0d 78%)`,
        }}
      >
        <span className="compact-num">{project.num}</span>
        <img className="compact-img" src={project.img} alt={project.title} loading="lazy" />

        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="compact-live-icon"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Open ${project.title} live site`}
        >
          <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
            <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <div className="compact-meta">
        <h3 className="compact-title">{project.title}</h3>
        <div className="compact-tags-row">
          <span className="compact-category-pill" style={{ borderColor: `${project.color}55`, color: project.color }}>
            {project.category}
          </span>
          <span className="compact-subtitle">{project.subtitle}</span>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(() => {
    const unique = [...new Set(projects.map((p) => p.category))]
    return ['All', ...unique]
  }, [])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  return (
    <>
      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .projects-page-section {
          position: relative;
          padding: clamp(110px, 14vh, 160px) 6vw clamp(80px, 10vh, 120px);
          overflow: hidden;
        }

        .projects-page-glow {
          position: absolute;
          top: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 70vw;
          height: 60vh;
          background: #00D4FF;
          filter: blur(150px);
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
        }

        .projects-page-header { position: relative; z-index: 1; margin-bottom: clamp(36px, 5vh, 52px); }

        .projects-page-eyebrow {
          display: flex; align-items: center; gap: 10px;
          font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); font-family: Inter, sans-serif; margin-bottom: 10px;
        }

        .projects-page-sub {
          margin-top: 14px; max-width: 460px; font-size: 13.5px; line-height: 1.7;
          color: rgba(255,255,255,0.45); font-family: Inter, sans-serif;
        }

        .projects-filters {
          position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 10px;
          margin-bottom: clamp(40px, 6vh, 56px);
        }

        .projects-filter-btn {
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px; padding: 10px 20px; cursor: pointer;
          transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
        }
        .projects-filter-btn:hover { border-color: rgba(0,212,255,0.4); color: #00D4FF; }
        .projects-filter-btn.is-active { background: #edeae3; border-color: #edeae3; color: #0d0d0d; }

        .bento-stack {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: clamp(28px, 4vh, 40px);
        }

        .bento-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(24px, 3vw, 32px);
        }
        @media (min-width: 860px) {
          .bento-row { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── featured (large, horizontal) card ── */
        .feat-card {
          position: relative;
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.08);
          padding: clamp(32px, 4.5vw, 56px);
          overflow: hidden;
          cursor: pointer;
          animation: card-in 0.55s cubic-bezier(0.16,1,0.3,1) both;
          transform: perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
          transition: border-color 0.3s ease, transform 0.15s ease-out;
          will-change: transform;
        }
        .feat-card:hover { border-color: var(--accent); }

        .feat-ghost-num {
          position: absolute;
          top: -2vw;
          right: 1vw;
          font-family: Inter, sans-serif;
          font-weight: 800;
          font-size: clamp(6rem, 14vw, 13rem);
          color: rgba(255,255,255,0.035);
          line-height: 1;
          pointer-events: none;
          z-index: 0;
          user-select: none;
        }

        .feat-row {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column-reverse;
          gap: clamp(28px, 4vw, 44px);
        }
        @media (min-width: 860px) {
          .feat-row { flex-direction: row; align-items: center; }
        }

        .feat-text-col { flex: 1; min-width: 0; }
        .feat-img-col {
          flex: 1.1;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feat-img-col img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 12px;
          filter: drop-shadow(0 35px 50px rgba(0,0,0,0.55));
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .feat-card:hover .feat-img-col img { transform: scale(1.02) translateY(-4px); }

        .feat-category-pill {
          display: inline-block;
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          font-family: 'Space Mono', monospace; font-weight: 500;
          border: 1px solid; padding: 5px 13px; border-radius: 999px;
          background: rgba(255,255,255,0.03);
          margin-bottom: 18px;
        }

        .feat-title {
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 800; color: #fff; letter-spacing: -0.03em;
          line-height: 1.05; font-family: Inter, sans-serif; margin: 0 0 8px;
        }

        .feat-subtitle {
          font-size: 13.5px; color: rgba(255,255,255,0.45);
          font-family: Inter, sans-serif; margin: 0 0 18px;
        }

        .feat-desc {
          font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.55);
          font-family: Inter, sans-serif; margin: 0 0 22px; max-width: 440px;
        }

        .feat-tech-row { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 26px; }
        .feat-tech-tag {
          font-size: 9.5px; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.1);
          padding: 5px 11px; border-radius: 7px; font-family: Inter, sans-serif;
          font-weight: 500; background: rgba(255,255,255,0.04);
        }

        .feat-live-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11.5px; letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none; font-family: Inter, sans-serif; font-weight: 700;
          padding: 12px 20px 12px 22px; border-radius: 999px; border: 1px solid;
          background: rgba(255,255,255,0.03);
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .feat-live-btn:hover { transform: translateY(-2px); background: rgba(255,255,255,0.06); }
        .feat-live-btn svg { transition: transform 0.3s ease; }
        .feat-live-btn:hover svg { transform: translate(2px, -2px); }

        /* ── compact (vertical) card ── */
        .compact-card {
          cursor: pointer;
          animation: card-in 0.55s cubic-bezier(0.16,1,0.3,1) both;
          transform: perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
          transition: transform 0.15s ease-out;
          will-change: transform;
        }

        .compact-panel {
          position: relative;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          padding: clamp(26px, 3.4vw, 36px) clamp(26px, 3.4vw, 36px) clamp(20px, 2.6vw, 26px);
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          min-height: clamp(280px, 36vw, 380px);
          transition: border-color 0.3s ease;
        }
        .compact-card:hover .compact-panel { border-color: var(--accent); }

        .compact-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: auto;
          max-height: 70%;
          object-fit: contain;
          display: block;
          border-radius: 10px;
          filter: drop-shadow(0 30px 40px rgba(0,0,0,0.55));
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .compact-card:hover .compact-img { transform: translateY(-4px) scale(1.02); }

        .compact-num {
          position: absolute; top: 16px; left: 18px; z-index: 2;
          font-family: 'Space Mono', monospace; font-size: 10.5px;
          letter-spacing: 0.1em; color: rgba(255,255,255,0.55);
        }

        .compact-live-icon {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 50%;
          color: rgba(255,255,255,0.7); background: rgba(0,0,0,0.35);
          backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.12);
          opacity: 0; transform: translateY(-4px);
          transition: opacity 0.25s ease, transform 0.25s ease, border-color 0.25s ease, color 0.25s ease;
        }
        .compact-card:hover .compact-live-icon { opacity: 1; transform: translateY(0); }
        .compact-live-icon:hover { border-color: var(--accent); color: var(--accent); }

        .compact-meta { padding: 18px 4px 0; }
        .compact-title {
          font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -0.02em;
          font-family: Inter, sans-serif; margin: 0 0 9px;
        }
        .compact-tags-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .compact-category-pill {
          font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: 'Space Mono', monospace; font-weight: 500; border: 1px solid;
          padding: 4px 11px; border-radius: 999px; background: rgba(255,255,255,0.03);
        }
        .compact-subtitle { font-size: 12.5px; color: rgba(255,255,255,0.4); font-family: Inter, sans-serif; }

        .masonry-empty {
          position: relative; z-index: 1; text-align: center; padding: 60px 20px;
          color: rgba(255,255,255,0.35); font-family: Inter, sans-serif; font-size: 14px;
        }
      `}</style>

      <section className="projects-page-section">
        <div className="projects-page-glow" aria-hidden="true" />

        <div className="projects-page-header">
          <p className="projects-page-eyebrow">
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%', background: '#00D4FF',
              display: 'inline-block', boxShadow: '0 0 8px 2px rgba(0,212,255,0.6)',
            }} />
            All Work
          </p>
          <RevealText
            text="PROJECTS"
            tag="h1"
            splitType="words"
            textAlign="left"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.4rem, 6vw, 4.6rem)',
              color: '#fff',
              letterSpacing: '-0.035em',
              lineHeight: 1,
            }}
          />
          <p className="projects-page-sub">
            A collection of things I've built — from full-stack tools to
            e-commerce frontends and practical UI work.
          </p>
        </div>

        <div className="projects-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`projects-filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="bento-stack" key={activeCategory}>
            {(() => {
              const rows = []
              let i = 0
              while (i < filtered.length) {
                // every 3rd group: one big featured card, then up to 2
                // compact cards side by side — gives the rhythm of the
                // layout variety without needing a packing algorithm
                rows.push(<FeaturedProjectCard key={filtered[i].id} project={filtered[i]} />)
                i += 1
                const pair = filtered.slice(i, i + 2)
                if (pair.length) {
                  rows.push(
                    <div className="bento-row" key={`row-${filtered[i]?.id ?? i}`}>
                      {pair.map((p) => <CompactProjectCard key={p.id} project={p} />)}
                    </div>
                  )
                  i += pair.length
                }
              }
              return rows
            })()}
          </div>
        ) : (
          <p className="masonry-empty">No projects in this category yet.</p>
        )}
      </section>
    </>
  )
}