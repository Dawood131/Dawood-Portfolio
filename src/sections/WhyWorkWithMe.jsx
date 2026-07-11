import { Sparkles, Zap, Users } from 'lucide-react'
import SpotlightCard from '../components/SpotlightCard'
import RevealText from '../components/RevealText'

const VALUES = [
    {
        icon: Sparkles,
        title: 'Pixel-Perfect UI',
        desc: 'I turn designs into interfaces that match — spacing, type, motion, all of it — not just "close enough".',
    },
    {
        icon: Zap,
        title: 'Fast & Optimized',
        desc: 'Clean, performant code with smooth animations that feel good to use, not just look good in a screenshot.',
    },
    {
        icon: Users,
        title: 'Easy To Collaborate With',
        desc: 'Clear communication and comfortable working closely with backend teams, designers, or solo on a project.',
    },
]

export default function WhyWorkWithMe() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@300;400&display=swap');

        .wwm-icon-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(0,212,255,0.08);
          border: 1px solid rgba(0,212,255,0.22);
          color: #00D4FF;
          margin-bottom: clamp(18px, 2.5vh, 24px);
        }
      `}</style>

            <section
                className="relative w-full"
                style={{ padding: 'clamp(60px,9vh,100px) clamp(16px,6vw,80px)' }}
            >
                <div style={{ marginBottom: 'clamp(36px, 6vh, 56px)' }}>
                    <p
                        className="font-mono uppercase"
                        style={{
                            fontSize: '10px',
                            letterSpacing: '0.3em',
                            color: 'rgba(255,255,255,0.3)',
                            marginBottom: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <span
                            style={{
                                width: '5px', height: '5px', borderRadius: '50%',
                                background: '#00D4FF', display: 'inline-block',
                                boxShadow: '0 0 8px 2px rgba(0,212,255,0.6)',
                            }}
                        />
                        What I Bring
                    </p>
                    <RevealText
                        text="WHY WORK WITH ME"
                        tag="h2"
                        splitType="chars"
                        delay={40}
                        duration={0.8}
                        className="font-bold text-4xl md:text-6xl"
                        textAlign="left"
                    />
                </div>

                <div
                    className="grid gap-5"
                    style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
                >
                    {VALUES.map(({ icon: Icon, title, desc }) => (
                        <SpotlightCard key={title} spotlightColor="rgba(0, 212, 255, 0.18)">
                            <div className="wwm-icon-box">
                                <Icon size={20} strokeWidth={1.8} />
                            </div>
                            <h3
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 700,
                                    fontSize: '18px',
                                    color: '#edeae3',
                                    marginBottom: '10px',
                                }}
                            >
                                {title}
                            </h3>
                            <p
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: '13.5px',
                                    lineHeight: 1.7,
                                    color: 'rgba(255,255,255,0.5)',
                                    margin: 0,
                                }}
                            >
                                {desc}
                            </p>
                        </SpotlightCard>
                    ))}
                </div>
            </section>
        </>
    )
}