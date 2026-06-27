import Experience from '../sections/Experience'

export default function About() {
  return (
    <>
      <style>{`
        .about-section {
          position: relative;
          padding: clamp(80px, 12vh, 140px) 6vw clamp(20px, 4vh, 40px);
          overflow: hidden;
        }

        .about-glow {
          position: absolute;
          top: -5%;
          left: 50%;
          transform: translateX(-50%);
          width: 55vw;
          height: 45vh;
          background: #00D4FF;
          filter: blur(150px);
          opacity: 0.08;
          pointer-events: none;
          z-index: 0;
        }

        .about-header {
          position: relative;
          z-index: 1;
          margin-bottom: clamp(28px, 4vh, 40px);
        }

        .about-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-family: 'Space Mono', monospace;
          margin-bottom: 10px;
        }

        .about-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00D4FF;
          box-shadow: 0 0 8px 2px rgba(0,212,255,0.6);
          display: inline-block;
        }

        .about-heading {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 800;
          color: white;
          letter-spacing: -0.035em;
          line-height: 1;
          font-family: Inter, sans-serif;
          margin: 0;
        }

        .about-bio {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: clamp(20px, 3vh, 28px) 0 0;
        }

        .about-bio p {
          font-family: Inter, sans-serif;
          font-size: clamp(14px, 1.4vw, 16px);
          line-height: 1.8;
          color: rgba(255,255,255,0.6);
          margin: 0 0 16px;
        }

        .about-bio p:last-child {
          margin-bottom: 0;
        }

        .about-bio strong {
          color: rgba(255,255,255,0.88);
          font-weight: 600;
        }

        .about-status {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: clamp(20px, 3vh, 28px);
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(74,222,128,0.3);
          background: rgba(74,222,128,0.08);
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #4ade80;
        }

        .about-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px 2px rgba(74,222,128,0.5);
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .about-section { padding: clamp(60px, 10vh, 100px) 5vw 20px; }
          .about-bio p { font-size: 13.5px; }
        }
      `}</style>

      <section className="about-section">
        <div className="about-glow" aria-hidden="true" />

        <div className="about-header">
          <p className="about-eyebrow">
            <span className="about-eyebrow-dot" />
            Get To Know Me
          </p>
          <h1 className="about-heading">ABOUT ME</h1>
        </div>

        <div className="about-bio">
          <p>
            I'm <strong>Dawood Butt</strong>, a frontend developer who enjoys
            turning ideas and designs into clean, interactive interfaces. I
            started out as an intern, converting Figma designs into
            responsive React UIs and learning how real production codebases
            work — and I've since moved into a full-time role where I get
            to build complete web applications from the ground up, working
            closely with backend teams on API integration and real users.
          </p>
          <p>
            I mostly work with <strong>React, Tailwind CSS, and Redux</strong>,
            and I'm always picking up new tools along the way — right now
            that's <strong>GSAP</strong> and 3D web experiences, to make the
            things I build feel a little more alive. I care about writing
            UI that's not just functional but genuinely nice to use.
          </p>
        </div>

        <div className="about-status">
          <span className="about-status-dot" />
          Currently building at Offneo · open to new opportunities
        </div>
      </section>

      <Experience />
    </>
  )
}