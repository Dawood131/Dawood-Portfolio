import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import CustomCursor from './components/CustomCursor'
import CustomScrollbar from './components/CustomScrollbar'
import ParticlesBg from './components/ParticlesBg'

import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import ProjectDetail from './pages/ProjectDetail'
import NotFound from './pages/NotFound'

import { initLenis, getLenis } from './lib/lenis'
import { trackPageView } from './lib/analytics'

function AppContent() {
  const [loading, setLoading] = useState(true)
  const { pathname } = useLocation()

  useEffect(() => {
    const lenis = initLenis()
    return () => lenis.destroy()
  }, [])

  useEffect(() => {
    const lenis = getLenis()

    if (lenis) {
      lenis.scrollTo(0, {
        immediate: true,
        force: true,
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])

  return (
    <>
      <CustomCursor />
      <CustomScrollbar />
      <ParticlesBg />

      {loading && <Preloader onComplete={() => setLoading(false)} />}

      <Navbar />

      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <Routes>
          <Route path="/" element={<Home isReady={!loading} />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}