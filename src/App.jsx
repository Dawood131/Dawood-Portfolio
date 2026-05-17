import { useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import CustomCursor from './components/CustomCursor'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import ProjectDetail from './pages/ProjectDetail'
import ParticlesBg from './components/ParticlesBg'
import { useEffect } from 'react'
import { initLenis } from './lib/lenis'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lenis = initLenis()
    return () => lenis.destroy()
  }, [])

  return (
    <BrowserRouter>
      <CustomCursor />
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
        </Routes>
      </div>
    </BrowserRouter>
  )
}