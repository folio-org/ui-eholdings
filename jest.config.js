import path from 'node:path';
import jcs from '@folio/jest-config-stripes';

const { config } = jcs;

// we don't want any funny business with timezones when running tests locally or in CI pipelines
process.env.TZ = 'UTC';

export default {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(import.meta.dirname, './test/jest/setup-tests.js'),
  ],
};
