"use client"

import { useEffect } from "react"

/**
 * Briefly highlights the top edge of a section when navigated to via anchor link.
 * Listens for clicks on a[href^="#"] and for popstate events. Adds a .section-flash
 * class for ~800ms to the target element.
 */
export function AnchorHighlight() {
  useEffect(() => {
    const flash = (el: HTMLElement) => {
      el.classList.remove("section-flash")
      // Force a reflow so the class re-triggers the animation even if applied back-to-back
      void el.offsetWidth
      el.classList.add("section-flash")
      setTimeout(() => el.classList.remove("section-flash"), 900)
    }

    const findTarget = (hash: string): HTMLElement | null => {
      if (!hash || hash === "#") return null
      try {
        return document.querySelector<HTMLElement>(hash)
      } catch {
        return null
      }
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute("href")
      if (!hash) return
      const el = findTarget(hash)
      if (!el) return
      // Fire after the browser's native anchor scroll kicks in
      setTimeout(() => flash(el), 100)
    }

    const onHashChange = () => {
      const el = findTarget(window.location.hash)
      if (el) setTimeout(() => flash(el), 100)
    }

    document.addEventListener("click", onClick)
    window.addEventListener("hashchange", onHashChange)
    return () => {
      document.removeEventListener("click", onClick)
      window.removeEventListener("hashchange", onHashChange)
    }
  }, [])

  return null
}
