#!/usr/bin/env node

const commander = require('commander');
const path = require('path');
const stripes = require('@folio/stripes-core/webpack/stripes-node-api');
const packageJSON = require('@folio/stripes-core/package.json');
const webpack = require('webpack');
const fs = require('fs');

commander.version(packageJSON.version);

// Display error to the console and exit
function processError(err) {
  if (err) {
    console.error(err); // eslint-disable-line no-console
  }
  process.exit(1);
}

// Display webpack output to the console
function processStats(stats) {
  console.log(stats.toString({ // eslint-disable-line no-console
    chunks: false,
    colors: true,
  }));
  // Check for webpack compile errors and exit
  if (stats.hasErrors()) {
    processError();
  }
}

function mirage(config, enabled = false) {
  if (enabled) {
    console.info('Using Mirage Server'); // eslint-disable-line no-console
    return Object.assign({}, config, {
      entry: ['./demo/boot-mirage'].concat(config.entry)
    });
  } else {
    return config;
  }
}

commander
  .command('dev')
  .option('--port [port]', 'Port')
  .option('--host [host]', 'Host')
  .option('--cache', 'Use HardSourceWebpackPlugin cache')
  .option('--devtool [devtool]', 'Use another value for devtool instead of "inline-source-map"')
  .option('--mirage [scenario]', 'Use the mirage server to simulate the backend', (scenario) => {
    let validScenario = scenario === true ? 'default' : scenario;

    if (!fs.existsSync(path.join(__dirname, '../mirage/scenarios', `${validScenario}.js`))) {
      console.warn(`Unable to find mirage scenario "${validScenario}"`); // eslint-disable-line no-console
      return 'default';
    } else {
      return validScenario;
    }
  })
  .arguments('<config>')
  .description('Launch a webpack-dev-server')
  .action((stripesConfigFile, options) => {
    const stripesConfig = require(path.resolve(stripesConfigFile)); // eslint-disable-line
    const mirageOption = options.mirage === true ? 'default' : options.mirage;

    options.webpackOverrides = (config) => {
      config.plugins.push(new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        MIRAGE_SCENARIO: mirageOption || 'default'
      }));

      // Show eslint failures at runtime
      config.module.rules.push({
        test: /src\/.*\.js$/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true
        }
      });

      return mirage(config, mirageOption);
    };

    stripes.serve(stripesConfig, options);
  });

commander
  .command('build')
  .option('--publicPath [publicPath]', 'publicPath')
  .arguments('<config> <output>')
  .description('Build a tenant bundle')
  .action((stripesConfigFile, outputPath, options) => {
    const stripesConfig = require(path.resolve(stripesConfigFile)); // eslint-disable-line
    options.outputPath = outputPath;
    options.webpackOverrides = (config) => {
      return mirage(config);
    };

    stripes.build(stripesConfig, options)
      .then(stats => processStats(stats))
      .catch(err => processError(err));
  });

commander.parse(process.argv);

// output help if no command specified
if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
