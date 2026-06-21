import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { projects } from '../data/projects'
import { getLenis } from '../lib/lenis'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const selectedProject = useSelector((state) => state.project.selectedProject)

  // Lenis keeps its own scroll position independent of the browser, so a
  // route change alone doesn't reset it — without this, the new page mounts
  // wherever the previous page's scroll happened to be.
  useEffect(() => {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [id])

  // Redux state resets on a hard refresh / direct link visit (selectedProject
  // will be null then), so fall back to looking the project up by id from
  // the static data file. This keeps the page working even without the
  // click-through navigation flow.
  const project =
    selectedProject && String(selectedProject.id) === id
      ? selectedProject
      : projects.find((p) => String(p.id) === id)

  if (!project) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Project not found.</p>
        <Link to="/projects" style={{ color: '#00D4FF', textDecoration: 'none', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ← Back to projects
        </Link>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '140px 6vw 100px',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        background: '#0a0a0a',
      }}
    >
      <button
        onClick={() => {
          // history.state.idx is set by react-router internally. If it's
          // greater than 0, there's a real previous entry in THIS session
          // to go back to (Home, the /projects list page, wherever they
          // came from). If it's 0 (or missing — direct link/hard refresh),
          // there's nothing to go back to, so fall back to Home instead of
          // navigate(-1) potentially leaving the app entirely.
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1)
          } else {
            navigate('/')
          }
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          padding: 0,
          marginBottom: '32px',
          display: 'inline-block',
        }}
      >
        ← Back
      </button>

      <p
        style={{
          color: project.color,
          fontSize: '12px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight: 700,
          marginBottom: '14px',
        }}
      >
        {project.subtitle}
      </p>

      <h1
        style={{
          fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 0.96,
          marginBottom: '28px',
        }}
      >
        {project.title}
      </h1>

      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '36px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <img
          src={project.img}
          alt={project.title}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      <p
        style={{
          maxWidth: '700px',
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.65)',
          fontSize: '15px',
          marginBottom: '28px',
        }}
      >
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '40px' }}>
        {project.tech.map((t, i) => (
          <span
            key={i}
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '7px 16px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: project.color,
            color: '#000',
            padding: '13px 26px',
            borderRadius: '999px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Live Demo
        </a>

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '13px 26px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            GitHub
          </a>
        )}
      </div>
    </main>
  )
}