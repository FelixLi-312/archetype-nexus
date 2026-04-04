import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export const baseConfig = {
  files: ['**/*.{ts,tsx,js,jsx}'],
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: {
    '@typescript-eslint': tsPlugin
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true, // 允许 a && b()
        allowTernary: true, // 允许 a ? b() : c()
        allowTaggedTemplates: true
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        // 关键配置：允许以 _ 开头的变量未使用
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        // 关键配置：允许以 _ 开头的 catch 变量未使用
        caughtErrorsIgnorePattern: '^_',
        // 可选：也忽略解构赋值中以 _ 开头的属性
        destructuredArrayIgnorePattern: '^_'
      }
    ]
  }
}
