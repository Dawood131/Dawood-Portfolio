import SkillsDome from '../components/SkillsDome'
import { skills } from '../data/skills'

export default function Skills() {
  return (
    <section style={{ position: 'relative', padding: '100px 6vw 60px', overflow: 'hidden',}}>
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

      <div style={{ position: 'relative', zIndex: 1, marginBottom: '60px' }}>
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
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, color: 'white',
          letterSpacing: '-0.035em', lineHeight: 1, fontFamily: 'Inter, sans-serif',
        }}>
          SKILLS
        </h2>
        <p style={{
          marginTop: '14px', fontSize: '13px', color: 'rgba(255,255,255,0.45)',
          fontFamily: 'Inter, sans-serif', maxWidth: '420px', lineHeight: 1.6,
        }}>
          Drag to rotate, tap a tile for a closer look.
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 1, height: 'clamp(420px, 60vh, 640px)' }}>
        <SkillsDome
          skills={skills}
          fit={0.5}
          minRadius={450}
          maxVerticalRotationDeg={20}
          segments={28}
          dragDampening={0}
          overlayBlurColor="#000000"
          accentColor="#00D4FF"
        />
      </div>
    </section>
  )
}