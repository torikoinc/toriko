import {defineType, defineField, defineArrayMember} from 'sanity'

const hex = (r: any) => r.regex(/^#([0-9a-fA-F]{6})$/, {name: 'HEX'})

export const restaurant = defineType({
  name: 'restaurant',
  title: '店舗',
  type: 'document',
  groups: [
    {name: 'info', title: '基本情報', default: true},
    {name: 'design', title: 'デザイン'},
    {name: 'menu', title: 'メニュー'},
    {name: 'recruitment', title: '求人'},
  ],
  fields: [
    // --- 基本情報
    defineField({
      name: 'nameEn',
      title: '店名（英語）',
      description: '例：COTORICO',
      type: 'string',
      group: 'info',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nameJa',
      title: '店名（日本語）',
      description: '例：焼鳥ことりこ',
      type: 'string',
      group: 'info',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'info',
      options: {source: 'nameEn'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'visible',
      title: 'サイトに表示',
      description: 'オフにすると非公開（オープン準備中の店舗など）',
      type: 'boolean',
      group: 'info',
      initialValue: true,
    }),
    defineField({name: 'order', title: '表示順', type: 'number', group: 'info'}),
    defineField({name: 'postalCode', title: '郵便番号', description: '例：〒153-0064', type: 'string', group: 'info'}),
    defineField({name: 'address', title: '住所', type: 'string', group: 'info'}),
    defineField({name: 'phone', title: '電話番号', type: 'string', group: 'info'}),
    defineField({name: 'hours', title: '営業時間', description: '例：17:00-0:00', type: 'string', group: 'info'}),
    defineField({name: 'holidays', title: '定休日', type: 'string', group: 'info'}),
    defineField({name: 'mapUrl', title: 'Google マップ URL', type: 'url', group: 'info'}),
    defineField({name: 'instagram', title: 'Instagram URL', type: 'url', group: 'info'}),
    defineField({name: 'reservationUrl', title: '予約 URL', type: 'url', group: 'info'}),
    defineField({
      name: 'description',
      title: '紹介文',
      type: 'array',
      group: 'info',
      of: [defineArrayMember({type: 'block', styles: [{title: 'Normal', value: 'normal'}], lists: []})],
    }),

    // --- デザイン
    defineField({
      name: 'color',
      title: 'パネルの背景色',
      description: 'HEX（例：#4E4A0B）',
      type: 'string',
      group: 'design',
      validation: hex,
    }),
    defineField({
      name: 'accentColor',
      title: 'アクセント色',
      description: '店名・見出しの色（例：#E6D98A）',
      type: 'string',
      group: 'design',
      validation: hex,
    }),
    defineField({name: 'logo', title: 'ロゴ', type: 'image', group: 'design'}),
    defineField({
      name: 'images',
      title: '写真',
      description: '1枚目がメイン写真になります',
      type: 'array',
      group: 'design',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', title: '代替テキスト', type: 'string'})],
        }),
      ],
    }),

    // --- メニュー
    defineField({
      name: 'menuImage',
      title: 'メニューパネルの写真',
      type: 'image',
      group: 'menu',
      options: {hotspot: true},
    }),
    defineField({
      name: 'menu',
      title: 'メニュー',
      type: 'array',
      group: 'menu',
      of: [defineArrayMember({type: 'menuSection'})],
    }),
    defineField({
      name: 'menuNote',
      title: 'メニュー備考',
      description: '例：価格は全て税込です',
      type: 'string',
      group: 'menu',
    }),

    // --- 求人
    defineField({
      name: 'recruitmentOpen',
      title: '募集中',
      description: 'オンにすると店舗パネルと RECRUITMENT ページに表示されます',
      type: 'boolean',
      group: 'recruitment',
      initialValue: false,
    }),
    defineField({
      name: 'positions',
      title: '募集職種',
      type: 'array',
      group: 'recruitment',
      of: [defineArrayMember({type: 'jobPosition'})],
      hidden: ({document}) => !document?.recruitmentOpen,
    }),
  ],
  orderings: [{title: '表示順', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'nameEn', subtitle: 'nameJa', media: 'logo', visible: 'visible', rec: 'recruitmentOpen'},
    prepare: ({title, subtitle, media, visible, rec}) => ({
      title: `${title}${visible === false ? '（非公開）' : ''}`,
      subtitle: `${subtitle ?? ''}${rec ? ' ・ 募集中' : ''}`,
      media,
    }),
  },
})
