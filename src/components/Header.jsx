import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logoSrc from '../assets/bookey_logo.svg'
import Logo from './Logo.jsx'
import WhatsAppLink from './WhatsAppLink.jsx'

const links = [
  { to: '/work', label: 'Collections' },
  { to: '/process', label: 'The Atelier' },
  { to: '/about', label: 'About' },
  { to: '/about#contact', label: 'Contact Us' },
]

/**
 * Maison-style header: hamburger menu on the left, logo centered,
 * client-services link on the right, and a full-screen overlay menu —
 * always on a solid background, in the manner of the great houses.
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-bone">
        <div className="relative flex h-28 items-center justify-between px-5 sm:px-8 lg:h-32 lg:px-12">
          {/* Menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className="group flex items-center gap-3"
          >
            <span className="flex flex-col gap-1.5">
              <span className="h-px w-6 bg-ink transition-all duration-300 group-hover:w-4" />
              <span className="h-px w-6 bg-ink" />
            </span>
            <span className="hidden text-[10px] tracking-[0.3em] uppercase sm:block">Menu</span>
          </button>

          {/* Centered logo */}
          <Link
            to="/"
            aria-label="By-Bookey — home"
            className="absolute left-1/2 -translate-x-1/2 transition-opacity duration-300 hover:opacity-60"
          >
            <img
              src={logoSrc}
              alt="By-Bookey"
              className="logo-breathe h-32 w-auto object-contain md:h-40"
              draggable={false}
            />
          </Link>

          {/* Client services */}
          <div className="flex items-center gap-6">
            <WhatsAppLink className="text-[10px] tracking-[0.3em] uppercase transition-opacity duration-300 hover:opacity-60">
              WhatsApp
            </WhatsAppLink>
            <Link
              to="/about#contact"
              className="text-[10px] tracking-[0.3em] uppercase transition-opacity duration-300 hover:opacity-60"
            >
              <span className="hidden sm:inline">Contact Us</span>
              <span className="sm:hidden">Contact</span>
            </Link>
          </div>
        </div>

        {/* Secondary nav row, desktop only */}
        <nav
          aria-label="Primary"
          className="hidden items-center justify-center gap-12 border-t border-ink/5 py-3.5 md:flex"
        >
          {links.slice(0, 3).map(({ to, label }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `text-[11px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                  isActive ? 'text-ink underline underline-offset-8' : 'text-charcoal/70 hover:text-ink'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* ——— Full-screen overlay menu ——— */}
      <div
        className={`fixed inset-0 z-[60] bg-bone transition-all duration-500 ease-out ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
      >
        <div className="flex h-16 items-center justify-between px-5 sm:px-8 lg:h-20 lg:px-12">
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="group flex items-center gap-3"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-5 w-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
            <span className="hidden text-[10px] tracking-[0.3em] uppercase sm:block">Close</span>
          </button>
          <Logo imgClassName="h-8" textClassName="text-2xl tracking-[0.08em]" />
          <span className="w-16" aria-hidden="true" />
        </div>

        <nav
          aria-label="Menu"
          className="flex h-[calc(100%-4rem)] flex-col justify-center gap-2 px-8 sm:px-16 lg:h-[calc(100%-5rem)] lg:px-24"
        >
          {links.map(({ to, label }, index) => (
            <NavLink
              key={label}
              to={to}
              className="group flex items-baseline gap-6 py-3"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <span className="text-[10px] tracking-[0.3em] text-ash tabular-nums">
                0{index + 1}
              </span>
              <span className="font-serif text-4xl text-ink transition-all duration-300 group-hover:translate-x-2 group-hover:italic sm:text-5xl lg:text-6xl">
                {label}
              </span>
            </NavLink>
          ))}

          <div className="mt-14 flex flex-col gap-4">
            <WhatsAppLink className="text-[11px] tracking-[0.3em] uppercase text-charcoal/70 transition-colors duration-300 hover:text-ink">
              WhatsApp the Studio
            </WhatsAppLink>
            <p className="text-[11px] tracking-[0.2em] uppercase text-ash">
              Private commissions &middot; Press &middot; Buyer consultations
            </p>
          </div>
        </nav>
      </div>
    </>
  )
}
