import {defineType, defineField, defineArrayMember} from 'sanity'

export const menuSection = defineType({
  name: 'menuSection',
  title: 'メニューカテゴリー',
  type: 'object',
  fields: [
    defineField({name: 'titleJa', title: 'カテゴリー名（日本語）', description: '例：焼鳥', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'titleEn', title: 'カテゴリー名（英語）', description: '例：YAKITORI', type: 'string'}),
    defineField({
      name: 'items',
      title: '品目',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuItem',
          title: '品目',
          fields: [
            defineField({name: 'name', title: '品名', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'price', title: '価格', description: '例：¥380 / 時価', type: 'string'}),
            defineField({name: 'note', title: '補足', description: '例：2本〜 / 塩・タレ', type: 'string'}),
            defineField({
              name: 'image',
              title: '写真（任意）',
              description: 'マウスを乗せるとカーソル横に表示されます',
              type: 'image',
              options: {hotspot: true},
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'price', media: 'image'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'titleJa', subtitle: 'titleEn', items: 'items'},
    prepare: ({title, subtitle, items}) => ({
      title,
      subtitle: `${subtitle ?? ''} ・ ${items?.length ?? 0}品`,
    }),
  },
})
