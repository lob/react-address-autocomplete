import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import imports from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import jest from 'eslint-plugin-jest'
import testingLibrary from 'eslint-plugin-testing-library'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

// Checks beyond the presets that catch unsafe patterns and project-specific mistakes.
const projectRules = {
  'array-callback-return': 'warn',
  'default-case': ['warn', { commentPattern: '^no default$' }],
  eqeqeq: ['warn', 'smart'],
  'no-array-constructor': 'warn',
  'no-caller': 'warn',
  'no-eval': 'warn',
  'no-extend-native': 'warn',
  'no-extra-bind': 'warn',
  'no-extra-label': 'warn',
  'no-implied-eval': 'warn',
  'no-iterator': 'warn',
  'no-label-var': 'warn',
  'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
  'no-lone-blocks': 'warn',
  'no-loop-func': 'warn',
  'no-multi-str': 'warn',
  'no-new-func': 'warn',
  'no-object-constructor': 'warn',
  'no-new-wrappers': 'warn',
  'no-script-url': 'warn',
  'no-self-compare': 'warn',
  'no-sequences': 'warn',
  'no-template-curly-in-string': 'warn',
  'no-throw-literal': 'warn',
  'no-restricted-globals': [
    'error',
    'addEventListener',
    'blur',
    'close',
    'closed',
    'confirm',
    'defaultStatus',
    'defaultstatus',
    'event',
    'external',
    'find',
    'focus',
    'frameElement',
    'frames',
    'history',
    'innerHeight',
    'innerWidth',
    'length',
    'location',
    'locationbar',
    'menubar',
    'moveBy',
    'moveTo',
    'name',
    'onblur',
    'onerror',
    'onfocus',
    'onload',
    'onresize',
    'onunload',
    'open',
    'opener',
    'opera',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    'parent',
    'print',
    'removeEventListener',
    'resizeBy',
    'resizeTo',
    'screen',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scroll',
    'scrollbars',
    'scrollBy',
    'scrollTo',
    'scrollX',
    'scrollY',
    'self',
    'status',
    'statusbar',
    'stop',
    'toolbar',
    'top'
  ],
  'no-unused-expressions': [
    'error',
    { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true }
  ],
  'no-use-before-define': [
    'warn',
    { functions: false, classes: false, variables: false }
  ],
  'no-useless-computed-key': 'warn',
  'no-useless-concat': 'warn',
  'no-useless-constructor': 'warn',
  'no-useless-rename': 'warn',
  'no-restricted-properties': [
    'error',
    { object: 'require', property: 'ensure', message: 'Use import() instead.' },
    { object: 'System', property: 'import', message: 'Use import() instead.' }
  ],
  'import/first': 'error',
  'import/no-amd': 'error',
  'import/no-anonymous-default-export': 'warn',
  'import/no-webpack-loader-syntax': 'error',
  'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
  'react/jsx-pascal-case': ['warn', { allowAllCaps: true, ignore: [] }],
  'react/no-typos': 'error',
  'react/style-prop-object': 'warn',
  'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
  'react/prop-types': 'off'
}

export default defineConfig([
  {
    ignores: [
      '**/build/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/.snapshots/**',
      '**/*.min.js',
      '**/.*'
    ]
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node }
    },
    settings: { react: { version: '18' } },
    plugins: { import: imports },
    rules: projectRules
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    ignores: ['example/**'],
    plugins: { prettier },
    rules: {
      ...prettierConfig.rules,
      ...prettier.configs.recommended.rules
    }
  },
  {
    files: ['example/**/*.{js,jsx,mjs}'],
    rules: {
      'no-inner-declarations': 'error',
      'no-constant-condition': ['error', { checkLoops: 'all' }],
      // Use @jest/globals for explicit Jest imports.
      'no-restricted-imports': ['error', 'jest'],
      'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }]
    }
  },
  {
    files: [
      '**/*.{test,spec}.{js,jsx,mjs}',
      '**/__tests__/**/*.{js,jsx,mjs}',
      '**/setupTests.{js,jsx,mjs}'
    ],
    extends: [jest.configs['flat/recommended']],
    settings: {
      'testing-library/utils-module': 'off',
      'testing-library/custom-renders': 'off',
      'testing-library/custom-queries': 'off'
    },
    plugins: { 'testing-library': testingLibrary },
    rules: {
      'testing-library/await-async-queries': 'error',
      'testing-library/await-async-utils': 'error',
      'testing-library/no-await-sync-queries': 'warn',
      'testing-library/no-dom-import': ['error', 'react'],
      'testing-library/no-wait-for-snapshot': 'error'
    }
  }
])
