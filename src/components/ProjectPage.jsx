import { useState, useMemo, useRef, useCallback, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { projects } from '../data/projects'
import { setSelectedProject } from '../store/projectSlice'
import RevealText from '../components/RevealText'

/* ── tilt hook ─────────────────────────── */
function useTilt(deg = 4) {
    const ref = useRef(null)
    const raf = useRef(null)
    const onMouseMove = useCallback((e) => {
        cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(() => {
            const el = ref.current; if (!el) return
            const { left, top, width, height } = el.getBoundingClientRect()
            const x = (e.clientX - left) / width - 0.5
            const y = (e.clientY - top) / height - 0.5
            el.style.setProperty('--tx', `${(-y * deg).toFixed(2)}deg`)
            el.style.setProperty('--ty', `${(x * deg).toFixed(2)}deg`)
            el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`)
            el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`)
        })
    }, [deg])
    const onMouseLeave = useCallback(() => {
        cancelAnimationFrame(raf.current)
        const el = ref.current; if (!el) return
        el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg')
    }, [])
    return { ref, onMouseMove, onMouseLeave }
}

/* ── card ──────────────────────────────── */
function ProjCard({ project, delay = 0 }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const tilt = useTilt(4)

    const open = () => {
        dispatch(setSelectedProject(project))
        navigate(`/project/${project.id}`)
    }

    return (
        <article
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            onClick={open}
            onKeyDown={(e) => e.key === 'Enter' && open()}
            className="pc"
            tabIndex={0}
            role="button"
            aria-label={`Open ${project.title} project`}
            style={{ '--accent': project.color, '--accentd': `${project.color}40`, animationDelay: `${delay}ms` }}
        >
            <div className="pc-panel" style={{ background: project.bg }}>
                <div className="pc-glow-top" style={{
                    background: `radial-gradient(ellipse 80% 55% at 50% 0%, ${project.color}50, transparent 68%)`
                }} />
                <div className="pc-spotlight" />
                <img className="pc-img" src={project.img} alt={project.title} loading="lazy" draggable="false" />
                <span className="pc-index">{project.num}</span>
                <a
                    className="pc-live"
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${project.title} live site`}
                >
                    Live
                    <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                        <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>

            <div className="pc-meta">
                <div className="pc-meta-text">
                    <h3 className="pc-name">{project.title}</h3>
                    <p className="pc-sub">{project.subtitle}</p>
                </div>
                <span className="pc-cat" style={{ color: project.color, borderColor: `${project.color}45` }}>
                    {project.category}
                </span>
            </div>
        </article>
    )
}

/* ── page ──────────────────────────────── */
export default function ProjectsPage() {
    const [active, setActive] = useState('All')
    const leftRef = useRef(null)
    const rightRef = useRef(null)

    const categories = useMemo(
        () => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))],
        []
    )

    const filtered = useMemo(
        () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
        [active]
    )

    const left = filtered.filter((_, i) => i % 2 === 0)
    const right = filtered.filter((_, i) => i % 2 === 1)

    /* JS stagger: measure first left card, offset right col by half its height */
    useLayoutEffect(() => {
        const apply = () => {
            if (!leftRef.current || !rightRef.current) return
            const first = leftRef.current.firstElementChild
            if (!first) { rightRef.current.style.marginTop = '0px'; return }
            const h = first.getBoundingClientRect().height
            rightRef.current.style.marginTop = `${Math.round(h / 2)}px`
        }
        apply()
        const ro = new ResizeObserver(apply)
        const first = leftRef.current?.firstElementChild
        if (first) ro.observe(first)
        window.addEventListener('resize', apply)
        return () => { ro.disconnect(); window.removeEventListener('resize', apply) }
    }, [filtered])

    return (
        <>
            <style>{`
        .pp {
          position: relative;
          padding: clamp(110px,14vh,160px) 6vw clamp(80px,10vh,120px);
          overflow: hidden;
        }
        .pp::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse 65% 45% at 50% -5%, rgba(0,212,255,.09) 0%, transparent 65%);
        }

        /* ── header ── */
        .pp-hd {
          position: relative; z-index: 1;
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
          margin-bottom: clamp(36px,5.5vh,52px);
          padding-bottom: clamp(28px,4vh,40px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .pp-hd-left { max-width: 560px; }
        .pp-eyebrow {
          display: flex; align-items: center; gap: 9px;
          font: 400 10px/1 'Space Mono', monospace; letter-spacing: .3em;
          text-transform: uppercase; color: rgba(255,255,255,.32); margin-bottom: 14px;
        }
        .pp-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #00D4FF;
          box-shadow: 0 0 8px 2px rgba(0,212,255,.6); flex-shrink: 0;
        }
        .pp-desc {
          margin-top: 14px;
          font: 400 13px/1.7 Inter, sans-serif; color: rgba(255,255,255,.36);
        }
        .pp-count {
          flex-shrink: 0;
          font: 400 12px/1 'Space Mono', monospace; letter-spacing: .08em;
          color: rgba(255,255,255,.4); text-align: right;
          padding-bottom: 6px;
        }
        .pp-count b {
          display: block; font: 800 clamp(2rem,3vw,2.6rem)/1 Inter, sans-serif;
          color: #edeae3; letter-spacing: -.03em; margin-bottom: 6px;
        }

        /* ── filters ── */
        .pp-filters {
          position: relative; z-index: 1;
          display: flex; flex-wrap: wrap; gap: 9px;
          margin-bottom: clamp(40px,6vh,60px);
        }
        .pp-f {
          font: 400 10.5px/1 'Space Mono', monospace; letter-spacing: .12em;
          text-transform: uppercase; color: rgba(255,255,255,.45);
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 999px; padding: 9px 18px; cursor: pointer;
          transition: border-color .22s, color .22s, background .22s;
        }
        .pp-f:hover { border-color: rgba(0,212,255,.4); color: #00D4FF; }
        .pp-f.on { background: #edeae3; border-color: #edeae3; color: #0b0c0e; font-weight: 600; }

        /* ── grid ── */
        .pp-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(16px,2.5vw,28px); align-items: start;
        }
        .pp-col { display: flex; flex-direction: column; gap: clamp(16px,2.5vw,28px); }

        @media (max-width: 620px) {
          .pp-hd { flex-direction: column; align-items: flex-start; }
          .pp-count { text-align: left; }
          .pp-grid { grid-template-columns: 1fr; }
          .pp-col--r { margin-top: 0 !important; }
        }

        /* ── card ── */
        @keyframes pc-in {
          from { opacity: 0; transform: perspective(1000px) translateY(24px); }
          to   { opacity: 1; transform: perspective(1000px) translateY(0); }
        }
        .pc {
          cursor: pointer; outline: none;
          animation: pc-in .55s cubic-bezier(.16,1,.3,1) both;
          transform: perspective(1200px) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg));
          transition: transform .14s ease-out;
          will-change: transform;
        }
        .pc-panel {
          position: relative; width: 100%; aspect-ratio: 16/9;
          border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.07);
          display: flex; align-items: center; justify-content: center;
          transition: border-color .3s ease, box-shadow .3s ease;
        }
        .pc:hover .pc-panel {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accentd), 0 24px 48px -16px rgba(0,0,0,.6);
        }
        .pc-glow-top { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .pc-spotlight {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: radial-gradient(circle 200px at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.07), transparent 70%);
          opacity: 0; transition: opacity .35s;
        }
        .pc:hover .pc-spotlight { opacity: 1; }
        .pc-img {
          position: relative; z-index: 2;
          width: 74%; height: auto; object-fit: contain; display: block;
          border-radius: 8px;
          box-shadow: 0 20px 50px rgba(0,0,0,.6), 0 4px 12px rgba(0,0,0,.4);
          transition: transform .5s cubic-bezier(.16,1,.3,1);
          user-select: none;
        }
        .pc:hover .pc-img { transform: translateY(-8px) scale(1.03); }
        .pc-index {
          position: absolute; top: 12px; left: 14px; z-index: 3;
          font: 400 10px/1 'Space Mono', monospace; letter-spacing: .12em;
          color: rgba(255,255,255,.4);
        }
        .pc-live {
          position: absolute; bottom: 14px; right: 14px; z-index: 3;
          display: inline-flex; align-items: center; gap: 6px;
          font: 600 10px/1 'Space Mono', monospace; letter-spacing: .1em; text-transform: uppercase;
          text-decoration: none; color: #0b0c0e;
          background: var(--accent);
          padding: 7px 13px 7px 14px; border-radius: 999px;
          opacity: 0; transform: translateY(6px);
          transition: opacity .25s, transform .25s, box-shadow .25s;
        }
        .pc:hover .pc-live { opacity: 1; transform: translateY(0); }
        .pc-live:hover { box-shadow: 0 6px 18px -4px var(--accentd); }
        .pc-meta {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 13px 3px 0;
        }
        .pc-name {
          font: 700 clamp(.95rem,1.4vw,1.1rem)/1.2 Inter, sans-serif;
          color: #edeae3; letter-spacing: -.02em; margin: 0 0 4px;
        }
        .pc-sub { font: 400 12px/1 Inter, sans-serif; color: rgba(255,255,255,.38); margin: 0; }
        .pc-cat {
          font: 500 9.5px/1 'Space Mono', monospace; letter-spacing: .08em;
          text-transform: uppercase; border: 1px solid;
          padding: 5px 11px; border-radius: 999px;
          background: rgba(255,255,255,.03); flex-shrink: 0; white-space: nowrap;
        }
        .pp-empty {
          grid-column: 1/-1; text-align: center; padding: 60px;
          font: 400 14px/1 Inter, sans-serif; color: rgba(255,255,255,.28);
        }
      `}</style>

            <section className="pp">
                <div className="pp-hd">
                    <div className="pp-hd-left">
                        <p className="pp-eyebrow"><span className="pp-dot" aria-hidden="true" />All Work</p>
                        <RevealText
                            text="PROJECTS"
                            tag="h2"
                            splitType="chars"
                            delay={30}
                            duration={0.8}
                            className="font-bold text-3xl md:text-5xl"
                            textAlign="left"
                        />
                        <p className="pp-desc">
                            Explore the work I've crafted with attention to detail, performance, and user experience.
                        </p>
                    </div>
                    <div className="pp-count">
                        <b>{String(filtered.length).padStart(2, '0')}</b>
                        {active === 'All' ? 'total projects' : `in ${active}`}
                    </div>
                </div>

                <div className="pp-filters" role="group" aria-label="Filter projects">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`pp-f${active === cat ? ' on' : ''}`}
                            onClick={() => setActive(cat)}
                            aria-pressed={active === cat}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {filtered.length > 0 ? (
                    <div className="pp-grid" key={active}>
                        <div className="pp-col pp-col--l" ref={leftRef}>
                            {left.map((p, i) => <ProjCard key={p.id} project={p} delay={i * 80} />)}
                        </div>
                        <div className="pp-col pp-col--r" ref={rightRef}>
                            {right.map((p, i) => <ProjCard key={p.id} project={p} delay={i * 80 + 60} />)}
                        </div>
                    </div>
                ) : (
                    <div className="pp-grid">
                        <p className="pp-empty">No projects in this category yet.</p>
                    </div>
                )}
            </section>
        </>
    )
}