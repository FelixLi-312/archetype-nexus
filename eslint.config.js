import { ignores, baseConfig, vueConfig, reactConfig } from '@nexus/eslint-config'
import storybook from 'eslint-plugin-storybook'

export default [
  ignores,
  baseConfig,
  vueConfig,
  reactConfig,
  ...storybook.configs['flat/recommended']
]
