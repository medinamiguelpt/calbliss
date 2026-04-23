import confetti from "canvas-confetti"
import type React from "react"

// Throttle bursts per element (WeakMap keys aren't serializable; per-instance state)
const lastBurstByEl = new WeakMap<HTMLElement, number>()

/**
 * Fires a tiny brand-colored particle burst from the hovered element's center.
 * Attach as onMouseEnter. Throttled to once per 1.5s per element to avoid spam.
 */
export function particleBurst(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget
  const now = Date.now()
  const last = lastBurstByEl.get(el) ?? 0
  if (now - last < 1500) return
  lastBurstByEl.set(el, now)

  const rect = el.getBoundingClientRect()
  confetti({
    particleCount: 6,
    spread: 50,
    startVelocity: 18,
    gravity: 0.9,
    ticks: 70,
    scalar: 0.7,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    },
    colors: ["#7C3AED", "#A78BFA", "#C4B5FD", "#FFFFFF"],
  })
}
