import { WHATSAPP_LINK } from '../config.js'

/**
 * Opens WhatsApp in a new tab/app. Uses api.whatsapp.com and a click
 * fallback so the link works even when plain href navigation is blocked
 * (some in-app browsers, Electron, etc.).
 */
export default function WhatsAppLink({ className = '', children, ...props }) {
  const open = (event) => {
    event.preventDefault()
    window.open(WHATSAPP_LINK, '_blank', 'noopener,noreferrer')
  }

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      onClick={open}
      className={className}
      {...props}
    >
      {children}
    </a>
  )
}
