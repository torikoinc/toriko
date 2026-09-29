// Contenu "live" : au chargement, le navigateur redemande les données au CDN Sanity.
// Si elles ont changé depuis le build → on re-rend avec le même render.ts.
// Résultat : une modif publiée dans Sanity est visible sans rebuild Netlify.

import {renderApp, signature} from '../lib/render'
import {siteQuery} from '../lib/queries'

type Config = {projectId?: string; dataset?: string; sig?: string}

// Heure de la dernière navigation (ouverture/fermeture de panneau)
let lastNav = 0
addEventListener('hashchange', () => (lastNav = performance.now()))

// Attend qu'aucune animation de panneau ne soit en cours avant de re-rendre
const whenIdle = async () => {
  const dur = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur')) || 0.75) * 1000
  while (performance.now() - lastNav < dur + 150) await new Promise((r) => setTimeout(r, 100))
}

export async function initLive(onSwap: () => void) {
  const el = document.getElementById('site-config')
  const app = document.getElementById('app')
  if (!el || !app) return
  const cfg: Config = JSON.parse(el.textContent || '{}')
  if (!cfg.projectId) return // mode démo

  try {
    const url = `https://${cfg.projectId}.apicdn.sanity.io/v2025-01-01/data/query/${cfg.dataset || 'production'}?query=${encodeURIComponent(siteQuery)}`
    const res = await fetch(url)
    if (!res.ok) return
    const {result} = await res.json()
    if (!result || signature(result) === cfg.sig) return // rien de neuf

    await whenIdle() // ne pas couper une animation en cours
    console.info('[toriko] contenu mis à jour depuis Sanity')
    document.body.classList.add('no-anim') // pas d'animation pendant l'échange
    app.innerHTML = renderApp(result, cfg)
    cfg.sig = signature(result)
    onSwap()
  } catch {
    // réseau KO → on garde la version du build
  }
}
