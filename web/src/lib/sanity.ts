import {createClient} from '@sanity/client'
import {siteQuery} from './queries'
import {mock} from '../data/mock'

export const projectId = import.meta.env.SANITY_PROJECT_ID
export const dataset = import.meta.env.SANITY_DATASET || 'production'

export async function getSite() {
  if (!projectId) {
    console.warn('[toriko] SANITY_PROJECT_ID absent → données de démo')
    return mock
  }
  const client = createClient({projectId, dataset, apiVersion: '2025-01-01', useCdn: false})
  return client.fetch(siteQuery)
}
