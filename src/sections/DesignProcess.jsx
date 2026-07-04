import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PenTool, LayoutGrid, Code2, ClipboardCheck, Rocket } from 'lucide-react'
import RevealText from '../components/RevealText'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
    {
        num: '01',
        icon: PenTool,
        title: 'Design',
        desc: 'Sketch the UI/UX direction — layout, flow, colors, and overall feel before a single line of code is written.',
    },
    {
        num: '02',
        icon: LayoutGrid,
        title: 'Plan Components',
        desc: 'Break the design into components — decide structure, state, and how each piece talks to the others.',
    },
    {
        num: '03',
        icon: Code2,
        title: 'Build',
        desc: 'Write clean, reusable code — turning the plan into a working, responsive interface.',
    },
    {
        num: '04',
        icon: ClipboardCheck,
        title: 'Review & Test',
        desc: 'Check functionality, responsiveness, and edge cases — fix bugs before anyone else can find them.',
    },
    {
        num: '05',
        icon: Rocket,
        title: 'Deploy',
        desc: 'Deploy seamlessly with Vercel, Netlify, or Jenkins, then monitor performance and ensure reliable production releases.',
    },
]

function StepCard({ step, index }) {
    const cardRef = useRef(null)
    const isRight = index % 2 === 1
    const Icon = step.icon

    useEffect(() => {
        const el = cardRef.current
        if (!el) return

        gsap.set(el, { opacity: 0, y: 40 })

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
                        observer.unobserve(el)
                    }
                })
            },
            { threshold: 0.2 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div className="process-step">
            <div className="process-step-dot">
                <Icon size={16} strokeWidth={2.2} />
            </div>

            <div
                className={`process-step-card-wrap ${isRight ? 'is-right' : 'is-left'}`}
                ref={cardRef}
            >
                <div className="process-step-card">
                    <span className="process-step-num">{step.num}</span>
                    <h3 className="process-step-title">{step.title}</h3>
                    <p className="process-step-desc">{step.desc}</p>
                </div>
            </div>
        </div>
    )
}

export default function DesignProcess() {
    const sectionRef = useRef(null)
    const lineFillRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                lineFillRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 65%',
                        end: 'bottom 75%',
                        scrub: 0.4,
                    },
                }
            )
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <>
            <style>{`
        .process-section {
          position: relative;
          overflow: hidden;
          padding: clamp(80px, 10vh, 120px) 6vw;
        }

        .process-glow {
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 50vw;
          height: 60vh;
          border-radius: 50%;
          background: #00D4FF;
          filter: blur(170px);
          opacity: 0.07;
          pointer-events: none;
          z-index: 0;
        }

        .process-header {
          position: relative;
          z-index: 1;
          margin-bottom: clamp(60px, 9vh, 96px);
        }

        .process-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-family: Inter, sans-serif;
          margin-bottom: 16px;
        }

        .process-subtitle {
          font-family: Inter, sans-serif;
          font-size: 14px;
          line-height: 1.75;
          color: rgba(255,255,255,0.45);
          max-width: 460px;
          margin-top: 16px;
        }

        /* ── timeline track ── */
        .process-track {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
        }

        .process-line-bg {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          bottom: 6px;
          background: rgba(255,255,255,0.08);
          z-index: 0;
        }

        .process-line-fill {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%) scaleY(0);
          width: 2px;
          bottom: 6px;
          background: linear-gradient(180deg, #00D4FF 0%, rgba(0,212,255,0.3) 100%);
          transform-origin: top center;
          box-shadow: 0 0 16px 2px rgba(0,212,255,0.5);
          z-index: 0;
        }

        .process-steps-list {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: clamp(48px, 7vh, 76px);
        }

        /* ── each step row: dot is absolutely centered, never affects layout width ── */
        .process-step {
          position: relative;
          min-height: 46px;
        }

        .process-step-dot {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #05070a;
          border: 1.5px solid rgba(0,212,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00D4FF;
          box-shadow: 0 0 20px -2px rgba(0,212,255,0.4);
          flex-shrink: 0;
        }

        /* ── card wrapper: fixed percentage width, immune to content-overflow ── */
        .process-step-card-wrap {
          width: calc(50% - 50px);
          min-width: 0;
          box-sizing: border-box;
        }

        .process-step-card-wrap.is-left {
          margin-right: auto;
        }

        .process-step-card-wrap.is-right {
          margin-left: auto;
        }

        .process-step-card {
          position: relative;
          background: linear-gradient(155deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 18px;
          padding: 22px 24px;
          min-width: 0;
          overflow-wrap: break-word;
        }

        .is-left .process-step-card { text-align: right; }
        .is-right .process-step-card { text-align: left; }

        .process-step-num {
          display: block;
          font-family: Inter, sans-serif;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.15em;
          color: rgba(0,212,255,0.55);
          margin-bottom: 10px;
        }

        .process-step-title {
          font-family: Inter, sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: #edeae3;
          letter-spacing: -0.01em;
          margin-bottom: 10px;
        }

        .process-step-desc {
          font-family: Inter, sans-serif;
          font-size: 13.5px;
          line-height: 1.7;
          color: rgba(255,255,255,0.48);
        }

        /* ── mobile: single column, line + dots on left ── */
        @media (max-width: 768px) {
          .process-line-bg, .process-line-fill {
            left: 23px;
            transform: translateX(-50%);
          }
          .process-line-fill { transform: translateX(-50%) scaleY(0); }

          .process-step-dot {
            left: 23px;
          }

          .process-step-card-wrap {
            width: 100%;
            margin: 0 !important;
            padding-left: 64px;
          }

          .is-left .process-step-card,
          .is-right .process-step-card {
            text-align: left;
          }
        }
      `}</style>

            <section className="process-section" ref={sectionRef}>
                <div className="process-glow" aria-hidden="true" />

                <div className="process-header">
                    <p className="process-eyebrow">
                        <span style={{
                            width: '5px', height: '5px', borderRadius: '50%', background: '#00D4FF',
                            display: 'inline-block', boxShadow: '0 0 8px 2px rgba(0,212,255,0.6)',
                        }} />
                        How I Work
                    </p>
                    <RevealText
                        text="My Design Process"
                        tag="h2"
                        splitType="chars"
                        delay={50}
                        duration={0.8}
                        className="font-bold text-4xl md:text-5xl"
                        textAlign="left"
                    />
                    <p className="process-subtitle">
                        Every project follows the same disciplined path — from a rough
                        idea to something live, tested, and ready to use.
                    </p>
                </div>

                <div className="process-track">
                    <div className="process-line-bg" aria-hidden="true" />
                    <div className="process-line-fill" ref={lineFillRef} aria-hidden="true" />

                    <div className="process-steps-list">
                        {STEPS.map((step, i) => (
                            <StepCard key={step.num} step={step} index={i} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}