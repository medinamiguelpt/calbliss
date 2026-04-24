"use client"

import { useState, useRef, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

interface TooltipProps {
  content: string
  children: React.ReactNode
}

/**
 * Hover/focus tooltip. Renders into a portal so it escapes any ancestor
 * `overflow: hidden` (e.g. the `SpotlightCard` wrapper on pricing tiers).
 *
 * Positioning:
 * - Measures the trigger on show and places the tooltip above it, centered.
 * - Clamps to within 8px of the viewport edges so it never spills off-screen
 *   on narrow pricing cards near the left or right of the viewport.
 * - Uses `position: fixed` for portaled rendering — tracks the trigger's
 *   current position without needing scroll listeners (it just hides on
 *   mouseleave/blur anyway).
 *
 * Text:
 * - Wraps naturally up to `max-w-[260px]` — no more `whitespace-nowrap`.
 * - `text-balance` makes the wrapped lines roughly equal length.
 */
type Align = "left" | "center" | "right"

interface Placement {
  top: number
  left: number
  align: Align
  /** Arrow's distance from the tooltip box edge — used to make the arrow point at the trigger's center even when the tooltip is clamped to a viewport edge. */
  arrowOffset: number
}

export function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false)
  const [placement, setPlacement] = useState<Placement>({ top: 0, left: 0, align: "center", arrowOffset: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!show || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const MARGIN = 8
    const MAX_W = 260
    const ARROW_SAFE = 16
    const center = rect.left + rect.width / 2

    // Pick horizontal alignment: prefer centered, otherwise clamp to the side
    // whose edge is closer, so the arrow still points at the trigger.
    let align: Align = "center"
    let left = center
    if (center - MAX_W / 2 < MARGIN) {
      align = "left"
      left = Math.max(rect.left, MARGIN)
    } else if (center + MAX_W / 2 > vw - MARGIN) {
      align = "right"
      left = Math.min(rect.right, vw - MARGIN)
    }

    // Arrow offset — measured so it visually lands under the trigger center
    let arrowOffset = 0
    if (align === "left") {
      arrowOffset = Math.min(Math.max(center - left, ARROW_SAFE), MAX_W - ARROW_SAFE)
    } else if (align === "right") {
      arrowOffset = Math.max(Math.min(center - left, -ARROW_SAFE), -(MAX_W - ARROW_SAFE))
    }

    setPlacement({ top: rect.top, left, align, arrowOffset })
  }, [show])

  const transform =
    placement.align === "center" ? "translate(-50%, calc(-100% - 10px))" :
    placement.align === "left"   ? "translate(0%, calc(-100% - 10px))"   :
                                   "translate(-100%, calc(-100% - 10px))"

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline-flex cursor-help"
        tabIndex={0}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        {children}
      </span>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {show && (
            <motion.span
              role="tooltip"
              className="fixed z-[500] pointer-events-none px-3 py-2 bg-foreground text-background text-xs font-medium leading-snug rounded-lg shadow-2xl max-w-[260px] text-balance"
              style={{ top: placement.top, left: placement.left, transform }}
              initial={{ opacity: 0, y: 4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              {content}
              {/* Down-pointing arrow — positioned to land under the trigger's center */}
              <span
                aria-hidden
                className="absolute top-full"
                style={{
                  left: placement.align === "center"
                    ? "50%"
                    : placement.align === "left"
                      ? `${placement.arrowOffset}px`
                      : `calc(100% + ${placement.arrowOffset}px)`,
                  transform: "translateX(-50%)",
                  borderWidth: "6px 6px 0",
                  borderStyle: "solid",
                  borderColor: "var(--foreground) transparent transparent",
                }}
              />
            </motion.span>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
