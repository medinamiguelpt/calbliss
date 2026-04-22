import { cn } from "@/lib/utils"

interface LogoIconProps {
  className?: string
  size?: number
}

export function LogoIcon({ className, size = 36 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tbp-bg" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      {/* Rounded hexagon — midpoint quadratic-bezier technique */}
      <path
        d="M44.1 11 Q56.2 18 56.2 32 Q56.2 46 44.1 53 Q32 60 19.9 53 Q7.8 46 7.8 32 Q7.8 18 19.9 11 Q32 4 44.1 11 Z"
        fill="url(#tbp-bg)"
      />
      {/* Upper chevron */}
      <path d="M20 25 L32 36 L44 25" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Lower chevron */}
      <path d="M20 34 L32 45 L44 34" stroke="rgba(255,255,255,0.55)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  iconSize?: number
  showWordmark?: boolean
}

export function Logo({
  className,
  iconSize = 36,
  showWordmark = true,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoIcon size={iconSize} />
      {showWordmark && (
        <span className="font-heading text-xl tracking-tight text-foreground">
          <span className="font-bold">TimeBooking</span><span className="font-light opacity-75">Pro</span>
        </span>
      )}
    </div>
  )
}
