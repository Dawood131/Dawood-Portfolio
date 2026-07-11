import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { getLenis } from '../lib/lenis'
import { Helmet } from 'react-helmet-async'

function pad2(n) {
  return String(n).padStart(2, '0')
}

function Media({ media, className = '', controls = false, onLoad }) {
  const [loaded, setLoaded] = useState(false)

  if (!media) return null

  const handleLoad = () => {
    setLoaded(true)
    onLoad?.()
  }

  if (media.type === 'video') {
    return (
      <div className={`pd-media-wrap ${loaded ? 'is-loaded' : ''}`}>
        {!loaded && (
          <div className="pd-media-skeleton">
            <span className="pd-media-sweep" />
          </div>
        )}
        <video
          className={`pd-media ${className}`}
          data-type="video"
          src={media.src}
          poster={media.poster}
          autoPlay={!controls}
          loop={!controls}
          muted={!controls}
          controls={controls}
          playsInline
          onLoadedData={handleLoad}
        />
      </div>
    )
  }

  return (
    <div className={`pd-media-wrap ${loaded ? 'is-loaded' : ''}`}>
      {!loaded && (
        <div className="pd-media-skeleton">
          <span className="pd-media-sweep" />
        </div>
      )}
      <img
        className={`pd-media ${className}`}
        data-type="image"
        src={media.src}
        alt={media.alt || ''}
        loading="lazy"
        onLoad={handleLoad}
      />
    </div>
  )
}

function CornerMarks() {
  return (
    <>
      <span className="pd-corner pd-corner--tl" />
      <span className="pd-corner pd-corner--tr" />
      <span className="pd-corner pd-corner--bl" />
      <span className="pd-corner pd-corner--br" />
    </>
  )
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const lenis = getLenis()
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      className="pd-lightbox"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <button className="pd-lightbox-close" onClick={onClose} aria-label="Close">✕</button>
      <div className="pd-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <Media media={item} className="pd-lightbox-media" controls />
      </div>
    </div>
  )
}

