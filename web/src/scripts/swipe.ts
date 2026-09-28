// Mobile : swipe vers la droite pour fermer un panneau (fiche resto ou sous-panneau).
// Le panneau suit le doigt ; au-delà du seuil (ou geste rapide) il se ferme, sinon il revient.

const THRESHOLD = 0.25 // 25 % de la largeur du panneau
const VELOCITY = 0.5 // px/ms

export function initSwipe() {
  const mq = matchMedia('(max-width: 767px)')

  document.querySelectorAll<HTMLElement>('.col-info, .sub').forEach((panel) => {
    let x0 = 0, y0 = 0, t0 = 0, dx = 0
    let mode: 'idle' | 'drag' | 'scroll' = 'idle'

    panel.addEventListener('touchstart', (e) => {
      if (!mq.matches || e.touches.length > 1) return
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
      t0 = performance.now()
      dx = 0
      mode = 'idle'
    }, {passive: true})

    panel.addEventListener('touchmove', (e) => {
      if (!mq.matches || mode === 'scroll') return
      const mx = e.touches[0].clientX - x0
      const my = e.touches[0].clientY - y0
      if (mode === 'idle') {
        if (Math.abs(mx) < 8 && Math.abs(my) < 8) return
        // geste vertical → on laisse scroller
        mode = mx > 0 && Math.abs(mx) > Math.abs(my) ? 'drag' : 'scroll'
        if (mode === 'scroll') return
        panel.style.transition = 'none'
      }
      e.preventDefault()
      dx = Math.max(0, mx)
      panel.style.transform = `translateX(${dx}px)`
    }, {passive: false})

    const end = () => {
      if (mode !== 'drag') return
      mode = 'idle'
      const v = dx / (performance.now() - t0)
      const close = dx > panel.offsetWidth * THRESHOLD || v > VELOCITY
      // on rend la main au CSS : la transition part de la position actuelle
      panel.style.transition = ''
      panel.style.transform = ''
      if (close) {
        const a = panel.querySelector<HTMLAnchorElement>(':scope > [data-close]')
        location.hash = a ? new URL(a.href).hash : ''
      }
    }
    panel.addEventListener('touchend', end)
    panel.addEventListener('touchcancel', end)
  })
}
