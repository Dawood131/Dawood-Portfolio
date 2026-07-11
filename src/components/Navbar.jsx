import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import StaggeredMenu from './StaggeredMenu'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Contact', path: '/contact' },
]

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'About me', link: '/about' },
  { label: 'Projects', ariaLabel: 'My projects', link: '/projects' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' },
]

const socialItems = [
  { label: 'GitHub', link: 'https://github.com/Dawood131' },
  { label: 'LinkedIn', link: "https://www.linkedin.com/in/muhammad-dawood-butt-413192282/", },
]

const LOGO_IMG = '/files/My Photo.jpg'

export default function Navbar() {
  const { pathname } = useLocation()
  const pillRef = useRef(null)
  const logoFullRef = useRef(null)
  const logoShortRef = useRef(null)
  const linksRef = useRef(null)
  const scrolled = useRef(false)
  const logoSwapInProgress = useRef(false)

  const [previewOpen, setPreviewOpen] = useState(false)
  const backdropRef = useRef(null)
  const imgBoxRef = useRef(null)

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }
    setVh()
    window.addEventListener('resize', setVh)
    const menuObserver = new MutationObserver(() => {
      const isOpen = document.body.classList.contains('menu-open')
    })

    const pill = pillRef.current
    const logoFull = logoFullRef.current
    const logoShort = logoShortRef.current
    const links = linksRef.current
    if (!pill || !logoFull || !logoShort || !links) return

    gsap.set(logoFull, { opacity: 0 })
    gsap.set(logoShort, { opacity: 0, scale: 0, rotation: -90 })

    const handleDone = () => {
      const fs = window.__preloaderFontSize || 13
      logoFull.style.fontSize = Math.max(fs, 10) + 'px'
      gsap.to(logoFull, { opacity: 1, duration: 0.3 })
    }
    window.addEventListener('preloader-done', handleDone)

    const SHRINK_START = 0
    const SHRINK_END = 250

    let ticking = false
    let lastProgress = -1
    const linkEls = Array.from(links.querySelectorAll('a'))

    const onScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const progress = Math.min(Math.max((scrollY - SHRINK_START) / (SHRINK_END - SHRINK_START), 0), 1)

        if (Math.abs(progress - lastProgress) < 0.003) {
          ticking = false
          return
        }
        lastProgress = progress

        const width = 100 - progress * 61
        const padV = 22 - progress * 12
        const padH = 48 - progress * 24
        const radius = progress * 999
        const bgAlpha = 0.28 + progress * 0.18
        const blurVal = 22

        gsap.to(pill, {
          width: `${width}%`,
          paddingTop: `${padV}px`,
          paddingBottom: `${padV}px`,
          paddingLeft: `${padH}px`,
          paddingRight: `${padH}px`,
          borderRadius: `${radius}px`,
          backgroundColor: `rgba(6,6,6,${bgAlpha})`,
          boxShadow: progress > 0.1
            ? `0 0 0 1px rgba(255,255,255,${progress * 0.1}), 0 8px 40px rgba(0,0,0,${progress * 0.5})`
            : 'none',
          duration: 0.15,
          ease: 'none',
          overwrite: 'auto',
        })

        pill.style.backdropFilter = `blur(${blurVal}px) saturate(180%)`
        pill.style.WebkitBackdropFilter = `blur(${blurVal}px) saturate(180%)`

        gsap.to(linkEls, {
          fontSize: `${12 - progress * 3}px`,
          letterSpacing: `${0.22 - progress * 0.12}em`,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: true,
        })

        if (progress > 0.6 && !scrolled.current && !logoSwapInProgress.current) {
          scrolled.current = true
          logoSwapInProgress.current = true
          gsap.killTweensOf([logoFull, logoShort])
          gsap.to(logoFull, {
            opacity: 0, scale: 0.5, duration: 0.25, ease: 'power2.out',
            onComplete: () => { logoSwapInProgress.current = false }
          })
          gsap.to(logoShort, {
            opacity: 1, scale: 1, rotation: 0, duration: 0.4,
            ease: 'back.out(1.7)', delay: 0.05
          })
        } else if (progress < 0.4 && scrolled.current && !logoSwapInProgress.current) {
          scrolled.current = false
          logoSwapInProgress.current = true
          gsap.killTweensOf([logoFull, logoShort])
          gsap.to(logoShort, {
            opacity: 0, scale: 0, rotation: 90, duration: 0.2,
            onComplete: () => { logoSwapInProgress.current = false }
          })
          const fs = window.__preloaderFontSize || 13
          logoFull.style.fontSize = Math.max(fs, 10) + 'px'
          gsap.to(logoFull, {
            opacity: 1, scale: 1, duration: 0.35,
            ease: 'power2.out', delay: 0.1
          })
        }

        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('preloader-done', handleDone)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', setVh)
    }
  }, [])

  useEffect(() => {
    if (!previewOpen) return

    const backdrop = backdropRef.current
    const box = imgBoxRef.current
    if (backdrop && box) {
      gsap.set(backdrop, { opacity: 0 })
      gsap.set(box, { opacity: 0, scale: 0.85, y: 16 })
      gsap.to(backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.to(box, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)', delay: 0.05 })
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closePreview()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [previewOpen])

  const closePreview = () => {
    const backdrop = backdropRef.current
    const box = imgBoxRef.current
    if (backdrop && box) {
      gsap.to(box, { opacity: 0, scale: 0.9, y: 10, duration: 0.22, ease: 'power2.in' })
      gsap.to(backdrop, {
        opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => setPreviewOpen(false),
      })
    } else {
      setPreviewOpen(false)
    }
  }

  const handleMenuOpen = () => {
    const scrollY = window.scrollY
    document.body.dataset.scrollY = String(scrollY)
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.touchAction = 'none'
  }

  const handleMenuClose = () => {
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10)
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.touchAction = ''
    window.scrollTo(0, scrollY)
  }

  return (
    <>
      <style>{`
  #nav-outer {
    position: fixed;
    top: 16px;
    left: 0;
    width: 100%;
    z-index: 40;
    display: none;
    justify-content: center;
    pointer-events: none;
  }

  @media (min-width: 768px) {
    #nav-outer {
      display: flex;
    }
  }

  #nav-pill {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 48px;
    pointer-events: auto;
    box-sizing: border-box;
  }

  #navbar-logo-target {
    flex-shrink: 0;
    width: 180px;
    height: 28px;
    position: relative;
    display: flex;
    align-items: center;
    overflow: visible;
  }

  .nav-logo-full {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 700;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: white;
    font-family: Inter, sans-serif;
    white-space: nowrap;
    line-height: 1;
    transition: color 0.3s ease;
  }
  .nav-logo-full:hover {
    color: #00D4FF;
  }

  .nav-logo-short {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(0,212,255,0.3);
    background: rgba(0,212,255,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0;
    cursor: pointer;
    transition: border-color 0.25s ease, transform 0.25s ease;
  }

  .nav-logo-short:hover {
    border-color: rgba(0,212,255,0.8);
    transform: translateY(-50%) scale(1.08);
  }

  .nav-logo-short-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .nav-links-list {
    display: flex;
    align-items: center;
    gap: 36px;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-shrink: 0;
  }

  .nav-links-list li {
    position: relative;
  }

  .nav-link {
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: white;
    text-decoration: none;
    font-family: Inter, sans-serif;
    white-space: nowrap;
    display: inline-block;
    position: relative;
    opacity: 0.35;
    transition: opacity 0.4s ease;
    overflow: visible;
    height: 1.2em;
    vertical-align: middle;
  }

  .nav-link .link-text {
    display: block;
    position: relative;
    transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1),
                opacity 0.4s ease;
    line-height: 1.2em;
  }

  .nav-link .link-clone {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    text-align: center;
    color: #00D4FF;
    transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1),
                opacity 0.4s ease;
    opacity: 0;
    pointer-events: none;
    white-space: nowrap;
    line-height: 1.2em;
  }

  .nav-link:hover { opacity: 1; }
  .nav-link:hover .link-text { transform: translateY(-100%); opacity: 0; }
  .nav-link:hover .link-clone { transform: translateY(-100%); opacity: 1; }

  .nav-link[data-active='true'] { opacity: 1; }
  .nav-link[data-active='true'] .link-text { color: #00D4FF; }

  .nav-link[data-active='true']::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #00D4FF;
    box-shadow: 0 0 8px 2px rgba(0,212,255,0.6);
    animation: dotPulse 2s ease-in-out infinite;
  }

  @keyframes dotPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px 2px rgba(0,212,255,0.6); }
    50%       { opacity: 0.4; box-shadow: 0 0 4px 1px rgba(0,212,255,0.2); }
  }

  /* ── Fix 1: Mobile menu full height — browser bar ignore karo ── */
  #mobile-menu-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    /* --vh se actual visible height milti hai, browser bar exclude */
    height: calc(var(--vh, 1vh) * 100);
    z-index: 50;
    pointer-events: none;
  }

  /* ── Logo image lightbox preview ── */
  #logo-preview-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(5,5,6,0.82);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  #logo-preview-box {
    position: relative;
    max-width: min(86vw, 480px);
    max-height: 80vh;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,255,0.08);
  }

  #logo-preview-box img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #0a0a0a;
  }

  #logo-preview-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(10,10,10,0.55);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  #logo-preview-close:hover {
    background: rgba(0,212,255,0.15);
    border-color: rgba(0,212,255,0.6);
  }
`}</style>

      {/* ── Desktop only ── */}
      <div id="nav-outer" className="hidden md:flex">
        <div id="nav-pill" ref={pillRef}>
          <div id="navbar-logo-target">
            <span className="nav-logo-full" ref={logoFullRef}>Dawood Butt</span>
            <button
              type="button"
              className="nav-logo-short"
              ref={logoShortRef}
              onClick={() => setPreviewOpen(true)}
              aria-label="Preview profile photo"
            >
              <img src={LOGO_IMG} alt="Dawood Butt" className="nav-logo-short-img" />
            </button>
          </div>

          <ul className="nav-links-list" ref={linksRef}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="nav-link"
                  data-active={pathname === link.path ? 'true' : 'false'}
                >
                  <span className="link-text">{link.label}</span>
                  <span className="link-clone">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Mobile logo placeholder ── */}
      <div
        id="navbar-logo-target-mobile"
        className="md:hidden"
        style={{
          position: 'fixed',
          top: '20px',
          left: '24px',
          width: '140px',
          height: '20px',
          zIndex: 41,
          pointerEvents: 'none',
        }}
      />

      {/* ── Mobile menu ── */}
      <div
        id="mobile-menu-wrapper"
        className="md:hidden"
      >
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={false}
          menuButtonColor="#ffffff"
          openMenuButtonColor="#ffffff"
          changeMenuColorOnOpen={false}
          colors={['#0a0a0a', '#111111']}
          accentColor="#ffffff"
          logoUrl=""
          isFixed={false}
          closeOnClickAway={true}
          onMenuOpen={handleMenuOpen}
          onMenuClose={handleMenuClose}
        />
      </div>

      {/* ── Logo preview lightbox ── */}
      {previewOpen && (
        <div
          id="logo-preview-backdrop"
          ref={backdropRef}
          onClick={(e) => {
            if (e.target === backdropRef.current) closePreview()
          }}
        >
          <div id="logo-preview-box" ref={imgBoxRef}>
            <button id="logo-preview-close" onClick={closePreview} aria-label="Close preview">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <img src={LOGO_IMG} alt="Dawood Butt" />
          </div>
        </div>
      )}
    </>
  )
}