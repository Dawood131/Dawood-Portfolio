import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { FolderOpen, User } from 'lucide-react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

// Tracks whether the hero intro has already played once. Lives at module
// scope (not component state) so it survives the Hero component unmounting
// and remounting when the user navigates away and back to Home within the
// same session — that's exactly when this was re-triggering and feeling
// repetitive/irritating. A full page reload still resets it, which is the
// expected "first visit" experience.
let heroIntroPlayed = false

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const GmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
)

export default function Hero({ isReady }) {
  const containerRef = useRef(null)
  const nameRef = useRef(null)
  const roleRef = useRef(null)
  const lineRef = useRef(null)
  const tagRef = useRef(null)
  const btnsRef = useRef(null)
  const socialRef = useRef(null)
  const availRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    if (!isReady) {
      // Only worth hiding pre-emptively if we're about to actually run the
      // animated intro. If it already played once this session, there's no
      // "hide then reveal" step at all — skip straight to final state once
      // isReady flips, see below.
      if (!heroIntroPlayed) {
        gsap.set([nameRef.current, roleRef.current, tagRef.current, availRef.current], { opacity: 0 })
        gsap.set(lineRef.current, { opacity: 0, scaleX: 0 })
        gsap.set(dotRef.current, { opacity: 0, scale: 0 })
        if (btnsRef.current?.children) gsap.set(btnsRef.current.children, { opacity: 0 })
        if (socialRef.current) gsap.set(socialRef.current.querySelectorAll('.social-icon'), { opacity: 0 })
      }
      return
    }

    if (heroIntroPlayed) {
      // Already played once this session — snap straight to the final
      // visible state, no animation, no delay.
      gsap.set([nameRef.current, roleRef.current, tagRef.current, availRef.current], {
        opacity: 1, y: 0, filter: 'blur(0px)',
      })
      gsap.set(lineRef.current, { opacity: 1, scaleX: 1, boxShadow: '0 0 0px rgba(0,212,255,0)' })
      gsap.set(dotRef.current, { opacity: 1, scale: 1 })
      if (tagRef.current) {
        gsap.set(tagRef.current.querySelectorAll('.word'), { opacity: 1, y: 0, filter: 'blur(0px)' })
      }
      if (btnsRef.current?.children) {
        gsap.set(btnsRef.current.children, { opacity: 1, y: 0, scale: 1 })
      }
      if (socialRef.current) {
        gsap.set(socialRef.current.querySelectorAll('.social-icon'), { opacity: 1, y: 0 })
      }
      return
    }

    heroIntroPlayed = true

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      tl.fromTo(nameRef.current,
        { opacity: 0, y: 40, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power4.out' })

      tl.fromTo(roleRef.current,
        { opacity: 0, y: 18, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, '-=0.7')

      tl.fromTo(dotRef.current,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.3')

      tl.to(lineRef.current,
        { opacity: 1, scaleX: 1, transformOrigin: 'center center', duration: 1.0, ease: 'expo.inOut' })

      tl.fromTo(lineRef.current,
        { boxShadow: '0 0 0px rgba(0,212,255,0)' },
        { boxShadow: '0 0 18px rgba(0,212,255,0.6)', duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1 }, '-=0.05')

      tl.set(tagRef.current, { opacity: 1 })
      const words = tagRef.current.querySelectorAll('.word')
      tl.fromTo(words,
        { opacity: 0, y: 10, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.055, ease: 'power2.out' }, '-=0.3')

      tl.fromTo(btnsRef.current.children,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.13, ease: 'power3.out' }, '-=0.2')

      const icons = socialRef.current.querySelectorAll('.social-icon')
      tl.fromTo(icons,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out' }, '-=0.3')

      tl.fromTo(availRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')

    }, containerRef)
    return () => ctx.revert()
  }, [isReady])

  const tagline = "Every pixel has a purpose. I build frontend experiences that are fast, focused, and impossible to ignore."
  const words = tagline.split(' ')
  const cyanList = ['purpose.', 'fast,', 'focused,', 'impossible']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@300;400&display=swap');

        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1);    box-shadow:0 0 0 0   rgba(74,222,128,0.4); }
          50%      { opacity:.7; transform:scale(.75); box-shadow:0 0 0 5px rgba(74,222,128,0);   }
        }
        .avail-dot { animation: pulse-dot 2.8s ease-in-out infinite; }

        /* Primary btn — shine sweep */
        .btn-primary {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          color: #0d0d0d;
          background: #edeae3;
          padding: 16px 40px;
          border: 1px solid transparent;
          transition: background 0.22s, transform 0.2s, box-shadow 0.22s;
        }
        .btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(110deg, transparent 20%, rgba(0,212,255,.2) 50%, transparent 80%);
          background-size: 200% 100%;
          background-position: 200% center;
          transition: background-position .6s ease;
        }
        .btn-primary:hover::before { background-position: -200% center; }
        .btn-primary:hover {
          background: #fff;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,.35), 0 0 24px rgba(0,212,255,.12);
        }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary .btn-arrow {
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .btn-primary:hover .btn-arrow { transform: translateX(3px); }

        /* Ghost btn */
        .btn-ghost {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.35);
          background: transparent;
          padding: 15px 36px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: color 0.22s, border-color 0.22s, background 0.22s, transform 0.2s, box-shadow 0.22s;
        }
        .btn-ghost::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(0,212,255,.04);
          opacity: 0;
          transition: opacity 0.22s;
        }
        .btn-ghost:hover::before { opacity: 1; }
        .btn-ghost:hover {
          color: rgba(0,212,255,.9);
          border-color: rgba(0,212,255,.28);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,.2), 0 0 16px rgba(0,212,255,.06);
        }
        .btn-ghost:active { transform: translateY(0); }
        .btn-ghost .btn-icon {
          opacity: 0.5;
          transition: opacity 0.2s, transform 0.2s;
        }
        .btn-ghost:hover .btn-icon {
          opacity: 1;
          transform: rotate(-45deg);
        }
      `}</style>

      <section
        ref={containerRef}
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ padding: 'clamp(60px,8vh,140px) clamp(16px,6vw,80px) clamp(40px,5vh,80px)', }}
      >
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse 80% 70% at center, transparent 30%, rgba(0,0,0,.6) 100%)' }}
        />

        {/* ── CENTER CONTENT ── */}
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[860px]">

          {/* Name */}
          <h1
            ref={nameRef}
            className="font-bold tracking-[-0.035em] text-[#edeae3] leading-[1]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(3.2rem,9vw,8.8rem)',
              marginBottom: 'clamp(16px, 2.5vh, 28px)',
            }}
          >
            Dawood Butt
          </h1>

          {/* Role */}
          <p
            ref={roleRef}
            className="font-mono tracking-[.26em] uppercase text-cyan-400"
            style={{
              fontSize: 'clamp(15px, 3vw, 20px)',
              fontWeight: 300,
              marginBottom: 'clamp(24px, 4vh, 44px)',
            }}
          >
            Frontend Developer
          </p>

          {/* Divider */}
          <div
            className="relative mx-auto"
            style={{
              width: 'clamp(200px, 45vw, 460px)',
              height: '1px',
              marginBottom: 'clamp(32px, 5vh, 52px)',
            }}
          >
            <span
              ref={lineRef}
              className="block w-full"
              style={{
                height: '1px',
                transformOrigin: 'center center',
                background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,.08) 10%, rgba(0,212,255,.65) 50%, rgba(0,212,255,.08) 90%, transparent 100%)',
              }}
            />
            <span
              ref={dotRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400"
              style={{
                width: '5px',
                height: '5px',
                boxShadow: '0 0 0 2px rgba(0,212,255,.15), 0 0 14px rgba(0,212,255,1)',
              }}
            />
          </div>

          {/* Tagline */}
          <p
            ref={tagRef}
            className="font-light text-white/[.62] max-w-[540px]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(14px, 1.35vw, 17px)',
              lineHeight: '1.9',
              letterSpacing: '0.025em',
              wordSpacing: '0.05em',
              marginBottom: 'clamp(36px, 5.5vh, 60px)',
            }}
          >
            {words.map((w, i) => (
              <span
                key={i}
                className={`word${cyanList.includes(w) ? ' text-cyan-400 font-medium' : ''}`}
                style={{ display: 'inline', marginRight: '0' }}
              >
                {w}{' '}
              </span>
            ))}
          </p>

          {/* Buttons */}
          <div
            ref={btnsRef}
            className="flex items-center justify-center flex-wrap"
            style={{ gap: 'clamp(10px, 1.5vw, 16px)', marginBottom: 'clamp(28px, 4vh, 44px)' }}
          >
            {/* Primary */}
            <Link
              to="/projects"
              className="group relative inline-flex items-center justify-center gap-3 no-underline cursor-pointer active:scale-[0.97] transition-transform duration-150"
              style={{ width: 'clamp(160px,18vw,210px)', height: '50px' }}
            >
              <span className="absolute inset-0 border border-white/20 group-hover:border-cyan-400/50 transition-colors duration-300 pointer-events-none" />
              <span className="absolute top-0 left-0 w-[10px] h-[10px] border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <span className="absolute bottom-0 right-0 w-[10px] h-[10px] border-b-2 border-r-2 border-cyan-400 pointer-events-none" />
              <span className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/[0.04] transition-colors duration-300 pointer-events-none" />

              <span className="relative z-10 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-200 font-mono text-[10px] tracking-[0.22em] uppercase">
                <FolderOpen size={13} className="opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                View My Work
                <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
              </span>

            </Link>

            {/* Ghost */}
            <Link
              to="/about"
              className="group relative inline-flex items-center justify-center gap-3 no-underline cursor-pointer active:scale-[0.97] transition-transform duration-150"
              style={{ width: 'clamp(160px,18vw,210px)', height: '50px' }}
            >
              <span className="absolute inset-0 border border-white/10 group-hover:border-cyan-400/30 transition-colors duration-300 pointer-events-none" />
              <span className="absolute top-0 right-0 w-[10px] h-[10px] border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <span className="absolute bottom-0 left-0 w-[10px] h-[10px] border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <span className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/[0.04] transition-colors duration-300 pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors duration-200 font-mono text-[10px] tracking-[0.22em] uppercase">
                <User size={13} className="opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                Get To Know Me
                <span className="transition-transform duration-250 group-hover:-rotate-45 inline-block">↗</span>
              </span>
            </Link>
          </div>

          {/* Social icons */}
          <div ref={socialRef} className="flex items-center gap-2">
            {[
              { href: 'https://www.linkedin.com/in/muhammad-dawood-butt-413192282', icon: <LinkedInIcon />, label: 'LinkedIn' },
              { href: 'https://github.com/Dawood131', icon: <GitHubIcon />, label: 'GitHub' },
              { href: 'mailto:buttdaud94@gmail.com', icon: <GmailIcon />, label: 'Gmail' },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="social-icon group relative flex items-center justify-center w-[44px] h-[44px] no-underline cursor-pointer active:scale-95 transition-transform duration-150"
                style={{ background: 'rgba(0,212,255,0.04)' }}
              >
                <span
                  className="absolute inset-0 border border-cyan-400/20 group-hover:border-cyan-400/60 transition-colors duration-300 pointer-events-none"
                  style={{ transform: 'rotate(45deg)', borderRadius: '3px' }}
                />
                <span className="relative z-10 text-white/40 group-hover:text-cyan-400 transition-colors duration-200">
                  {icon}
                </span>
              </a>
            ))}
          </div>
        </div>

      </section>
    </>
  )
}