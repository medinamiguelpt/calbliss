"use client"

import { useEffect, useRef } from "react"

const FLAGS = ["🇬🇧", "🇪🇸", "🇫🇷", "🇧🇷", "🇩🇪", "🇸🇦"]

export function Globe3D({ size = 80 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let angle = 0
    const flags = el.querySelectorAll<HTMLSpanElement>(".flag-orbit")
    const total = flags.length

    const tick = () => {
      angle = (angle + 0.4) % 360
      flags.forEach((flag, i) => {
        const a = ((angle + (i / total) * 360) * Math.PI) / 180
        const x = Math.cos(a) * (size * 0.52)
        const z = Math.sin(a) * (size * 0.52)
        const scale = 0.65 + (z / (size * 0.52)) * 0.35
        const opacity = 0.5 + (z / (size * 0.52)) * 0.5
        flag.style.transform = `translateX(${x}px) scale(${scale})`
        flag.style.opacity = String(Math.max(0.15, opacity))
        flag.style.zIndex = String(Math.round(scale * 10))
      })
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [size])

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Sphere body */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-emerald-400/30 via-emerald-500/20 to-emerald-600/10 border border-emerald-500/30"
        style={{ width: size, height: size, boxShadow: `0 0 ${size * 0.3}px rgba(16,185,129,0.15)` }}
      />
      {/* Latitude lines */}
      {[0.3, 0.5, 0.7].map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-emerald-500/15"
          style={{ width: size * r, height: size * r }}
        />
      ))}
      {/* Orbiting flags */}
      <div className="absolute inset-0 flex items-center justify-center">
        {FLAGS.map((flag, i) => (
          <span
            key={i}
            className="flag-orbit absolute text-base select-none"
            style={{ fontSize: size * 0.18 }}
          >
            {flag}
          </span>
        ))}
      </div>
    </div>
  )
}
