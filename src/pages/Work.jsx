import Reveal from '../components/Reveal.jsx'

/**
 * Work / Collections — asymmetrical editorial grid with hover reveals
 * and a full-screen lightbox. Built out after homepage approval.
 */
export default function Work() {
  return (
    <section className="mx-auto flex min-h-svh max-w-[1400px] flex-col justify-center px-6 py-40 sm:px-10 lg:px-16">
      <Reveal>
        <p className="text-[11px] tracking-[0.35em] uppercase text-umber">Work</p>
        <h1 className="mt-6 font-serif text-4xl text-ink sm:text-5xl">Collections</h1>
        <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/70">
          The editorial grid of seasonal collections is coming next — this page
          will follow the design language established on the homepage.
        </p>
      </Reveal>
    </section>
  )
}
