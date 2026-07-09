import { useState } from 'react'
import { Link } from 'react-router-dom'
import footerLogoSrc from '../assets/bookey_logo_footer.svg'
import { CONTACT_EMAIL } from '../config.js'
import WhatsAppLink from './WhatsAppLink.jsx'

const COLUMNS = [
  {
    heading: 'Explore',
    items: [
      { label: 'Collections', to: '/work' },
      { label: 'The Atelier', to: '/process' },
      { label: 'About the House', to: '/about' },
    ],
  },
  {
    heading: 'Client Services',
    items: [
      { label: 'Contact Us', to: '/about#contact' },
      { label: 'Private Commissions', to: '/about#contact' },
      { label: 'Buyer Consultations', to: '/about#contact' },
      { label: 'WhatsApp', whatsapp: true },
    ],
  },
  {
    heading: 'Press',
    items: [
      { label: 'Press Enquiries', to: '/about#contact' },
      { label: 'Editorial Features', to: '/about#contact' },
    ],
  },
]

const encode = (data) =>
  Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | done

  const subscribe = async (event) => {
    event.preventDefault()
    if (!email.trim()) return
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'newsletter', email: email.trim() }),
      })
    } catch {
      /* Netlify-only endpoint; treat as best-effort in local dev */
    }
    setStatus('done')
    setEmail('')
  }

  return (
    <footer className="border-t border-ink/10">
      {/* Newsletter */}
      <div className="border-b border-ink/10">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="font-serif text-2xl text-ink">Stay in the Know</h2>
          <p className="text-sm leading-relaxed text-charcoal/70">
            Collection previews, atelier notes, and appointment openings — a few times a season.
          </p>
          {status === 'done' ? (
            <p className="text-[11px] tracking-[0.25em] uppercase text-umber">
              Thank you — you are on the list.
            </p>
          ) : (
            <form onSubmit={subscribe} className="flex w-full max-w-md items-center border-b border-ink">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address"
                aria-label="Email address for the newsletter"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink placeholder:text-ash focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 pl-4 text-[10px] tracking-[0.3em] uppercase text-ink transition-opacity duration-300 hover:opacity-60"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-12 px-6 py-16 sm:grid-cols-3 sm:px-10">
        {COLUMNS.map(({ heading, items }) => (
          <nav key={heading} aria-label={heading}>
            <h3 className="text-[10px] tracking-[0.35em] uppercase text-ash">{heading}</h3>
            <ul className="mt-6 flex flex-col gap-3.5">
              {items.map(({ label, to, whatsapp }) => (
                <li key={label}>
                  {whatsapp ? (
                    <WhatsAppLink className="text-sm text-charcoal/80 transition-colors duration-300 hover:text-ink">
                      {label}
                    </WhatsAppLink>
                  ) : (
                    <Link
                      to={to}
                      className="text-sm text-charcoal/80 transition-colors duration-300 hover:text-ink"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden px-6 pb-10">
        <img
          src={footerLogoSrc}
          alt="By-Bookey"
          className="logo-breathe mx-auto w-2/3 object-contain md:w-1/2"
          draggable={false}
        />
        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-[10px] tracking-[0.25em] uppercase text-ash sm:flex-row">
          <span>&copy; {new Date().getFullYear()} By&#8211;Bookey Studio</span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="transition-colors duration-300 hover:text-ink"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  )
}
