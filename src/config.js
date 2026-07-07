/**
 * Studio contact configuration.
 *
 * WHATSAPP_NUMBER — international format, digits only (no "+", spaces or dashes).
 * Example: +234 916 023 1260 → 2349160231260
 *
 * CONTACT_EMAIL   — studio inbox for chatbot mailto fallback and footer display.
 *                   On Netlify: Forms → chatbot-queries → Notifications →
 *                   add this address to receive submitted queries by email.
 */
export const WHATSAPP_NUMBER = '2349160231260'
export const CONTACT_EMAIL = 'bookey659@gmail.com'
export const LOGO_SRC = 'logo.svg'

const WHATSAPP_MESSAGE = 'Hello By-Bookey - I would like to make an enquiry.'

/** Normalise pasted numbers (+234…, spaces, dashes) to digits-only international. */
export function normalizeWhatsAppNumber(value) {
  const digits = String(value).replace(/\D/g, '')
  // Local NG format 0916… → drop leading 0 when prefixed with 2340
  if (digits.startsWith('2340') && digits.length === 14) {
    return `234${digits.slice(4)}`
  }
  return digits
}

export function buildWhatsAppLink(message = WHATSAPP_MESSAGE) {
  const phone = normalizeWhatsAppNumber(WHATSAPP_NUMBER)
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
}

/** Primary WhatsApp URL — api.whatsapp.com works reliably on mobile and desktop. */
export const WHATSAPP_LINK = buildWhatsAppLink()
