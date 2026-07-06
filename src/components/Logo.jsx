import { useState } from 'react'
import { LOGO_SRC } from '../config.js'

/**
 * Brand logo slot. Renders the image configured in LOGO_SRC (from public/)
 * and falls back to the serif "By–Bookey" wordmark when no artwork exists
 * yet or the file fails to load. Swap-in requires no code changes — just
 * drop the file into public/ with the configured name.
 */
export default function Logo({ imgClassName = 'h-7 sm:h-8', textClassName = 'text-xl sm:text-2xl' }) {
  const [failed, setFailed] = useState(false)
  const src = LOGO_SRC ? `${import.meta.env.BASE_URL}${LOGO_SRC}` : null

  if (!src || failed) {
    return (
      <span className={`font-serif tracking-wide text-ink ${textClassName}`}>
        By&#8211;Bookey
      </span>
    )
  }

  return (
    <img
      src={src}
      alt="By-Bookey"
      className={`w-auto object-contain ${imgClassName}`}
      onError={() => setFailed(true)}
      draggable={false}
    />
  )
}
