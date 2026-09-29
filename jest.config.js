const path = require('path');
const config = require('@folio/jest-config-stripes');

const additionalModules = [
  'keyboardjs',
].join('|');
const combinedModules = config.transformIgnorePatterns[0].replace(')', `|${additionalModules})`);

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setup-tests.js'),
  ],
  setupFilesAfterEnv: [
    ...config.setupFilesAfterEnv,
    path.join(__dirname, './test/jest/jest.setup.js'),
  ],
  transformIgnorePatterns: [combinedModules],
};
