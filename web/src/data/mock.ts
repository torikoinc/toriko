// Données de démo (même forme que le résultat de siteQuery).
// Utilisées tant que SANITY_PROJECT_ID n'est pas défini.

const text = `2012年1月15日に福岡市中央区の港にオープン。
仕事帰りだけでなく、家族でも来れるようなアットホームな店づくりを目指しました。本場福岡で愛されるスタイルの焼き鳥メニューだけでなく、こだわりの食材を使ったアラカルトメニューもご用意しております。子供のデザートから大人のおつまみまで幅広くご用意しております。`

const yakitori = {url: '/mock/yakitori.svg'}
const photo = {url: '/mock/photo.svg'}

const menu = [
  {
    titleJa: '焼鳥',
    titleEn: 'YAKITORI',
    items: [
      {name: 'もも', note: '塩・たれ', price: '220円', image: yakitori},
      {name: 'ねぎま', note: '塩・たれ', price: '240円', image: yakitori},
      {name: 'かわ', note: '塩・たれ', price: '220円'},
      {name: 'ぼんじり', price: '240円'},
      {name: '砂肝', price: '240円'},
      {name: 'ハツ', price: '240円'},
      {name: 'レバー', price: '240円'},
      {name: 'せせり', price: '260円'},
      {name: 'ささみ', note: '梅・わさび', price: '280円'},
      {name: '手羽先', price: '300円'},
      {name: 'つくね', note: '月見 +80円', price: '320円', image: yakitori},
    ],
  },
  {
    titleJa: '野菜串',
    titleEn: 'VEGETABLES',
    items: [
      {name: 'しいたけ', price: '220円'},
      {name: 'ししとう', price: '220円'},
      {name: '長ねぎ', price: '220円'},
      {name: 'エリンギ', price: '240円'},
      {name: 'アスパラベーコン', price: '320円'},
      {name: 'うずらベーコン', price: '320円'},
    ],
  },
  {
    titleJa: '一品料理',
    titleEn: 'SIDES',
    items: [
      {name: '枝豆', price: '420円'},
      {name: '冷やしトマト', price: '480円'},
      {name: 'たたききゅうり', price: '480円'},
      {name: 'ポテトサラダ', price: '520円'},
      {name: 'だし巻き玉子', price: '680円'},
      {name: '鶏の唐揚げ', price: '780円'},
      {name: '揚げ出し豆腐', price: '620円'},
    ],
  },
]

const base = {
  postalCode: '〒810-0075',
  address: '福岡県福岡市中央区港2-10-3',
  phone: '092-711-7188',
  hours: '17:00-0:00',
  description: text,
  images: [photo],
  menu,
  menuImage: yakitori,
  menuNote: '価格は全て税込です',
}

const ref = (slug: string, nameEn: string, nameJa: string) => ({slug, nameEn, nameJa})

const positions = [
  {
    title: 'ホールスタッフ',
    restaurant: ref('cotorico', 'COTORICO', '焼鳥ことりこ'),
    employmentType: 'parttime',
    salary: '時給 1,200円〜',
    hours: '17:00-0:00（シフト制）',
    details: '未経験歓迎。週2日〜OK。まかないあり。',
  },
  {
    title: 'ホールスタッフ',
    restaurant: ref('sumiyaki', 'SUMIYAKI', '炭焼きとりこ'),
    employmentType: 'parttime',
    salary: '時給 1,200円〜',
    hours: '17:00-0:00（シフト制）',
  },
  {
    title: '焼き場スタッフ',
    restaurant: ref('cotorico', 'COTORICO', '焼鳥ことりこ'),
    employmentType: 'fulltime',
    salary: '月給 25万円〜',
    hours: '15:00-0:00',
    details: '経験者優遇。社会保険完備。',
  },
  {
    title: '店長候補',
    employmentType: 'fulltime',
    salary: '月給 30万円〜',
    details: '全店舗共通の募集です。',
  },
]

const restaurants = [
  {...base, _id: 'r1', slug: 'toriko', nameEn: 'TORIKO', nameJa: '焼きとりのとりこ', color: '#103353'},
  {...base, _id: 'r2', slug: 'sumiyaki', nameEn: 'SUMIYAKI', nameJa: '炭焼きとりこ', color: '#302703'},
  {...base, _id: 'r3', slug: 'cotorico', nameEn: 'COTORICO', nameJa: '焼鳥ことりこ', color: '#4F4B07'},
]

export const mock = {
  settings: {
    companyName: 'TORIKO INC.',
    seoDescription: '福岡の焼鳥店「とりこ」グループ。',
    aboutText: `${text}\n\n${text}`,
    aboutImage: photo,
    aboutCaption: '代表 〇〇〇〇',
    company: [
      {label: '会社名', value: '株式会社とりこ'},
      {label: '設立', value: '2012年'},
      {label: '所在地', value: '福岡県福岡市中央区'},
    ],
    recruitmentIntro: '一緒に働く仲間を募集しています。各店舗の募集内容をご確認ください。',
    recruitmentEmpty: '現在募集はありません。',
    positions,
    email: 'info@toriko.jp',
    phone: '092-711-7188',
    address: '〒810-0075 福岡県福岡市中央区港2-10-3',
    contactText: 'ご予約は各店舗まで直接お電話ください。',
  },
  restaurants,
}
