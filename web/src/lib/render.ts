// Rendu du site en HTML (string) — UNE SEULE source pour :
//  - le build Astro (HTML statique complet, SEO + affichage immédiat)
//  - le navigateur (live.ts re-rend avec les données fraîches de Sanity)
// ⚠️ Toute modif de mise en page se fait ICI.

import imageUrlBuilder from '@sanity/image-url'
import {toHTML} from '@portabletext/to-html'

export type Cfg = {projectId?: string; dataset?: string}

// ---------- helpers ----------
const esc = (v: any) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]!)
const tel = (p: string) => p.replace(/[^\d+]/g, '')
const X = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1 1 9 9M9 1 1 9" /></svg>'

export function rich(v: any): string {
  if (!v) return ''
  if (typeof v === 'string')
    return v.split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('')
  return toHTML(v)
}

export function images(cfg: Cfg) {
  const builder = cfg.projectId ? imageUrlBuilder({projectId: cfg.projectId, dataset: cfg.dataset || 'production'}) : null
  const img = (src: any, w: number, h?: number): string | null => {
    if (!src) return null
    if (typeof src.url === 'string') return src.url // données de démo
    if (!builder || !src.asset) return null
    let b = builder.image(src).width(w).auto('format').quality(80)
    if (h) b = b.height(h).fit('crop')
    return b.url()
  }
  const srcset = (src: any, widths = [640, 960, 1600]) =>
    !src || typeof src.url === 'string' ? '' : widths.map((w) => `${img(src, w)} ${w}w`).join(', ')
  return {img, srcset}
}

// ---------- blocs ----------
function logo(url: string | null, label: string, attrs: string, cls = '') {
  return url
    ? `<img src="${esc(url)}" alt="${esc(label)}" class="${cls}" ${attrs} />`
    : `<span class="logo-ph ${cls}" aria-label="${esc(label)}" ${attrs}>${esc(label?.slice(0, 1))}</span>`
}

function sub(id: string, title: string, titleJa: string | null, body: string) {
  return `<aside class="sub" data-sub="${esc(id)}" inert>
  <a class="close" href="#" data-close aria-label="閉じる">${X}</a>
  <div class="sub-inner">
    <h2 class="sub-title">${esc(title)}${titleJa ? `<span> ${esc(titleJa)}</span>` : ''}</h2>
    ${body}
  </div>
</aside>`
}

const JOB_TYPES: Record<string, string> = {fulltime: '正社員', parttime: 'アルバイト・パート', contract: '契約社員'}

function positionsHtml(positions: any[], email?: string) {
  return positions
    .map((p) => {
      const apply = p.applyUrl
        ? `<a class="job-apply" href="${esc(p.applyUrl)}" target="_blank" rel="noopener">応募する →</a>`
        : email
          ? `<a class="job-apply" href="mailto:${esc(email)}?subject=${esc(encodeURIComponent('求人応募：' + p.title))}">応募する →</a>`
          : ''
      return `<div class="job">
  <h4>${esc(p.title)}${p.employmentType ? `<span>${esc(JOB_TYPES[p.employmentType])}</span>` : ''}</h4>
  <dl>${p.salary ? `<dt>給与</dt><dd>${esc(p.salary)}</dd>` : ''}${p.hours ? `<dt>勤務時間</dt><dd>${esc(p.hours)}</dd>` : ''}</dl>
  ${p.details ? `<div class="job-details">${rich(p.details)}</div>` : ''}
  ${apply}
</div>`
    })
    .join('')
}

