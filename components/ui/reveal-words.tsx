"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

type Tag = "h1" | "h2" | "h3" | "h4"

interface RevealWordsProps {
  children: string
  className?: string
  as?: Tag
  /** Delay between each word in seconds (default 0.07) */
  stagger?: number
  /** Extra delay before the first word (default 0) */
  delay?: number
}

/**
 * Splits text into words and reveals them with a staggered fade + small rise.
 *
 * Earlier iterations used `overflow: hidden` + `y: 110%` to clip words off-screen
 * until they animated up. That caused two regressions: descenders (y, p, g, j) got
 * clipped at the clip edge, and whenever the IntersectionObserver failed to fire,
 * words stayed permanently invisible below the clip. The current implementation
 * uses no clipping — words fade in from y:14 so failure mode = text visible, just
 * not animated. Which is the correct failure mode for a headline.
 */
export function RevealWords({
  children,
  className,
  as: Tag = "h2",
  stagger = 0.07,
  delay = 0,
}: RevealWordsProps) {
  const prefersReducedMotion = useReducedMotion()
  const words = children.split(" ")

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
          initial={{ y: 14, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.55,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
