import { FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const EMAIL = 'buttdaud94@gmail.com'

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const GmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
)

export default function Footer({ showCTA = true }) {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@300;400&display=swap');

        @keyframes pulse-dot-cyan {
          0%,100% { opacity:1; transform:scale(1);    box-shadow:0 0 0 0   rgba(0,212,255,0.4); }
          50%      { opacity:.7; transform:scale(.75); box-shadow:0 0 0 5px rgba(0,212,255,0);   }
        }
        .footer-avail-dot { animation: pulse-dot-cyan 2.8s ease-in-out infinite; }

        .footer-card-glow {
          position: absolute;
          top: -15%;
          left: 50%;
          transform: translateX(-50%);
          width: 55%;
          height: 70%;
          background: #00D4FF;
          filter: blur(120px);
          opacity: 0.07;
          pointer-events: none;
        }

        .footer-card-wrap {
          position: relative;
          border-radius: 28px;
          padding: 1.5px;
          overflow: hidden;
          isolation: isolate;
        }
        .footer-card-wrap::before {
          content: '';
          position: absolute;
          inset: -60%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 260deg,
            rgba(0,212,255,0.85) 295deg,
            #fff 305deg,
            rgba(0,212,255,0.85) 315deg,
            transparent 350deg,
            transparent 360deg
          );
          animation: footer-border-spin 5s linear infinite;
          z-index: 0;
        }
        @keyframes footer-border-spin {
          to { transform: rotate(360deg); }
        }

        .footer-card-inner {
          position: relative;
          z-index: 1;
          border-radius: 27px;
          background: #0a0b0d;
          overflow: hidden;
        }

        .footer-cta-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #edeae3;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 999px;
          padding: 13px 30px;
          transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease, transform 0.2s ease;
        }
        .footer-cta-btn:hover {
          border-color: rgba(0,212,255,0.55);
          color: #00D4FF;
          background: rgba(0,212,255,0.06);
          transform: translateY(-2px);
        }

        .footer-icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .footer-icon-link:hover {
          color: #00D4FF;
          transform: translateY(-2px);
        }
      `}</style>

      <footer
        className="relative w-full"
        style={{ padding: 'clamp(40px,5vh,64px) clamp(16px,5vw,60px) clamp(32px,4vh,44px)' }}
      >
        {showCTA && (
          <div className="footer-card-wrap">
            <div
              className="footer-card-inner relative w-full flex flex-col items-center text-center"
              style={{ padding: 'clamp(56px,9vh,96px) clamp(20px,6vw,60px)' }}
            >
              <div className="footer-card-glow" aria-hidden="true" />

              <div
                className="relative flex items-center gap-2 font-mono uppercase"
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.22em',
                  color: '#00D4FF',
                  background: 'rgba(0,212,255,0.08)',
                  border: '1px solid rgba(0,212,255,0.25)',
                  borderRadius: '999px',
                  padding: '7px 16px',
                  marginBottom: 'clamp(22px, 4vh, 32px)',
                }}
              >
                <span
                  className="footer-avail-dot rounded-full bg-cyan-400 inline-block"
                  style={{ width: '6px', height: '6px' }}
                />
                Open To New Work
              </div>

              <h2
                className="relative font-bold tracking-[-0.03em] leading-[1.08]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: '#edeae3',
                  fontSize: 'clamp(2rem, 5.5vw, 3.8rem)',
                  marginBottom: 'clamp(28px, 4.5vh, 40px)',
                }}
              >
                Got a project in mind?<br />
                <span className="text-cyan-400">Let's build it.</span>
              </h2>

              <Link
                to="/projects"
                className="footer-cta-btn relative"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <FolderOpen size={14} strokeWidth={1.8} />
                See My Work
              </Link>
            </div>
          </div>
        )}

        <div
          className="w-full flex flex-col md:flex-row items-center justify-between gap-5"
          style={{ marginTop: showCTA ? "clamp(24px, 4vh, 32px)" : 0 }}
        >
          {/* Social Icons */}
          <div className="flex items-center justify-center gap-5 md:order-2">
            <a
              href="https://www.linkedin.com/in/muhammad-dawood-butt-413192282"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="footer-icon-link"
            >
              <LinkedInIcon />
            </a>

            <a
              href="https://github.com/Dawood131"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="footer-icon-link"
            >
              <GitHubIcon />
            </a>

            <a
              href={`mailto:${EMAIL}`}
              target="_blank"
              title="Gmail"
              className="footer-icon-link"
            >
              <GmailIcon />
            </a>
          </div>

          {/* Copyright */}
          <p
            className="font-mono text-center md:text-left md:order-1"
            style={{
              fontSize: "clamp(10px, 2vw, 11px)",
              letterSpacing: "0.05em",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            © {year} Dawood Butt. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}