// Galerie photo de la fiche resto : points de navigation + clic sur la photo = suivante.
// Le défilement lui-même est en CSS (scroll-snap), donc le swipe tactile est natif.

export function initGallery() {
  document.querySelectorAll<HTMLElement>('.r-gallery').forEach((g) => {
    const slides = g.querySelector<HTMLElement>('.r-slides')!
    const dots = [...g.querySelectorAll<HTMLButtonElement>('.r-dots button')]
    const count = dots.length
    const current = () => Math.round(slides.scrollLeft / slides.clientWidth)
    const go = (i: number) => slides.scrollTo({left: ((i + count) % count) * slides.clientWidth, behavior: 'smooth'})

    let raf = 0
    slides.addEventListener('scroll', () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const i = current()
        dots.forEach((d, j) => d.classList.toggle('is-active', i === j))
      })
    }, {passive: true})

    dots.forEach((d, i) => d.addEventListener('click', () => go(i)))
    // desktop : clic sur la photo → suivante (en boucle)
    slides.addEventListener('click', () => {
      if (matchMedia('(hover: hover)').matches) go(current() + 1)
    })
  })
}
