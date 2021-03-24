module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  extends: ['@folio/eslint-config-stripes'],
  env: {
    browser: true,
    "jest/globals": true
  },
  globals: {
    process: true,
    Promise: true
  },
  overrides: [
    {
      files: ["**/*.test.js"],
      rules: {
        "max-classes-per-file": "off",
        "no-unused-expressions": "off",
        "react/prop-types": "off"
      }
    }, {
      files: ["test/jest/helpers/*"],
      rules: {
        "react/prop-types": "off"
      }
    }
  ],
  rules: {
    "arrow-body-style": "off",
    "comma-dangle": "off",
    "import/no-extraneous-dependencies": "off",
    "jsx-quotes": "off",
    "no-console": "warn",
    "react/forbid-prop-types": "off",
    "react/destructuring-assignment": "off",
    "react/sort-prop-types": ["error"],
    "no-unused-vars": ["error", { "ignoreRestSiblings": true }]
  },
  plugins: ["jest"]
};
