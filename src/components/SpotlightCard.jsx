import { useRef } from 'react'

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(0, 212, 255, 0.18)' }) => {
  const divRef = useRef(null)

  const handleMouseMove = (e) => {
    const rect = divRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    divRef.current.style.setProperty('--mouse-x', `${x}px`)
    divRef.current.style.setProperty('--mouse-y', `${y}px`)
    divRef.current.style.setProperty('--spotlight-color', spotlightColor)
  }

  return (
    <>
      <style>{`
        .card-spotlight {
          position: relative;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.025), rgba(255, 255, 255, 0.005));
          padding: 2rem;
          overflow: hidden;
          --mouse-x: 50%;
          --mouse-y: 50%;
          --spotlight-color: rgba(0, 212, 255, 0.18);
          transition: border-color 0.3s ease, transform 0.3s ease;
        }

        .card-spotlight:hover {
          border-color: rgba(0, 212, 255, 0.3);
          transform: translateY(-4px);
        }

        .card-spotlight::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .card-spotlight:hover::before,
        .card-spotlight:focus-within::before {
          opacity: 1;
        }
      `}</style>

      <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
        {children}
      </div>
    </>
  )
}

export default SpotlightCard