import { useRef, useEffect, useState, useCallback } from 'react'
import { BadgeCheck, Calendar, Building2, ExternalLink, X, Expand, ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import RevealText from '../components/RevealText'
import { achievements } from '../data/achievements'

// const AUTOPLAY_DELAY = 5000

function CertificateCard({ item, onExpand }) {
    const frameRef = useRef(null)

    const handleMove = (e) => {
        const frame = frameRef.current
        if (!frame || window.matchMedia('(pointer: coarse)').matches) return
        const r = frame.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        frame.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 10}deg)`
    }
    const handleLeave = () => {
        if (frameRef.current) frameRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
    }

    return (
        <div className="ach-slide">
            <div className="ach-grid">
                <div>
                    <h3 className="ach-detail-title">{item.title}</h3>
                    <div className="ach-meta-row">
                        <Building2 size={15} strokeWidth={2} />
                        {item.company} — {item.program}
                    </div>
                    <div className="ach-meta-row">
                        <Calendar size={15} strokeWidth={2} />
                        {item.duration}
                    </div>
                    <p className="ach-desc">{item.description}</p>
                    {item.verifyLink ? (
                        <a href={item.verifyLink} target="_blank" rel="noopener noreferrer" className="ach-verify-btn">
                            Verify Certificate
                            <ExternalLink size={13} strokeWidth={2.2} />
                        </a>
                    ) : null}
                </div>

                <div className="ach-frame-stage">
                    <div className="ach-frame-glow" aria-hidden="true" />
                    <div
                        className="ach-frame"
                        ref={frameRef}
                        onMouseMove={handleMove}
                        onMouseLeave={handleLeave}
                        onClick={() => onExpand(item.image)}
                        role="button"
                        tabIndex={0}
                        aria-label="Expand certificate"
                    >
                        <img src={item.image} alt={item.title} loading="lazy" />
                        <span className="ach-corner tl" />
                        <span className="ach-corner br" />
                        <div className="ach-expand-hint">
                            <Expand size={14} strokeWidth={2.2} />
                            Click to expand
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Achievements() {
    const sectionRef = useRef(null)
    const trackRef = useRef(null)
    const overlayRef = useRef(null)
    const overlayImgRef = useRef(null)
    const [active, setActive] = useState(0)
    const [lightboxImg, setLightboxImg] = useState(null)
    const [isPaused, setIsPaused] = useState(false)
    const total = achievements.length

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return
        gsap.set(el, { opacity: 0, y: 36 })
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
                        observer.unobserve(el)
                    }
                })
            },
            { threshold: 0.15 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const goTo = useCallback((i) => {
        if (total === 0) return
        const wrapped = (i + total) % total
        setActive(wrapped)
    }, [total])

    // ── autoplay ──
    //   useEffect(() => {
    //     if (total <= 1 || isPaused || lightboxImg) return
    //     const id = setInterval(() => {
    //       setActive((prev) => (prev + 1) % total)
    //     }, AUTOPLAY_DELAY)
    //     return () => clearInterval(id)
    //   }, [total, isPaused, lightboxImg])

    useEffect(() => {
        if (!lightboxImg) return
        document.body.style.overflow = 'hidden'
        gsap.set(overlayRef.current, { opacity: 0 })
        gsap.set(overlayImgRef.current, { opacity: 0, scale: 0.85, y: 20 })
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        gsap.to(overlayImgRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.05 })

        const onKey = (e) => { if (e.key === 'Escape') closeLightbox() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightboxImg])

    const closeLightbox = () => {
        gsap.to(overlayImgRef.current, { opacity: 0, scale: 0.9, y: 10, duration: 0.25, ease: 'power2.in' })
        gsap.to(overlayRef.current, {
            opacity: 0, duration: 0.25, ease: 'power2.in', delay: 0.05,
            onComplete: () => { document.body.style.overflow = ''; setLightboxImg(null) },
        })
    }

    return (
        <>
            <style>{`
        .ach-section { position: relative; overflow: hidden; padding: clamp(80px, 10vh, 120px) 6vw; }
        .ach-glow { position: absolute; bottom: -10%; right: 0%; width: 50vw; height: 55vh; border-radius: 50%; ; filter: blur(170px); opacity: 0.08; pointer-events: none; z-index: 0; }
        .ach-header { position: relative; z-index: 1; margin-bottom: clamp(40px, 6vh, 60px); display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 20px; }
        .ach-eyebrow { display: inline-flex; align-items: center; gap: 9px; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.3); font-family: Inter, sans-serif; margin-bottom: 16px; }
        .ach-subtitle { font-family: Inter, sans-serif; font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.45); max-width: 460px; margin-top: 16px; }

        .ach-nav { display: flex; gap: 10px; flex-shrink: 0; }
        .ach-nav-btn { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.6); cursor: pointer; transition: border-color 0.25s, color 0.25s, background 0.25s; }
        .ach-nav-btn:hover { border-color: rgba(0,212,255,0.4); color: #00D4FF; background: rgba(0,212,255,0.06); }

        .ach-viewport { position: relative; z-index: 1; overflow: hidden; }
        .ach-track { display: flex; }
        .ach-slide { width: 100%; flex-shrink: 0; }

        .ach-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(40px, 6vw, 80px); align-items: center; max-width: 1100px; margin: 0 auto; }

        .ach-frame-stage { position: relative; }
        .ach-frame-glow { position: absolute; inset: -6%; background: radial-gradient(circle at 50% 50%, rgba(0,212,255,0.16), transparent 70%); filter: blur(30px); z-index: -1; }
        .ach-frame { position: relative; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.12); background: #0a0c0e; box-shadow: 0 40px 90px -24px rgba(0,0,0,0.75); transition: transform 0.25s ease-out; will-change: transform; cursor: pointer; }
        .ach-frame img { width: 100%; display: block; aspect-ratio: 4 / 3; object-fit: cover; }
        .ach-corner { position: absolute; width: 22px; height: 22px; border: 2px solid #00D4FF; z-index: 2; pointer-events: none; }
        .ach-corner.tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
        .ach-corner.br { bottom: 10px; right: 10px; border-left: none; border-top: none; }

        .ach-expand-hint { position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(5,7,10,0.55); opacity: 0; transition: opacity 0.25s ease; font-family: Inter, sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: #edeae3; text-transform: uppercase; }
        .ach-frame:hover .ach-expand-hint { opacity: 1; }

        .ach-detail-title { font-family: Inter, sans-serif; font-weight: 800; font-size: clamp(1.4rem, 2.4vw, 1.9rem); color: #edeae3; letter-spacing: -0.02em; margin-bottom: 18px; line-height: 1.25; }
        .ach-meta-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; font-family: Inter, sans-serif; font-size: 13px; color: rgba(255,255,255,0.55); }
        .ach-meta-row svg { color: #00D4FF; flex-shrink: 0; }
        .ach-desc { font-family: Inter, sans-serif; font-size: 14px; line-height: 1.8; color: rgba(255,255,255,0.48); margin: 22px 0 28px; max-width: 420px; }
        .ach-verify-btn { display: inline-flex; align-items: center; gap: 9px; font-family: Inter, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #edeae3; text-decoration: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 13px 24px; transition: border-color 0.25s, color 0.25s, background 0.25s, transform 0.2s; }
        .ach-verify-btn:hover { border-color: rgba(0,212,255,0.5); color: #00D4FF; background: rgba(0,212,255,0.06); transform: translateY(-2px); }

        .ach-dots { display: flex; justify-content: center; gap: 8px; margin-top: clamp(32px, 5vh, 48px); position: relative; z-index: 1; }
        .ach-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; padding: 0; cursor: pointer; transition: background 0.3s, width 0.3s, border-radius 0.3s; }
        .ach-dot.is-active { background: #00D4FF; width: 22px; border-radius: 3px; }

        @media (max-width: 860px) {
          .ach-grid { grid-template-columns: 1fr; gap: 36px; }
          .ach-desc { max-width: 100%; }
        }

        .ach-lightbox-overlay { position: fixed; inset: 0; z-index: 999; background: rgba(5,7,10,0.92); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 5vh 5vw; }
        .ach-lightbox-img-wrap { position: relative; max-width: 1000px; max-height: 90vh; width: 100%; }
        .ach-lightbox-img-wrap img { width: 100%; height: auto; max-height: 90vh; object-fit: contain; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 50px 100px -30px rgba(0,0,0,0.8); display: block; }
        .ach-lightbox-close { position: fixed; top: 24px; right: 24px; z-index: 1000; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #edeae3; cursor: pointer; transition: background 0.25s, border-color 0.25s, transform 0.2s; backdrop-filter: blur(8px); }
        .ach-lightbox-close:hover { background: rgba(0,212,255,0.12); border-color: rgba(0,212,255,0.4); color: #00D4FF; transform: rotate(90deg); }
        @media (max-width: 640px) { .ach-lightbox-close { top: 16px; right: 16px; width: 36px; height: 36px; } }
      `}</style>

            <section
                className="ach-section"
                ref={sectionRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="ach-glow" aria-hidden="true" />

                <div className="ach-header">
                    <div>
                        <p className="ach-eyebrow">
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00D4FF', display: 'inline-block', boxShadow: '0 0 8px 2px rgba(0,212,255,0.6)' }} />
                            Certification
                        </p>
                        <RevealText
                            text="Achievements"
                            tag="h2"
                            splitType="chars"
                            delay={50}
                            duration={0.8}
                            className="font-bold text-4xl md:text-5xl"
                            textAlign="left"
                        />
                        <p className="ach-subtitle">
                            Showcasing certifications, achievements, and milestones that reflect my skills, dedication, and continuous growth as a developer.
                        </p>
                    </div>

                    {total > 1 && (
                        <div className="ach-nav">
                            <button className="ach-nav-btn" onClick={() => goTo(active - 1)} aria-label="Previous">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="ach-nav-btn" onClick={() => goTo(active + 1)} aria-label="Next">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="ach-viewport">
                    <div
                        className="ach-track"
                        ref={trackRef}
                        style={{ transform: `translateX(-${active * 100}%)`, transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}
                    >
                        {achievements.map((item) => (
                            <CertificateCard key={item.id} item={item} onExpand={setLightboxImg} />
                        ))}
                    </div>
                </div>

                {total > 1 && (
                    <div className="ach-dots">
                        {achievements.map((item, i) => (
                            <button
                                key={item.id}
                                className={`ach-dot ${i === active ? 'is-active' : ''}`}
                                onClick={() => goTo(i)}
                                aria-label={`Go to ${item.title}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {lightboxImg && (
                <div className="ach-lightbox-overlay" ref={overlayRef} onClick={closeLightbox}>
                    <div className="ach-lightbox-img-wrap" ref={overlayImgRef} onClick={(e) => e.stopPropagation()}>
                        <button className="ach-lightbox-close" onClick={closeLightbox} aria-label="Close">
                            <X size={18} strokeWidth={2.2} />
                        </button>
                        <img src={lightboxImg} alt="Certificate full view" />
                    </div>
                </div>
            )}
        </>
    )
}