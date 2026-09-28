import imageUrlBuilder from '@sanity/image-url'
import {toHTML} from '@portabletext/to-html'
import {projectId, dataset} from './sanity'

const builder = projectId ? imageUrlBuilder({projectId, dataset}) : null

/** URL d'image Sanity (ou `url` direct pour les données de démo) */
export function img(src: any, w: number, h?: number): string | null {
  if (!src) return null
  if (typeof src.url === 'string') return src.url
  if (!builder || !src.asset) return null
  let b = builder.image(src).width(w).auto('format').quality(80)
  if (h) b = b.height(h).fit('crop')
  return b.url()
}

export function srcset(src: any, widths = [640, 960, 1600]) {
  if (!src || typeof src.url === 'string') return undefined
  return widths.map((w) => `${img(src, w)} ${w}w`).join(', ')
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]!)

/** Portable text → HTML (accepte aussi une string simple) */
export function rich(v: any): string {
  if (!v) return ''
  if (typeof v === 'string')
    return v
      .split(/\n{2,}/)
      .map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
      .join('')
  return toHTML(v)
}
