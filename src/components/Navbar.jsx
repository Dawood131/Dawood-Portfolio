import { useEffect, useRef } from 'react'
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
  { label: 'LinkedIn', link: 'www.linkedin.com/in/muhammad-dawood-butt-413192282' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const pillRef = useRef(null)
  const logoFullRef = useRef(null)
  const logoShortRef = useRef(null)
  const linksRef = useRef(null)
  const scrolled = useRef(false)
  const logoSwapInProgress = useRef(false)

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
        const bgAlpha = progress * 0.90
        const blurVal = progress * 20

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

        pill.style.backdropFilter = `blur(${blurVal}px)`
        pill.style.WebkitBackdropFilter = `blur(${blurVal}px)`

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
`}</style>

      {/* ── Desktop only ── */}
      <div id="nav-outer" className="hidden md:flex">
        <div id="nav-pill" ref={pillRef}>
          <div id="navbar-logo-target">
            <span className="nav-logo-full" ref={logoFullRef}>DAWOOD BUTT</span>
            <div className="nav-logo-short" ref={logoShortRef}>
              <img src="/files/IMG-20250815-WA0006.jpg" alt="DB" className="nav-logo-short-img" />
            </div>
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
    </>
  )
}