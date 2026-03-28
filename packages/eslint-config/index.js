import { baseConfig } from './base.js'
import { reactConfig } from './react.js'
import { vueConfig } from './vue.js'
import { nestConfig } from './nest.js'

export { baseConfig, reactConfig, vueConfig, nestConfig }

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**', '**/.turbo/**', '**/public/**'],
  },
  baseConfig,
  reactConfig,
  vueConfig,
]