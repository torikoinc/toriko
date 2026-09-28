// Contenu "live" : au chargement, le navigateur redemande les données au CDN Sanity.
// Si elles ont changé depuis le build → on re-rend avec le même render.ts.
// Résultat : une modif publiée dans Sanity est visible sans rebuild Netlify.

import {renderApp, signature} from '../lib/render'
import {siteQuery} from '../lib/queries'

type Config = {projectId?: string; dataset?: string; sig?: string}

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

    document.body.classList.add('no-anim') // pas d'animation pendant l'échange
    app.innerHTML = renderApp(result, cfg)
    cfg.sig = signature(result)
    onSwap()
  } catch {
    // réseau KO → on garde la version du build
  }
}
