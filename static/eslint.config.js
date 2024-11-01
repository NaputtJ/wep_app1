import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import importNewLine from 'eslint-plugin-import-newlines'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },

    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      "import-newlines": importNewLine,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "brace-style": ["error", "1tbs"],
      "max-len": ["error", { "code": 120 }],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      "indent": ["error", 2],
      "object-curly-newline": [
        "error",
        {
          "multiline": true,
          "minProperties": 4,
          "consistent": true,
        },
      ],
      "object-property-newline": [2, {
        "allowMultiplePropertiesPerLine": false,
      }],
      "object-curly-spacing": [2, "always"],
      "comma-dangle": [2, "always-multiline"],
      "no-multiple-empty-lines": [2, {
        "max": 2,
        "maxEOF": 1,
      }],
      "import-newlines/enforce": ["error", {
        "items": 3,
        "max-len": 120,
      }],
      "react/jsx-max-props-per-line": [2, {
        "maximum": {
          "single": 3,
          "multi": 1,
        },
      }],
      "react/jsx-first-prop-new-line": [2, 'multiline'],
      'react/jsx-closing-bracket-location': [2, 'line-aligned'],
      "react/jsx-wrap-multilines": [2, {
        "declaration": "parens-new-line",
        "assignment": "parens-new-line",
        "return": "parens-new-line",
        "arrow": "parens-new-line",
        "condition": "parens-new-line",
        "logical": "parens-new-line",
        "prop": "ignore",
      }],
      "react/jsx-tag-spacing": [2, {
        "closingSlash": "never",
        "beforeSelfClosing": "always",
        "afterOpening": "never",
        "beforeClosing": "never",
      }],
      "react/jsx-props-no-multi-spaces": [1],
      "react/jsx-newline": [2, {
        "prevent": true,
        "allowMultilines": false,
      }],
      "react/jsx-indent": [2, 2, {
        checkAttributes: false,
        indentLogicalExpressions: true,
      }],
      "react/jsx-indent-props": [2, 2],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true,
        },
      ],
    },
  },
)
