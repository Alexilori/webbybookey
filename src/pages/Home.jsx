import { Link } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import Reveal from '../components/Reveal.jsx'
import { HOME_IMAGES } from '../data/homeImages.js'

const CTA_CLASSES =
  'inline-block border border-ink bg-bone/80 px-10 py-3.5 text-[11px] tracking-[0.3em] uppercase text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-bone'

const LOOKS = [
  'Look 01 — sculpted overcoat',
  'Look 02 — bias-cut column dress',
  'Look 03 — deconstructed blazer',
  'Look 04 — raw-hem trench',
  'Look 05 — draped evening set',
  'Look 06 — tailored jumpsuit',
]

export default function Home() {
  return (
    <>
      {/* ——— Campaign hero ———
          Static placeholder for now; a muted, autoplaying, looping <video>
          with object-cover can replace <Placeholder> in this container. */}
      <section className="relative h-[calc(100svh-4rem)] w-full md:h-[calc(100svh-7.25rem)]">
        <Placeholder
          full
          eager
          src={HOME_IMAGES.hero}
          label="Hero — campaign, garment in motion"
          className="h-full"
        />

        {/* Soft scrim so the title and CTA stay legible over real photography */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-bone/90 via-bone/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 text-center sm:pb-28">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] uppercase text-charcoal">
              Autumn / Winter &#8217;26
            </p>
            <h1 className="mt-4 font-serif text-5xl text-ink sm:text-6xl lg:text-7xl">Meridian</h1>
            <Link to="/work" className={`${CTA_CLASSES} mt-8`}>
              Explore the Collection
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——— Two-up campaign tiles ——— */}
      <section className="grid grid-cols-1 gap-px bg-ink/5 md:grid-cols-2">
        {[
          {
            label: 'Campaign — Collection 01, full silhouette',
            src: HOME_IMAGES.campaigns[0],
            title: 'Collection 01 — Meridian',
            to: '/work',
            cta: 'Discover More',
          },
          {
            label: 'Campaign — Raw Seam capsule, fabric macro',
            src: HOME_IMAGES.campaigns[1],
            title: 'Capsule — Raw Seam',
            to: '/work',
            cta: 'Discover More',
          },
        ].map(({ label, src, title, to, cta }) => (
          <Reveal key={title} className="bg-bone">
            <Link to={to} className="group block">
              <div className="overflow-hidden">
                <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                  <Placeholder ratio="4 / 5" src={src} label={label} />
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <h2 className="font-serif text-2xl text-ink">{title}</h2>
                <span className="text-[11px] tracking-[0.3em] uppercase text-ink underline underline-offset-8 transition-opacity duration-300 group-hover:opacity-60">
                  {cta}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      {/* ——— Selected looks carousel ——— */}
      <section className="py-20 lg:py-28">
        <Reveal className="mb-12 flex flex-col items-center gap-3 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-umber">The Season</p>
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">Selected Looks</h2>
        </Reveal>

        <Reveal>
          <div
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8 lg:px-12"
            aria-label="Selected looks from the current season"
          >
            {LOOKS.map((look, index) => (
              <Link
                key={look}
                to="/work"
                className="group w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[23%]"
              >
                <div className="overflow-hidden">
                  <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                    <Placeholder ratio="3 / 4" src={HOME_IMAGES.looks[index]} label={look} />
                  </div>
                </div>
                <p className="mt-4 text-center text-[10px] tracking-[0.25em] uppercase text-charcoal/70">
                  Look {String(index + 1).padStart(2, '0')}
                </p>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ——— Atelier banner ——— */}
      <section className="relative">
        <Placeholder
          ratio="16 / 9"
          src={HOME_IMAGES.atelier}
          label="The Atelier — hands at the cutting table"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] uppercase text-charcoal">The Craft</p>
            <h2 className="mt-4 font-serif text-4xl text-ink sm:text-5xl">Inside the Atelier</h2>
            <Link to="/process" className={`${CTA_CLASSES} mt-8`}>
              Discover the Process
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——— Brand statement ——— */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:py-36">
        <Reveal>
          <p className="text-[10px] tracking-[0.4em] uppercase text-umber">The House</p>
          <p className="mt-8 font-serif text-2xl leading-relaxed text-ink sm:text-3xl">
            By&#8211;Bookey: Exploring form, texture, and the art of&nbsp;tailoring.
          </p>
          <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-charcoal/80">
            An independent atelier where structure meets softness — garments conceived as
            sculpture, cut with intention, and finished by hand.
          </p>
        </Reveal>
      </section>

      {/* ——— Client services strip ——— */}
      <section className="border-t border-ink/10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-14 px-6 py-20 text-center sm:grid-cols-3 sm:gap-8">
          {[
            {
              title: 'Private Commissions',
              copy: 'Made-to-measure pieces, developed in close dialogue with the studio.',
              to: '/about#contact',
              cta: 'Enquire',
            },
            {
              title: 'Press & Editorial',
              copy: 'Sample requests, interviews, and features handled by the studio directly.',
              to: '/about#contact',
              cta: 'Contact Press Office',
            },
            {
              title: 'Buyer Consultations',
              copy: 'Wholesale appointments and line sheets for boutiques and showrooms.',
              to: '/about#contact',
              cta: 'Book an Appointment',
            },
          ].map(({ title, copy, to, cta }) => (
            <Reveal key={title} className="flex flex-col items-center gap-4">
              <h3 className="font-serif text-xl text-ink">{title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-charcoal/70">{copy}</p>
              <Link
                to={to}
                className="text-[10px] tracking-[0.3em] uppercase text-ink underline underline-offset-8 transition-opacity duration-300 hover:opacity-60"
              >
                {cta}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
