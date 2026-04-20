"use client"

import { useEffect } from "react"
import { useScroll, useMotionValueEvent } from "framer-motion"

export function ScrollHue() {
  const { scrollYProgress } = useScroll()

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const hue = Math.round(v * 20) - 10
    document.documentElement.style.setProperty("--scroll-hue", `${hue}deg`)
  })

  useEffect(() => {
    document.documentElement.style.setProperty("--scroll-hue", "0deg")
    return () => { document.documentElement.style.removeProperty("--scroll-hue") }
  }, [])

  return null
}
