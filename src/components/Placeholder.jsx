import { useMemo, useState } from 'react'

/**
 * Image slot for the site's photography.
 *
 * Three ways a picture can appear here, in order of precedence:
 * 1. `src` prop — the permanent way (file in public/, e.g. "images/hero.jpg").
 * 2. Drag & drop (dev preview) — drop an image file straight onto the frame
 *    in the browser; it renders immediately and persists in localStorage so
 *    it survives reloads. Hover the frame and press "Remove" to clear it.
 *    This is a design-preview tool: for the deployed site, save the file to
 *    public/images/ and set the `src` prop.
 * 3. Neither — a labeled grey placeholder frame is shown.
 *
 * `ratio` uses CSS aspect-ratio (e.g. "3 / 4", "4 / 5", "16 / 9").
 * `full` removes the aspect ratio so the frame fills its container.
 */
export default function Placeholder({
  label,
  caption,
  ratio = '3 / 4',
  full = false,
  src,
  eager = false,
  className = '',
}) {
  const storageKey = `bybookey-image:${label}`
  const [failed, setFailed] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dropped, setDropped] = useState(() => {
    try {
      return localStorage.getItem(storageKey)
    } catch {
      return null
    }
  })

  const fromProp = src && !failed ? `${import.meta.env.BASE_URL}${src}` : null
  const shown = fromProp || dropped

  const floatDelay = useMemo(() => {
    let hash = 0
    for (let i = 0; i < label.length; i += 1) {
      hash = (hash + label.charCodeAt(i) * (i + 1)) % 120
    }
    return `${hash * 45}ms`
  }, [label])

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setDropped(dataUrl)
      try {
        localStorage.setItem(storageKey, dataUrl)
      } catch {
        /* very large image: preview still shows, it just won't survive a reload */
      }
    }
    reader.readAsDataURL(file)
  }

  const clearDropped = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDropped(null)
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
  }

  return (
    <figure
      className={`${full ? 'flex h-full flex-col p-4 sm:p-6 lg:p-8' : 'p-4 sm:p-5 md:p-6'} ${className}`}
    >
      <div
        className={`placeholder-float-frame group/slot relative w-full overflow-hidden bg-linen transition-shadow duration-300 ${
          dragging ? 'shadow-[inset_0_0_0_2px_var(--color-umber)]' : ''
        } ${full ? 'min-h-0 flex-1' : ''}`}
        style={{
          ...(full ? { height: '100%' } : { aspectRatio: ratio }),
          '--float-delay': floatDelay,
        }}
        role={shown ? undefined : 'img'}
        aria-label={shown ? undefined : label}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {shown ? (
          <>
            <img
              src={shown}
              alt={label}
              loading={eager ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover"
              onError={fromProp ? () => setFailed(true) : undefined}
              draggable={false}
            />
            {dropped && !fromProp && (
              <button
                type="button"
                onClick={clearDropped}
                className="absolute top-3 right-3 border border-bone/60 bg-ink/60 px-3 py-1.5 text-[9px] tracking-[0.25em] text-bone uppercase opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/slot:opacity-100 hover:bg-ink"
                aria-label={`Remove dropped image for ${label}`}
              >
                Remove
              </button>
            )}
          </>
        ) : (
          <>
            {/* Hairline inset frame */}
            <div className="pointer-events-none absolute inset-3 border border-ink/10 sm:inset-4" />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <span className="text-[10px] tracking-[0.35em] uppercase text-ash">Placeholder</span>
              <span className="font-serif text-sm text-charcoal italic sm:text-base">{label}</span>
              <span
                className={`mt-3 text-[9px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                  dragging ? 'text-umber' : 'text-ash/70'
                }`}
              >
                {dragging ? 'Release to place image' : 'Drag & drop an image here'}
              </span>
            </div>
          </>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-[11px] tracking-[0.18em] uppercase text-ash">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
