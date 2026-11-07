// Liste des restos : une seule taille pour tous les noms, réduite juste assez
// pour que le plus long tienne sur une ligne dans sa colonne (1/3 d'écran sur desktop,
// pleine largeur sur mobile). Plafonnée à la taille des gros titres (--fs-l).

export function initFitList() {
  const ul = document.querySelector<HTMLElement>('.r-list')
  if (!ul) return () => {}

  const run = () => {
    ul.style.removeProperty('--fs-list') // repart de --fs-l
    const fs = parseFloat(getComputedStyle(ul).fontSize)
    const mobile = !matchMedia('(min-width: 768px)').matches
    const padEl = document.querySelector<HTMLElement>(mobile ? '.stage' : '.col-left')
    const pad = padEl ? parseFloat(getComputedStyle(padEl).paddingLeft) : 16
    const avail = (mobile ? innerWidth : innerWidth / 3) - 2 * pad
    const widest = Math.max(...[...ul.querySelectorAll('a')].map((a) => a.getBoundingClientRect().width))
    if (widest > avail) ul.style.setProperty('--fs-list', `${Math.floor(fs * avail / widest * 10) / 10}px`)
  }

  run()
  document.fonts?.ready.then(run) // recalcul une fois Noto Sans JP chargée
  const ac = new AbortController()
  addEventListener('resize', run, {signal: ac.signal})
  return () => ac.abort()
}
