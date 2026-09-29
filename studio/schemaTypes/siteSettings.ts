import {defineType, defineField, defineArrayMember} from 'sanity'

const text = defineArrayMember({type: 'block', styles: [{title: 'Normal', value: 'normal'}]})

// 1 seul document (singleton) : réglages + ABOUT + RECRUITMENT + CONTACT
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'サイト設定',
  type: 'document',
  groups: [
    {name: 'general', title: '共通', default: true},
    {name: 'about', title: 'ABOUT'},
    {name: 'recruitment', title: 'RECRUITMENT'},
    {name: 'contact', title: 'CONTACT'},
  ],
  fields: [
    // --- 共通
    defineField({name: 'companyName', title: '会社名', description: '例：TORIKO INC.', type: 'string', group: 'general'}),
    defineField({name: 'logo', title: 'ロゴ', description: '推奨：SVG、または透過PNG 500×500px（正方形）', type: 'image', group: 'general'}),
    defineField({name: 'seoDescription', title: 'SEO 説明文', type: 'text', rows: 3, group: 'general'}),
    defineField({name: 'ogImage', title: 'OG 画像（SNS共有用）', description: '推奨：1200×630px、JPG', type: 'image', group: 'general'}),

    // --- ABOUT
    defineField({name: 'aboutImage', title: '写真', description: '比率は自由（元の比率のまま表示）。推奨：長辺 1600px、JPG、5MB以下', type: 'image', group: 'about'}),
    defineField({name: 'aboutCaption', title: '写真キャプション', description: '例：代表 〇〇', type: 'string', group: 'about'}),
    defineField({name: 'aboutText', title: '本文', type: 'array', of: [text], group: 'about'}),
    defineField({
      name: 'company',
      title: '会社概要',
      description: '例：設立 / 2015年',
      type: 'array',
      group: 'about',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'companyRow',
          fields: [
            defineField({name: 'label', title: '項目', type: 'string'}),
            defineField({name: 'value', title: '内容', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        }),
      ],
    }),

    // --- RECRUITMENT
    defineField({
      name: 'recruitmentIntro',
      title: 'リード文',
      description: 'RECRUITMENT ページの紹介文',
      type: 'array',
      of: [text],
      group: 'recruitment',
    }),
    defineField({
      name: 'positions',
      title: '募集職種',
      description: '店舗ごとにまとめて表示されます',
      type: 'array',
      group: 'recruitment',
      of: [defineArrayMember({type: 'jobPosition'})],
    }),
    defineField({name: 'recruitmentEmpty', title: '募集がない時の文言', type: 'string', group: 'recruitment'}),

    // --- CONTACT
    defineField({name: 'email', title: 'メールアドレス', type: 'string', group: 'contact'}),
    defineField({name: 'phone', title: '電話番号', type: 'string', group: 'contact'}),
    defineField({name: 'address', title: '本社住所', type: 'string', group: 'contact'}),
    defineField({name: 'contactText', title: '補足文', type: 'array', of: [text], group: 'contact'}),
  ],
  preview: {prepare: () => ({title: 'サイト設定'})},
})
