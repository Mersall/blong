module.exports = {
  root: true,
  env: { es6: true, node: true, browser: true, jest: true },
  extends: [
    '@react-native',
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
  },
  ignorePatterns: [
    'node_modules/**', 'android/**', 'ios/**', 'dist/**', 'build/**',
    'src/tests/**', 'src/scripts/**'
  ],
  rules: {
    // Enforce BLONG spacing multiples in inline numeric literals when obvious
    // Note: comprehensive design checks are handled by scripts/design-lint.js

    // No console in production builds (allow warn/error)
    'no-console': process.env.NODE_ENV === 'production' ? ['warn', { allow: ['warn', 'error'] }] : 'off',

    // Style preferences
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
      rules: {},
    },
  ],
};

