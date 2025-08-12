// ESLint v9 flat CJS config for React Native + JSX via Babel parser
const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = [
  // Global ignores to keep noise down
  {
    ignores: [
      'node_modules/**', 'android/**', 'ios/**', 'dist/**', 'build/**',
      'src/tests/**', 'src/scripts/**', 'src/localization/translations/**'
    ],
  },

  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: require('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [require('@babel/preset-react')],
        },
      },
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        Blob: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        window: 'readonly',
        global: 'readonly',
        performance: 'readonly',
        requestIdleCallback: 'readonly',
        FormData: 'readonly',
        XMLHttpRequest: 'readonly',
        AbortController: 'readonly',
        URLSearchParams: 'readonly',
        localStorage: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? ['warn', { allow: ['warn', 'error'] }] : 'off',
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'react/jsx-uses-react': 'off', // React 17+ JSX transform
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-restricted-imports': ['error', {
        paths: [
          { name: '@tanstack/react-query', message: 'Use useQueryWithLoading/useMutationWithLoading from src/hooks/useQueryWithLoading.js' },
        ],
      }],
    },
  },
];

