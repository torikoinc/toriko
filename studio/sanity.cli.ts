import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {projectId: '6fyua1ac', dataset: 'production'},
  studioHost: 'toriko', // → toriko.sanity.studio
  server: {port: 3334}, // 3333 = Studio de quentinchambry.com
})
