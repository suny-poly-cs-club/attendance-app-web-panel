module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "./node_modules/gts/.eslintrc.json",
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '.prettierrc.js'],
  plugins: ['react-refresh'],
  rules: {
    'node/no-unpublished-import': 0,
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
