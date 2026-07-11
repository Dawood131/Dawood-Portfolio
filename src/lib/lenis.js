import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

const MAX_DELTA_PX = 100 
const LINE_HEIGHT_PX = 16
let isReplayedEvent = false

function normalizeAndClamp(e) {
  let { deltaX, deltaY, deltaMode } = e

  if (deltaMode === 1) {
    deltaX *= LINE_HEIGHT_PX
    deltaY *= LINE_HEIGHT_PX
  } else if (deltaMode === 2) {
    // "page" mode
    deltaX *= window.innerWidth
    deltaY *= window.innerHeight
  }

  deltaX = Math.sign(deltaX) * Math.min(Math.abs(deltaX), MAX_DELTA_PX)
  deltaY = Math.sign(deltaY) * Math.min(Math.abs(deltaY), MAX_DELTA_PX)

  return { deltaX, deltaY }
}

function installWheelNormalizer() {
  window.addEventListener(
    'wheel',
    (e) => {
      if (isReplayedEvent) return 
      const { deltaX, deltaY } = normalizeAndClamp(e)

      if (deltaX === e.deltaX && deltaY === e.deltaY && e.deltaMode === 0) return

      e.stopImmediatePropagation()
      e.preventDefault()

      const cleanEvent = new WheelEvent('wheel', {
        deltaX,
        deltaY,
        deltaMode: 0,
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: true,
        cancelable: true,
      })

      isReplayedEvent = true
      e.target.dispatchEvent(cleanEvent)
      isReplayedEvent = false
    },
    { capture: true, passive: false }
  )
}

export function initLenis() {
  installWheelNormalizer()

  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1, 
    touchMultiplier: 1.5,
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