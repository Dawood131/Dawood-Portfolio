import { useState } from 'react'

const EMAIL = 'buttdaud94@gmail.com'

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const year = new Date().getFullYear()

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard not available — the link still works as a fallback
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        .footer-section {
          position: relative;
          overflow: hidden;
          background: #07080a;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: clamp(70px, 12vh, 120px) 6vw clamp(28px, 4vh, 36px);
        }

        .footer-glow {
          position: absolute;
          top: -10%;
          left: 50%;
          transform: translateX(-50%);
          width: 65vw;
          height: 55vh;
          background: #00D4FF;
          filter: blur(160px);
          opacity: 0.09;
          pointer-events: none;
          z-index: 0;
        }

        .footer-top {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .footer-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          border-radius: 999px;
          border: 1px solid rgba(74,222,128,0.3);
          background: rgba(74,222,128,0.08);
          font-family: 'Space Mono', monospace;
          font-size: 11.5px;
          color: #4ade80;
          margin-bottom: clamp(22px, 4vh, 32px);
        }

        .footer-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px 2px rgba(74,222,128,0.5);
          flex-shrink: 0;
        }

        .footer-heading {
          font-family: Inter, sans-serif;
          font-weight: 800;
          font-size: clamp(2.1rem, 6vw, 4.2rem);
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: #fff;
          margin: 0;
        }

        .footer-heading .accent {
          color: #00D4FF;
        }

        .footer-sub {
          font-family: Inter, sans-serif;
          font-size: clamp(13.5px, 1.4vw, 15.5px);
          color: rgba(255,255,255,0.45);
          max-width: 480px;
          margin: clamp(14px, 2vh, 18px) 0 0;
          line-height: 1.7;
        }

        .footer-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: clamp(30px, 5vh, 44px);
        }

        .footer-email-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 22px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.03);
          font-family: 'Space Mono', monospace;
          font-size: 13.5px;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .footer-email-btn:hover {
          border-color: rgba(0,212,255,0.4);
          background: rgba(0,212,255,0.06);
        }

        .footer-email-btn svg { flex-shrink: 0; color: #00D4FF; }

        .footer-copied {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #4ade80;
        }

        .footer-cta-btn {
          padding: 14px 28px;
          border-radius: 999px;
          background: #00D4FF;
          color: #07080a;
          font-family: Inter, sans-serif;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 0 0 0 rgba(0,212,255,0.5);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .footer-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -8px rgba(0,212,255,0.55);
        }

        .footer-socials {
          display: flex;
          gap: 14px;
          margin-top: clamp(36px, 5vh, 48px);
        }

        .footer-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.55);
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }

        .footer-social-link:hover {
          border-color: rgba(0,212,255,0.4);
          color: #00D4FF;
          transform: translateY(-3px);
        }

        .footer-divider {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: clamp(56px, 8vh, 80px) auto 0;
          border-top: 1px solid rgba(255,255,255,0.07);
        }

        .footer-bottom {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 22px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        .footer-copy {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin: 0;
        }

        .footer-bottom-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-built {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          margin: 0;
        }

        .footer-top-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }

        .footer-top-btn:hover {
          border-color: rgba(0,212,255,0.4);
          color: #00D4FF;
          transform: translateY(-2px);
        }

        @media (max-width: 600px) {
          .footer-section { padding: 60px 6vw 24px; }
          .footer-actions { flex-direction: column; width: 100%; }
          .footer-email-btn, .footer-cta-btn { width: 100%; justify-content: center; text-align: center; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
          .footer-bottom-right { width: 100%; justify-content: space-between; }
        }
      `}</style>

      <footer className="footer-section">
        <div className="footer-glow" aria-hidden="true" />

        <div className="footer-top">
          <span className="footer-badge">
            <span className="footer-badge-dot" />
            Open to interesting projects
          </span>

          <h2 className="footer-heading">
            Got an idea? Let's make<br />it <span className="accent">real.</span>
          </h2>

          <p className="footer-sub">
            Whether it's a full product, a landing page, or just an
            interesting problem — I'd love to hear about it.
          </p>

          <div className="footer-actions">
            <button className="footer-email-btn" onClick={handleCopyEmail}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 5.5l9 6.5 9-6.5M3 19h18a1 1 0 001-1V6a1 1 0 00-1-1H3a1 1 0 00-1 1v12a1 1 0 001 1z" />
              </svg>
              {EMAIL}
              {copied && <span className="footer-copied">Copied!</span>}
            </button>

            <a className="footer-cta-btn" href={`mailto:${EMAIL}`}>
              Say Hello →
            </a>
          </div>

          <div className="footer-socials">
            {/* TODO: replace these href values with your real profile links */}
            <a className="footer-social-link" href="https://github.com/your-username" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.11.81 2.25 0 1.62-.015 2.925-.015 3.33 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a className="footer-social-link" href="https://linkedin.com/in/your-username" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.025-3.04-1.85-3.04-1.855 0-2.14 1.45-2.14 2.945v5.665H9.36V9h3.41v1.56h.05c.475-.9 1.635-1.85 3.365-1.85 3.6 0 4.265 2.37 4.265 5.455v6.285zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
            <a className="footer-social-link" href="https://twitter.com/your-username" target="_blank" rel="noreferrer" aria-label="Twitter / X">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 1.5h3.7l-8 9.2L24 22.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.5h7.6l5.2 7 6.1-7zm-1.3 19h2L6.5 3.4H4.3L17.6 20.5z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">© {year} Dawood Butt. All rights reserved.</p>
          <div className="footer-bottom-right">
            <p className="footer-built">Built with React · Tailwind CSS</p>
            <button className="footer-top-btn" onClick={scrollToTop} aria-label="Back to top">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}