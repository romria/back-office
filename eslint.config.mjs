import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importX from 'eslint-plugin-import-x';
import promise from 'eslint-plugin-promise';
import globals from 'globals';

export default tseslint.config(
  // 1. Ignores
  { ignores: ['build/**', 'dist/**', '**/*.d.ts', 'webpack.config.*.js', 'postcss.config.js'] },

  // 2. Base rules (all files)
  js.configs.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  promise.configs['flat/recommended'],

  // 3. TypeScript with type checking (src TS/TSX files only)
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      'react/require-default-props': 'off',
    },
  },

  // 4. TypeScript (no type checking) for webpack/postcss/eslint JS config files
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.recommended],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },

  // 5. Test file overrides — relax rules that don't apply to test callbacks/mocks
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'react/display-name': 'off',
    },
  },

  // 6. Shared: globals, import-x plugin, custom rule overrides
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
    plugins: { 'import-x': importX },
    settings: {
      react: { version: 'detect' },
      'import-x/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] } },
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'import-x/prefer-default-export': 'off',
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/no-array-index-key': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/no-unused-state': 'warn',
      'react/jsx-one-expression-per-line': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/control-has-associated-label': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
    },
  },
);