// ---------- page ----------
export function renderApp(data: any, cfg: Cfg): string {
  const {img, srcset} = images(cfg)
  const s = data?.settings || {}
  const restaurants: any[] = data?.restaurants || []
  const company = s.companyName || 'TORIKO INC.'
  const allPositions: any[] = s.positions || []
  const hasJobs = allPositions.length > 0

  // recrutement groupé par resto (ordre des restos), puis 全店舗共通
  const recruitment = [
    ...restaurants
      .map((r) => ({r, positions: allPositions.filter((p) => p.restaurant?.slug === r.slug)}))
      .filter((g) => g.positions.length),
    ...(allPositions.some((p) => !p.restaurant?.slug)
      ? [{r: null as any, positions: allPositions.filter((p) => !p.restaurant?.slug)}]
      : []),
  ]

  const info = (r: any) => {
    const photo = r.images?.[0]
    const photoUrl = img(photo, 960, 720)
    const color = r.color || '#333333'
    return `<article class="r-info" data-info="${esc(r.slug)}" data-color="${esc(color)}" data-accent="${esc(r.accentColor || color)}" inert>
  ${photoUrl
    ? `<img class="r-photo" src="${esc(photoUrl)}" srcset="${esc(srcset(photo))}" sizes="(max-width: 767px) 100vw, 33vw" alt="${esc(photo?.alt || r.nameJa)}" loading="lazy" />`
    : '<div class="r-photo"></div>'}
  <div class="r-body">
    <h2 class="big r-name">${esc(r.nameEn)}<br /><span>${esc(r.nameJa)}</span></h2>
    <p class="r-meta">
      ${r.postalCode ? `${esc(r.postalCode)}<br />` : ''}
      ${r.address ? (r.mapUrl ? `<a href="${esc(r.mapUrl)}" target="_blank" rel="noopener">${esc(r.address)}</a>` : esc(r.address)) : ''}<br />
      ${r.phone ? `<a href="tel:${esc(tel(r.phone))}">${esc(r.phone)}</a><br />` : ''}
      ${esc(r.hours)}${r.holidays ? ` ／ 定休日 ${esc(r.holidays)}` : ''}
    </p>
    <div class="r-desc">${rich(r.description)}</div>
    ${r.instagram || r.reservationUrl
      ? `<p class="r-ext">${r.reservationUrl ? `<a href="${esc(r.reservationUrl)}" target="_blank" rel="noopener">RESERVATION 予約</a>` : ''}${r.instagram ? `<a href="${esc(r.instagram)}" target="_blank" rel="noopener">INSTAGRAM</a>` : ''}</p>`
      : ''}
    <!-- mobile uniquement : sur desktop ces liens sont dans la colonne de droite -->
    <div class="r-links">
      ${logo(img(r.logo, 240), r.nameEn, '', 'r-links-logo')}
      <div>
        <a class="big" href="#${esc(r.slug)}/menu">MENU<br /><span>メニュー</span></a>
        ${hasJobs ? `<a class="small-link" href="#${esc(r.slug)}/recruitment">RECRUITMENT 求人</a>` : ''}
      </div>
    </div>
  </div>
</article>`
  }

  const menu = (r: any) => {
    const menuImg = img(r.menuImage, 800)
    const cats = (r.menu || [])
      .map((cat: any, i: number) => {
        const items = (cat.items || [])
          .map((it: any) => {
            const preview = img(it.image, 480)
            return `<li class="menu-item"${preview ? ` data-img="${esc(preview)}"` : ''}><span>${esc(it.name)}${it.note ? `<small>（${esc(it.note)}）</small>` : ''}</span><span>${esc(it.price)}</span></li>`
          })
          .join('')
        return `<section class="menu-cat"><h3>${esc(cat.titleJa)}${cat.titleEn ? `<span>${esc(cat.titleEn)}</span>` : ''}</h3><ul>${items}</ul></section>${
          i === 0 && menuImg ? `<img class="menu-photo" src="${esc(menuImg)}" alt="" loading="lazy" />` : ''
        }`
      })
      .join('')
    return sub(`menu-${r.slug}`, 'MENU', 'メニュー', cats + (r.menuNote ? `<p class="menu-note">${esc(r.menuNote)}</p>` : ''))
  }

  const aboutImg = img(s.aboutImage, 800)
  const about = sub('about', 'ABOUT', null, `
    <div class="prose">${rich(s.aboutText)}</div>
    ${s.company?.length ? `<dl class="company">${s.company.map((row: any) => `<dt>${esc(row.label)}</dt><dd>${esc(row.value)}</dd>`).join('')}</dl>` : ''}
    ${aboutImg ? `<figure class="about-fig"><img src="${esc(aboutImg)}" alt="" loading="lazy" />${s.aboutCaption ? `<figcaption>${esc(s.aboutCaption)}</figcaption>` : ''}</figure>` : ''}`)

  const rec = sub('recruitment', 'RECRUITMENT', '求人', `
    <div class="prose">${rich(s.recruitmentIntro)}</div>
    ${recruitment.length
      ? recruitment
          .map(({r, positions}) => `<section class="rec-block">${
            r ? `<h3><a href="#${esc(r.slug)}">${esc(r.nameEn)}</a><span>${esc(r.nameJa)}</span></h3>` : '<h3>ALL<span>全店舗共通</span></h3>'
          }${positionsHtml(positions, s.email)}</section>`)
          .join('')
      : `<p>${esc(s.recruitmentEmpty || '現在募集はありません。')}</p>`}`)

  const contact = sub('contact', 'CONTACT', 'お問い合わせ', `
    <p class="contact-lines">
      ${s.email ? `<a href="mailto:${esc(s.email)}">${esc(s.email)}</a><br />` : ''}
      ${s.phone ? `<a href="tel:${esc(tel(s.phone))}">${esc(s.phone)}</a><br />` : ''}
      ${esc(s.address)}
    </p>
    <div class="prose">${rich(s.contactText)}</div>
    <ul class="contact-shops">${restaurants.map((r) => `<li><a href="#${esc(r.slug)}">${esc(r.nameEn)}</a> ${esc(r.phone)}</li>`).join('')}</ul>`)

  return `<div class="stage">
  <div class="col col-left">
    <a href="#" class="big brand">${esc(company)}</a>
    <ul class="big r-list">${restaurants.map((r) => `<li><a href="#${esc(r.slug)}" data-r="${esc(r.slug)}">${esc(r.nameEn)}</a></li>`).join('')}</ul>
  </div>
  <div class="col col-info">
    <a href="#" class="strip-close" data-close aria-label="閉じる">${X}</a>
    ${restaurants.map(info).join('')}
  </div>
  <div class="col col-right">
    <div class="logo-slot">
      ${logo(img(s.logo, 240), company, 'data-logo="home"', 'is-active')}
      ${restaurants.map((r) => logo(img(r.logo, 240), r.nameEn, `data-logo="${esc(r.slug)}"`)).join('')}
    </div>
    <a class="big menu-link" href="#" data-menu-link>MENU<br /><span>メニュー</span></a>
    <nav class="big main-nav">
      <a href="#about" data-nav="about">ABOUT</a>
      <a href="#recruitment" data-nav="recruitment">RECRUITMENT</a>
      <a href="#contact" data-nav="contact">CONTACT</a>
    </nav>
  </div>
</div>
${restaurants.map(menu).join('')}
${about}
${rec}
${contact}`
}

/** Empreinte du contenu, pour savoir si Sanity a changé depuis le build */
export function signature(data: any): string {
  const str = JSON.stringify(data ?? null)
  let h = 5381
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}
