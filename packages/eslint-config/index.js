import { baseConfig } from './base.js'
import { reactConfig } from './react.js'
import { vueConfig } from './vue.js'
import { nestConfig } from './nest.js'

export { baseConfig, reactConfig, vueConfig, nestConfig }

export const ignores = {
  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    '**/storybook-static/**',
    '**/.turbo/**',
    '**/public/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.config.{js,ts,mjs,cjs}'
  ]
}

export default [ignores, baseConfig]
