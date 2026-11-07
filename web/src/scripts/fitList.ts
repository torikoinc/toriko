// Gros titres : une seule taille pour tout le site (--fs-l), réduite juste assez
// pour que le nom de resto le plus long tienne sur une ligne dans sa colonne
// (1/3 d'écran sur desktop, pleine largeur sur mobile). Plafonnée à la taille du CSS.

export function initFitList() {
  const ul = document.querySelector<HTMLElement>('.r-list')
  if (!ul) return () => {}

  const run = () => {
    const root = document.documentElement
    root.style.removeProperty('--fs-l') // repart de la taille définie dans le CSS
    const fs = parseFloat(getComputedStyle(ul).fontSize)
    const mobile = !matchMedia('(min-width: 768px)').matches
    const padEl = document.querySelector<HTMLElement>(mobile ? '.stage' : '.col-left')
    const pad = padEl ? parseFloat(getComputedStyle(padEl).paddingLeft) : 16
    const avail = (mobile ? innerWidth : innerWidth / 3) - 2 * pad
    const widest = Math.max(...[...ul.querySelectorAll('a')].map((a) => a.getBoundingClientRect().width))
    if (widest > avail) root.style.setProperty('--fs-l', `${Math.floor(fs * avail * 0.98 / widest * 10) / 10}px`)
  }

  run()
  document.fonts?.ready.then(run) // recalcul une fois Noto Sans JP chargée
  const ac = new AbortController()
  addEventListener('resize', run, {signal: ac.signal})
  return () => ac.abort()
}
