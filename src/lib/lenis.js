import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

// Note: with the native scrollbar hidden (see hideNativeScrollbar.css) and
// CustomScrollbar.jsx driving scroll exclusively through this Lenis
// instance, there is no second scroll source left to fight with — that's
// what was causing the blink/jump/overlap glitch on scrollbar drag before.
export function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', () => ScrollTrigger.update())

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  lenisInstance = lenis
  return lenis
}

export function destroyLenis() {
  lenisInstance?.destroy()
  lenisInstance = null
}

export function getLenis() {
  return lenisInstance
}