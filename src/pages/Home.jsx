import Hero from '../sections/Hero'
import HorizontalScroll from '../sections/HorizontalScroll'

export default function Home({ isReady }) {
  return (
    <main>
      <Hero isReady={isReady} />
      <HorizontalScroll />
        <div style={{ 
        height: '100vh', 
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2rem',
        fontFamily: 'Inter'
      }}>
        Next Section
      </div>
    </main>
  )
}