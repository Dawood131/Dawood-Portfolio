import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | Dawood Butt</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <main className="nf-main">
        <p className="nf-code">404</p>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="nf-btn">
          ← Back to Home
        </Link>
      </main>

      <style>{`
        .nf-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
          background: #0a0b0d;
          color: #f2f3f5;
          font-family: Inter, sans-serif;
        }
        .nf-code {
          font-size: 14px;
          letter-spacing: 0.1em;
          color: #00D4FF;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .nf-title {
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          font-weight: 700;
          margin-bottom: 12px;
        }
        .nf-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          max-width: 380px;
          line-height: 1.6;
          margin-bottom: 28px;
        }
        .nf-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: Inter, sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #000;
          background: #00D4FF;
          text-decoration: none;
          border-radius: 999px;
          padding: 14px 24px;
          transition: transform 0.25s ease, box-shadow 0.3s ease;
        }
        .nf-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 30px -8px rgba(0,212,255,0.45);
        }
      `}</style>
    </>
  )
}