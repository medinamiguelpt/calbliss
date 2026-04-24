"use client"

import { useState, useRef, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

interface TooltipProps {
  content: string
  children: React.ReactNode
}

type Align = "left" | "center" | "right"

interface Placement {
  top: number
  left: number
  align: Align
  /** Arrow's offset (px) from the tooltip box so it points at the trigger's center even when the tooltip is clamped to a viewport edge. */
  arrowOffset: number
}

/**
 * Hover/focus tooltip. Renders into a portal so it escapes any ancestor
 * `overflow: hidden` (e.g. SpotlightCard on pricing tiers).
 *
 * Positioning:
 * - `position: fixed` at the trigger's measured rect, then shifted via CSS
 *   `transform` to sit centered above the trigger.
 * - If the trigger sits near a viewport edge, the tooltip clamps to `left`
 *   or `right` alignment and the arrow offset is recomputed so it still
 *   lands under the trigger's center.
 *
 * Animation: opacity only. We deliberately avoid animating y/scale/x because
 * framer-motion's transform output would overwrite the positioning transform
 * on `style`. Opacity doesn't touch `transform`, so positioning is preserved.
 */
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

    let align: Align = "center"
    let left = center
    if (center - MAX_W / 2 < MARGIN) {
      align = "left"
      left = Math.max(rect.left, MARGIN)
    } else if (center + MAX_W / 2 > vw - MARGIN) {
      align = "right"
      left = Math.min(rect.right, vw - MARGIN)
    }

    let arrowOffset = 0
    if (align === "left") {
      arrowOffset = Math.min(Math.max(center - left, ARROW_SAFE), MAX_W - ARROW_SAFE)
    } else if (align === "right") {
      arrowOffset = Math.max(Math.min(center - left, -ARROW_SAFE), -(MAX_W - ARROW_SAFE))
    }

    setPlacement({ top: rect.top, left, align, arrowOffset })
  }, [show])

  // Horizontal shift so the tooltip's appropriate edge (center / left / right) lines up with `placement.left`.
  const xShift =
    placement.align === "center" ? "-50%" :
    placement.align === "left"   ? "0%"   :
                                   "-100%"

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
            <motion.div
              key="tooltip"
              role="tooltip"
              className="fixed z-[500] pointer-events-none"
              style={{
                top: placement.top,
                left: placement.left,
                transform: `translate(${xShift}, calc(-100% - 10px))`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="relative block px-3 py-2 bg-foreground text-background text-xs font-medium leading-snug rounded-lg shadow-2xl max-w-[260px] text-balance">
                {content}
                {/* Down-pointing arrow under the tooltip, lined up with the trigger's center */}
                <span
                  aria-hidden
                  className="absolute top-full"
                  style={{
                    left:
                      placement.align === "center"
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
              </span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
