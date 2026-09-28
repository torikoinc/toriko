import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('TORIKO')
    .items([
      S.listItem()
        .title('サイト設定（ABOUT / RECRUITMENT / CONTACT）')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('店舗')
        .id('restaurants')
        .child(
          S.documentTypeList('restaurant')
            .title('店舗')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
    ])
