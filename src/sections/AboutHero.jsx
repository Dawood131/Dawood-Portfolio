import { useRef, useEffect, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { experience } from '../data/experience'
import { Download, ArrowUpRight } from 'lucide-react'
import RevealText from '../components/RevealText'
import { Link } from 'react-router-dom'

const RESUME_PATH = '/files/Dawood_Butt_Frontend_Developer_CV.pdf'
const PHOTO = '/files/My Photo.jpg'
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
  const [startStr, endStr] = durationStr.split(/\s*[—–-]\s*/).map((s) => s.trim())
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

function useExpLabel(items) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 60 * 60)
    return () => clearInterval(id)
  }, [])

  return useMemo(() => {
    const totalMs = items.reduce((sum, item) => sum + parseDuration(item.duration, now), 0)
    const totalDays = totalMs / (1000 * 60 * 60 * 24)
    const years = Math.floor(totalDays / 365.25)
    const afterYears = totalDays - years * 365.25
    const months = Math.floor(afterYears / 30.44)

    if (years === 0) return `${months} months`
    if (months === 0) return `${years} year`
    return `${years}yr ${months}mo`
  }, [items, now])
}

export default function AboutHero() {
  const sectionRef = useRef(null)
  const imgWrapRef = useRef(null)
  const clipRef = useRef(null)
  const introRef = useRef(null)
  const expLabel = useExpLabel(experience)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(clipRef.current, { clipPath: 'inset(0 0 100% 0)' })
      gsap.set(introRef.current.querySelectorAll('.about2-anim'), { opacity: 0, y: 26 })

      const tl = gsap.timeline({ delay: 0.15 })
      tl.to(clipRef.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut' })
        .to(introRef.current.querySelectorAll('.about2-anim'), {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
        }, 0.3)
    }, sectionRef)

    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    let xTo, yTo
    const onMove = (e) => {
      const r = sectionRef.current.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      xTo(px * 18)
      yTo(py * 14)
    }

    if (!isCoarse && imgWrapRef.current) {
      xTo = gsap.quickTo(imgWrapRef.current, 'x', { duration: 0.6, ease: 'power3.out' })
      yTo = gsap.quickTo(imgWrapRef.current, 'y', { duration: 0.6, ease: 'power3.out' })
      sectionRef.current.addEventListener('mousemove', onMove)
    }

    return () => {
      ctx.revert()
      if (!isCoarse) sectionRef.current?.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <style>{`
        .about2-section {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(90px, 11vh, 120px) 6vw clamp(36px, 5vh, 56px);
        }

        .about2-watermark {
          position: absolute;
          top: 5%;
          left: 50%;
          transform: translateX(-50%);
          font-family: Inter, sans-serif;
          font-weight: 800;
          font-size: clamp(5rem, 15vw, 11rem);
          letter-spacing: -0.04em;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.07);
          white-space: nowrap;
          z-index: 0;
          pointer-events: none;
          user-select: none;
        }

        .about2-vertical-label {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: translateY(-50%) rotate(180deg);
          writing-mode: vertical-rl;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: Inter, sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          z-index: 2;
        }

        @keyframes about2-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:.6; transform:scale(.7); }
        }
        .about2-vlabel-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00D4FF;
          animation: about2-pulse 2.4s ease-in-out infinite;
        }

        .about2-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: clamp(36px, 5vw, 60px);
          align-items: center;
        }

        /* ── image, smaller now ── */
        .about2-img-stage {
          position: relative;
          width: 100%;
          max-width: 320px;
        }

        .about2-img-clip {
          position: relative;
          aspect-ratio: 4 / 5;
          clip-path: polygon(0% 6%, 94% 0%, 100% 94%, 6% 100%);
          overflow: hidden;
          background: #0a0c0e;
        }

        .about2-img-clip img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: grayscale(0.2) contrast(1.08);
          transform: scale(1.08);
        }

        .about2-img-glow {
          position: absolute;
          inset: -8%;
          background: radial-gradient(circle at 50% 40%, rgba(0,212,255,0.18), transparent 65%);
          filter: blur(36px);
          z-index: -1;
        }

        .about2-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 2px solid #00D4FF;
          z-index: 3;
          pointer-events: none;
        }
        .about2-corner.tl { top: -6px; left: -6px; border-right: none; border-bottom: none; }
        .about2-corner.br { bottom: -6px; right: -6px; border-left: none; border-top: none; }

        .about2-badge {
          position: absolute;
          right: -14px;
          top: 16px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(10,12,14,0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 8px 14px 8px 9px;
          box-shadow: 0 12px 26px -10px rgba(0,0,0,0.6);
        }
        .about2-badge-text {
          font-family: Inter, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          color: #edeae3;
          white-space: nowrap;
        }

        /* ── text side ── */
        .about2-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-family: Inter, sans-serif;
          margin-bottom: 14px;
        }

        .about2-role {
          font-family: Inter, sans-serif;
          font-size: clamp(13px, 1.4vw, 15px);
          font-weight: 600;
          color: #00D4FF;
          letter-spacing: 0.02em;
          margin-bottom: 16px;
        }

        .about2-desc {
          font-size: 14px;
          line-height: 1.8;
          color: rgba(255,255,255,0.5);
          font-family: Inter, sans-serif;
          max-width: 440px;
          margin-bottom: 28px;
        }

        .about2-cta-row {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .about2-resume-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: Inter, sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #000;
          background: #00D4FF;
          text-decoration: none;
          border-radius: 999px;
          padding: 14px 24px;
          transition: transform 0.25s ease, box-shadow 0.3s ease;
        }
        .about2-resume-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px -8px rgba(0,212,255,0.45);
        }

        .about2-contact-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: Inter, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.18);
          padding-bottom: 2px;
          transition: color 0.25s, border-color 0.25s;
        }
        .about2-contact-link:hover { color: #00D4FF; border-color: #00D4FF; }

        @media (max-width: 900px) {
          .about2-vertical-label { display: none; }
          .about2-grid { grid-template-columns: 1fr; gap: 40px; }
          .about2-img-stage { max-width: 240px; margin: 0 auto; }
          .about2-watermark { top: 4%; font-size: clamp(3.4rem, 20vw, 6rem); }
          .about2-desc { max-width: 100%; }
          .about2-section { padding-top: clamp(80px, 10vh, 100px); }
        }
      `}</style>

      <section ref={sectionRef} className="about2-section">
        {/* <div className="about2-watermark" aria-hidden="true">Dawood Butt</div> */}

        {/* <div className="about2-vertical-label">
                    <span className="about2-vlabel-dot" />
                    Available For Work
                </div> */}

        <div className="about2-grid">
          {/* ── image ── */}
          <div className="about2-img-stage" ref={imgWrapRef} style={{ justifySelf: 'center' }}>
            <div className="about2-img-glow" aria-hidden="true" />
            <div className="about2-img-clip" ref={clipRef}>
              <img src={PHOTO} alt="Dawood Butt" loading="eager" />
            </div>
            <span className="about2-corner tl" />
            <span className="about2-corner br" />
            {/* <div className="about2-badge">
                            <span className="about2-vlabel-dot" />
                            <span className="about2-badge-text">Open to work</span>
                        </div> */}
          </div>

          {/* ── text ── */}
          <div ref={introRef}>
            <p className="about2-eyebrow about2-anim">
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%', background: '#00D4FF',
                display: 'inline-block', boxShadow: '0 0 8px 2px rgba(0,212,255,0.6)',
              }} />
              About Me
            </p>

            <div className="about2-anim">
              <RevealText
                text="Hey, I'm Dawood"
                tag="h1"
                splitType="chars"
                delay={35}
                duration={0.8}
                className="font-bold text-4xl md:text-6xl"
                textAlign="left"
              />
            </div>

            <p className="about2-role about2-anim" style={{ marginTop: '16px' }}>
              Frontend Developer based in Lahore, Pakistan
            </p>

            <p className="about2-desc about2-anim">
              I have {expLabel} of professional experience — building clean,
              fast, and detail-obsessed interfaces where every animation and
              interaction is intentional.
            </p>

            <div className="about2-cta-row about2-anim">
              <a href={RESUME_PATH} download className="about2-resume-btn">
                <Download size={14} strokeWidth={2.2} />
                Download Resume
              </a>
              <Link to="/contact" className="about2-contact-link">
                <span>Let's Talk</span>
                <ArrowUpRight size={13} strokeWidth={2.4} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}