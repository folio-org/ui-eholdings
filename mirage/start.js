/* global require */

import Mirage from 'mirage-server';
import baseConfig from './config';
import camelCase from 'lodash/camelCase';
import '../tests/force-fetch-polyfill';

const environment = process.env.NODE_ENV;
const moduleTypes = ['factories', 'fixtures', 'scenarios', 'models', 'serializers', 'identity-managers'];

const req = require.context('./', true, /\.js$/);

let modules = moduleTypes.reduce((memo, name) => {
  memo[camelCase(name)] = {};
  return memo;
}, {});

req.keys().forEach((modulePath) => {
  const moduleParts = modulePath.split('/');
  const moduleType = moduleParts[1];
  const moduleName = moduleParts[2];

  if (moduleName) {
    const moduleKey = camelCase(moduleName.replace('.js', ''));
    modules[moduleType][moduleKey] = req(modulePath).default;
  }
});

export function startDevMirage() {
  let options = Object.assign(modules, { environment, baseConfig });
  return new Mirage(options);
}

export function startTestMirage() {
  let testModules = { ...modules };
  delete modules.scenarios;

  let options = Object.assign(testModules, { environment, baseConfig });
  return new Mirage(options);
}
