/**
 * ESLint flat config for the tree-sitter grammar.
 *
 * `grammar.js` runs in the tree-sitter DSL sandbox, where rule helpers
 * (`seq`, `choice`, `repeat`, `field`, …) and `grammar` are injected as
 * globals. They are declared here so `no-undef` doesn't flag them.
 */
'use strict';

const js = require('@eslint/js');

const DSL_GLOBALS = [
  'grammar',
  'seq',
  'choice',
  'repeat',
  'repeat1',
  'optional',
  'field',
  'alias',
  'token',
  'prec',
  'sym',
];

module.exports = [
  js.configs.recommended,
  {
    files: ['grammar.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: Object.fromEntries(DSL_GLOBALS.map((g) => [g, 'readonly'])),
    },
    rules: {
      // Every rule is `($) => …`; the `$` arg is conventionally always present
      // even when a rule body doesn't reference it. Don't flag unused args.
      'no-unused-vars': ['error', { args: 'none' }],
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', module: 'writable' },
    },
  },
];
