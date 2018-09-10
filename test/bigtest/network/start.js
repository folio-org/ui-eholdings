/* global require */

import Mirage, { camelize } from '@bigtest/mirage';
import baseConfig from './config';
import './force-fetch-polyfill';

const environment = process.env.NODE_ENV;
const moduleTypes = ['scenarios', 'factories', 'fixtures', 'models', 'serializers', 'identity-managers'];

let allModules = moduleTypes.reduce((memo, name) => {
  memo[camelize(name)] = {};
  return memo;
}, {});

// require all files within this directory recursively and build a hash
// of modules based on it's moduleType (parent directory) to load with Mirage.
const req = require.context('./', true, /\.js$/);
req.keys().forEach((modulePath) => {
  const moduleParts = modulePath.split('/');
  const moduleType = moduleParts[1];
  const moduleName = moduleParts[2];

  if (moduleName && allModules[moduleType]) {
    const moduleKey = camelize(moduleName.replace('.js', ''));
    allModules[moduleType][moduleKey] = req(modulePath).default;
  }
});

let { scenarios, ...modules } = allModules;

export default function startMirage(...scenarioNames) {
  let options = Object.assign(modules, { environment, baseConfig });
  let server = new Mirage(options);

  // mirage does not load our factories outside of testing when we do
  // not declare a default scenario, so we load them ourselves
  if (environment !== 'test') {
    server.loadFactories(modules.factories);
  }

  // mirage only loads a `default` scenario for us out of the box, so
  // instead we run any scenarios after we initialize mirage
  scenarioNames.filter(Boolean).forEach((scenarioName) => {
    let scenario = scenarios[camelize(scenarioName)];
    if (scenario) scenario(server);
  });

  return server;
}
