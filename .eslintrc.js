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
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  env: {
    browser: true
  },
  globals: {
    process: true,
    Promise: true
  },
  rules: {
    "jsx-quotes": "off",
    "no-console": "warn"
  }
};