function Reveal({ children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`pd-reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </Tag>
  )
}

function useSections(project) {
  if (!project) return []
  if (project.sections?.length) {
    return project.sections.filter((s) => s.id !== 'walkthrough')
  }

  return [
    {
      id: 'overview',
      eyebrow: 'Overview',
      heading: 'About the project',
      body: project.description,
      tech: project.tech,
    },
  ]
}

function useActiveSection(count, onActive) {
  const refs = useRef([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.secIndex)
            if (!Number.isNaN(idx)) onActive(idx)
          }
        })
      },
      { rootMargin: '-120px 0px -65% 0px', threshold: 0 }
    )
    refs.current.forEach((el) => { if (el) io.observe(el) })
    return () => io.disconnect()
  }, [count, onActive])
  return refs
}

function ProjectView({ project, prevProject, nextProject }) {
  const [lightboxItem, setLightboxItem] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [])

  const heroMedia = project.video
    ? { type: 'video', src: project.video }
    : project.img
      ? { type: 'image', src: project.img, alt: project.title }
      : null

  useEffect(() => {
    if (heroMedia?.type === 'image') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = heroMedia.src
      document.head.appendChild(link)
      return () => document.head.removeChild(link)
    }
  }, [heroMedia])

  const sections = useSections(project)
  const hasToc = sections.length > 1
  const sectionRefs = useActiveSection(sections.length, setActiveIndex)

  const jumpTo = (i) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Helmet>
        <title>{`${project.title} | Dawood Butt`}</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <main className="pd-main" style={{ '--accent': project.color }}>
        <div className="pd-grid">
          <aside
            className="pd-rail"
            onWheel={(e) => {
              const el = e.currentTarget
              if (el.scrollHeight > el.clientHeight) e.stopPropagation()
            }}
            onTouchMove={(e) => {
              const el = e.currentTarget
              if (el.scrollHeight > el.clientHeight) e.stopPropagation()
            }}
          >
            <nav className="pd-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="pd-crumb-sep">/</span>
              <Link to="/projects">Projects</Link>
            </nav>

            <h1 className="pd-rail-title">{project.title}</h1>
            <p className="pd-rail-subtitle">{project.subtitle}</p>

            {(project.role || project.client) && (
              <dl className="pd-spec-list">
                {project.role && (
                  <div className="pd-spec-row">
                    <dt>Role</dt>
                    <dd>{project.role}</dd>
                  </div>
                )}
                {project.client && (
                  <div className="pd-spec-row">
                    <dt>Client</dt>
                    <dd>{project.client}</dd>
                  </div>
                )}
              </dl>
            )}

            {(project.tags?.length || project.tech?.length) ? (
              <div className="pd-tags">
                {(project.tags?.length ? project.tags : project.tech).map((t, i) => (
                  <span key={i} className="pd-tag">{t}</span>
                ))}
              </div>
            ) : null}

            <div className="pd-links">
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="pd-cta">
                  Check it out
                  <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                    <path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="pd-link pd-link--ghost">
                  GitHub
                </a>
              )}
            </div>

            {hasToc && (
              <nav className="pd-toc" aria-label="On this page">
                <p className="pd-toc-label">On this page</p>
                {sections.map((s, i) => (
                  <button
                    key={s.id || i}
                    className={`pd-toc-item ${activeIndex === i ? 'is-active' : ''}`}
                    onClick={() => jumpTo(i)}
                  >
                    <span className="pd-toc-index">{pad2(i + 1)}</span>
                    {s.eyebrow || s.heading || `Section ${i + 1}`}
                  </button>
                ))}
              </nav>
            )}
          </aside>

          <div className="pd-content">
            {heroMedia && (
              <section className={`pd-hero ${heroLoaded ? 'is-revealed' : ''}`}>
                <button
                  type="button"
                  className="pd-hero-frame"
                  style={{ background: project.bg }}
                  onClick={() => setLightboxItem(heroMedia)}
                  aria-label="Open full view"
                >
                  <Media media={heroMedia} className="pd-hero-media" onLoad={() => setHeroLoaded(true)} />
                  <CornerMarks />
                  <span className={`pd-hero-wipe ${heroLoaded ? '' : 'is-loading'}`} />
                  <span className="pd-shot-expand">⤢ Click to expand</span>
                </button>
              </section>
            )}

            <Reveal className="pd-desc-block">
              <p className="pd-desc">{project.description}</p>

              {project.features?.length ? (
                <div className="pd-features-block">
                  <p className="pd-block-label">Key features</p>
                  <ul className="pd-feature-list">
                    {project.features.map((f, i) => (
                      <li key={i}><span className="pd-feature-dot" />{f}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </Reveal>

            <div className="pd-sections">
              {sections.map((s, i) => (
                <section
                  key={s.id || i}
                  ref={(el) => (sectionRefs.current[i] = el)}
                  data-sec-index={i}
                  className="pd-section"
                >
                  <div className="pd-section-head">
                    <span className="pd-section-index">{pad2(i + 1)}</span>
                    <div>
                      <p className="pd-block-eyebrow">{s.eyebrow}</p>
                      <h2 className="pd-block-heading">{s.heading}</h2>
                    </div>
                  </div>

                  {s.body && <p className="pd-block-body">{s.body}</p>}

                  {s.tech?.length ? (
                    <div className="pd-tags pd-tags--section">
                      {s.tech.map((t, ti) => <span key={ti} className="pd-tag">{t}</span>)}
                    </div>
                  ) : null}

                  {s.links?.length ? (
                    <div className="pd-links">
                      {s.links.map((l, li) => (
                        <a key={li} href={l.href} target="_blank" rel="noopener noreferrer" className="pd-link pd-link--ghost">
                          {l.label}
                        </a>
                      ))}
                    </div>
                  ) : null}

                  {s.media && (
                    <button
                      type="button"
                      className="pd-shot"
                      onClick={() => setLightboxItem(s.media)}
                      aria-label="Open full view"
                    >
                      <Media media={s.media} className="pd-shot-media" />
                      <CornerMarks />
                      <span className="pd-shot-expand">⤢ Click to expand</span>
                    </button>
                  )}
                </section>
              ))}
            </div>

            <Reveal className="pd-nav-row">
              {prevProject ? (
                <Link to={`/project/${prevProject.id}`} className="pd-nav-link">
                  <span className="pd-nav-dir">← Previous Project</span>
                  <span className="pd-nav-name">{prevProject.title}</span>
                </Link>
              ) : <span />}
              {nextProject && (
                <Link to={`/project/${nextProject.id}`} className="pd-nav-link pd-nav-link--right">
                  <span className="pd-nav-dir">Next Project →</span>
                  <span className="pd-nav-name">{nextProject.title}</span>
                </Link>
              )}
            </Reveal>
          </div>
        </div>
      </main>

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find((p) => String(p.id) === id)
  const currentIdx = projects.findIndex((p) => String(p.id) === id)
  const prevProject = currentIdx > 0 ? projects[currentIdx - 1] : null
  const nextProject =
    currentIdx >= 0 && currentIdx < projects.length - 1 ? projects[currentIdx + 1] : null

  if (!project) {
    return (
      <>
        <Helmet><title>Project Not Found | Dawood Butt</title></Helmet>
        <main className="pd-main pd-empty">
          <p className="pd-empty-text">Project not found.</p>
          <Link to="/projects" className="pd-empty-link">← Back to projects</Link>
        </main>
        <style>{PD_STYLES}</style>
      </>
    )
  }

  return (
    <>
      <ProjectView
        key={project.id}
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
      />
      <style>{PD_STYLES}</style>
    </>
  )
}

const PD_STYLES = `
  .pd-main {
    --ink: #0a0b0d;
    --surface: #111318;
    --line: rgba(255,255,255,0.09);
    --text: #f2f3f5;
    --muted: rgba(242,243,245,0.55);
    --accent: #00D4FF;
    position: relative;
    min-height: 100vh;
    padding: 120px 6vw 120px;
    color: var(--text);
    font-family: Inter, sans-serif;
    background: var(--ink);
  }

  .pd-grid {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: clamp(32px, 5vw, 72px);
    align-items: start;
  }

  /* ── left rail ── */
  .pd-rail {
    position: sticky;
    top: 110px;
    max-height: calc(100vh - 140px);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-right: 6px;
    scrollbar-width: thin;
  }

  .pd-crumbs {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: var(--muted);
    margin-bottom: 22px;
  }
  .pd-crumbs a { color: rgba(255,255,255,0.55); text-decoration: none; transition: color .2s ease; }
  .pd-crumbs a:hover { color: var(--accent); }
  .pd-crumb-sep { color: rgba(255,255,255,0.2); }

  .pd-rail-title {
    font-family: 'Space Grotesk', Inter, sans-serif;
    font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; line-height: 1.08;
    margin-bottom: 6px;
  }
  .pd-rail-subtitle {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11.5px; letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 22px;
  }

  .pd-spec-list { display: flex; flex-direction: column; margin-bottom: 20px; }
  .pd-spec-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 9px 0; border-bottom: 1px dashed var(--line);
  }
  .pd-spec-row dt {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.4); margin: 0;
  }
  .pd-spec-row dd { font-size: 12.5px; font-weight: 600; color: #fff; margin: 0; }

  .pd-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 22px; }
  .pd-tags--section { margin: 4px 0 20px; }
  .pd-tag {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10.5px; letter-spacing: 0.03em;
    color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 5px 10px; border-radius: 5px;
  }

  .pd-links { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 26px; }
  .pd-cta {
    display: inline-flex; align-items: center; gap: 8px;
    text-decoration: none; color: #05070a; background: var(--accent);
    font-family: Inter, sans-serif;
    font-weight: 700; font-size: 13px; letter-spacing: 0.02em;
    padding: 12px 22px; border-radius: 12px;
    transition: transform .2s ease, box-shadow .3s ease, filter .2s ease;
  }
  .pd-cta svg { transition: transform .2s ease; }
  .pd-cta:hover { transform: translateY(-2px); filter: brightness(1.1); }
  .pd-cta:hover svg { transform: translateX(3px); }
  .pd-link {
    display: inline-flex; align-items: center; gap: 7px;
    text-decoration: none; font-weight: 700; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 10px 16px; border-radius: 6px;
    transition: border-color .2s ease, color .2s ease;
  }
  .pd-link--ghost { background: rgba(255,255,255,0.03); color: #fff; border: 1px solid rgba(255,255,255,0.12); }
  .pd-link--ghost:hover { border-color: var(--accent); color: var(--accent); }

  .pd-toc { padding-top: 18px; border-top: 1px solid var(--line); }
  .pd-toc-label {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.35); margin-bottom: 10px;
  }
  .pd-toc-item {
    display: flex; align-items: center; gap: 9px; width: 100%; text-align: left;
    background: none; border: none; cursor: pointer;
    font-size: 12px; color: rgba(255,255,255,0.45);
    padding: 6px 0; transition: color .2s ease;
  }
  .pd-toc-index {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; color: rgba(255,255,255,0.3);
  }
  .pd-toc-item.is-active { color: var(--accent); font-weight: 600; }
  .pd-toc-item.is-active .pd-toc-index { color: var(--accent); }

  @media (max-width: 960px) {
    .pd-grid { grid-template-columns: 1fr; }
  .pd-rail {
    position: static;
    max-height: none;
    padding-right: 0;
    margin-bottom: 48px;
    overflow-y: visible;
    overscroll-behavior: auto;
  }
}


  /* ── right content ── */
  .pd-content { min-width: 0; }

  .pd-hero { margin-bottom: 48px; }
  .pd-hero-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    max-height: 460px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--line);
    display: flex; align-items: center; justify-content: center;
  }
  button.pd-hero-frame {
    cursor: pointer;
    padding: 0;
  }
  button.pd-hero-frame:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
  .pd-hero-frame:hover .pd-shot-expand { opacity: 1; transform: translateY(0); }

  .pd-media { display: block; width: 100%; height: 100%; }
  .pd-hero-frame .pd-media[data-type='video'] { object-fit: cover; }
  .pd-hero-frame .pd-media[data-type='image'] { object-fit: contain; }

  /* ── media loading state ── */
  .pd-media-wrap { position: relative; width: 100%; height: 100%; }
  .pd-hero-frame .pd-media-wrap { width: 100%; height: 100%; }
  .pd-shot .pd-media-wrap,
  .pd-lightbox-inner .pd-media-wrap {
    width: 100%; height: auto; display: block;
  }
  .pd-shot .pd-media-wrap:not(.is-loaded) { aspect-ratio: 16 / 9; }

  .pd-media-wrap .pd-media { opacity: 0; transition: opacity .5s ease; }
  .pd-media-wrap.is-loaded .pd-media { opacity: 1; }

  .pd-media-skeleton {
    position: absolute; inset: 0;
    background: linear-gradient(100deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
    overflow: hidden;
  }
  .pd-media-sweep {
    position: absolute; top: 0; bottom: 0; left: -45%;
    width: 45%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
    animation: pd-media-sweep 1.4s ease-in-out infinite;
  }
  @keyframes pd-media-sweep {
    0% { left: -45%; }
    100% { left: 100%; }
  }

  .pd-hero-wipe {
    position: absolute; inset: 0 0 0 auto;
    width: 100%;
    background: var(--ink);
    border-left: 2px solid var(--accent);
    box-shadow: -6px 0 28px var(--accent);
  }
  .pd-hero-wipe:not(.is-loading) { transition: width 1s cubic-bezier(.65,0,.35,1); }
  .pd-hero-wipe.is-loading { animation: pd-hero-scan 1.6s ease-in-out infinite; }
  .pd-hero.is-revealed .pd-hero-wipe { width: 0%; }

  @keyframes pd-hero-scan {
    0%, 100% { width: 100%; }
    50% { width: 62%; }
  }

  @media (max-width: 700px) {
    .pd-hero-frame { aspect-ratio: 4/3; max-height: 300px; }
  }

  /* ── corner brackets (blueprint signature) ── */
  .pd-corner { position: absolute; width: 16px; height: 16px; pointer-events: none; opacity: 0.85; }
  .pd-corner--tl { top: 8px; left: 8px; border-top: 2px solid var(--accent); border-left: 2px solid var(--accent); }
  .pd-corner--tr { top: 8px; right: 8px; border-top: 2px solid var(--accent); border-right: 2px solid var(--accent); }
  .pd-corner--bl { bottom: 8px; left: 8px; border-bottom: 2px solid var(--accent); border-left: 2px solid var(--accent); }
  .pd-corner--br { bottom: 8px; right: 8px; border-bottom: 2px solid var(--accent); border-right: 2px solid var(--accent); }

  /* ── intro description block ── */
  .pd-desc-block { margin-bottom: 56px; }
  .pd-desc { font-size: 15px; line-height: 1.8; color: var(--muted); max-width: 620px; margin-bottom: 24px; }

  .pd-block-label {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.4); margin-bottom: 12px;
  }
  .pd-feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .pd-feature-list li {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 13.5px; line-height: 1.6; color: rgba(255,255,255,0.7);
  }
  .pd-feature-dot { width: 5px; height: 5px; border-radius: 1px; background: var(--accent); flex-shrink: 0; margin-top: 7px; }

  /* ── sections ── */
  .pd-sections { display: flex; flex-direction: column; gap: clamp(56px, 7vw, 80px); }
  .pd-section { scroll-margin-top: 110px; }

  .pd-section-head { display: flex; gap: 18px; align-items: flex-start; margin-bottom: 16px; }
  .pd-section-index {
    flex-shrink: 0;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px; color: var(--accent);
    border: 1px solid var(--line); border-radius: 5px;
    padding: 3px 8px; margin-top: 3px;
  }
  .pd-block-eyebrow {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11.5px; letter-spacing: 0.13em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 8px;
  }
  .pd-block-heading { font-family: 'Space Grotesk', Inter, sans-serif; font-size: 1.5rem; font-weight: 700; letter-spacing: -0.01em; }
  .pd-block-body { line-height: 1.8; color: var(--muted); font-size: 14.5px; margin: 16px 0 22px; max-width: 620px; }

  .pd-shot {
    position: relative;
    display: block; width: 100%; padding: 0;
    border: 1px solid var(--line);
    border-radius: 10px; overflow: hidden;
    background: rgba(255,255,255,0.02);
    cursor: pointer;
  }
  .pd-shot-media { width: 100%; height: auto; object-fit: contain; display: block; transition: transform .4s ease; }
  .pd-shot:hover .pd-shot-media { transform: scale(1.01); }
  .pd-shot-expand {
    position: absolute; bottom: 10px; right: 10px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.05em;
    color: #fff; background: rgba(10,10,10,0.7); backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.14);
    padding: 6px 11px; border-radius: 5px;
    opacity: 0; transform: translateY(6px);
    transition: opacity .25s ease, transform .25s ease;
  }
  .pd-shot:hover .pd-shot-expand { opacity: 1; transform: translateY(0); }

  /* ── lightbox ── */
  .pd-lightbox {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(6,6,7,0.9); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: clamp(16px, 4vw, 56px);
    overscroll-behavior: contain;
  }
  .pd-lightbox-inner {
    max-width: 960px; width: 100%; max-height: 100%;
    overflow-y: auto; overscroll-behavior: contain;
    border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
    background: #0d0d0f;
  }
  .pd-lightbox-media { width: 100%; height: auto; display: block; }
