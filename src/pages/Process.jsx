import Reveal from '../components/Reveal.jsx'

/**
 * Process — magazine-style split screen with a sticky sketch column.
 * Built out after homepage approval.
 */
export default function Process() {
  return (
    <section className="mx-auto flex min-h-svh max-w-[1400px] flex-col justify-center px-6 py-40 sm:px-10 lg:px-16">
      <Reveal>
        <p className="text-[11px] tracking-[0.35em] uppercase text-umber">Process</p>
        <h1 className="mt-6 font-serif text-4xl text-ink sm:text-5xl">The craft</h1>
        <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/70">
          The split-screen craftsmanship journey — sketches, swatches, and
          finished garments — is coming next, following the homepage design
          language.
        </p>
      </Reveal>
    </section>
  )
}
