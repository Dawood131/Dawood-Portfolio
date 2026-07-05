import { useState, useMemo, useRef, useCallback, useLayoutEffect, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { projects } from '../data/projects'
import { setSelectedProject } from '../store/projectSlice'
import RevealText from '../components/RevealText'

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

/* ── reveal-on-scroll hook ─────────────── */
function useReveal(rootMargin = '-10% 0px') {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    io.disconnect()
                }
            },
            { threshold: 0.12, rootMargin }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [rootMargin])
    return { ref, visible }
}

/* ── card ──────────────────────────────── */
function ProjCard({ project, delay = 0 }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const tilt = useTilt(3.5)
    const reveal = useReveal()

    const open = () => {
        dispatch(setSelectedProject(project))
        navigate(`/project/${project.id}`)
    }

    const setRefs = (node) => {
        tilt.ref.current = node
        reveal.ref.current = node
    }

    return (
        <article
            ref={setRefs}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            onClick={open}
            onKeyDown={(e) => e.key === 'Enter' && open()}
            className={`pc${reveal.visible ? ' pc--in' : ''}`}
            tabIndex={0}
            role="button"
            aria-label={`Open ${project.title} project`}
            style={{
                '--accent': project.color,
                '--accentd': `${project.color}40`,
                '--delay': `${delay}ms`,
            }}
        >
            <div className="pc-frame">
                <div className="pc-panel" style={{ background: project.bg }}>
                    <div className="pc-glow-top" style={{
                        background: `radial-gradient(ellipse 80% 55% at 50% 0%, ${project.color}55, transparent 68%)`
                    }} />
                    <div className="pc-grid-lines" />
                    <div className="pc-spotlight" />

                    <div className="pc-img-wrap">
                        <img className="pc-img" src={project.img} alt={project.title} loading="lazy" draggable="false" />
                    </div>

                    <span className="pc-index">{project.num}</span>
                    {/* <span className="pc-cat-float" style={{ color: project.color, borderColor: `${project.color}45` }}>
                        {project.category}
                    </span> */}

                    <a
                        className="pc-live"
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${project.title} live site`}
                    >
                        <span>Visit site</span>
                        <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                            <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
                <div className="pc-edge" aria-hidden="true" />
            </div>

            <div className="pc-underline" aria-hidden="true" />

            <div className="pc-meta">
                <div className="pc-meta-row">
                    <h3 className="pc-name">{project.title}</h3>
                    <span className="pc-arrow" aria-hidden="true">
                        <svg width="13" height="13" viewBox="0 0 11 11" fill="none">
                            <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
                <p className="pc-sub">{project.subtitle}</p>
                {Array.isArray(project.tech) && project.tech.length > 0 && (
                    <ul className="pc-tech">
                        {project.tech.slice(0, 4).map((t) => (
                            <li key={t}>{t}</li>
                        ))}
                    </ul>
                )}
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
          gap: clamp(20px,3vw,32px); align-items: start;
        }
        .pp-col { display: flex; flex-direction: column; gap: clamp(20px,3vw,32px); }

        @media (max-width: 620px) {
          .pp-hd { flex-direction: column; align-items: flex-start; }
          .pp-count { text-align: left; }
          .pp-grid { grid-template-columns: 1fr; }
          .pp-col--r { margin-top: 0 !important; }
        }

        /* ── card entrance ── */
        .pc {
          cursor: pointer; outline: none;
          opacity: 0;
          transform: perspective(1200px) translateY(46px) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg)) scale(.96);
          filter: blur(8px);
          transition:
            opacity .8s cubic-bezier(.16,1,.3,1) var(--delay,0ms),
            transform .8s cubic-bezier(.16,1,.3,1) var(--delay,0ms),
            filter .8s cubic-bezier(.16,1,.3,1) var(--delay,0ms);
          will-change: transform, opacity, filter;
        }
        .pc--in {
          opacity: 1;
          filter: blur(0);
          transform: perspective(1200px) translateY(0) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg)) scale(1);
        }
        .pc--in:not(:hover) { transition: transform .5s ease-out; }

        /* ── card frame / border glow ── */
        .pc-frame {
          position: relative;
          border-radius: 20px;
          padding: 1px;
        }
        .pc-edge {
          position: absolute; inset: 0; border-radius: 20px; z-index: 0;
          background: conic-gradient(from calc(var(--gx,50%) * 3.6deg), var(--accent), transparent 30%, transparent 70%, var(--accent));
          opacity: 0; transition: opacity .4s ease;
        }
        .pc:hover .pc-edge { opacity: .55; }

        .pc-panel {
          position: relative; z-index: 1; width: 100%; aspect-ratio: 16/9;
          border-radius: 19px; overflow: hidden;
          border: 1px solid rgba(255,255,255,.07);
          display: flex; align-items: center; justify-content: center;
          transition: border-color .3s ease, box-shadow .3s ease;
        }
        .pc:hover .pc-panel {
          border-color: transparent;
          box-shadow: 0 24px 56px -18px rgba(0,0,0,.65);
        }
        .pc-glow-top { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .pc-grid-lines {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: .5;
          background-image:
            linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 75%);
        }
        .pc-spotlight {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: radial-gradient(circle 220px at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.08), transparent 70%);
          opacity: 0; transition: opacity .35s;
        }
        .pc:hover .pc-spotlight { opacity: 1; }

        .pc-img-wrap {
          position: relative; z-index: 2; width: 76%; height: 76%;
          display: flex; align-items: center; justify-content: center;
          clip-path: inset(100% 0 0 0);
          transition: clip-path .9s cubic-bezier(.16,1,.3,1) calc(var(--delay,0ms) + 120ms);
        }
        .pc--in .pc-img-wrap { clip-path: inset(0 0 0 0); }
        .pc-img {
          width: 100%; height: 100%; object-fit: contain; display: block;
          border-radius: 8px;
          transition: transform .5s cubic-bezier(.16,1,.3,1);
          user-select: none;
        }
        .pc:hover .pc-img { transform: translateY(-8px) scale(1.03); }

        .pc-index {
          position: absolute; top: 14px; left: 16px; z-index: 3;
          font: 400 10px/1 'Space Mono', monospace; letter-spacing: .12em;
          color: rgba(255,255,255,.4);
        }
        .pc-cat-float {
          position: absolute; top: 12px; right: 14px; z-index: 3;
          font: 500 8.5px/1 'Space Mono', monospace; letter-spacing: .1em; text-transform: uppercase;
          border: 1px solid; padding: 5px 10px; border-radius: 999px;
          background: rgba(10,10,12,.55); backdrop-filter: blur(6px);
        }
        .pc-live {
          position: absolute; bottom: 14px; right: 14px; z-index: 3;
          display: inline-flex; align-items: center; gap: 6px;
          font: 600 10px/1 'Space Mono', monospace; letter-spacing: .1em; text-transform: uppercase;
          text-decoration: none; color: #0b0c0e;
          background: var(--accent);
          padding: 7px 13px 7px 14px; border-radius: 999px;
          opacity: 0; transform: translateY(8px) scale(.94);
          transition: opacity .25s, transform .3s cubic-bezier(.16,1,.3,1), box-shadow .25s;
        }
        .pc:hover .pc-live { opacity: 1; transform: translateY(0) scale(1); }
        .pc-live:hover { box-shadow: 0 6px 18px -4px var(--accentd); }

        /* ── accent underline below image ── */
        .pc-underline {
          position: relative;
          height: 2px;
          margin: 12px 3px 0;
          border-radius: 2px;
          background: rgba(255,255,255,.08);
          overflow: hidden;
        }
        .pc-underline::after {
          content: '';
          position: absolute; inset: 0;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        .pc:hover .pc-underline::after,
        .pc:focus-visible .pc-underline::after {
          transform: scaleX(1);
        }

        /* ── meta ── */
        .pc-meta { padding: 13px 3px 0; }
        .pc-meta-row {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .pc-name {
          font: 700 clamp(.98rem,1.4vw,1.15rem)/1.2 Inter, sans-serif;
          color: #edeae3; letter-spacing: -.02em; margin: 0;
        }
        .pc-arrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,.12); color: rgba(255,255,255,.4);
          transition: transform .3s cubic-bezier(.16,1,.3,1), border-color .3s, color .3s, background .3s;
        }
        .pc:hover .pc-arrow {
          transform: rotate(45deg);
          border-color: var(--accent); color: var(--accent);
          background: var(--accentd);
        }
        .pc-sub { font: 400 12px/1.5 Inter, sans-serif; color: rgba(255,255,255,.38); margin: 5px 0 0; }
        .pc-tech {
          list-style: none; display: flex; flex-wrap: wrap; gap: 6px;
          margin: 11px 0 0; padding: 0;
        }
        .pc-tech li {
          font: 400 9px/1 'Space Mono', monospace; letter-spacing: .04em;
          color: rgba(255,255,255,.42);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 6px; padding: 5px 8px;
          background: rgba(255,255,255,.02);
        }

        .pp-empty {
          grid-column: 1/-1; text-align: center; padding: 60px;
          font: 400 14px/1 Inter, sans-serif; color: rgba(255,255,255,.28);
        }

        @media (prefers-reduced-motion: reduce) {
          .pc, .pc-img-wrap, .pc-underline::after { transition: none !important; filter: none !important; opacity: 1 !important; transform: none !important; clip-path: none !important; }
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
                        {active === 'All' ? 'Total Projects' : `in ${active}`}
                    </div>
                </div>

                {/* <div className="pp-filters" role="group" aria-label="Filter projects">
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
                </div> */}

                {filtered.length > 0 ? (
                    <div className="pp-grid" key={active}>
                        <div className="pp-col pp-col--l" ref={leftRef}>
                            {left.map((p, i) => <ProjCard key={p.id} project={p} delay={i * 90} />)}
                        </div>
                        <div className="pp-col pp-col--r" ref={rightRef}>
                            {right.map((p, i) => <ProjCard key={p.id} project={p} delay={i * 90 + 70} />)}
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