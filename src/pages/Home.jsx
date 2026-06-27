import Footer from '../components/Footer'
import Hero from '../sections/Hero'
import HorizontalScroll from '../sections/HorizontalScroll'
import Projects from '../sections/ProjectSection'
import Skills from '../sections/Skills'

export default function Home({ isReady }) {
  return (
    <main>
      <Hero isReady={isReady} />
      <HorizontalScroll />
      <Projects />
      <Skills />
      <Footer />
    </main>
  )
}