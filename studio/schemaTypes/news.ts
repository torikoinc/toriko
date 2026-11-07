import {defineField, defineType} from 'sanity'

export const news = defineType({
  name: 'news',
  title: 'ニュース',
  type: 'document',
  fields: [
    defineField({name: 'date', title: '日付', type: 'date', validation: (r) => r.required(), initialValue: () => new Date().toISOString().slice(0, 10)}),
    defineField({name: 'title', title: 'タイトル', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'body', title: '本文', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'image', title: '画像（任意）', type: 'image', description: '比率自由・横幅1600px程度推奨', options: {hotspot: true}}),
    defineField({name: 'url', title: 'リンク（任意）', type: 'url'}),
    defineField({name: 'urlLabel', title: 'リンクの表示テキスト（任意）', type: 'string', description: '空欄の場合「詳しくはこちら」'}),
  ],
  orderings: [{title: '日付（新しい順）', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'date', media: 'image'}},
})
