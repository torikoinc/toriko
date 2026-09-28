import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {jaJPLocale} from '@sanity/locale-ja-jp'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

const SINGLETONS = ['siteSettings']

export default defineConfig({
  name: 'default',
  title: 'TORIKO',
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',
  plugins: [structureTool({structure}), jaJPLocale()],
  schema: {
    types: schemaTypes,
    // empêche de créer un 2e siteSettings
    templates: (t) => t.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (prev, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : prev,
  },
})
