import { useEffect, useRef } from 'react'
import Particles from './Particles'

export default function ParticlesBg() {
  const isMobile = window.innerWidth < 768

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Particles
        particleColors={['#ffffff']}
        particleCount={isMobile ? 80 : 150}
        particleSpread={10}
        speed={0.05}
        particleBaseSize={isMobile ? 60 : 80}
        moveParticlesOnHover={false}
        alphaParticles={true}
        disableRotation={false}
        pixelRatio={Math.min(window.devicePixelRatio, 2.0)}
      />
    </div>
  )
}