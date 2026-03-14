import reactPlugin from 'eslint-plugin-react'

export const reactConfig = {
  files: ['**/*.{tsx,jsx}'],
  plugins: {
    react: reactPlugin,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',
  },
}
