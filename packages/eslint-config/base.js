import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export const baseConfig = {
  files: ['**/*.{ts,tsx,js,jsx}'],
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: {
    '@typescript-eslint': tsPlugin,
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',

    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-imports': 'warn',
  },
}
