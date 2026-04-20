"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const EVENTS = [
  { name: "Sarah", city: "Miami",       service: "booked a haircut",    ago: "2m ago" },
  { name: "James", city: "London",      service: "scheduled a trim",    ago: "4m ago" },
  { name: "Camila",city: "São Paulo",   service: "booked a colour",     ago: "1m ago" },
  { name: "Yuki",  city: "Tokyo",       service: "reserved a blow-dry", ago: "6m ago" },
  { name: "Omar",  city: "Dubai",       service: "booked a beard trim", ago: "3m ago" },
  { name: "Priya", city: "Singapore",   service: "scheduled a facial",  ago: "5m ago" },
  { name: "Lucas", city: "Barcelona",   service: "booked a shave",      ago: "2m ago" },
  { name: "Aisha", city: "Lagos",       service: "reserved a cut",      ago: "8m ago" },
  { name: "Tyler", city: "New York",    service: "booked a clean fade", ago: "1m ago" },
  { name: "Elena", city: "Amsterdam",   service: "scheduled a massage", ago: "7m ago" },
]

let idx = Math.floor(Math.random() * EVENTS.length)

export function SocialProof() {
  const [current, setCurrent] = useState<typeof EVENTS[0] | null>(null)
  const [id, setId] = useState(0)

  const show = useCallback(() => {
    idx = (idx + 1) % EVENTS.length
    setCurrent(EVENTS[idx])
    setId((p) => p + 1)
  }, [])

  useEffect(() => {
    const first = setTimeout(show, 4000)
    return () => clearTimeout(first)
  }, [show])

  useEffect(() => {
    if (!current) return
    const hide = setTimeout(() => setCurrent(null), 5000)
    const next = setTimeout(show, 10000)
    return () => { clearTimeout(hide); clearTimeout(next) }
  }, [id, current, show])

  return (
    <div className="fixed bottom-28 left-4 sm:left-6 z-[148] pointer-events-none" aria-live="polite">
      <AnimatePresence>
        {current && (
          <motion.div
            key={id}
            className="flex items-center gap-3 bg-card/95 backdrop-blur-md border border-border rounded-xl px-4 py-3 shadow-lg shadow-black/10 max-w-[260px] sm:max-w-xs"
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
              {current.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-foreground font-medium leading-snug truncate">
                <span className="font-semibold">{current.name}</span> from {current.city}
              </p>
              <p className="text-[11px] text-muted-foreground leading-snug">{current.service} · {current.ago}</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
