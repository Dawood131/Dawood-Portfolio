import SkillsDome from '../components/SkillsDome'
import { skills } from '../data/skills'
import RevealText from '../components/RevealText';

export default function Skills() {
  const isMobile = window.innerWidth < 768;

  return (
    <section style={{ position: 'relative', padding: '100px 6vw 60px', overflow: 'hidden', }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw',
          height: '40vh',
          borderRadius: '50%',
          filter: 'blur(140px)',
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, marginBottom: '100px' }}>
        <p style={{
          fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)', marginBottom: '10px',
          fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%', background: '#00D4FF',
            display: 'inline-block', boxShadow: '0 0 8px 2px rgba(0,212,255,0.6)',
          }} />
          What I Work With
        </p>
        <RevealText
          text="SKILLS"
          tag="h2"
          splitType="chars"
          delay={40}
          duration={0.8}
          className="font-bold text-4xl md:text-6xl"
          textAlign="left"
        />
        {/* <p style={{
          marginTop: '14px', fontSize: '13px', color: 'rgba(255,255,255,0.45)',
          fontFamily: 'Inter, sans-serif', maxWidth: '420px', lineHeight: 1.6,
        }}>
          Drag to rotate, tap a tile for a closer look.
        </p> */}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: isMobile ? "350px" : "clamp(420px,60vh,640px)",
        }}
      >
        <SkillsDome
          skills={skills}
          fit={isMobile ? 0.85 : 0.5}
          minRadius={isMobile ? 170 : 450}
          segments={isMobile ? 18 : 28}
          maxVerticalRotationDeg={20}
          dragDampening={0}
          overlayBlurColor="#000000"
          accentColor="#00D4FF"
        />
      </div>
    </section>
  )
}