import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export const vueConfig = {
  files: ['**/*.vue'],
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  plugins: {
    vue: vuePlugin,
  },
  rules: {
    ...vuePlugin.configs['flat/recommended'].rules,
    'vue/multi-word-component-names': 'off',
    'vue/no-setup-props-destructure': 'off',
  },
}
