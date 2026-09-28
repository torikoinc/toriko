// Aperçu image au survol d'un item de menu, calé en bas à droite du curseur.
// Désactivé sur écrans tactiles.

export function initMenuHover() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const preview = document.createElement('img')
  preview.className = 'menu-preview'
  preview.alt = ''
  document.body.appendChild(preview)

  const OFFSET = 16
  let x = 0, y = 0, raf = 0

  const place = () => {
    raf = 0
    const w = preview.offsetWidth, h = preview.offsetHeight
    const left = x + OFFSET + w > innerWidth ? x - OFFSET - w : x + OFFSET
    const top = y + OFFSET + h > innerHeight ? y - OFFSET - h : y + OFFSET
    preview.style.transform = `translate(${left}px, ${top}px)`
  }
  const move = (e: MouseEvent) => {
    x = e.clientX
    y = e.clientY
    if (!raf) raf = requestAnimationFrame(place)
  }

  document.querySelectorAll<HTMLElement>('.menu-item[data-img]').forEach((item) => {
    const src = item.dataset.img!
    item.addEventListener('mouseenter', (e) => {
      if (preview.getAttribute('src') !== src) preview.src = src
      move(e)
      preview.classList.add('is-visible')
      item.addEventListener('mousemove', move)
    }, {passive: true})
    item.addEventListener('mouseleave', () => {
      preview.classList.remove('is-visible')
      item.removeEventListener('mousemove', move)
    })
  })

  // préchargement quand un panneau menu s'ouvre
  addEventListener('hashchange', () => {
    document.querySelectorAll<HTMLElement>('.sub.is-active .menu-item[data-img]').forEach((i) => {
      new Image().src = i.dataset.img!
    })
  })
}
