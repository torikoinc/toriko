// Remplit サイト設定 → RECRUITMENT → 募集職種 avec des annonces de démo.
// Ne touche qu'au champ "positions" (le reste de サイト設定 est conservé).
// Lancer depuis studio/ :  npx sanity exec scripts/seed-positions.ts --with-user-token

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})

const blocks = (txt: string) =>
  txt.split('\n').map((line, i) => ({
    _type: 'block', _key: `b${i}${Math.random().toString(36).slice(2, 7)}`, style: 'normal', markDefs: [],
    children: [{_type: 'span', _key: `s${i}`, text: line, marks: []}],
  }))

// slug du resto → annonce (null = 全店舗共通)
const jobs: Array<{shop: string | null} & Record<string, any>> = [
  {
    shop: 'toriko',
    title: '焼き場スタッフ',
    employmentType: 'fulltime',
    salary: '月給 26万円〜（経験・能力により優遇）',
    hours: '15:00〜24:00（休憩1時間）',
    details: '備長炭で焼き上げる焼き場を担当していただきます。\n未経験の方も、串打ちから丁寧にお教えします。\n週休2日制・社会保険完備・まかないあり。',
  },
  {
    shop: 'sumiyaki',
    title: 'ホールスタッフ',
    employmentType: 'parttime',
    salary: '時給 1,200円〜（22時以降 1,500円）',
    hours: '17:00〜24:00の間で4時間〜（シフト制）',
    details: '接客・ドリンク作り・配膳をお願いします。\n週2日〜OK、学生・フリーター歓迎。\n交通費支給・まかない無料。',
  },
  {
    shop: 'cotorico',
    title: 'キッチンスタッフ',
    employmentType: 'parttime',
    salary: '時給 1,150円〜',
    hours: '16:00〜23:00（週3日〜）',
    details: '仕込み・一品料理の調理を担当していただきます。\n料理経験のある方歓迎。\n昇給あり・髪型自由。',
  },
  {
    shop: 'cotorico',
    title: 'ホールスタッフ（ランチ）',
    employmentType: 'parttime',
    salary: '時給 1,100円〜',
    hours: '11:00〜15:00（土日祝のみもOK）',
    details: '主婦（夫）の方も活躍中です。\n扶養内勤務の相談も可能です。',
  },
  {
    shop: 'nikai',
    title: 'オープニングスタッフ',
    employmentType: 'contract',
    salary: '時給 1,300円〜（研修期間あり）',
    hours: '17:00〜24:00（シフト制）',
    details: '新店舗のオープニングメンバーを募集しています。\nみんなスタートは同じなので、未経験の方も安心です。\n正社員登用制度あり。',
  },
  {
    shop: null,
    title: '店長・店長候補',
    employmentType: 'fulltime',
    salary: '月給 30万円〜45万円',
    hours: '14:00〜24:00（休憩あり・月8〜9日休み）',
    details: '店舗運営・スタッフ育成・メニュー開発まで幅広くお任せします。\n飲食店での店長経験がある方歓迎。\n賞与年2回・独立支援制度あり。',
  },
]

async function run() {
  const shops: Array<{_id: string; slug: string}> = await client.fetch(
    `*[_type == "restaurant" && !(_id in path("drafts.**"))]{_id, "slug": slug.current}`,
  )
  const idOf = (slug: string) => shops.find((s) => s.slug === slug)?._id

  const positions = jobs.map(({shop, details, ...job}, i) => {
    const id = shop ? idOf(shop) : null
    if (shop && !id) console.warn(`⚠️  resto "${shop}" introuvable → annonce classée 全店舗共通`)
    return {
      _key: `job${i}`,
      _type: 'jobPosition',
      ...job,
      details: blocks(details),
      ...(id ? {restaurant: {_type: 'reference', _ref: id}} : {}),
    }
  })

  await client.createIfNotExists({_id: 'siteSettings', _type: 'siteSettings'})
  await client.patch('siteSettings').set({positions}).commit()
  console.log(`✓ ${positions.length} annonces enregistrées dans サイト設定 → RECRUITMENT`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
