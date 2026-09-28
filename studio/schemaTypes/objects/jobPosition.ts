import {defineType, defineField, defineArrayMember} from 'sanity'

export const jobPosition = defineType({
  name: 'jobPosition',
  title: '募集職種',
  type: 'object',
  fields: [
    defineField({name: 'title', title: '職種', description: '例：ホールスタッフ', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'employmentType',
      title: '雇用形態',
      type: 'string',
      options: {
        list: [
          {title: '正社員', value: 'fulltime'},
          {title: 'アルバイト・パート', value: 'parttime'},
          {title: '契約社員', value: 'contract'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'salary', title: '給与', description: '例：時給 1,300円〜', type: 'string'}),
    defineField({name: 'hours', title: '勤務時間', type: 'string'}),
    defineField({
      name: 'details',
      title: '仕事内容・条件',
      type: 'array',
      of: [defineArrayMember({type: 'block', styles: [{title: 'Normal', value: 'normal'}]})],
    }),
    defineField({name: 'applyUrl', title: '応募 URL', description: '空欄の場合は共通の連絡先を表示', type: 'url'}),
  ],
  preview: {select: {title: 'title', subtitle: 'salary'}},
})
