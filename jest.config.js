const path = require('path');
const config = require('@folio/jest-config-stripes');

const additionalModules = [
  'keyboardjs',
].join('|');
const combinedModules = config.transformIgnorePatterns[0].replace(')', `|${additionalModules})`);

// we don't want any funny business with timezones when running tests locally or in CI pipelines
process.env.TZ = 'UTC';

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setup-tests.js'),
  ],
  transformIgnorePatterns: [combinedModules],
};
