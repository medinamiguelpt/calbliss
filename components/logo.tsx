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
      {/* Outer solid M-badge */}
      <path
        d="M8 0 L0 18 L0 50 L32 64 L64 50 L64 18 L56 0 L32 22 Z"
        fill="#8B5CF6"
      />
      {/* Inner solid M-badge — same shape scaled inside, gap shows background */}
      <path
        d="M17 11 L9 24 L9 44 L32 55 L55 44 L55 24 L47 11 L32 29 Z"
        fill="#A855F7"
      />
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
