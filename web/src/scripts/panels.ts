// Routing par hash :
//   #cotorico              → fiche resto
//   #cotorico/menu         → + panneau menu
//   #cotorico/recruitment  → RECRUITMENT global aux couleurs du resto
//   #cotorico/about        → ABOUT aux couleurs du resto
//   #about #recruitment #contact → panneaux globaux

const $$ = <T extends HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)]

export function initPanels() {
  const root = document.documentElement
  const infos = $$('[data-info]')
  const slugs = infos.map((el) => el.dataset.info!)

  const parse = () => {
    const parts = decodeURIComponent(location.hash.slice(1)).split('/').filter(Boolean)
    if (slugs.includes(parts[0])) return {r: parts[0], sub: parts[1] || null}
    return {r: null, sub: parts[0] || null}
  }

  const subId = (r: string | null, sub: string | null) => {
    if (sub === 'menu') return r ? `menu-${r}` : null
    if (sub === 'about' || sub === 'contact' || sub === 'recruitment') return sub
    return null
  }

  const menuLink = document.querySelector<HTMLElement>('[data-menu-link]')
  const desktop = matchMedia('(min-width: 768px)')
  const calm = matchMedia('(prefers-reduced-motion: reduce)')
  let prevR: string | null = null

  // Passage d'un resto à l'autre : MENU glisse sous la fiche (gauche) et ressort vers la droite,
  // en changeant de couleur à mi-course → on comprend que c'est le menu du nouveau resto.
  const swapMenuLink = (oldColor: string, newColor: string) => {
    if (!menuLink || !desktop.matches || calm.matches) return
    const w = menuLink.parentElement!.offsetWidth
    const dur = parseFloat(getComputedStyle(root).getPropertyValue('--dur')) * 1000 || 750
    menuLink.animate(
      [
        {transform: 'translateX(0)', color: oldColor, easing: 'cubic-bezier(.6,0,.9,.4)'},
        {transform: `translateX(${-w}px)`, color: oldColor, offset: 0.5},
        {transform: `translateX(${-w}px)`, color: newColor, offset: 0.5001, easing: 'cubic-bezier(.1,.6,.4,1)'},
        {transform: 'translateX(0)', color: newColor},
      ],
      {duration: dur}, // même durée que le glissement des logos
    )
  }

  const apply = () => {
    const {r, sub} = parse()
    const id = subId(r, sub)
    const switching = !!(prevR && r && prevR !== r)
    const oldColor = menuLink ? getComputedStyle(menuLink).color : ''

    root.classList.toggle('is-r', !!r)
    root.classList.toggle('is-sub', !!id)

    if (r) {
      const el = infos.find((i) => i.dataset.info === r)!
      root.style.setProperty('--r-color', el.dataset.color!)
      root.style.setProperty('--r-accent', el.dataset.accent!)
      if (switching) swapMenuLink(oldColor, el.dataset.accent!)
    }
    prevR = r

    // barre du navigateur mobile = couleur du fond
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', r ? getComputedStyle(root).getPropertyValue('--r-color').trim() : '#f3eee6')

    infos.forEach((el) => {
      const on = el.dataset.info === r
      el.classList.toggle('is-active', on)
      el.inert = !on
    })
    $$('[data-logo]').forEach((el) => el.classList.toggle('is-active', el.dataset.logo === (r || 'home')))
    $$('[data-r]').forEach((el) => el.classList.toggle('is-current', el.dataset.r === r))
    $$('[data-sub]').forEach((el) => {
      const on = el.dataset.sub === id
      el.classList.toggle('is-active', on)
      el.inert = !on
      if (on) el.querySelector('.sub-inner')?.scrollTo(0, 0)
    })

    const prefix = r ? `#${r}/` : '#'
    $$<HTMLAnchorElement>('[data-nav]').forEach((a) => (a.href = prefix + a.dataset.nav))
    $$<HTMLAnchorElement>('[data-menu-link]').forEach((a) => (a.href = r ? `#${r}/menu` : '#'))
    $$<HTMLAnchorElement>('.sub [data-close]').forEach((a) => (a.href = r ? `#${r}` : '#'))
  }

  addEventListener('hashchange', apply)

  // Mobile : un tap en dehors du panneau du dessus le ferme
  // (capture pour bloquer les liens de la home visibles dans la bande)
  document.addEventListener('click', (e) => {
    if (desktop.matches) return
    const t = e.target as Element
    const {r} = parse()
    const sub = document.querySelector('.sub.is-active')
    if (sub) {
      if (sub.contains(t)) return
      e.preventDefault(); e.stopPropagation()
      location.hash = r || ''
    } else if (r) {
      if (t.closest('.col-info')) return
      e.preventDefault(); e.stopPropagation()
      location.hash = ''
    }
  }, true)
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    const {r, sub} = parse()
    location.hash = sub && r ? r : ''
  })

  apply()
  // pas d'animation au chargement direct sur un hash
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove('no-anim')))
}
