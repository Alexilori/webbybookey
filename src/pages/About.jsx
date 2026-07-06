import Reveal from '../components/Reveal.jsx'

/**
 * About & Contact — two-column portrait and philosophy layout with a
 * minimal contact form (#contact anchor). Built out after homepage approval.
 */
export default function About() {
  return (
    <section className="mx-auto flex min-h-svh max-w-[1400px] flex-col justify-center px-6 py-40 sm:px-10 lg:px-16">
      <Reveal>
        <p className="text-[11px] tracking-[0.35em] uppercase text-umber">About</p>
        <h1 className="mt-6 font-serif text-4xl text-ink sm:text-5xl">The designer</h1>
        <p className="mt-8 max-w-md text-base leading-relaxed text-charcoal/70">
          Studio portrait, brand philosophy, and the contact form for press,
          commissions, and buyer consultations are coming next.
        </p>
      </Reveal>
      <div id="contact" />
    </section>
  )
}
