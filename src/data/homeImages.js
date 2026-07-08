/**
 * Homepage photography — files live in public/picsbokky/.
 * Placeholder frames stay grey until the file exists; drag-and-drop still
 * works in the browser for quick previews during design.
 */
export const PICS = {
  anthhero: 'picsbokky/anthhero.jpg',
  main: 'picsbokky/main.jpg',
  orih: 'picsbokky/orih.jpg',
}

export const HOME_IMAGES = {
  hero: PICS.anthhero,
  campaigns: [PICS.main, PICS.orih],
  looks: [PICS.main, PICS.orih, PICS.anthhero, PICS.main, PICS.orih, PICS.anthhero],
  atelier: PICS.main,
}