.pd-lightbox-close {
  position: fixed;
  top: 20px; right: 20px; z-index: 10;
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(10, 10, 12, 0.85);   /* CHANGED: solid dark, koi bhi image ho */
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  font-size: 16px; cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,0,0,0.4); /* ADD: image se alag dikhne ke liye depth */
  transition: background .2s ease, border-color .2s ease;
}
.pd-lightbox-close:hover { background: rgba(20,20,22,0.95); border-color: var(--accent); }

  /* ── reveal ── */
  .pd-reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
  .pd-reveal.is-visible { opacity: 1; transform: translateY(0); }

  /* ── prev/next ── */
  .pd-nav-row {
    margin-top: 90px; padding-top: 28px;
    border-top: 1px solid var(--line);
    display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  }
  .pd-nav-link {
    display: flex; flex-direction: column; gap: 6px;
    text-decoration: none; color: #fff;
    border: 1px solid rgba(255,255,255,0.16); border-radius: 10px;
    padding: 18px 20px;
    flex: 0 1 340px;
    transition: border-color .2s ease, transform .2s ease;
  }
  .pd-nav-link:hover { border-color: var(--accent); transform: translateY(-2px); }
  .pd-nav-link--right { text-align: right; align-items: flex-end; margin-left: auto; }
  .pd-nav-dir {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.45);
  }
  .pd-nav-name { font-family: 'Space Grotesk', Inter, sans-serif; font-size: 1.05rem; font-weight: 700; transition: color .2s ease; }
  .pd-nav-link:hover .pd-nav-name { color: var(--accent); }

  @media (max-width: 700px) {
    .pd-nav-row { flex-direction: column; }
    .pd-nav-link { flex-basis: auto; }
    .pd-nav-link--right { text-align: left; align-items: flex-start; margin-left: 0; }
  }

  /* ── empty ── */
  .pd-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; }
  .pd-empty-text { color: rgba(255,255,255,0.6); }
  .pd-empty-link { color: #00D4FF; text-decoration: none; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; }

  @media (max-width: 700px) {
    .pd-main { padding: 100px 5vw 90px; }
    .pd-sections { gap: 48px; }
    .pd-block-heading { font-size: 1.3rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .pd-reveal, .pd-hero-wipe { transition: none !important; opacity: 1 !important; transform: none !important; width: 0 !important; }
    .pd-media-sweep, .pd-hero-wipe.is-loading { animation: none !important; }
    .pd-media-wrap .pd-media { transition: none !important; opacity: 1 !important; }
  }
`