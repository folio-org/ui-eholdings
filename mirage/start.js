/* global require */

import Mirage from 'mirage-server';
import baseConfig from './config';
import camelCase from 'lodash/camelCase';
import '../tests/force-fetch-polyfill';

const environment = process.env.NODE_ENV;
const moduleTypes = ['factories', 'fixtures', 'models', 'serializers', 'identity-managers'];

// don't load scenarios in the 'test' environment since you want to
// create the server configuration by hand to correspond to each test case.
if (environment !== 'test') {
  moduleTypes.push('scenarios');
}

let modules = moduleTypes.reduce((memo, name) => {
  memo[camelCase(name)] = {};
  return memo;
}, {});

// require all files within this directory recursively and build a hash
// of modules based on it's moduleType (parent directory) to load with Mirage.
const req = require.context('./', true, /\.js$/);
req.keys().forEach((modulePath) => {
  const moduleParts = modulePath.split('/');
  const moduleType = moduleParts[1];
  const moduleName = moduleParts[2];

  if (moduleName && modules[moduleType]) {
    const moduleKey = camelCase(moduleName.replace('.js', ''));
    modules[moduleType][moduleKey] = req(modulePath).default;
  }
});

export default function startMirage() {
  let options = Object.assign(modules, { environment, baseConfig });
  return new Mirage(options);
}
