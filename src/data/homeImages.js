/**
 * Homepage photography — paths are relative to public/.
 * Placeholder frames stay grey until the file exists; drag-and-drop still
 * works in the browser for quick previews during design.
 */
export const PICS = {
  anthhero: '/picsbokky/anthhero.jpg', // hero image in picsbokky folder
  main: '/meridian.jpg', // meridian campaign — public/meridian.jpg
  orih: '/raw.jpg', // raw seam capsule — public/raw.jpg
}

export const HOME_IMAGES = {
  hero: PICS.anthhero,
  campaigns: [PICS.main, PICS.orih],
  looks: [PICS.main, PICS.orih, PICS.anthhero, PICS.main, PICS.orih, PICS.anthhero],
  atelier: PICS.main,
}
